# CONFIGURATION
#

module Logjam
  # Set base url when embedding logam into your main app
  # Logjam.base_url = '/stats'

  # Set import_threshold. Requests fast than the threshold will not be stored in mongo.
  # Their performance data is added to the stats, though. Default is 0.
  # Logjam.import_threshold = Rails.env == "development" ? 0 : 750

  # Set how many days we keep request details
  # Logjam.request_cleaning_threshold = 7

  # Set how many days we keep statistics
  # Logjam.database_cleaning_threshold = 365

end
