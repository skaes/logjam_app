# This section probably needs modification

set :application,         "logjam"
set :logjam_host,         ENV['LOGJAM_DEPLOY_HOST']
set :user,                ENV['LOGJAM_DEPLOY_USER'] || application
set :deploy_to,           ENV['LOGJAM_DEPLOY_TO'] || "/home/#{user}/#{application}"
set :use_sudo,            false

# From here on nothing should need to be changed for a simple one machine install

role :app,    logjam_host
role :web,    logjam_host
role :worker, logjam_host
role :cron,   logjam_host

# repository deploy parameters
set :scm,                   "git"
set :repository,            "git://github.com/skaes/logjam_app.git"
set :branch,                "master"
set :git_enable_submodules, true
set :deploy_via,            :remote_cache

# set default environment variables
set :default_environment, {
  "RAILS_ENV"          => "production",
  "LOGJAM_DIR"         => current_path,
  "LOGJAM_SERVICE_DIR" => "#{shared_path}/service",
  "RESTART_DELAY"      => 10,
  "SVWAIT"             => 15
}

# don't normalize asset timestamps, as we're using the asset pipeline'
set :normalize_asset_timestamps, false

######### Bundler Settings ############
set :bundle_dir,      File.join(fetch(:shared_path), 'bundle')
set :bundle_without,  [:development, :test, :deployment]

require 'bundler/capistrano'
require 'capistrano_colors'

######### cronjobs ##############
set :whenever_roles, [:cron, :worker]
set :whenever_command, "bundle exec whenever"
require "whenever/capistrano"

##################################################################
# Overwritten Capistrano Tasks
##################################################################

namespace :deploy do
  desc <<-DESC
  Restart the app on the app server.
  DESC
  task :restart, :roles => :app do
    run "touch #{current_path}/tmp/restart.txt"
  end

  desc <<-DESC
  Symlink sockets directory.
  DESC
  task :importer_sockets do
    run "ln -nsf #{shared_path}/sockets #{latest_release}/tmp/sockets"
  end

  desc <<-DESC
  Uodate known databases.
  DESC
  task :update_known_databases, :roles => :app do
    run "cd #{latest_release}; bundle exec rake logjam:db:update_known_databases"
  end

  desc "Override deploy:cold to NOT run migrations - there's no database"
  task :cold do
    update
    start
  end
end

##################################################################
# Application Tasks
##################################################################
namespace :daemons do
  def run_in_current_path(cmd)
    run "cd #{current_path}; #{cmd}"
  end

  desc "Install the logjam daemons"
  task :install, :roles => :worker do
    run_in_current_path "bundle exec rake logjam:daemons:install"
  end

  desc "Start the logjam daemons"
  task :start, :roles => :worker do
    run_in_current_path "bundle exec rake logjam:daemons:start"
  end

  desc "Stop the logjam daemons"
  task :stop, :roles => :worker do
    run_in_current_path "bundle exec rake logjam:daemons:stop"
  end

  desc "Restart all logjam daemons"
  task :restart, :roles => :worker do
    run_in_current_path "bundle exec rake logjam:daemons:restart"
  end

  desc "Restart logjam import daemons"
  task :restart_importers, :roles => :worker do
    run_in_current_path "bundle exec rake logjam:daemons:restart DAEMON_MATCH=/importer"
  end

  desc "Restart logjam live stream"
  task :restart_live_stream, :roles => :worker do
    run_in_current_path "bundle exec rake logjam:daemons:restart DAEMON_MATCH=/live-stream"
  end

  desc "Show logjam daemon status"
  task :status, :roles => :worker do
    run_in_current_path "bundle exec rake logjam:daemons:status"
  end
end

##################################################################
# Hooks
##################################################################

after 'deploy:update_code' do
  deploy.importer_sockets
  deploy.update_known_databases
end

after 'deploy' do
  deploy.cleanup
  deploy.restart
  daemons.install
  daemons.restart_importers
end

after 'deploy:setup' do
  run "test -d #{shared_path}/sockets || mkdir -p #{shared_path}/sockets"
end
