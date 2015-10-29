---
title: "在AWS上搭建Jekyll博客"
subtitle: "利用Github Post Receive Hook同步"
---
Jekyll是一个为生成静态博客非常快速且优雅的工具, [官方网站](http://jekyllrb.com/ "jekyll")资料详实, 有需要可以去学习一下, 本文会涉及它的基本应用, 但不会深入讨论日常用法. AWS是一个Amazon推出的强大的云服务, 可以被用作VPS. 本文主要讨论如何通过 Github Post Receive 实现本地与 AWS EC2 实例自动同步. 你需要确保已安装git和jekyll在你的机器上. 

##创建博客

在想要存放博客的地方:

    jekyll new myblog
    
这样就创建了一个基本博客的文件系统. 不需要做任何事, 已经创建了初始页面, 现在可以进入文件夹运行博客:

    cd myblog
    jekyll serve
    
现在可以通过访问`http://localhost:4000`, 查看博客. 

然后在博客文件夹里面新建一个git仓库:

    git init
    git add .
    git commit -m 'My new blog!'
    
##配置AWS EC2
除了AWS, 还有很多优秀的VPS提供商. 如果使用的是其他VPS可以跳过*申请开通*, 其余的根据系统相应调整. 

####申请开通  
创建一个AWS帐号, 按照默认设置初始化一个EC2实例. 我选择的是系统是Ubuntu, 因为比较熟悉. 不用多久, 将会获得一个Pem文件, 需要妥善保管, 这是登陆实例的唯一凭证. 还可以通过管理面板找到该实例的IP地址. 现在就可以通过SSH连接:

    ssh -i younameit.pem ubuntu@xxx.xxx.xxx.xxx
    
####新建BARE仓库  
什么是bare仓库, 看[这里](http://git-scm.com/book/en/v2/Git-on-the-Server-Getting-Git-on-a-Server  "git-pro"). 此时在VPS里面:

    cd ~/
    mkdir myblog.git && cd myblog.git
    git init --bare
    
####创建Post-receive Hook  
接下来需要做的是创建Hook. 每次`push`到远程仓库时, Git都会执行一个叫作post-receive的shell脚本, 这里需要创建它:

    cd hooks
    touch post-receive
    nano post-receive

这时可以把以下脚本复制进来. `GIT_REPO`是刚刚创建的bare仓库, `TMP_GIT_CLONE`是临时放置clone下来的博客源码的地方, 在这里build代码后复制到大部分服务器默认的根目录`/var/www/myblog`, `PUBLIC_WWW`是最终网站代码的位置:

    #!/bin/bash -l
    GIT_REPO=$HOME/myblog.git
    TMP_GIT_CLONE=$HOME/tmp/git/myblog
    PUBLIC_WWW=/var/www/myblog

    git clone $GIT_REPO $TMP_GIT_CLONE
    jekyll build --source $TMP_GIT_CLONE --destination $PUBLIC_WWW
    rm -Rf $TMP_GIT_CLONE
    exit
    
有的地方建议修改添加文件可执行权限, 按需执行:

    chmod +x post-receive
    
####本地连接Remote
回到本地, 添加刚刚创建的bare远程仓库到remote:

    git remote add origin ubuntu@[IP 或 DNS]:~/myblog.git
    
为了能够连接到AWS, 你需要把AWS给的证书写到本地安全钥里:

    cat ~/.ssh/id_dsa.pub | ssh -i amazon-generated-key.pem ec2-user@amazon-instance-public-dns "cat >> .ssh/authorized_keys"
    
现在应该就可以`push`到AWS上了:

    git push origin master

