require_relative "boot"

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
# require "active_job/railtie"
# require "active_record/railtie"
# require "active_storage/engine"
require "action_controller/railtie"
# require "action_mailer/railtie"
# require "action_mailbox/engine"
# require "action_text/engine"
require "action_view/railtie"
# require "action_cable/engine"
require "sprockets/railtie"
require "rails/test_unit/railtie"

$:.unshift File.expand_path('../../vendor/logjam/lib', __FILE__)
require 'logjam/railtie'
require 'time_bandits'
require 'logjam_agent'
require 'gc_hacks'
require 'dalli'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module LogjamApp
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    # We don't need to encrypt credentials as there is no user specific content.
    config.credentials.content_path = Rails.root.join("config", "credentials", "#{Rails.env}.yml")

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de
    config.i18n.enforce_available_locales = false

    # configure the cache store (uses dalli)
    memcache_host = (ENV['LOGJAM_MEMCACHE_HOST'] || ENV['LOGJAMCACHE_NAME'] || '127.0.0.1').split('/').last
    memcache_port = (ENV['LOGJAM_MEMCACHE_PORT'] || ENV['LOGJAMCACHE_PORT_11211_TCP_PORT'] || 11211).to_i
    config.cache_store = :mem_cache_store, "#{memcache_host}:#{memcache_port}", { :namespace => "logjam" }

    # wire logger for cache operations
    config.after_initialize do
      Rails.cache.logger = Rails.logger
      Mongo::Logger.logger = Rails.logger
    end
    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w(assets tasks))

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
  end
end

# if defined?(PhusionPassenger)
#   PhusionPassenger.on_event(:starting_worker_process) do |forked|
#     LogjamAgent.event("passenger worker process forked", :pid => $$) if forked
#   end
# end
