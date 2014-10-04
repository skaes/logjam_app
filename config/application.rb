require File.expand_path('../boot', __FILE__)

require "action_controller/railtie"
require "rails/test_unit/railtie"
# for asset pipeline:
require "sprockets/railtie"

$:.unshift File.expand_path('../../vendor/logjam/lib', __FILE__)
require 'logjam/railtie'
require 'time_bandits'
require 'logjam_agent'
require 'gc_hacks'
require 'dalli'
require 'font-awesome-rails'

# If you have a Gemfile, require the gems listed there, including any gems
# you've limited to :test, :development, or :production.
# Bundler.require(:default, Rails.env) if defined?(Bundler)

module LogjamApp
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    # config.logger = LogjamAgent::BufferedLogger.new(config.paths.log.to_a.first)
    # config.logger.formatter = LogjamAgent::SyslogLikeFormatter.new

    # Custom directories with classes and modules you want to be autoloadable.
    # config.autoload_paths += %W(#{config.root}/extras)

    # Only load the plugins named here, in the order given (default is alphabetical).
    # :all can be used as a placeholder for all plugins not explicitly named.
    config.plugins = [ :gc_hacks, :all ]

    # Activate observers that should always be running.
    # config.active_record.observers = :cacher, :garbage_collector, :forum_observer

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de
    config.i18n.enforce_available_locales = false

    # JavaScript files you want as :defaults (application.js is always included).
    # config.action_view.javascript_expansions[:defaults] = %w(jquery rails)

    # Configure the default encoding used in templates for Ruby 1.9.
    config.encoding = "utf-8"

    require "digest/md5"
    filter = lambda{|k,v| k =~ /password/i && v.replace("[FILTERED (#{Digest::MD5.hexdigest(v)})]")}
    # Configure sensitive parameters which will be filtered from the log file.
    config.filter_parameters += [filter]

    # Enable the asset pipeline
    config.assets.enabled = true

    # TODO: move to logjam plugin
    config.assets.precompile += %w(*.png *.jpg *.jpeg *.gif)

    # Version of your assets, change this if you want to expire all your assets
    config.assets.version = '1.0'

    # configure the cache store (uses dalli)
    config.cache_store = :mem_cache_store, "localhost"

    # wire logger for cache operations
    config.after_initialize { Rails.cache.logger = Rails.logger }
  end
end

# if defined?(PhusionPassenger)
#   PhusionPassenger.on_event(:starting_worker_process) do |forked|
#     LogjamAgent.event("passenger worker process forked", :pid => $$) if forked
#   end
# end
