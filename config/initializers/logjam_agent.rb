module LogjamAgent
  self.application_name = "logjam"
  self.environment_name = Rails.env
  Forwarders.add(ZMQForwarder.new("logjam", Rails.env, :host => "localhost", :port => 9605))
  auto_detect_logged_exceptions

  mattr_accessor :forwarding_error_logger
  mattr_accessor :forwarding_error_log

  self.forwarding_error_log = File.expand_path("#{::Rails.root}/log/logjam_agent_error.log")
  self.forwarding_error_logger = ::Logger.new(forwarding_error_log)
  self.forwarding_error_logger.level = ::Logger::ERROR
  self.forwarding_error_logger.formatter = ::Logger::Formatter.new

  self.error_handler = lambda do |exception|
    forwarding_error_logger.error "#{exception.class.name}: #{exception.message}"
  end
end
