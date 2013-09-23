# Importer streams
module Logjam
  livestream "development"

  stream "logjam-development" do
    importer { type :zmq; port 9605 }
  end
end
