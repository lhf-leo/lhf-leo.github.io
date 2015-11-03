---
title: Sinatra 实现原理(二)
subtitle: Helpers and Extensions
tags: [翻译, Sinatra]
---
翻译来自 ＊Sinatra: Up and Running＊

##Helpers and Extensions

Now we’ve armed ourselves with enough knowledge to be a little dangerous with Sinatra. We know now that we don’t have to rely on the DSL, but can engage Sinatra in a completely modular fashion. This begs the question of what we stand to gain by doing so. After all, the DSL is capable and convenient out of the box. What if, however, we want to do something that Sinatra’s DSL doesn’t natively allow?

There are two primary ways to extend Sinatra’s functionality: extension methods and helpers. You’ve used extension methods already; an example would be the route handlers (such as get) that make up the average classic application. Usually used at application load time, extension methods are mostly used for configuration and routing, and map directly to class methods for Sinatra::Base or subclasses. It’s the responsibility of Sinatra::Base to make sure everything works properly.
```
Note

When creating extension and helper methods, it’s considered a best practice to wrap those in a module and use the register method to let Sinatra figure out where to use those modules as mixins. Be kind to your fellow Sinatra developers!
```
####Creating Sinatra Extensions

Let’s take a moment to create a simple extension to Sinatra. Our fictional application for this example requires us to send both GET and POST requests to a particular URL such that the same block of code handles both verbs. We’re Ruby developers, so we try to keep our code DRY and we obviously don’t want to define two routes with identical code. Therefore, it makes sense to define an extension that can handle our requirement without duplication. A simple extension is shown in Example 3-6.

*Example 3-6. Creating the Sinatra::PostGet extension*
{% highlight bash %}
require 'sinatra/base'

module Sinatra
  module PostGet
    def post_get(route, &block)
      get(route, &block)
      post(route, &block)
    end
  end

  # now we just need to register it via Sinatra::Base
  register PostGet
end
{% endhighlight %}

Go ahead and create a quick Sinatra app and a module extension in a “sinatra” subfolder; your file should be called post_get.rb. Example 3-7 shows how to actually make use of your new extension.
```
Note

Once you’ve tried the extension and observed it functioning, try removing the register PostGet call from the module. What happens?
```
*Example 3-7. Using custom Sinatra::PostGet extension*
{% highlight bash %}
require 'sinatra'
require './sinatra/post_get'

post_get '/' do
  "Hi #{params[:name]}"
end
{% endhighlight %}

Now we can crack open Telnet again and try our multiple route handler.
{% highlight bash %}
$ telnet 0.0.0.0 4567
Trying 0.0.0.0...
Connected to 0.0.0.0.
Escape character is '^]'.
GET / HTTP/1.1
Host: 0.0.0.0

  HTTP/1.1 200 OK
  Content-Type: text/html;charset=utf-8
  Content-Length: 3
  Connection: keep-alive
  Server: thin 1.2.11 codename Bat-Shit Crazy

  Hi

POST / HTTP/1.1
Host: localhost:4567
Content-Length: 7

foo=bar

  HTTP/1.1 200 OK
  Content-Type: text/html;charset=utf-8
  Content-Length: 3
  Connection: keep-alive
  Server: thin 1.2.11 codename Bat-Shit Crazy

  Hi
{% endhighlight %}

Success! We now have a custom extension that allows us to respond to two verbs in one route without duplicating any code. The extension approach excels at handling low-level routing and configuration requirements deftly.

####Helpers

Helpers and extensions are something like cousins: you can recognize them both as being from the same family, but they have quite different roles to play. Instead of calling register to let Sinatra know about them, you pass them to helpers. `Most importantly, they’re available both in the block you pass to your route and the view template itself, making them effective across application tiers.`

Let’s look at an archetypical helper method: one that generates hyperlinks. The code is shown in Example 3-8.

*Example 3-8. A helper method that generates hyperlinks*
{% highlight bash %}
require 'sinatra/base'

module Sinatra
  module LinkHelper
    def link(name)
      case name
      when :about then '/about'
      when :index then '/index'
      else "/page/#{name}"
    end
  end

  helpers LinkHelper
end
{% endhighlight %}

All you need to do is require './sinatra/link_helper' in your main Sinatra application, and you’ll be able to make use of the LinkHelper module throughout. Let’s make a quick view in Erb that tests it, demonstrated in Example 3-9.

*Example 3-9. An Erb view to test the module*
{% highlight bash %}
<html>
<head>
  <title>Link Helper Test</title>
</head>
<body>
  <nav>
    <ul>
      <li><a href="<%= link(:index) %>">Index</a></li>
      <li><a href="<%= link(:about) %>">About</a></li>
      <li><a href="<%= link(:random) %>">Random</a></li>
    </ul>
  </nav>
</body>
</html>
{% endhighlight %}

Our links are nicely rendered, and mousing over indicates they’re pointing to /index, /about, and /page/random as intended.

##Helpers Without Modules

Sometimes you need to create a helper or two that are only going to be used in one application or for a specific purpose. The helpers method used in Example 3-10 accommodates this case by accepting a block, avoiding the overhead of creating modules, and so on.

*Example 3-10. Creating a helper via a block*
{% highlight bash %}
require 'sinatra'
helpers do
  def link(name)
    case name
    when :about then '/about'
    when :index then '/index'
    else "/page/#{name}"
  end
end

get '/' do
  erb :index
end

get '/index.html' do
  redirect link(:index)
end

__END__

@@index
<a href="<%= link :about %>">about</a>
{% endhighlight %}
```
Note

What’s up with the funky @@index stuff at the bottom of Example 3-10? It’s what Sinatra refers to as an inline template. Got a small amount of HTML to deliver and don’t want to create a whole view file dedicated to it? You can provide it after your routing code and call it the same way you would a normal view. Figure 3-3 shows the rendered output of our friendly helpers.
```
**Figure 3-3. Using the link helper module**

####Combining Helpers and Extensions

What if you want to create an extension that ships with a helper as well? Sinatra provides a hook for this type of activity via a method called registered. Simply create a registered method that takes the application class as an argument. Example 3-11 provides an example of how you might organize your methods; register them with Sinatra as shown and it becomes trivial to produce some fairly sweeping changes to how Sinatra executes.

*Example 3-11. Combining helpers with extensions*
{% highlight bash %}
require 'sinatra/base'
module MyExtension
  module Helpers
    # helper methods go here
  end

  # extension methods go here

  def self.registered(app)
    app.helpers Helpers
  end
end

Sinatra.register MyExtension
{% endhighlight %}

