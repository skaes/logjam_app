require_relative 'boot'

# fix 7.0.0 bug
require_relative "../lib/active_support_descendants_fix"

require "rails"
# Pick the frameworks you want:
# require "active_model/railtie"
# require "active_job/railtie"
# require "active_record/railtie"
require "action_controller/railtie"
# require "action_mailer/railtie"
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
require 'font-awesome-rails'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
# Bundler.require(*Rails.groups)

module LogjamApp
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    config.load_defaults 7.0

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
  end
end

# if defined?(PhusionPassenger)
#   PhusionPassenger.on_event(:starting_worker_process) do |forked|
#     LogjamAgent.event("passenger worker process forked", :pid => $$) if forked
#   end
# end
