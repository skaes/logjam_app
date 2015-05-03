# logjam importer streams
# developent streams are skipped in production
module Logjam

  # ----------------------- #
  # performance data stream #
  # ----------------------- #

  livestream "development"
  livestream "production"

  # ----------------------- #
  #  config for C importer  #
  # ----------------------- #

  self.devices = %w[tcp://127.0.0.1:9606]

  stream "logjam-development"
  stream "logjam-production"

end
