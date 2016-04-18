module LogjamAgent
  # Configure the application name (required). Must not contain dots of hyphens.
  self.application_name = "logjam"

  # Configure the environment name (optional). Defaults to Rails.env.
  # self.environment_name = Rails.env

  # Configure request data forwarder for ZeroMQ.
  add_forwarder(:zmq, :host => "localhost", :port => 9605)

  # Configure request data forwarder for ZeroMQ.
  # add_forwarder(:amqp, :host => "message.broker.at.your.org"))

  # Configure ip obfuscation. Defaults to false.
  self.obfuscate_ips = true

  # Configure cookie obfuscation. Defaults to [/_session\z/]
  # self.obfuscated_cookies = [/_session\z]/

  # Configure log level for logging on disk: only lines with a log level
  # greater than or equal to the specified one will be logged to disk.
  # Defaults to Logger::INFO. Note that logjam_agent extends the standard
  # logger log levels by the constant NONE, which indicates no logging.
  # Also, setting the level has no effect on console logging in development.
  # self.log_device_log_level = Logger::WARN   # log warnings, errors, fatals and unknown log messages
  # self.log_device_log_level = Logger::NONE   # log nothing at all

  # Configure asset request logging and forwarding. Defaults to ignore
  # asset requests in development mode. Set this to false if you need
  # to debug asset request handling.
  # self.ignore_asset_requests = Rails.env.development?

  # Configure compression method. Defaults to NO_COMPRESSION. Available
  # compression methods are GZIP_COMPRESSION and SNAPPY_COMPRESSION.
  # Snappy is faster and less CPU intensive than GZIP, GZIP achieves
  # higher compression rates.
  self.compression_method = SNAPPY_COMPRESSION
end
