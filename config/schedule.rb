# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
# set :output, "/path/to/my/cron_log.log"
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# Learn more: http://github.com/javan/whenever

env :MAILTO, ENV['LOGJAM_ERROR_MAIL'] || ENV['LOGJAM_USER'] || "logjam"
env :PATH, ENV['PATH']

# The complex redirection syntax here sends stdout and stderr to the log file,
# but also sends stderr to the console so that an email is sent when an error occurs
job_type :rake,  "cd :path && RAILS_ENV=:environment bundle exec rake :task >> :log 2> >(tee -a :log >&2)"

every :day, :at => '01:15', :roles => [:cron] do
  rake 'logjam:db:clean', :log => 'log/database_cleanup.log'
end

every 1.minute, :roles => [:worker] do
  rake 'logjam:daemons:list_orphans', :log => 'log/orphaned_workers.log'
end
