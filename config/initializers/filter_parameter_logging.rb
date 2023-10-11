# Be sure to restart your server when you modify this file.

require "digest/md5"
filter = lambda{|k,v| k =~ /password/i && v.replace("[FILTERED (#{Digest::MD5.hexdigest(v)})]")}

# Configure sensitive parameters which will be filtered from the log file.
Rails.application.config.filter_parameters += [filter]

# Configure parameters to be partially matched (e.g. passw matches password) and filtered from the log file.
# Use this to limit dissemination of sensitive information.
# See the ActiveSupport::ParameterFilter documentation for supported notations and behaviors.
Rails.application.config.filter_parameters += [
  :passw, :secret, :token, :_key, :crypt, :salt, :certificate, :otp, :ssn
]
