#!/bin/bash
set -e

mkdir -p /data/db
mkdir -p /etc/service/mongodb/log/logs
echo '#!/bin/sh' >/etc/service/mongodb/log/run
echo 'exec svlogd -ttt ./logs' >>/etc/service/mongodb/log/run
chmod 755 /etc/service/mongodb/log/run

echo '#!/bin/sh' >/etc/service/mongodb/run
echo 'exec 2>&1' >>/etc/service/mongodb/run
echo 'exec mongod' >>/etc/service/mongodb/run
chmod 755 /etc/service/mongodb/run

mkdir -p /etc/service/memcached/log/logs
echo '#!/bin/sh' >/etc/service/memcached/log/run
echo 'exec svlogd -ttt ./logs' >>/etc/service/memcached/log/run
chmod 755 /etc/service/memcached/log/run

echo '#!/bin/sh' >/etc/service/memcached/run
echo 'exec 2>&1' >>/etc/service/memcached/run
echo 'exec memcached -unobody' >>/etc/service/memcached/run
chmod 755 /etc/service/memcached/run

mkdir -p /etc/service/logjam/log/logs
echo '#!/bin/sh' >/etc/service/logjam/log/run
echo 'exec svlogd -ttt ./logs' >>/etc/service/logjam/log/run
chmod 755 /etc/service/logjam/log/run

mkdir -p /home/logjam/logjam_app/service
echo '#!/bin/sh' >/etc/service/logjam/run
echo 'exec 2>&1' >>/etc/service/logjam/run
echo 'exec runsvdir /home/logjam/logjam_app/service \"................................................................................................\"' >>/etc/service/logjam/run
chmod 755 /etc/service/logjam/run

mkdir -p /etc/service/rails/log/logs
echo '#!/bin/sh' >/etc/service/rails/log/run
echo 'exec svlogd ./logs' >>/etc/service/rails/log/run
chmod 755 /etc/service/rails/log/run

echo '#!/bin/bash -l' >/etc/service/rails/run
echo 'sv start mongodb || exit 1' >>/etc/service/rails/run
echo 'exec 2>&1' >>/etc/service/rails/run
echo 'cd /home/logjam/logjam_app' >>/etc/service/rails/run
echo 'exec rails s --binding 0.0.0.0' >>/etc/service/rails/run
chmod 755 /etc/service/rails/run

cd /home/logjam/logjam_app
rake logjam:daemons:install
