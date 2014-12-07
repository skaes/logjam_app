module Logjam
  # Set the import threshold (ms). Requests with a response time lower
  # than the threshold will not be stored in mongo. Their performance
  # data is added to the stats, though.
  self.import_threshold = Rails.env.development? ? 0 : 750

  # Set how many days we keep request details stored in mongo.
  self.request_cleaning_threshold = 7

  # Set how many days we keep statistics around.
  self.database_cleaning_threshold = 7

  # Set how often accumulated stats are flushed to the database.
  # This setting also determines the stream update interval
  self.database_flush_interval = 1

  # Set the bind ip for logjam daemons. Defaults to "127.0.0.1",
  # which is appropriate for single machine installs. If you are distributing
  # daemon processes across several machines, you must set it to "0.0.0.0."
  # If you change this setting in development mode, you must regenerate the
  # service definitions by running 'rake logjam:daemons:install'.
  self.bind_ip = "127.0.0.1"
end
