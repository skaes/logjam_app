mongodb: mongod
memcached: memcached
# we need to give mongo some time to start properly
importer: sleep 2 && ./service/importer/run -s development
livestream: ./service/live-stream/run
httpd: ./service/httpd/run
