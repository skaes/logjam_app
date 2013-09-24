# Logjam

Logjam is a Ruby on Rails application for finding performance hot spots and errors in web
applications. Its primary target are Ruby on Rails applications, although it's possible to use it
with other technologies.

It differs from other Rails monitoring solutions in that is is meant to be hosted in your own
datacenter (or private cloud), for two reasons:

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

## Quick getting started guide for the impatient developer

A quick way of getting to understand what Logjam can do is to install and run a local development
version, which monitors itself.

In the following, I assume you're a Rails developer.

### Install required software packages

* mongodb (see http://www.mongodb.org/downloads)
* zeromq (see http://zeromq.org/intro:get-the-software)
* memcached (see http://memcached.org/)
* a patched ruby for greater fun (see https://github.com/skaes/rvm-patchsets)

If you're on a Mac and are using MacPorts:

    sudo port install mongodb memcached zmq libffi

I'm sure with Home Brew it's equally simple, but I haven't tried it.

If you're using rvm, I recommend to install a patched ruby like so:

    rvm install 1.9.3-p392 --patch railsexpress -n railsexpress
    rvm use 1.9.3-p392-railsexpress@logjam
    gem install bundler
    mkdir logjam_app
    echo 1.9.3-p392-railsexpress > logjam_app/.ruby-version
    echo logjam > logjam_app/.ruby-gemset

Note: make sure to have a recent rvm version installed, otherwise it will not have up to date ruby
patches. If in doubt, run

    rvm get latest


### Clone the git repository and bundle the application

    git clone https://github.com/skaes/logjam_app.git
    cd logjam_app
    git submodule init
    git submodule update
    bundle
    mkdir -p log
    rake logjam:daemons:install

### Install and start services

Open a separate shell window and run

    foreman start

foreman will start all background processes which are necessary to enable self monitoring. If this
gives you errors, e.g. because you have mongodb or memcached already running on your machine,
comment out the corresponging lines in ./Procfile.

### Start the application and play

Run "rails s", then open the browser at <http://localhost:3000/>. You will be greeted with a "Dataset
Empty" message.  Reload the page once to get some performance data. Then click around and explore
the UI while your dataset continues to grow.


## Monitoring other applications

Unsurprisingly, this requires you to configure Logjam to listen for request information and the
application to send request data.

### Transport options

Logjam supports two different transport methods for sending request information from the application
to Logjam:

* AMQP
* ZeroMQ

Both methods have their advantages and disadvantages:

* AMQP requires a running message broker which acts as an intermediate, provides buffering and
  allows the logjam request importers to scale, but requires supervision.

* With ZeroMQ, the application talks directly to the logjam request import daemon(s). Currently this
  doesn't scale as easily as the AMQP transport. This will be changed in the future.

For AMQP, I can recommend using [RabbitMQ](http://www.rabbitmq.com/).

### Configuring Logjam

Application monitoring is configured through stream declarations in the file
config/initializers/logjam_streams.rb. Such a declaration looks like this:

````ruby
    stream "app-env" do
      importer do
         type :zmq
         port 9605
      end
    end
````

Here "app" is the name which will be used by logjam internally and "env" the name of the environment
(typically "production"). Note that each stream needs a separate port, on which the corresponding
importer process will listen on (interface 0.0.0.0).

For the AMQP transport:

````ruby
    stream "app-env" do
      importer do
        type  :amqp
        hosts "amqp-broker.at.your.org"
      end
      workers 3
    end
````

Here you can specify how many workers will be started by logjam to process request data.


### Instrumenting the application

* add the logjam_agent gem to the Gemfile of your application
* add an initializer for logjam_agent and specify transport method and endpoint
* add either the bunny gem or the ffi-rzmq gem to the Gemfile (based on which transport you chose)
* add an initializer for time_bandits and specify which metrics to track

Have a look at the corresponding files in logjam itself to get an idea on how to proceed.

Detailed explanation: coming soon ...


## Deploying Logjam into production

Coming soon ...


## Authors

[Stefan Kaes](http://github.com/skaes) (<skaes@railsexpress.de>) and
[David Anderson](http://github.com/alpinegizmo) (<david@alpinegizmo.com>).


## License

The MIT License

Copyright (c) 2009-2013 Stefan Kaes

Copyright (c) 2009 David Anderson

Copyright (c) 2009 XING AG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
