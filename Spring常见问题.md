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

## Spring AOP

Aspect-Oriented Programming（面向切面编程）能够将那些与业务无关，却为业务模块所**共用**的代码（成为**横切逻辑代码**）（例如事务处理、日志管理、权限控制等）封装起来，，便于减少重复代码，降低模块耦合度，增加可拓展性和可维护性。

Spring AOP 就是基于动态代理的，如果要代理的对象，实现了某个接口，那么 Spring AOP 会使用 **JDK Proxy**，去创建代理对象，而对于没有实现接口的对象，就无法使用 JDK Proxy 去进行代理了，这时候 Spring AOP 会使用 **Cglib** 生成一个被代理对象的子类来作为代理，如下图所示：

![SpringAOPProcess](D:\CS-Note\images\Spring常见问题\926dfc549b06d280a37397f9fd49bf9d.jpg)

### Spring AOP创建时机？

在BeanPostProcessor后置处理器时创建，有jdk动态代理和cglib两种实现

## SpringBoot单体应用支持的最大并发？

SpringBoot内置Tomcat，在默认设置中，Tomcat的最大线程数是200，**最大连接数（并发量）是10000**。

## Bean的生命周期

Bean的生命周期指的就是：在Spring中，Bean是如何生成的？
被Spring管理的对象叫做Bean。Bean的生成步骤如下：
1. Spring扫描class得到BeanDefinition
2. 根据得到的BeanDefinition去生成bean
3. 首先根据class推断构造方法
4. 根据推断出来的构造方法，反射，得到一个对象（暂时叫做原始对象）
5. 填充原始对象中的属性（依赖注入）
6. 如果原始对象中的某个方法被AOP了，那么则需要根据原始对象生成一个代理对象
7. 把最终生成的代理对象放入单例池（源码中叫做singletonObjects）中，下次getBean时就直接
从单例池拿即可

## 如何解决循环依赖

A创建时--->需要B---->B去创建--->需要A，从而产生了循环依赖

Spring使用三级缓存

1. 一级缓存`singletonObjects `ConcurrentHashMap<beanName, bean对象> ：

   缓存已经经历了完整生命周期的bean对象。

2. 二级缓存`earlySingletonObjects `HashMap<beanName, bean对象>：

   比`singletonObjects`多了一个early，表示缓存的是早期的bean对象。 早期是什么意思？表示Bean的生命周期还没走完就把这个Bean放入了earlySingletonObjects。 

3. 三级缓存`singletonFactories ` ConcurrentHashMap<beanName, bean对象>：

   缓存ObjectFactory，表示对象工厂，表示用来创建早期bean对象的 工厂。

![image-20220311095851373-16469639344001](D:\CS-Note\images\Spring常见问题\image-20220311095851373-16469639344001.png)

# Spring常用注解