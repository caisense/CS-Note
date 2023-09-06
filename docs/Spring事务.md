Spring事务

# @Transacational原理

根据 @Transactional 的属性配置信息，这个代理对象（AOP Proxy）决定该声明的目标方法是否由拦截器 `TransactionInterceptor` 来使用**拦截**。

拦截时，会在目标方法开始执行之前**创建并加入事务**，执行目标方法逻辑，最后根据执行情况是否出现异常，利用抽象事务管理器 `AbstractPlatformTransactionManager` 操作数据源 `DataSource` 来提交或回滚事务

参数：

- propagation：传播类型，枚举值见[propagation参数](####propagation参数)。默认为**REQUIRED**。
- rollbackFor：触发回滚的异常类型，可以有多种。默认为**RunTimeException**。
- transactionManager：与value同名，指定事务管理器。默认为空。如果是数据库事务管理器，其实就是配置数据源。
- isolation：隔离级别（对数据库而言）。mysql 默认为 **REPEATABLE_READ** 可重复读
- timeout：超时时间。默认为**-1永不超时**。

# 事务不生效场景

## 1、方法访问权限问题（非public）

spring要求被代理方法必须是`public`

原因：在`AbstractFallbackTransactionAttributeSource`类的`computeTransactionAttribute`方法中有个判断，如果目标方法不是public，则返回null，即不支持事务。



## 2、方法用final、static修饰

原因：spring事务底层使用了aop，也就是通过jdk动态代理或者cglib，帮我们生成了代理类，在代理类中实现的事务功能。如果方法是final或static，则不会被拦截，代理类无法重写该方法



## 3、类是final

也是cglib的限制，final类无法生成代理



## 4、方法内部调用

```java
@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

  
    public void add(UserModel userModel) {
        userMapper.insertUser(userModel);
        updateStatus(userModel);  // 调用事务方法失败
    }

    @Transactional
    public void updateStatus(UserModel userModel) {
        doSameThing();
    }
}
```

在方法中直接调用同一个类的@Transactional方法，会导致事务失效

原因：调用了this对象

### 解决

总之就是不让当前对象的方法a直接调方法b，可以分两个对象调用，或者让代理对象来调用

#### 3.1、方法拆分

方法a和调用的方法b放在两个类中，给方法a加@Transactional

#### 3.2、在Service类中注入自己

```java
@Servcie
public class ServiceA {
   @Autowired
   prvate ServiceA serviceA;

   public void save(User user) {
         queryData1();
         queryData2();
         serviceA.doSave(user);
   }

   @Transactional(rollbackFor=Exception.class)
   public void doSave(User user) {
       addData1();
       updateData2();
    }
 }
```

这种做法会不会出现循环依赖问题？

其实spring ioc内部的**三级缓存**保证了它，不会出现循环依赖问题。

#### 3.3、通过AopContent类

在该Service类中使用AopContext.currentProxy()获取代理对象，然后由代理对象调事务方法

```java
@Servcie
public class ServiceA {

   public void save(User user) {
         queryData1();
         queryData2();
         ((ServiceA)AopContext.currentProxy()).doSave(user);
   }

   @Transactional(rollbackFor=Exception.class)
   public void doSave(User user) {
       addData1();
       updateData2();
    }
 }
```



## 4、未被spring管理

使用spring事务的前提是：对象要被spring管理，需要创建bean实例，即给类加@Controller、@Service、@Component、@Repository等注解

## 5、多线程调用

若两个线程获取的不是同一个数据库连接，则事务不生效

```java
@Slf4j
@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private RoleService roleService;

    @Transactional
    public void add(UserModel userModel) throws Exception {
        userMapper.insertUser(userModel);
        new Thread(() -> {
            roleService.doOtherThing();
        }).start();
    }
}

@Service
public class RoleService {

    @Transactional
    public void doOtherThing() {
        System.out.println("保存role表数据");
    }
}
```

spring的事务是通过数据库连接来实现的。当前线程中保存了一个map，key是数据源，value是数据库连接。

```java
private static final ThreadLocal<Map<Object, Object>> resources = new NamedThreadLocal<>("Transactional resources");
```

同一个事务，其实是指同一个**数据库连接**，只有拥有同一个数据库连接才能同时提交和回滚

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

原因：springboot通过`DataSourceTransactionManagerAutoConfiguration`类，默认开启了事务。只需要配置.yml文件的`spring.datasource`相关参数即可

解决：传统的spring项目，则需要在applicationContext.xml手动配置



## 8、UDAL分片键不一致

分库的系统中，fence_subscribe_record表分片键是prod_inst_id，elec_fence表分片键是elec_fence_id，两个表分片键不一致，则要做成事务的两条数据不一定在同一片中（下面报错，一条在corp_1分片，另一条在corp_2），无法构成事务。

```
[PUB-1201]UDAL - Handler process error: Distributed transaction occurred, statement : /*89a86853fed14f1ebcced2c1f1ef57ae ElecFenceController.disableFenceForWeb*/  update fence_subscribe_record set  update_date = '2022-04-06 10:37:21'  ,status = 0 ,subscribe_type = 1 where prod_inst_id = 980016408905 and shard = 980016408905 is executed on cmp_corp_2 while the last statement : /*89a86853fed14f1ebcced2c1f1ef57ae ElecFenceController.disableFenceForWeb*/  update elec_fence set status_cd='1100', status_date='2022-04-06 14:49:55', update_date='2022-04-06 14:49:55'  where elec_fence_id=100000000007000 and shard=100000000007000 was executed on cmp_corp_1
```



# 事务不回滚场景

## 1、错误的传播特性

### propagation参数

使用`@Transactional`注解时，可以显式指定`propagation`参数，该参数的作用是指定事务的传播特性，spring目前支持7种传播特性：

1. `REQUIRED` **（默认值）**如果当前上下文中存在事务，那么加入该事务。如果不存在事务，创建一个事务。
2. `REQUIRES_NEW` 每次都会**新建**一个事务，并将**当前上下文**中的事务**挂起**。直到完成新事务后，再恢复执行上下文事务。
3. `SUPPORTS` 如果当前上下文存在事务，则支持事务加入事务，如果不存在事务，则使用非事务的方式执行。
4. `NOT_SUPPORTED` 如果当前上下文中存在事务，则挂起当前事务，然后新的方法在没有事务的环境中执行。
5. `MANDATORY` 如果当前上下文中存在事务，否则抛出异常。
6. `NEVER` 如果当前上下文中存在事务，则抛出异常，否则在无事务环境上执行代码。
7. `NESTED` 如果当前上下文中存在事务，则嵌套创建子事务。如果不存在事务，则新建事务。

只有这三种会创建新事务：REQUIRED（默认），REQUIRES_NEW，NESTED。

如果传播特性设置错了，例如

```java
@Service
public class UserService {
    @Transactional(propagation = Propagation.NEVER)
    public void add(UserModel userModel) {
        saveData(userModel);
        updateData(userModel);
    }
}
```

这种类型的传播特性不支持事务，如果有事务则会抛异常。

### 嵌套事务

> 注意：嵌套事务的 **回滚** 不会互相影响，只要函数内有异常就回滚。
>
> 只在 **提交** 时会互相影响。

a函数带事务，调用b函数，当b的事务传播为：

1. REQUIRES_NEW：新建一个事务，b的事务提交与a的事务提交独立，各自执行完就**立即提交**。
2. NESTED：创建一个子事务，b执行完并不会立即提交，而是等待父事务（即a执行完）**一起提交**。



## 2、自己吞了异常

最常见的问题是：开发者在代码中手动try...catch了异常，然后不继续抛出。而事务回滚是通过异常触发的



## 3、手动抛了别的异常

```java
@Slf4j
@Service
public class UserService {
    
    @Transactional
    public void add(UserModel userModel) throws Exception {
        try {
             saveData(userModel);
             updateData(userModel);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new Exception(e);
        }
    }
}
```

spring事务，默认情况下只会回滚`RuntimeException`（运行时异常）和`Error`（错误），对于普通的Exception（非运行时异常），它不会回滚。

## 4、自定义了回滚异常

可以通过设置`rollbackFor`参数，填入一个类型来自定义回滚的异常。

但如果这个参数的值设置错了，例如：

```java
@Slf4j
@Service
public class UserService {
    
    @Transactional(rollbackFor = BusinessException.class)
    public void add(UserModel userModel) throws Exception {
       saveData(userModel);
       updateData(userModel);
    }
}
```

执行时报错，抛了SqlException、DuplicateKeyException等异常。

而BusinessException是我们自定义的异常，报错的异常不属于BusinessException，所以事务也不会回滚。

#### 注意

即使rollbackFor有默认值，但阿里巴巴开发者规范中，还是要求开发者显式指定，建议`Exception`或`Throwable`。

如果使用默认值RuntimeException，一旦程序抛出了Exception，事务不会回滚，

## 5、嵌套事务回滚多了

```java
public class UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private RoleService roleService;

    @Transactional
    public void add(UserModel userModel) throws Exception {
        userMapper.insertUser(userModel);
        roleService.doOtherThing();
    }
}

@Service
public class RoleService {

    @Transactional(propagation = Propagation.NESTED)
    public void doOtherThing() {
        System.out.println("保存role表数据");
    }
}
```

这种情况使用了嵌套的内部事务，原本是希望调用roleService.doOtherThing方法时，如果出现了异常，只回滚doOtherThing方法里的内容，不回滚 userMapper.insertUser里的内容，即回滚保存点。。但事实是，insertUser也回滚了。

因为doOtherThing方法出现了异常，没有手动捕获，会继续往上抛，导致外部方法也回滚

怎么样才能只回滚保存点呢？

```java
@Transactional
public void add(UserModel userModel) throws Exception {

    userMapper.insertUser(userModel);  // 保存点
    try {
        roleService.doOtherThing();
    } catch (Exception e) {
        log.error(e.getMessage(), e);
    }
}
```

可以将内部嵌套事务放在try/catch中，并且不继续往上抛异常。这样就能保证，如果内部嵌套事务中出现异常，只回滚内部事务，而不影响外部事务。



# 大事务问题

`@Transactional`注解，如果被加到方法上，有个缺点就是整个方法都包含在事务当中了。

```java
@Service
public class UserService {
    
    @Autowired 
    private RoleService roleService;
    
    @Transactional
    public void add(UserModel userModel) throws Exception {
       query1();
       query2();
       query3();
       roleService.save(userModel);
       update(userModel);
    }
}


@Service
public class RoleService {
    
    @Autowired 
    private RoleService roleService;
    
    @Transactional
    public void save(UserModel userModel) throws Exception {
       query4();
       query5();
       query6();
       saveData(userModel);
    }
}
```

在UserService类中，其实只有这两行才需要事务：

```
roleService.save(userModel);
update(userModel);
```

在RoleService类中，只有这一行需要事务：

```
saveData(userModel);
```

如果query方法非常多，调用层级很深，而且有部分查询方法比较耗时的话，会造成整个事务非常耗时，而从造成大事务问题。

# 编程式事务

spring还提供了另外一种创建事务的方式，即通过手动编写代码实现的事务

```java
  @Autowired
   private TransactionTemplate transactionTemplate;
   
   ...
   
   public void save(final User user) {
         queryData1();
         queryData2();
         transactionTemplate.execute((status) => {
            addData1();
            updateData2();
            return Boolean.TRUE;
         })
   }
```

在spring中为了支持编程式事务，专门提供了一个类：TransactionTemplate，在它的execute方法中，就实现了事务的功能。

相较于`@Transactional`注解声明式事务，更建议使用基于`TransactionTemplate`的编程式事务。主要原因如下：

1. 避免由于spring aop问题，导致事务失效的问题。
2. 能够**更小粒度**的控制事务的范围，更直观。

