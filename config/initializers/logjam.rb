# CONFIGURATION
#

module Logjam
  # Set import_threshold. Requests fast than the threshold will not be stored in mongo.
  # Their performance data is added to the stats, though. Default is 0.
  # Logjam.import_threshold = Rails.env == "development" ? 0 : 750

  # Set how many days we keep request details
  Logjam.request_cleaning_threshold = 7

  # Set how many days we keep statistics
  Logjam.database_cleaning_threshold = 18*7 # 18 weeks

  # Set how often accumulated stats are flushed to the database
  # this also determines the stream update interval
  Logjam.database_flush_interval = 1

end
