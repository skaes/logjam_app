# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require_relative 'config/application'
LogjamApp::Application.load_tasks

desc "update code from the git repository"
task :update do
  puts "updating logjam from remote repository"
  system "git pull && (cd vendor/logjam; git pull origin master)"
end
