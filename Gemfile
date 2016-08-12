source "https://rubygems.org"

ENV['PKG_CONFIG_PATH'] = [ "/opt/logjam/lib/pkgconfig", ENV['PKG_CONFIG_PATH'] ].compact.join(':')

gem "rake",           '~> 10.5.0'
gem "rails",          '~> 4.2.6'
gem "dalli",          '~> 2.7.0'
gem "mongo",          '~> 2.0.6'
gem "bson",           '~> 3.2.1'
gem "oj",             '~> 2.15.0'
gem "amqp",           '~> 1.6.0'
gem "eventmachine",   '~> 1.2.0'
gem "ffi",            '~> 1.9.0'
gem "ffi-rzmq-core",  '~> 1.0.5'   #, :path => "~/src/ffi-rzmq-core"
gem "ffi-rzmq",       '~> 2.0.1'
gem "em-zeromq",      '~> 0.5.0'
gem "em-websocket",   '~> 0.5.0'
gem "snappy",         '~> 0.0.15'   #, :path => "~/src/rbsnappy"
gem "logjam_agent",   '~> 0.22'     #, :path => "~/src/logjam_agent"
gem "time_bandits",   '~> 0.10'     #, :path => "~/src/time_bandits"
gem "gc_hacks"
gem "font-awesome-rails"
gem "whenever", :require => false

# if you don't put it here, running a rails console in production will complain
gem "wirble"

group :development do
  gem "foreman", :require => false
  gem "byebug"
  gem "better_errors"
end

group :test do
  # gem "turn"
end

group :deployment do
  gem "capistrano", '~> 2.15.6'
  gem "capistrano_colors"
end

# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0.1'

# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
