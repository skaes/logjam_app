#!/bin/bash
set -e

cd /home/logjam
git clone https://github.com/skaes/logjam_app.git
cd logjam_app
git submodule init
git submodule update
bundle
mkdir -p log
mkdir -p tmp/sockets
