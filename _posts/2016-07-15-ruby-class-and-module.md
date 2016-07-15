---
title: Ruby的Class, Modules, Extend, Include, Mixins...
subtitle: 还有谁？！
tags: [Ruby]
---

刚开始接触Ruby，除了“ Ruby 是世界上最好的语言”，最大的感触就是：好像随便怎么写都是对的。其中最明显的就是 Extend 和 Include 的用法，我一直凭借着类似于高中做英语选择题的“语感”来决定用哪一个。然而“并非夏去秋才至”，这个问题应该早点搞清楚。

# Module 还是 Class

首先这两个语法都能用在 Module 上，不能用在 Class 上。我们就先从 Module 和 Class 的区别聊起。Class 其实很简单直接，大家大学一般都是从 Java 开始的：和 Java Class 是一样的，用来定义和创造对象。而 Module 是用来提供 namespace 和当做 mixin 用的，硬要作比喻的话，就像 Java 里面 abstract class 与 package 的综合体。有一点需要注意：Class 这个类的父类就是 Module。看个表就都清楚了：

|          | Class         | Module |
| --------- | ------------- | ------ |
| 能否初始化  | 能            | 不能  |
| 用途       | 定义和新建对象   |   namespace，mixin |
| 父类       | Module        |    Object |
| 继承       | 能继承与被继承   |    不能 |
| Inclusion | 不能           |    可以用 `include` 在class和module里 |
| Extension | 不能            |    可以用 `extend` 在class和module里 |
| 包含函数    | Class函数和实例函数 |    Module函数和实例函数 |

基本上讲，Class 就是关于对象的，Module 就是关于方法的。Module 应该是可以用来在各种不同的类中提供方法，最典型的就是验证授权——所有的类都要验证授权，这些方法就像API一样。这就是为什么一般都把 Module 放到 library 文件夹下。

# `include` 还是 `extend`
刚刚说到了 `include` 和 `extend`，都是用来引进 modules 的。之间的区别又是什么呢？举个小🌰：

{% highlight ruby %}
module Foo
  def foo1
    puts 'foo1!'
  end

  def foo2
    puts 'foo2!'
  end
  module_function :foo2
end

Foo.foo2 # foo2!

class Bar
  include Foo
end

Bar.new.foo1 # foo1!
Bar.new.foo2 # NoMethodError: private method `f2' called for #<Bar:0x007f9604884b58>
Bar.foo1 # NoMethodError: undefined method ‘foo1’ for Bar:Class

class Baz
  extend Foo
end

Baz.foo1 # foo1!
Baz.foo2 # NoMethodError: private method `foo2' called for Bar:Class
Baz.new.foo1 # NoMethodError: undefined method ‘foo1’ for #<Baz:0x1e708>
{% endhighlight %}

先看 Foo 的实例函数 foo1。`include` 就是把 Foo 的实例函数变成自己的实例函数。 `extend` 就是把 Foo 的实例函数变成自己的类函数。而 Foo 的 module 函数呢，只能自己用，也叫私有函数。这样应该就很清楚了。

不过这里之所以很容易搞混淆是因为一个 Ruby 的通用惯例，当中就包括 rails：很多时候，人们都会通过 `included` 这个方法把 Module 内部定义的 ClassMethods `extend` 到调用这个 Module 的类中。所以看起来好像你只是 `include` 一个 Module 也可以添加类方法，而其实只是 `extend` 了另外一个 Module 而已。

{% highlight ruby %}
module Foo
  def self.included(base)
    base.extend(ClassMethods)
  end
  
  module ClassMethods
    def bar
      puts 'class method'
    end
  end
  
  def foo
    puts 'instance method'
  end
end

class Baz
  include Foo
end

Baz.bar # class method
Baz.new.foo # instance method
Baz.foo # NoMethodError: undefined method ‘foo’ for Baz:Class
Baz.new.bar # NoMethodError: undefined method ‘bar’ for #<Baz:0x1e3d4>
{% endhighlight %}

# 新名词 Mixin

说到现在， Mixin 也只是一个新名字而已了——就是那些寂寞的类不满足于继承一个父类，于是就 include 更多 Module 想要一统天下。对于这种走火入魔盲目崇拜力量的类，我们为了告诫后人，就称它们为：迷信（Mi Xin）。
