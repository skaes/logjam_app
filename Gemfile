source :rubygems

gem "rake"
gem "rails", '~> 3.0.0'
gem "mongo", '~> 1.4.0'
gem "bson_ext", '~> 1.4.0'
gem "eventmachine"
gem "amqp", '~> 0.8.0'
gem "logjam_agent", '~> 0.3.2'
gem "json"
gem "em-websocket", '~> 0.3.5'
gem "time_bandits", '>= 0.1.1'
gem "gc_hacks"  # , :path => "#{ENV['HOME']}/src/gc_hacks"

# if you don't put it here, running a rails console in production will complain
gem "wirble"

group :development do
  gem "ruby-prof"
  if RUBY_VERSION > "1.9"
    gem "ruby-debug19"
  else
    gem "ruby-debug"
  end
  # uncomment the following lines if you want to run railsbench
  # gem railsbench
  # gem "gnuplot"
  # gem "gruff"
  # gem "rmagick"
end

group :test do
  gem "turn"
end

group :deplyoment do
  gem "capistrano"
end
