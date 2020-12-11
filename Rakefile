# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require_relative 'config/application'
Rails.application.load_tasks

desc "update code from the git repository"
task :update do
  puts "updating logjam from remote repository"
  system "git pull && (cd vendor/logjam; git pull origin master)"
end

namespace :docker do
  desc "build docker image"
  task :build do
    system "docker build -t=stkaes/logjamdemo ."
  end

  desc "run the docker container"
  task :run do
    system "docker run --rm -i -t -p 3000:3000 -p 8080:8080 --name logjam stkaes/logjamdemo"
  end
end

namespace :test do
  namespace :db do
    desc "start test database"
    task :start do
      system "docker run --rm -p 27018:27017 percona/percona-server-mongodb mongod"
    end
  end
end

# TODO: Remove this file when https://github.com/rails/rails/issues/40795 has a fix.
Rake::Task["assets:precompile"].prerequisites.delete("yarn:install")
