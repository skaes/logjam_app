# Warning[:deprecated] = false if RUBY_VERSION =~ /\A3.1.0/
source "https://rubygems.org"

ENV['PKG_CONFIG_PATH'] = [ "/opt/logjam/lib/pkgconfig", ENV['PKG_CONFIG_PATH'] ].compact.join(':')

gem "rake"
gem "rails",          '~> 7.0.1'
# gem "rails",          '~> 7.0.0', github: "rails/rails", branch: "7-0-stable"
gem "dalli",          '~> 3.1'
gem "mongo",          '~> 2.8', github: "mongodb/mongo-ruby-driver", ref: "3c675eaad6e892dc5e51c11e6c7ca870958a46af"
gem "bson",           '~> 4.5'      #, github: "skaes/bson-ruby", :branch => "reduce-memory-allocation-on-resizing-buffers"
gem "oj",             '~> 3.0'
gem "ffi",            '~> 1.15'
gem "ffi-rzmq-core",  '~> 1.0.5'    #, :path => "~/src/ffi-rzmq-core"
gem "ffi-rzmq",       '~> 2.0.1'
gem "snappy",         '~> 0.2.0'    #, :path => "~/src/rbsnappy"
gem "logjam_agent",   '>= 0.32.2'   #, :path => "~/src/logjam_agent"
gem "time_bandits",   '>= 0.10'     #, :path => "~/src/time_bandits"
gem "gc_hacks"
gem "whenever", :require => false

# RSA host keys broken with openssl 3.0.0
gem 'openssl', '~> 2.2.1'

gem "ruby-prof", :group => [:development, :test]

group :development do
  gem "byebug"
  gem "foreman"
  gem "web-console"
  gem "webrick"
end

group :test do
end

group :deployment do
  gem "capistrano", '~> 2.15.6'
  gem "capistrano_colors"
end

gem "cssbundling-rails"
gem "jsbundling-rails"
gem "sprockets-rails"
gem "terser"

# only needed for css compression
gem "sass-rails"
