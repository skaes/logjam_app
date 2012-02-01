module LogjamAgent
  self.application_name = "logjam"
  self.environment_name = Rails.env
  amqp_logging_host = "localhost"
  Forwarders.add(AMQPForwarder.new("logjam", Rails.env, :host => amqp_logging_host))
  auto_detect_logged_exceptions
end
