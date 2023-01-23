# logjam data streams. developent streams are skipped when deploying
# to production.

module Logjam
  # ----------------------- #
  #     devices config      #
  # ----------------------- #
  self.devices = ENV['LOGJAM_DEVICES']&.split(/[\s,]+/) || [
    "tcp://localhost:9606",   # logjam-device
    "tcp://localhost:9706",   # logjam-httpd
  ]

  # ----------------------- #
  # performance data stream #
  # ----------------------- #

  livestream(ENV['LOGJAM_ENV'] || Rails.env)

  # ----------------------- #
  #     importer config     #
  # ----------------------- #

  stream("logjam-#{ENV['LOGJAM_ENV'] || Rails.env}")

  # pick up simple stream definitions from environment
  (ENV['LOGJAM_USER_STREAMS'] || "").strip.split(/[\s,]+/).each do |s|
    stream s if s =~ /\A.+-[^-]+\z/
  end

end
