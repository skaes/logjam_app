source "https://rubygems.org"

ENV['PKG_CONFIG_PATH'] = [ "/opt/logjam/lib/pkgconfig", ENV['PKG_CONFIG_PATH'] ].compact.join(':')

gem "rake"
gem "rails",          '~> 6.0.0'
gem "dalli",          '~> 2.7'
gem "mongo",          '~> 2.6'
gem "bson",           '~> 4.2'   #, :git => "https://github.com/skaes/bson-ruby.git", :branch => "reduce-memory-allocation-on-resizing-buffers"
gem "oj",             '~> 3.0'
gem "ffi",            '~> 1.10'
gem "ffi-rzmq-core",  '~> 1.0.5'   #, :path => "~/src/ffi-rzmq-core"
gem "ffi-rzmq",       '~> 2.0.1'
gem "snappy",         '~> 0.0.15'   #, :path => "~/src/rbsnappy"
gem "logjam_agent",   '~> 0.29'     #, :path => "~/src/logjam_agent"
gem "time_bandits",   '~> 0.10'     #, :path => "~/src/time_bandits"
gem "gc_hacks"
gem "font-awesome-rails", '~> 4.7.0'
gem "whenever", :require => false

# if you don't put it here, running a rails console in production will complain
gem "wirble"

# need to do some profiling in production
gem "ruby-prof"

group :development do
  gem "byebug"
  gem "foreman"
  # gem "better_errors"
  gem 'web-console'
end

group :test do
end

group :deployment do
  gem "capistrano", '~> 2.15.6'
  gem "capistrano_colors"
end

gem 'sass-rails', '~> 6.0'
gem 'uglifier', '>= 1.3.0'

# gem 'jquery-rails'
# gem 'jbuilder', '~> 2.5'
# gem 'bcrypt', '~> 3.1.7'
