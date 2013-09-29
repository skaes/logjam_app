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
end
