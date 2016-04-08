---
title: Sinatra 实现原理总结
subtitle: Summary
tags: [Sinatra]
---

#Summary

This has been a deep chapter! It’s certainly a lot to take in given how simple and straightforward Sinatra is on the surface. We have started by digging just a little deeper into Sinatra’s implementation details with every step in this chapter. By now, you should have a general understanding of what is going on, how the routing system works, and what Sinatra will do with the results.

We also introduced you to Rack in this chapter, which is the foundation for basically any and all Ruby web applications you’re likely to run across. Understanding Rack will also help you understand the internals of other Ruby web frameworks and libraries (such as Rails) or web servers (like Thin). Understanding how Sinatra and Rack tick will help us design cleaner and more powerful applications, and opens the doors from a creative architecture standpoint.

In Chapter 4, we will have a look into modular applications, which allows Sinatra to be an even better Rack citizen.