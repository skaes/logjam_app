# Logjam

Logjam is a Ruby on Rails application for finding performance hot spots and errors in web
applications. Its primary target are Ruby on Rails applications, although it's possible to use it
with other technologies.

It differs from other Rails monitoring solutions in that is is meant to be hosted in your own
data center (or private cloud), for two reasons:

* it requires low latency between the monitored application and itself
* it stores extensive information for web requests, which might contain sensitive data

Logjam can produce various graphs and tables showing how much time and memory are consumed by
different parts of your application. The interface is flexible enough to be able to provide answers
to a great many questions you may have about your application, such as

* which actions in my application are most in need of optimization?
* in the worst case, how slow is my application?
* which actions are causing the most exceptions?
* what actions are causing the ruby heap to grow?
* which actions are making the most DB queries?
* which actions spend most of their time waiting for external services?
* how is my application behaving currently?

It also provides a live stream of performance and error data which is especially useful for
supervising applications during deployments.

In addition, if you have several applications to monitor, and they call each other, Logjam can show
you how often and when these calls occur.

Note that some of Logjam's features (e.g. those involving GC and memory data) depend on using a
specially built version of Ruby (see https://github.com/skaes/rvm-patchsets).

## Quick start for the impatient developer

A quick way of getting to understand what Logjam can do is to install and run a local development
version, which monitors itself.

In the following, I assume you're a Rails developer.

### Install required software packages

* mongodb (see http://www.mongodb.org/downloads)
* memcached (see http://memcached.org/)
* a patched ruby for greater fun (see https://github.com/skaes/rvm-patchsets)
* logjam-tools (see https://github.com/skaes/logjam-tools)

If you're on a Mac and are using MacPorts:

    sudo port install mongodb memcached

I'm sure with Home Brew it's equally simple, but I haven't tried it.

In either case, you might need to create the mongodb data directory:

    sudo mkdir -p /data/db

If you're using rvm, I recommend to install a patched ruby like so:

    rvm install 2.3.3-railsexpress --patch railsexpress
    rvm use 2.3.3-railsexpress@logjam --create
    gem install bundler

Note: make sure to have a recent rvm version installed, otherwise it
will not have up to date ruby patches. If in doubt, run

    rvm get latest

Please follow the instructions on https://github.com/skaes/logjam-tools
to install logjam tools.


### Clone the git repository and bundle the application

    git clone https://github.com/skaes/logjam_app.git
    cd logjam_app
    git submodule init
    git submodule update
    echo 2.3.3-railsexpress > .ruby-version
    echo logjam > .ruby-gemset
    cd .
    mkdir -p log
    bundle

### Start the services and initialize the database

Run

    rake logjam:daemons:install

to create necessary service definitions under ./service.

Open a separate terminal session and run

    foreman start

foreman will start all background processes which are necessary to enable self monitoring. If this
gives you errors, e.g. because you have mongodb or memcached already running on your machine,
comment out the corresponging lines in ./Procfile.

Then go back to the original session and run

    rake logjam:db:update_known_databases

to initialize mongodb contents.

### Start the application and play

Run "rails s", then open the browser at <http://localhost:3000/>. You will be greeted with a "Dataset
Empty" message. Reload the page to get some performance data. Then click around and explore
the UI while your dataset continues to grow.

### Troubleshooting

If you experience any problems following the steps above,
[please open a ticket](https://github.com/skaes/logjam_core/issues).


## Monitoring other applications

Unsurprisingly, this requires you to configure Logjam to listen for request information and the
application to send request data.

### Transport options

Logjam supports two different transport methods for sending request information from the application
to Logjam:

* AMQP
* ZeroMQ

AMQP was the first transport to be implemented when all the importer code was still in
ruby. It requires a running message broker and a corresponding logjam-device to publish
messages for the importer process, but does not require ZMQ libraries to be installed on
machines running message publishers. Nowadays, I consider it mostly deprecated, but if you
prefer it, [RabbitMQ](http://www.rabbitmq.com/) is a good broker choice.

With ZeroMQ, the application can either talk directly to the logjam request import daemon
or a logjam-device can be used as an
intermediate. The
[logjam-tools README](https://github.com/skaes/logjam-tools/blob/master/README.md) has
more details abut port usage of importer, devices and other daemons.


### Configuring Logjam

Application monitoring is configured through stream declarations in the file
`./config/initializers/logjam_streams.rb`. In the simplest case, such a declaration looks
like this:

````ruby
stream "app-env"
````

Here `app` is the name which will be used by logjam internally and "env" the name of the
environment (typically "production").


### Instrumenting the application

* add the logjam_agent gem to the Gemfile of your application
* add an initializer for logjam_agent and specify transport method and endpoint
* add either the bunny gem or the ffi-rzmq gem to the Gemfile (depending on which transport you chose)
* add an initializer for time_bandits gem and specify which metrics to track

Have a look at the corresponding files in logjam itself to get an idea on how to proceed.


## Deploying Logjam into production

Contact the author ...


## Authors

[Stefan Kaes](https://github.com/skaes) (<skaes@railsexpress.de>) and
[David Anderson](https://github.com/alpinegizmo) (<david@alpinegizmo.com>).


## License

Older versions of this code were MIT licensed. The current license version is GPLv3.

Copyright (c) 2009-2017 Stefan Kaes

Copyright (c) 2009 David Anderson

Copyright (c) 2009 XING AG

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
