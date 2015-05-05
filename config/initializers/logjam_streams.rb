# logjam data streams. developent streams are skipped when deploying
# to production.

module Logjam

  # ----------------------- #
  # performance data stream #
  # ----------------------- #

  livestream "development"
  livestream "production"

  # ----------------------- #
  #     importer config     #
  # ----------------------- #

  stream "logjam-development"
  stream "logjam-production"

end
