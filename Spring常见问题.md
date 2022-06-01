#  Spring常见问题

## Spring IoC

**Inverse of Control（控制反转）**是一种设计思想，**控制**指的是对象创建（实例化、管理）的权力，**反转**是控制权交给外部环境（Spring 框架、IoC 容器）。

**IoC 容器**是 Spring 用来实现 IoC 的载体， IoC 容器实际上就是个 Map（key，value），存放各种对象。

例如：现有类 A 依赖于类 B

- **传统的开发方式** ：往往是在类 A 中手动通过 new 关键字来 new 一个 B 的对象出来
- **使用 IoC 思想的开发方式** ：不通过 new 关键字来创建对象，而是通过 IoC 容器(Spring 框架) 来帮助我们实例化对象。我们需要哪个对象，直接从 IoC 容器里面过去即可。

![图片](images/Spring常见问题/640.png)

### IoC 和 DI 

IoC 最常见以及最合理的实现方式叫做**依赖注入**（Dependency Injection，简称 DI）。

老马（Martin Fowler）在一篇文章中提到将 IoC 改名为 DI，原文如下，原文地址：https://martinfowler.com/articles/injection.html 。

老马的大概意思是 IoC 太普遍并且不表意，很多人会因此而迷惑，所以，使用 DI 来精确指名这个模式比较好。

## Spring AOP

Aspect-Oriented Programming（面向切面编程）能够将那些与业务无关，却为业务模块所**共用**的代码（成为**横切逻辑代码**）（例如事务处理、日志管理、权限控制等）封装起来，，便于减少重复代码，降低模块耦合度，增加可拓展性和可维护性。

Spring AOP 就是基于动态代理的，如果要代理的对象，实现了某个接口，那么 Spring AOP 会使用 **JDK Proxy**，去创建代理对象，而对于没有实现接口的对象，就无法使用 JDK Proxy 去进行代理了，这时候 Spring AOP 会使用 **Cglib** 生成一个被代理对象的子类来作为代理，如下图所示：

![SpringAOPProcess](images/Spring常见问题/926dfc549b06d280a37397f9fd49bf9d.jpg)

### Spring AOP创建时机？

在BeanPostProcessor后置处理器时创建，有jdk动态代理和cglib两种实现

## SpringBoot单体应用支持的最大并发？

SpringBoot内置Tomcat，在默认设置中，Tomcat的最大线程数是200，**最大连接数（并发量）是10000**。

# Bean的生命周期

Bean的生命周期指的就是：在Spring中，Bean是如何生成的？
被Spring管理的对象叫做Bean。Bean的生成步骤如下：

1. Spring扫描class得到`BeanDefinition`
2. 根据得到的BeanDefinition去生成bean
3. 首先根据class推断构造方法
4. 根据推断出来的构造方法，反射，得到一个对象（暂时叫做原始对象）
5. 填充原始对象中的属性（依赖注入）
6. 如果原始对象中的某个方法被AOP了，那么则需要根据原始对象生成一个代理对象
7. 把最终生成的代理对象放入单例池（源码中叫做singletonObjects）中，下次getBean()时就直接
    从单例池拿即可

# SpringBoot是怎么启动的

在Application类下 SpringApplication.run()

SpringBootApplication有三个Annotation

@EnableAutoConfiguration 通过@import将所有符合自动配置条件的bean定义都加载到IoC容器 搜索符合自动配置条件的功能需要借助于SpringFactoriesLoader提供的配置查找的功能 即根据 @EnableAutoConfiguration的完整类名作为查找的Key 获取对应的一组Configuration类

@Configuration 和JavaConfig形式的Spring loc容器的配置类使用的@Configuration一样 是其定义成一个JavaConfig配置类

 

@ComponentScan 对应XML配置中的元素 其功能就是自动扫描并加载符合条件的组件（比如@Component和@Repository等）或者bean定义，最终将这些bean定义加载到IoC容器

## 如何解决循环依赖

A创建时--->需要B---->B去创建--->需要A，从而产生了循环依赖

Spring使用三级缓存

1. 一级缓存`singletonObjects `ConcurrentHashMap<beanName, bean对象> ：

   缓存已经经历了完整生命周期的bean对象。

2. 二级缓存`earlySingletonObjects `HashMap<beanName, bean对象>：

   比`singletonObjects`多了一个early，表示缓存的是早期的bean对象。 早期是什么意思？表示Bean的生命周期还没走完就把这个Bean放入了earlySingletonObjects。 

3. 三级缓存`singletonFactories ` ConcurrentHashMap<beanName, bean对象>：

   缓存ObjectFactory，表示对象工厂，表示用来创建早期bean对象的 工厂。

SingletonObjecs 完成初始化的单例对象的cache（一级缓存）

EarlySingletonObjecs 完成实例化但没有初始化的 提前曝光的单例对象的Cache（二级缓存）

SingletonFactories 进入实例化阶段的单例对象工厂的cache（三级缓存）

![image-20220311095851373-16469639344001](images/Spring常见问题/image-20220311095851373-16469639344001.png)

## @Component 和 @Configuration + @Bean 同时存在，创建bean用拿个？

`allowBeanDefinitionOverriding=true;`，默认是允许BeanDefinition覆盖

因此若同时存在，默认情况下，容器加载的是@Configuration + @Bean 配置的bean

# Spring常用注解

## @Component

最普通的组件，可以被注入到spring容器进行管理。等效于XML的bean配置

是单例模式，因此bean会在全局共享。

根据类型注入，因此如果有多个同类型（或一个接口的多个实现，具体看程序getBean()获取的是类还是接口），启动时会报错：

```
Field sysUserApi in com.eshore.cmp.corp.service.service.base.CorpBaseService required a single bean, but 2 were found:
	- userErrorDecoder: defined in URL [jar:file:/D:/Java/apache-maven-3.5.4/repository/com/eshore/cmp/cmp-ord-api/2.0.0-SNAPSHOT/cmp-ord-api-2.0.0-SNAPSHOT.jar!/com/eshore/cmp/ord/UserErrorDecoder.class]
	- feignErrorDecoder: defined in URL [jar:file:/D:/Java/apache-maven-3.5.4/repository/com/eshore/cmppub/cmppub-springcloud-common/2.0.0-SNAPSHOT/cmppub-springcloud-common-2.0.0-20210618.070507-15.jar!/com/eshore/cmppub/springcloud/common/components/feign/FeignErrorDecoder.class]
```

@Repository, @Service  和 @Controller 都包含 @Component，是针对不同的使用场景所采取的特定功能化的注解组件

- @Repository注解可以标记在任何的类上，用来表明该类是用来执行与数据库相关的操作（即dao对象），并支持自动处理数据库操作产生的异常
- @Service修饰服务（接口实现类）。如果你不知道要在项目的业务层采用@Service还是@Component注解。那么，@Service是一个更好的选择。



## @Configuration

用于修饰类，告诉Springboot这是一个配置类（等同于配置文件）

参数：proxyBeanMethods，代理bean的方法，布尔类型

- true：保证每个@Bean方法被调用多少次返回的组件都是单实例的
- false：每个@Bean方法被调用多少次返回的组件都是新创建的



## @Bean

用于修饰方法，按**类型**装配。一般与@Configuration搭配使用，在配置类中，使用@Bean标注的方法给容器中添加组件。默认以**方法名**作为组件name，返回类型就是组件类型。

组件name必须是唯一的，否则会冲突。

1. 方法无参

   ```java
   // 配置类
   @Configuration(proxyBeanMethods = false)  
   public class Myconfig {
       @Bean  
       public User user01() {  // 向容器中添加组件，名称默认为user01，即方法名
           return new User("zhangsan", 18);
       }
   }
   // 主启动类main方法, 获取IOC容器
   ConfigurableApplicationContext run = SpringApplication.run(MainApplicaition.class, args);
   
   // 从容器中获取组件
   User user = run.getBean("user01", User.class);
   ```

2. 方法带参

   @Bean修饰的方法若带参数，则根据**形参类型**寻找容器组件

   ```java
   @Bean
   @ConditionalOnMissingBean(name = "user123")  // 若容器中不存在名为user123的组件
   public User user123(User user1) {            // 则获取容器中类型为User的组件，并将其命名为user123以返回
       return user1;
   }
   ```

## @Order

用于修饰类

```java
@Order(1)
@Service
public class CustomerHandler extends BaseSyncCorpDataHandler implements ISyncCorpDataHandler {
	// 实现dealData方法
    @Override
    public CorpDataHandleResult dealData() {
        ...
    }
}
```

参数x越小，优先级越高。如果不标注数字，默认最低优先级（int最大值）

该注解等同于实现Ordered接口getOrder方法，并返回数字。

配合@Autowired，就能在类中按顺序注入List

```java
public class SyncCorpDataServiceImpl extends CorpBaseService implements ISyncCorpDataService {
	// 按Order的排序，扫描ISyncCorpDataHandler的所有实现类，依次注入到List中
    @Autowired
    List<ISyncCorpDataHandler> syncCorpDataHandlers;
    
    public String dealCorpDataFromIotReqInfo(SyncReqInfoBo svcCont) {
        // 依次执行每个ISyncCorpDataHandler接口实现类的dealData
        for (ISyncCorpDataHandler syncCorpDataHandler : syncCorpDataHandlers) {
            syncCorpDataHandler.dealData();
            ...
        }
    }
}
```

注意：@Order不能决定Spring容器加载Bean的顺序，只能决定@Autowired注入List<>的顺序

## @PostConstruct

jdk1.6开始，用于修饰非静态的void方法，在当前类构造完成时执行该方法，完成某些初始化动作。

执行顺序：Constructor -> @Autowired -> @PostConstruct  （构造完成，说明是完整的bean，因此依赖注入已完成）

例：当某个类中，注入的bean加载顺序迟于当前类，则程序无法启动，因为@PostConstruct方法依赖于注入bean，而此时bean未加载，无法继续

```java
// 某个类中
    @Autowired
    private IParamApi paramApi;

    @PostConstruct
    public void initOiddUrl() {
        if (!"local".equals(envActive)) {
            CmpParam param = paramApi.queryCmpParam("OIDD_URL");
            if (StringHelper.isNotEmpty(param.getParamValue())) {
                this.oiddUrl = param.getParamValue();
            }
        }
    }
```



## @Autowired

**作用**

自动导入对象到类中，被注入进的类同样要被 Spring 容器管理比如：Service 类注入到 Controller 类中。

默认 按类型装配（而不是变量名），默认情况下必须要求依赖对象必须存在，如果要允许null值，可以设置它的required属性为false

@Bean 和 @Autowired 做了两件完全不同的事情：

1. @Bean 告诉 Spring：“这是这个类的一个实例，请保留它，并在我请求时将它还给我”。
2. @Autowired 说：“请给我一个这个类的实例，例如，一个我之前用@Bean注释创建的实例”。

**前提**

要注入的类加上@Component（或者@Service、@Controller等包含@Component的注解）。

在类中的变量加@Autowired注解无法生效。

因为如果一个类new对象生成的，那么这个类就不归spring容器管理，IOC等spring的功能也就无法使用了。



**常规用法：单个注入**

  

```java
@Autowired // 直接注入
private  BeanInterface beaninterface; 
```

**注意**

由于@Autowired根据类型装配，因此容器中有多个同类型Bean时，需要加@Qualifier指定要注入的Bean名称，否则会出错。

```java
//控制器 
@RestController
public class HelloController {
    @Autowired
    @Qualifier("Zhang")  //指定注入名为“Zhang"的组件
    private User user;
}
// 配置类
@Configuration(proxyBeanMethods = false)
public class Myconfig {
    @Bean("Zhang")
    public User user01() {
        return new User("zhangsan", 18);
    }
    @Bean("Li")
    public User user03() {
        return new User("lisi", 19);
    }
}
```

若想将多个同类型Bean都注入，参考下文注入Map<T>

**注入集合**

注入`List<T>`

按类型搜寻相应的Bean并注入List，还可以使用@Order指定加载的顺序（也即是Bean在List中的顺序，spring根据加载顺序填入list。

注入`Set<T>`

也是按类型注入，但是没有顺序

注入`Map<T>`

 @Autowired 标注作用于 Map 类型时，如果 Map 的 key 为 String 类型，则 Spring 会将容器中所有**类型符合** Map 的 value 对应的类型的 Bean 增加进来，用 Bean 的 id 或 name 作为 Map 的 key。



## @ControllerAdvice

全局Controller异常处理

用法：在打上注解的类中，对每种要处理的异常类型，写一个处理方法，每个方法用@ExceptionHandler注解指定处理的异常类型，方法的参数一般也是要处理的异常类型

优点：将 Controller 层的异常和数据校验的异常进行统一处理，减少模板代码，减少编码量，提升扩展性和可维护性。

缺点：只能处理 Controller 层未捕获（往外抛）的异常，对于 Interceptor（拦截器）层的异常，Spring 框架层的异常，就无能为力了。

```java
// 全局Controller异常处理
@ControllerAdvice
public class GlobalExceptionAdvice {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

	// valid异常
    @ResponseBody
    // 指定处理异常类型
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    // 入参为要处理的异常类型
    public NaResult<Object> methodArgumentNotValidHandler(MethodArgumentNotValidException e) {
        if (e != null && CollectionHelper.isNotEmpty(e.getBindingResult().getFieldErrors())) {
            FieldError error = CollectionHelper.getFirst(e.getBindingResult().getFieldErrors());
            return new NaResult<>(NaConstant.FAIL_CODE, error.getDefaultMessage(), null);
        }
        return new NaResult<>(NaConstant.FAIL_CODE, ExceptionMsgs.CommonErrMsg.PARAM_ERROR, null);
    }

    // NA自定义异常
    @ResponseBody
    @ExceptionHandler(value = NaException.class)
    public NaResult<Object> naExceptionHandler(NaException e) {
        logger.error("GlobalExceptionAdvice-naExceptionHandler:{}", e.getMessage(), e);
        return new NaResult<>(NaConstant.FAIL_CODE, e.getMessage(), null);
    }

    // 其他异常
    @ResponseBody
    @ExceptionHandler(value = Exception.class)
    public NaResult<Object> exceptionHandler(Exception e) {
        logger.error("GlobalExceptionAdvice-exceptionHandler:{}", e.getMessage(), e);
        return new NaResult<>(NaConstant.FAIL_CODE, e.getMessage(), null);
    }

}
```

## 参数校验（validation框架）

@Validated：用在方法入参上

@Valid：用在属性上，配合@Validated嵌套验证

例：数据结构是Item类包裹Prop类，最外层用@Validated校验Item，Item内用@Valid校验Prop，就能启用校验

```java
@PostMapping("/item/add")
public void addItem(@RequestBody @Validated Item item) {
    System.out.println("input:" + jsonMapper.toJson(item));
}

public class Item {
    @NotNull(message = "id不能为空")
    @Min(value = 1, message = "id必须为正整数")
    private Long id;

    @Valid
    @NotNull(message = "props不能为空")
    @Size(min = 1, message = "至少要有一个属性")
    private List<Prop> props;
    // get、set省略
}

public class Prop {
    @NotNull(message = "pid不能为空")
    @Min(value = 1, message = "pid必须为正整数")
    private Long pid;

    @NotBlank(message = "pidName不能为空")
    private String pidName;
    // get、set省略
}
```

**常用校验注解**

1. @NotNull：不能为null，但可以为empty（空字符串，空对象）
2. @NotEmpty：不能为null，而且长度必须大于0
3. @NotBlank：只能作用在String上，不能为null，而且调用trim()去除前后空格后，长度必须大于0
4. @Max(value)：最大值，用于一个枚举值的数据范围控制
5. @Min(value)：最小值，用于一个枚举值的数据范围控制
6. @Size(min=a, max=b)：限制字符长度必须在min到max之间
7. @Pattern(regexp = "正则")：正则表达式校验