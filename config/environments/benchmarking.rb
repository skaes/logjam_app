LogjamApp::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb
  config.eager_load = true

  # In the development environment your application's code is reloaded on
  # every request.  This slows down response time but is perfect for development
  # since you don't have to restart the webserver when you make code changes.
  config.cache_classes = true

  # Show full error reports and disable caching
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true

  # Don't care if the mailer can't send
  # config.action_mailer.raise_delivery_errors = false

  # Send deprecation notices to registered listeners
  config.active_support.deprecation = :notify
end

