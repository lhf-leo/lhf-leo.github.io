---
title: dup 和 clone 的区别
tags: [Ruby]
---
这两个方法都是对一个对象进行潜复制。它们的区别在于`clone`还做了两件`dup`不做的事：

* 复制该对象的singleton
* 保持该对象的frozen状态

看下面两段代码就清楚了。

dup：

{% highlight ruby %}
a = Object.new
def a.foo; :foo end
a.freeze

p a.foo
# => :foo
p a.frozen?
# => true

b = a.dup

p b.foo
# => undefined method `foo'
p b.frozen?
# => false
{% endhighlight %}

clone：

{% highlight ruby %}
a = Object.new
def a.foo; :foo end
a.freeze

p a.foo
# => :foo
p a.frozen?
# => true

b = a.clone

p b.foo
# => :foo
p b.frozen?
# => true
{% endhighlight %}