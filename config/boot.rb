ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../Gemfile', __dir__)

ENV['ZMQ_LIB_PATH'] ||= "/opt/logjam/lib"
require 'bundler/setup' # Set up gems listed in the Gemfile.
