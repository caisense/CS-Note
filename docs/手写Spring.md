声明：本文是对廖雪峰大神的  [手写Spring教程](https://liaoxuefeng.com/books/summerframework/introduction/index.html) 的学习笔记，仅限于学习交流之用途！

# 0.架构
Summer Framework设计目标如下：

context模块：实现ApplicationContext容器与Bean的管理；
aop模块：实现AOP功能；
jdbc模块：实现JdbcTemplate，以及声明式事务管理；
web模块：实现Web MVC和REST API；
boot模块：实现一个简化版的“Spring Boot”，用于打包运行。

# 1.实现IoC容器
## 1.1 实现ResourceResolver