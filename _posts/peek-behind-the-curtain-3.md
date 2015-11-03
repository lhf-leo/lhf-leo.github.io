---
title: Sinatra 实现原理(三)
subtitle: Request and Response
tags: [翻译, Sinatra]
---
翻译来自 ＊Sinatra: Up and Running＊

##Request and Response

The next step in understanding Sinatra’s internals is to examine the flow of a request, from parsing to delivery of a response back to the client. To do so, we need to examine the role of Rack (which we’ve mentioned briefly earlier) in the Sinatra landscape.

####Rack

Rack is a specification implemented by not only Sinatra, but also Rails, Merb, Ramaze, and a number of other Ruby projects. It’s an extremely simple protocol specifying how an HTTP server (such as Thin, which we’ve used throughout the book) interfaces with an application object, like Sinatra::Application, without having to know anything about Sinatra in particular. In short, Rack defines the higher-level vocabulary that hardware and software can use to communicate. The Rack homepage, http://rack.rubyforge.org, is shown in Figure 3-4.

**Figure 3-4. You can learn more about Rack at http://rack.rubyforge.org**

The Rack protocol at its core specifies that the application object, the so-called endpoint, has to respond to the method call. The server, usually referred to as the handler, will call that method with one parameter. This parameter is a hash containing all relevant information about the request: this includes the HTTP verb used by the request, the path that is requested, the headers that have been sent by the client, and so on.

The method is expected to return an array with three elements. The first one is the status code, provided as an integer. For example, a successful request may receive status code 200, indicating that no errors occurred. The second element is a hash (or hash-like object in Rack 1.3 or later) containing all the response headers. Here you’ll find information such as whether or not the client should cache the response, the length of the response, and similar information. The last object is the body object. This object is required to behave like an array of strings; that is, it has to respond to each and call the passed block with strings.

####Sinatra Without Sinatra

What’s neat about this is that it’s completely possible (and acceptable) to run a Sinatra application without truly invoking Sinatra. Let’s try to port a simple Sinatra application to pure Rack, shown in Example 3-12.

*Example 3-12. Simplified equivalent of a Sinatra application using Rack*
{% highlight bash %}
module MySinatra
  class Application
    def self.call(env)
      new.call(env)
    end

    def call(env)
      headers = {'Content-Type' => 'text/html'}
      if env['PATH_INFO'] == '/'
        status, body = 200, 'hi'
      else
        status, body = 404, "Sinatra doesn't know this ditty!"
      end
      headers['Content-Length'] = body.length.to_s
      [status, headers, [body]]
    end
  end
end

require 'thin'
Thin::Server.start MySinatra::Application, 4567
{% endhighlight %}

Example 3-12 is roughly equivalent to get('/') { 'hi' }. Of course, this is not the implementation found in Sinatra, since the Sinatra implementation is generic and handles a larger number of use cases, contains wrappers, optimizations, and so on. Sinatra will, however, wrap the env hash in a convenience object, available to your code in the form of the request object. Likewise, response is available for generating the body array. These are easily accessible in your application; take a look at Example 3-13 to see how they’re used.

*Example 3-13. Using env, request, and response in Sinatra*
{% highlight bash %}
require 'sinatra'

helpers do
  def assert(condition)
    fail "something is terribly broken" unless condition
  end
end

get '/' do
  assert env['PATH_INFO'] == request.path_info

  final_result = response.finish
  assert Array === final_result
  assert final_result.length == 3
  assert final_result.first == 200

  "everything is fine"
end
{% endhighlight %}

