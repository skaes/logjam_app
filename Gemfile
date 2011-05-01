source :rubygems

gem "rake"
gem "rails", '~>3.0'
gem "mongo_ext"
gem "mongo"
gem "bson_ext"
gem "eventmachine"
gem "amqp"
gem "logjam_logger", :git => "git://github.com/skaes/logjam_logger.git"
gem "json"
gem "em-websocket"
gem "time_bandits"
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
  gem "redgreen"
end
