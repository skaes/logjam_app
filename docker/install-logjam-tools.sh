#!/bin/bash
set -e

mkdir /home/logjam
cd /home/logjam
git clone https://github.com/skaes/logjam-tools.git
cd logjam-tools
./bin/install-libs
sh autogen.sh
make
make install
