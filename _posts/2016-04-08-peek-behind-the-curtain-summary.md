---
title: Sinatra 实现原理补充
subtitle: Ruby 高级概念
tags: [Sinatra]
---

这一系列文章讲解十分深入，有很多概念我不得不回头去查阅，从中也学到了不少。在这篇文章，我会就文章中出现的难懂的概念，做出一些补充。

<!--more-->
# UnboundMethod

Ruby 支持两种对象化了的方法：Bound 和 Unbound。 Bound方法是指和一个特定对象绑定起来的方法对象。 Unbound方法自然就是没有被绑定的嘛。╮（￣▽￣）╭ Unbound方法可以通过`instance_method`来创建，或者令bound方法`unbind`。

Unbound方法只能在绑定后才能被调用，而且必须绑定在一个 和这个方法被解绑下来的类（对象）的实例 上（只要这个实例是`kind_of?`这个类就行）。 

{% highlight ruby %}
class Square
  def area
    @side * @side
  end
  def initialize(side)
    @side = side
  end
end

area_un = Square.instance_method(:area)

s = Square.new(12)
area_un.bind(s).call  #=> 144
{% endhighlight %}

Sinatra里面大概就是这样用的，当路径不同时，绑定不同的方法在get，post上面。

# class << self 

这段代码在Sinatra源码里面有，高端又神秘。其实就是用来为`self`写一些singleton方法。我们首先不要管self，当作一个不同的object好了，看用法：

{% highlight ruby %}
a = 'foo'
class << a
  def inspect
    '"bar"'
  end
end
a.inspect   # => "bar"

a = 'foo'   # new object, new singleton class
a.inspect   # => "foo"
{% endhighlight %}

所以`class << self`也就不难理解了：

{% highlight ruby %}
class String
  class << self
    def value_of obj
      obj.to_s
    end
  end
end

String.value_of 42   # => "42"
{% endhighlight %}

和下面两种方式是一样的：

{% highlight ruby %}
class String
  def self.value_of obj
    obj.to_s
  end
end
{% endhighlight %}

或者：

{% highlight ruby %}
def String.value_of obj
  obj.to_s
end
{% endhighlight %}

# Rack

Rack在Ruby的世界里面是一种构建服务端的最基本，但也是非常有意思的方式。 而且理解Rack也是理解Sinatra的基础，毕竟Sinatra是在Rack的基础上写出来的。 我们可以只用Rack搭建一个简单的后端程序。 直接上实例，代码保存到`config.ru`，然后在该文件夹下执行`rackup`，默认会在` http://localhost:9292`下显示。 非常建议好好研究一下这段代码，对于理解Sinatra和整个Ruby环境都非常有帮助。

{% highlight ruby %}
class Application
  def call(env)
    handle_request(env['REQUEST_METHOD'], env['REQUEST_PATH'])
  end

  private

    def handle_request(method, path)
      if method == "GET"
        get(path)
      else
        method_not_allowed(method)
      end
    end

    def get(path)
      [200, { "Content-Type" => "text/html" }, ["You have requested the path #{path}, using GET"]]
    end

    def method_not_allowed(method)
      [405, {}, ["Method not allowed: #{method}"]]
    end
end

run Application.new
{% endhighlight %}