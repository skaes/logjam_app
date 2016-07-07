# Be sure to restart your server when you modify this file.

require "digest/md5"
filter = lambda{|k,v| k =~ /password/i && v.replace("[FILTERED (#{Digest::MD5.hexdigest(v)})]")}

# Configure sensitive parameters which will be filtered from the log file.
Rails.application.config.filter_parameters += [filter]
