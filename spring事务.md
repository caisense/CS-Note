# spring事务不生效场景

## 1、访问权限问题

spring要求被代理方法必须是`public`

原因：在`AbstractFallbackTransactionAttributeSource`类的`computeTransactionAttribute`方法中有个判断，如果目标方法不是public，则返回null，即不支持事务。



## 2、方法用final修饰

原因：spring事务底层使用了aop，也就是通过jdk动态代理或者cglib，帮我们生成了代理类，在代理类中实现的事务功能。如果方法是final或static，则不会被拦截，代理类无法重写该方法



## 3、方法内部调用



在方法中直接调用同一个类的方法，会导致事务失效

原因：调用了this对象

## 4、未被spring管理

使用spring事务的前提是：对象要被spring管理，需要创建bean实例，即给类加@Controller、@Service、@Component、@Repository等注解

## 5、多线程调用

若两个线程获取的不是同一个数据库连接，则事务不生效

## 6、表不支持事务

原因：mysql5之前，默认的数据库引擎是`myisam`，不支持事务

解决：在创建表的时候，只需要把`ENGINE`参数设置成`MyISAM`

```sql
CREATE TABLE `category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `one_category` varchar(20) COLLATE utf8mb4_bin DEFAULT NULL,
  `two_category` varchar(20) COLLATE utf8mb4_bin DEFAULT NULL,
  `three_category` varchar(20) COLLATE utf8mb4_bin DEFAULT NULL,
  `four_category` varchar(20) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin
```



## 7、未开启事务



事务不回滚