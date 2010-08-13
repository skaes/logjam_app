# CONFIGURATION
#

module Logjam
  # Set base url when embedding logam into your main app
  # Logjam.base_url = '/stats'

  # Set import_threshold. Requests fast than the threshold will not be stored in mongo.
  # Their performance data is added to the stats, though. Default is 0.
  # Logjam.import_threshold = 500

  # Make sure to enable matchers appropriate for the log files that will be imported.
  # The sample log file included with LogJam is in basic time bandit format.
  # It is ok to have multiple COMPLETED matchers enabled; the first to match will be used.
  RequestInfo.register_matcher Matchers::PROCESSING
  RequestInfo.register_matcher Matchers::SESSION_XING
  RequestInfo.register_matcher Matchers::COMPLETED_RAILS
end
