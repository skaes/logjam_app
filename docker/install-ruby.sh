#!/bin/bash
set -e

ruby_version=$1
apt-get -y install --no-install-recommends ruby
mkdir -p /tmp/ruby
cd /tmp/ruby
curl -s http://railsexpress.de/downloads/${ruby_version}.tar.gz | tar xz
cd $ruby_version
autoconf
./configure --enable-shared --disable-install-doc
make
apt-get -y purge ruby; apt-get clean
make install
cd $HOME
rm -rf /tmp/ruby
echo "gem: --no-ri --no-rdoc" > $HOME/.gemrc
gem install bundler
