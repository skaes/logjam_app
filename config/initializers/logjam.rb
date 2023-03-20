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

  # Sensitive cookies which must be masked for import.
  # self.sensitive_cookies = []

  # Set how many days we keep request details stored in mongo.
  self.request_cleaning_threshold = ENV['LOGJAM_REQUEST_CLEANING_THRESHOLD'] || 7

  # Set how many days we keep statistics around.
  self.database_cleaning_threshold = ENV['LOGJAM_DATABASE_CLEANING_THRESHOLD'] || 28

  # Set how often accumulated stats are flushed to the database.
  # This setting also determines the stream update interval
  self.database_flush_interval = ENV['LOGJAM_DATABASE_FLUSH_INTERVAL'] || 1

  # Allow cross domain Ajax requests.
  # self.allow_cross_domain_ajax = true

  # Comma separated list of request names which we assume are backend only requests:
  # "*" means all requests are backend only
  # "" means no requests are backend only
  # self.backend_only_requests = "Rest::,Processors::,Cron::"

  # Configure issue tracker.
  # self.github_issue_url = "https://github.com/skaes/logjam_app/issues/new"

  # Configure websocket uri. If not set, hostname will extracted from request,
  # protocol will be "ws" and port will be 8080 on Linux and 9608 on OS X.
  self.web_socket_uri = ENV['LOGJAM_WEB_SOCKET_URI']

  # Configure frontend timings collector.
  self.frontend_timings_collector = ENV['LOGJAM_FRONTEND_TIMINGS_COLLECTOR']
  self.frontend_timings_collector_port = ENV['LOGJAM_FRONTEND_TIMINGS_COLLECTOR_PORT']

  # Configure logjam url to be used by importer.
  self.logjam_url = ENV['LOGJAM_URL'] || ( Rails.env.production? ? "http://localhost" : "http://localhost:3000")
end
