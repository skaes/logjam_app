#!/bin/bash
set -e

apt-get -y install --no-install-recommends ruby
mkdir /tmp/ruby
cd /tmp/ruby
curl http://railsexpress.de/downloads/ruby-2.1.2-p95.tar.gz | tar xz
cd ruby-2.1.2-p95
autoconf
./configure --prefix=/usr --disable-install-doc
make
apt-get -y purge ruby; apt-get clean
make install
cd ..
rm -rf /tmp/ruby-2.1.2-p95
echo "gem: --no-ri --no-rdoc" > $HOME/.gemrc
gem install bundler
