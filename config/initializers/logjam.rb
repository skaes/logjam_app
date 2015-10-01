module Logjam
  # Set the bind ip for logjam daemons. Defaults to "0.0.0.0".
  # If you change this setting in development mode, you must regenerate the
  # service definitions by running 'rake logjam:daemons:install'.
  self.bind_ip = ENV['LOGJAM_BIND_IP'] || "0.0.0.0"

  # Ignore requests which start with the following uri prefix
  self.ignored_request_uri = ENV['LOGJAM_IGNORED_REQUEST_URI'] || "/_system/"

  # Set the import threshold (ms). Requests with a response time lower
  # than the threshold will not be stored in mongo. Their performance
  # data is added to the stats, though.
  self.import_threshold = ENV['LOGJAM_IMPORT_THRESHOLD'] || 500

  # Set how many days we keep request details stored in mongo.
  self.request_cleaning_threshold = ENV['LOGJAM_REQUEST_CLEANING_THRESHOLD'] || 7

  # Set how many days we keep statistics around.
  self.database_cleaning_threshold = ENV['LOGJAM_DATABASE_CLEANING_THRESHOLD'] || 28

  # Set how often accumulated stats are flushed to the database.
  # This setting also determines the stream update interval
  self.database_flush_interval = ENV['LOGJAM_DATABASE_FLUSH_INTERVAL'] || 1
end
