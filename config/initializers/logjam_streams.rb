# logjam importer streams
# developent streams are skipped in production
module Logjam
  # ---------------------------- #
  # live performance data stream #
  # ---------------------------- #

  livestream "development"
  livestream "production"

  # ------------------------- #
  # config for ruby importers #
  # ------------------------- #

  # stream "logjam-development" do
  #   importer { type :zmq; port 9605 }
  # end

  # stream "logjam-production" do
  #   importer { type :zmq; port 9605 }
  # end

  # --------------------- #
  # config for C importer #
  # --------------------- #

  self.devices = %w[tcp://127.0.0.1:9606]

  stream "logjam-development"
  stream "logjam-production"

end
