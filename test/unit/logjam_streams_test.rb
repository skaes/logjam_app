require_relative '../test_helper'

class LogjamStreamsTest < ActiveSupport::TestCase
  test "all streams have valid app-env pairings" do
    Logjam.streams.values.each do |stream|
      assert(stream.app.present?, "app name of stream #{stream.name} is not set. This is because it does not adhere to the format ('my-app_name-environment')")
      assert(stream.env.present?, "app env of stream #{stream.name} is not set. This is because it does not adhere to the format ('my-app_name-environment')")
    end
  end
end
