# VERSION         0.1
# DOCKER-VERSION  1.6.0
# AUTHORS:        Stefan Kaes <skaes@railsexpress.de>, Jochen Kramer <freetwix@web.de>
# DESCRIPTION:    logjam demo
#
# TO_BUILD:            docker build -t=stkaes/logjamdemo .
# TO_RUN_INTERACTIVE:  docker run --rm -i -t -p 3000:3000 -p 8080:8080 stkaes/logjamdemo
# ----------------------------
FROM ubuntu:14.04
MAINTAINER Stefan Kaes

# ----------------------------
# Environment (can be used in scripts)
# ----------------------------
ENV DEBIAN_FRONTEND noninteractive
ENV HOME /root

# ----------------------------
# update system
# ----------------------------
RUN apt-get update; apt-get -y upgrade #; apt-get clean
RUN locale-gen en_US.UTF-8 && \
  update-locale LANG=en_US.UTF-8 LANGUAGE=en_US.UTF-8 LC_ALL=en_US.UTF-8

# ----------------------------
# base libs
# ----------------------------
RUN apt-get install -y \
  runit patch build-essential zlib1g-dev libyaml-dev libssl-dev libgdbm-dev \
  libreadline-dev libncurses5-dev libffi-dev openssh-server \
  checkinstall libxml2-dev libxslt-dev libcurl4-openssl-dev \
  libicu-dev logrotate libpq-dev sudo lsof curl git-core git htop \
  gawk libsqlite3-dev sqlite3 autoconf automake libtool pkg-config bison #; apt-get clean

# ----------------------------
# ruby
# ----------------------------
ADD ./docker/install-ruby.sh /docker/install-ruby.sh
RUN /bin/bash -l -c '/docker/install-ruby.sh ruby-2.2.2-p95'

# ----------------------------
# services
# ----------------------------
# TODO: use containers
RUN apt-get -y install mongodb memcached; apt-get clean

# ----------------------------
# logjam
# ----------------------------
ADD ./docker/install-logjam-tools.sh /docker/install-logjam-tools.sh
RUN /bin/bash -l -c /docker/install-logjam-tools.sh

ADD ./docker/install-code.sh /docker/install-code.sh
RUN /bin/bash -l -c /docker/install-code.sh

ADD ./docker/install-services.sh /docker/install-services.sh
RUN /bin/bash -l -c /docker/install-services.sh

## Install an SSH key
# ADD ./docker/id_dsa.pub /tmp/my_key.pub
# RUN cat /tmp/my_key.pub >> /root/.ssh/authorized_keys && rm -f /tmp/my_key.pub

WORKDIR /home/logjam/logjam_app

ADD ./docker/Procfile /home/logjam/logjam_app/Procfile
ADD ./docker/startapp.sh /docker/startapp.sh
CMD /docker/startapp.sh

EXPOSE  3000 8080
