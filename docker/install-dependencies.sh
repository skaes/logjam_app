#!/bin/bash
set -e

builddir=/tmp/build-logjam-tools
mkdir -p $builddir
cd $builddir

d=rabbitmq-c-0.5.2
f=${d}.tar.gz
test -f $f || wget -nv https://github.com/alanxz/rabbitmq-c/releases/download/v0.5.2/$f
test -d $d || tar xzvf $f
cd $d
test -f config.status || ./configure
make
make install
ldconfig
cd ..

d=zeromq-4.0.5
f=${d}.tar.gz
test -f $f || wget -nv http://download.zeromq.org/$f
test -d $d || tar xzvf $f
cd $d
test -f config.status || ./configure
make
make install
ldconfig
cd ..

d=czmq-3.0.0
f=czmq-3.0.0-rc1.tar.gz
test -f $f || wget -nv http://download.zeromq.org/$f
test -d $d || tar xzvf $f
cd $d
test -f config.status || ./configure
make
make install
ldconfig
cd ..

d=mongo-c-driver
test -d $d || git clone https://github.com/mongodb/${d}.git
#!/bin/bash
cd $d
git reset --hard
git checkout master
git pull origin master
git checkout 048c851919dc32c98b5f8a9a0270e69af9385db3
test -f config.status || (sh autogen.sh && ./configure)
make
make install
ldconfig
cd ..

d=json-c
test -d $d || git clone https://github.com/skaes/${d}.git
cd $d
git reset --hard
git checkout master
git pull origin master
git checkout 36be1c4c7ade78fae8ef67280cd4f98ff9f81016
test -f config.status || (sh autogen.sh && ./configure)
make
make install
ldconfig

cd
rm -rf $builddir
