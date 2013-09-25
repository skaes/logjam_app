# logjam importer streams
# developent streams are skipped in production
module Logjam
  livestream "development"
  livestream "production"

  stream "logjam-development" do
    importer { type :zmq; port 9605 }
  end

  stream "logjam-production" do
    importer { type :zmq; port 9605 }
  end
end
