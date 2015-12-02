---
title: Sublime 使用手册
subtitle: 安装，设置与插件
category: 工具
tags: [搭建环境, 软件]
---
使用sublime很长一段时间了，各个方面都令我非常满意。因为这次更换系统，正好把使用方法归纳一下。下面是我在用的图标以供分享：
![afterglow icon](https://raw.githubusercontent.com/YabataDesign/sublime-text-icon/master/Sublime_text_256x256x32.png "afterglow")
<!--more-->
##安装

在Windows，OS X 和 Ubuntu上安装sublime都非常方便，这里主要介绍一下CentOS的安装方法。
首先，去[Sublime网站](http://www.sublimetext.com/3)下载64位或32位*tarball*，或者直接使用`wget`命令下载：
{% highlight bash %}
## On 64bit
$ wget http://c758482.r82.cf2.rackcdn.com/sublime_text_3_build_3083_x64.tar.bz2
{% endhighlight %}

然后解压到`/opt`文件夹：
{% highlight bash %}
$ sudo tar -vxjf sublime_text_3_build_3083_x64.tar.bz2 -C /opt
{% endhighlight %}

建立一个链接到刚刚安装的文件夹：
{% highlight bash %}
$ sudo ln -s /opt/sublime_text_3/sublime_text /usr/bin/sublime3
{% endhighlight %}

到这里，就可以通过在终端输入`sublime3`来打开软件了。如果需要让GUI知道它的存在（比如想在KDE中的App Launcher找到），创建desktop文件：
{% highlight bash %}
$ sudo sublime3 /usr/share/applications/sublime3.desktop
{% endhighlight %}

在该文件中添加下列语句：
{% highlight bash%}
[Desktop Entry]
Name=Sublime3
Exec=sublime3
Terminal=false
Icon=/opt/sublime_text_3/Icon/48x48/sublime-text.png
Type=Application
Categories=TextEditor;IDE;Development
X-Ayatana-Desktop-Shortcuts=NewWindow
 
[NewWindow Shortcut Group]
Name=New Window
Exec=sublime -n
TargetEnvironment=Unity
{% endhighlight %}

这样安装久搞定了。

##设置

Sublime 使用 Json 作为配置文件格式，方便修改与迁移，我只需要将原来的配置文件（settings-user）替换掉就行了。下面是我用的配置：
{% highlight json %}
{
  "highlight_line": true,
  "font_size": 15,
  "ignored_packages":
  [
    "Vintage"
  ],
  "tab_size": 2,
  "translate_tabs_to_spaces": true
}
{% endhighlight %}

##插件

Sublime 最让人倾慕的功能莫过于其强大的插件支持。众多插件几乎可以满足各个方面的工作需要。一般地，推荐使用`Package Control`安装管理所有插件，安装非常简单。首先在sublime界面中按住`Ctrl`＋`\``打开控制台，输入下列命令（最好去[官网](https://packagecontrol.io/installation)根据你的版本复制代码）：
{% highlight python %}
import urllib.request,os,hashlib; h = '2915d1851351e5ee549c20394736b442' + '8bc59f460fa1548d1514676163dafc88'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)
{% endhighlight %}
然后重启，就能开始安装一些非常实用的插件了。按住`Ctrl`＋`Shift`＋`P`，输入`install`选中`Install Package`，输入或选择你需要的插件回车就安装了（注意左下角的状态栏变化，会提示安装成功）。

一些非常优秀的常用的插件：

* Theme - afterglow
* HTML-CSS-JS Prettify
* Alignment
* ZenCoding

唯一有一些遗憾的是在linux上，sublime无法输入中文（当然也不是没有办法，只是过程繁琐不甚优雅），给一小部分使用场景带来了些许困扰。希望sublime团队能都早日解决这一问题。


