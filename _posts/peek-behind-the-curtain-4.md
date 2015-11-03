---
title: Sinatra 实现原理(四)
subtitle: Rack It Up
tags: [翻译, Sinatra]
---
翻译来自 ＊Sinatra: Up and Running＊

##Rack It Up

What does all this mean for us as Sinatra developers? If you hop into IRB again and try typing Sinatra::Application.new.class, you will find that new does not return an instance of Sinatra::Application (give it a shot; it actually returns an instance of Rack::MethodOverride).

The Rack specification supports chaining filters and routers in front of your application. In Rack slang, those are called middleware. This middleware also implements the Rack specification; it responds to call and returns an array as described above. Instead of simply creating that array on its own, it will use different Rack endpoint or middleware and simply call call on that object. Now this middleware can modify the request (the env hash), modify the response, decide whether or not to call the next endpoint, or any combination of those. By returning a Rack::MethodOverride object instead of a Sinatra::Application object, Sinatra respects this middleware chaining.

####Middleware

Rack has an additional specification for middleware. Middleware is created by a factory object. This object has to respond to new; new takes at least one argument, which is the endpoint that will be wrapped by the middleware. Finally, the middleware returns the wrapped endpoint.

Usually the factory is simply a class, like Sinatra::ShowException, and the instances of this class are the concrete middleware configurations, with a fixed endpoint. Let’s set Sinatra aside for a moment and write a simple Rack application again. We can use a Proc object for that, since it responds to call. We will also create a simple middleware that will check if the path is correct.

The rack gem should already be installed on your system, since Sinatra depends on it. It comes with a handy tool called rackup, which understands a simple DSL for setting up a Rack application (you may recall we used a rackup file in Chapter 1 to deploy code to Heroku). Create a file called config.ru with the contents shown in Example 3-14. Once you’ve done so, run rackup -p 4567 -s thin from the same directory. You should be able to view your application at http://localhost:4567/.

*Example 3-14. Contents of config.ru*
{% highlight bash %}
MyApp = proc do |env|
  [200, {'Content-Type' => 'text/plain'}, ['ok']]
end

class MyMiddleware
  def initialize(app)
    @app = app
  end

  def call(env)
    if env['PATH_INFO'] == '/'
      @app.call(env)
    else
      [404, {'Content-Type' => 'text/plain'}, ['not ok']]
    end
  end
end

# this is the actual configuration
use MyMiddleware
run MyApp
{% endhighlight %}

####Sinatra and Middleware

The features exposed by Rack are so handy that Sinatra actually ships with a use method that behaves exactly like the version offered by rackup. Example 3-15 shows it in use.

*Example 3-15. Using use in Sinatra*
{% highlight bash %}
require 'sinatra'
require 'rack'

# A handy middleware that ships with Rack
# and sets the X-Runtime header
use Rack::Runtime

get('/') { 'Hello world!' }
{% endhighlight %}

Although interesting, the question lingers: how does this all connect to day-to-day development in Sinatra? The answer: you can use any Sinatra application as middleware.

The class, Sinatra::Application, is the factory creating the configured middleware instance (which is your application instance). When the request comes in, all before filters are triggered. Then, if a route matches, the corresponding block will be executed. If no route matches, the request is handed off to the wrapped application. The after filters are executed after we’ve got a response back from the route or wrapped app. Thus, your application is Rack middleware.

