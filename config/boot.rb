require 'rubygems'

# Set up gems listed in the Gemfile.
ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../../Gemfile', __FILE__)
ENV['ZMQ_LIB_PATH'] ||= "/opt/logjam/lib"
require 'bundler/setup' if File.exists?(ENV['BUNDLE_GEMFILE'])
