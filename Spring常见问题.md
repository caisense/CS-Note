# Spring常见问题

## Spring IoC

**Inverse of Control（控制反转）**是一种设计思想，**控制**指的是对象创建（实例化、管理）的权力，**反转**是控制权交给外部环境（Spring 框架、IoC 容器）。

**IoC 容器**是 Spring 用来实现 IoC 的载体， IoC 容器实际上就是个 Map（key，value），存放各种对象。

例如：现有类 A 依赖于类 B

- **传统的开发方式** ：往往是在类 A 中手动通过 new 关键字来 new 一个 B 的对象出来
- **使用 IoC 思想的开发方式** ：不通过 new 关键字来创建对象，而是通过 IoC 容器(Spring 框架) 来帮助我们实例化对象。我们需要哪个对象，直接从 IoC 容器里面过去即可。

![图片](D:\CS-Note\images\Spring常见问题\640.png)

## IoC 和 DI 

IoC 最常见以及最合理的实现方式叫做**依赖注入**（Dependency Injection，简称 DI）。

老马（Martin Fowler）在一篇文章中提到将 IoC 改名为 DI，原文如下，原文地址：https://martinfowler.com/articles/injection.html 。

老马的大概意思是 IoC 太普遍并且不表意，很多人会因此而迷惑，所以，使用 DI 来精确指名这个模式比较好。

#### Spring AOP

Aspect-Oriented Programming（面向切面编程）能够将那些与业务无关，却为业务模块所**共用**的代码（成为**横切逻辑代码**）（例如事务处理、日志管理、权限控制等）封装起来，，便于减少重复代码，降低模块耦合度，增加可拓展性和可维护性。

Spring AOP 就是基于动态代理的，如果要代理的对象，实现了某个接口，那么 Spring AOP 会使用 **JDK Proxy**，去创建代理对象，而对于没有实现接口的对象，就无法使用 JDK Proxy 去进行代理了，这时候 Spring AOP 会使用 **Cglib** 生成一个被代理对象的子类来作为代理，如下图所示：

![SpringAOPProcess](D:\CS-Note\images\Spring常见问题\926dfc549b06d280a37397f9fd49bf9d.jpg)