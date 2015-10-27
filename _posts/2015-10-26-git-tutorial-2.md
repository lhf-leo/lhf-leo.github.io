---
title: "Git初学者(二)"
subtitle: "Git分支"
---
出于实用的考虑，本文略过 Git 实现分支的原理，如有兴趣可以参考 [Pro Git](https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%88%86%E6%94%AF%E7%AE%80%E4%BB%8B) 的描述。
<!--more-->

## 创建分支

如果还记得上篇文章 [Git基础](http://hanfu.space/learning/2015/08/26/git-tutorial/) 中提到的指针，那么就会知道，创建分支其实就是创建了一个新的指针。使用的指令是`git branch`：
```
    git branch testing
```
![img](https://git-scm.com/book/en/v2/book/03-git-branching/images/head-to-master.png "head-to-master") 