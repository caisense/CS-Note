Spring常用注解

# @Component

最普通的组件，可以被注入到spring容器进行管理。等效于XML的bean配置

是单例模式，因此bean会在全局共享。

根据类型注入，因此如果有多个同类型（或一个接口的多个实现，具体看程序getBean()获取的是类还是接口），启动时会报错：

```
Field sysUserApi in com.eshxxx.cmp.corp.service.service.base.CorpBaseService required a single bean, but 2 were found:
	- userErrorDecoder: defined in URL [jar:file:/D:/Java/apache-maven-3.5.4/repository/com/eshxxx/cmp/cmp-ord-api/2.0.0-SNAPSHOT/cmp-ord-api-2.0.0-SNAPSHOT.jar!/com/eshxxx/cmp/ord/UserErrorDecoder.class]
	- feignErrorDecoder: defined in URL [jar:file:/D:/Java/apache-maven-3.5.4/repository/com/eshxxx/cmppub/cmppub-springcloud-common/2.0.0-SNAPSHOT/cmppub-springcloud-common-2.0.0-20210618.070507-15.jar!/com/eshxxx/cmppub/springcloud/common/components/feign/FeignErrorDecoder.class]
```

@Repository, @Service  和 @Controller 都包含 @Component，是针对不同的使用场景所采取的特定功能化的注解组件

- @Repository注解可以标记在任何的类上，用来表明该类是用来执行与数据库相关的操作（即dao对象），并支持自动处理数据库操作产生的异常
- @Service修饰服务（接口实现类）。如果你不知道要在项目的业务层采用@Service还是@Component注解。那么，@Service是一个更好的选择。

# Controller不能直接返回数字

如下代码直接返回int

```java
@Controller
@RequestMapping("/api/v1/authBillDetail")
public class AuthBillDetailController extends CMPController {
    @Autowired
    private IAuthBillDetailService authBillDetailService;
    
    @ApiOperation(value = "xxx notes = "xxx")
    @PostMapping("/insert")
    //@ResponseBody
    int insert(@RequestBody AuthBillDetail entity) {
        int res = authBillDetailService.insert(entity);
        return res;
    }
}
```

报错：

```
java.lang.IllegalArgumentException: Unknown return value type: java.lang.Integer
	at org.springframework.web.method.support.HandlerMethodReturnValueHandlerComposite.handleReturnValue(HandlerMethodReturnValueHandlerComposite.java:80)
	at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:123)
	at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:879)
```

若返回其他数字类型，如long等，也会报错。

解决：加@ResponseBody，或者返回非整数类型，或用自定义泛型包裹数字类型

# @Scope

只有一个参数：value，别名scopeName

用法：

- `singleton`：单例（默认），每次getBean都只返回同一个bean
- `prototype`：原型，每次getBean返回一个新的bean
- `request`: 表示该针对每一次HTTP请求都会产生一个新的bean，同时该bean仅在当前HTTP request内有效
- `session`：表示该针对每一次HTTP请求都会产生一个新的bean，同时该bean仅在当前HTTP session内有效

**多例失效场景**

controller是默认的单例，对其Autowired注入的service层指定是多例时，多例失效。原因是多例service被单例controller依赖，而单例controller初始化时，多例的service注入，创建bean；单例controller调用service时，由于注入只有一次，因此调的还是注入时的service，即多例service没有起效

解决：

- 方法1: 不使用`@Autowired` ,每次调用多例的时候,直接调用bean

- 方法2:spring的解决方法:设置`proxyMode`,每次请求的时候实例化

  > `@Scope`注解添加了一个proxyMode的属性，有两个值`ScopedProxyMode.INTERFACES`和`ScopedProxyMode.TARGET_CLASS`，前一个表示表示Service是一个接口，后一个表示Service是一个类。

```java
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE, proxyMode = ScopedProxyMode.TARGET_CLASS)
```

# @ComponentScan

扫描含有@Component的类，注入spring容器。包含@Component的注解也算，如：@Controller，@Service和@Repository

**原理**

org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider#registerDefaultFilters

方法中给includeFilters添加了@Component过滤器，因此默认扫描带@Component的类：

```java
this.includeFilters.add(new AnnotationTypeFilter(Component.class));
```

**value**

指定扫描路径，默认扫描该注解修饰的当前类所在目录

**ExcludeFilter 和 IncludeFilter**

1.ExcludeFilter表示**排除过滤器**。

比如以下配置，表示扫描com.zhouyu这个包下面的所有类，但是排除UserService类，也就是就算它上面有@Component注解也不会成为Bean。

```java
@ComponentScan(value = "com.css.service",
        excludeFilters = {@ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = UserService.class)})
public class AppConfig {
}
```

2.IncludeFilter表示**包含过滤器**

以下配置，即使UserService类没加@Component也能注入spring容器。

```java
@ComponentScan(value = "com.css.service",
        includeFilters = {@ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = UserService.class)})
public class AppConfig {
}
```

FilterType分为：

1. ANNOTATION：通过注解过滤
2. ASSIGNABLE_TYPE：通过Class类型过滤
3. ASPECTJ：Aspectj表达式过滤
4. REGEX：正则表达式过滤
5. CUSTOM：自定义 过滤 

在Spring的扫描逻辑中，默认会添加一个**Annotation**类型的FilterType给includeFilters，表示默认情况下Spring会认为类上有@Component注解的就是Bean。  

# @Configuration

用于修饰类，告诉Springboot这是一个配置类（等同于配置文件）

参数：proxyBeanMethods，代理bean的方法，布尔类型

- true：保证每个@Bean方法被调用多少次返回的组件都是单实例的
- false：每个@Bean方法被调用多少次返回的组件都是新创建的



# @Bean

用于修饰方法，按**类型**装配。一般与@Configuration搭配使用，在配置类中，使用@Bean标注的方法给容器中添加组件。默认以**方法名**作为beanName（必须是唯一的，否则会冲突），返回类型就是bean类型。Spring对`@Bean`方法只调用一次，因此返回的Bean仍然是**单例**。

参数：给bean命名，无参则默认取方法名为beanName。

参数为列表，则第一个是真名，其他参数是**别名**：

```java
@Bean({"user", "user1", "user2"})			// 名字是user，有两个别名user1和user2
public User user123(User user1) {            // 则获取容器中类型为User的组件，并将其命名为user123以返回
    return user1;
}
```

方法的bean搜寻机制分为无参和有参：

1. 方法无参，则编写方法逻辑返回bean，容器并不帮你找bean。

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

2. 方法带参，则spring根据**形参类型**寻找容器组件。容器中注入的bean名称为传入参数

   ```java
   @Bean
   @ConditionalOnMissingBean(name = "user123")  // 若容器中不存在名为user123的组件
   public User user123(User user1) {       // 则获取容器中类型为User（不看名字）的组件，并将其命名为user123以返回。
       return user1;
   }
   ```

# @lazy

表示延迟加载，没有指定此注解时，单例会在容器初始化时就被创建。而当使用此注解后，单例对象的创建时机会在该bean在被**第一次使用**时才创建（即getBean()、打印bean等动作，只声明bean不算使用）

只对单例bean有用，原型bean无效。

1. 修饰属性，与@Autowired配合，用于延迟注入
2. 修饰类，与@Component配合，用于延迟IoC
3. 修饰方法，与@Bean配合，用于延迟IoC


# @Autowired

**参数**

required，布尔值，默认true--表示注入的对象必须存在。false--允许为null

**作用**

自动注入对象到类中。

> 注意：被注入的类要被 Spring 容器管理（加上@Component，或者@Service、@Controller等包含@Component的注解），否则在类中的变量加@Autowired注解无法生效。
>
> 因为如果一个类是new生成的，那么这个类就不归spring容器管理，IOC等spring的功能也就无法使用了。

可以修饰：

1. 属性：先根据**属性类型（而不是名字）**去找Bean，如果找到多个再根据**属性名**确定一个

2. set方法：先根据方法**参数类型**去找Bean，如果找到多个再根据**参数名**确定一个

3. 构造方法：先根据方法**参数类型**去找Bean，如果找到多个再根据**参数名**确定一个

   用途：由于Java变量的初始化顺序为：静态变量或静态语句块–>实例变量或初始化语句块–>构造方法–>@Autowired，因此构造时属性还未注入，如果此时需要这个属性值，则应在构造方法加@Autowired

   ```java
   public class UserService {
       // 下面两种@Autowired效果相同
       @Autowired
       private OrderService os; // 用于字段上
   
       @Autowired
       public void setOrderService(OrderService os) { // 用于属性的方法上
           this.os = os;
       }
   }
   ```

   ```java
   // 第3种：加载构造方法
   @Component
   public class UserService {
       private OrderService os;
       @Autowired  
       public UserService(OrderService os) {
           System.out.println(this.os);  // null
           System.out.println(os);  // com.zhouyu.service.OrderService@59690aa4
       }
   }
   
   //测试：
   public static void main(String[] args) {
       // 创建一个Spring容器
       AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
       UserService userService = (UserService) context.getBean("userService");
   }
   ```

   如果根据属性名还是找不到，则报错

   ```java
   public class AppConfig {  // 配置类
   	@Bean({"orderService2", "orderService3"})  // 名字orderService2，别名orderService3
   	public OrderService orderService() {
   		return new OrderService();
   	}
   	@Bean
   	public OrderService orderService1() {  // 名字orderService1
   		return new OrderService();
   	}
   }
   public class UserService {
   	@Autowired
   	private OrderService orderService;  // 报错，因为OrderService类型bean有两个，但没有名为orderService的
       @Autowired
   	private OrderService orderService3  // 正确，因为有一个别名为orderService3的bean
   	@Value("#{orderService3}")
   	@Autowired
   	private OrderService orderService;  // 正确，虽然Autowired没找到，但是value找到了
   }
   ```

   

@Bean 和 @Autowired 做了两件完全不同的事情：

1. @Bean 告诉 Spring：“这是这个类的一个实例，请保留它，并在我请求时将它还给我”。
2. @Autowired 说：“请给我一个这个类的实例，例如，一个我之前用@Bean注释创建的实例”。

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

1. 注入`List<T>`

   按类型搜寻相应的Bean并注入List，还可以使用@Order指定加载的顺序（也即是Bean在List中的顺序，spring根据加载顺序填入list。

2. 注入`Set<T>`

   也是按类型注入，但是没有顺序

3. 注入`Map ---- Map <beanName，Bean>`

   @Autowired 标注作用于 Map 类型时，spring强制要求 key **必须为 String** 类型，则并将容器中所有**类型** 为value 的 Bean 注入进来，用 Bean 的 id 或 name 作为 key：

## Q：为什么spring不建议使用基于字段的依赖注入？

如下代码IDEA会报警告：Field injection is not recommended

```java
@Autowired
private Bean bean
```

官方文档建议：强制依赖使用构造器注入，可选依赖使用setter注入。

使用字段注入可能造成的问题：

1. 可能产生NPE

   在静态语句块、初始化语句块、构造方法中使用@Autowired的字段，都会引起NPE问题（空指针）

2. 隐藏依赖

   对于一个正常的使用依赖注入的Bean来说，它应该“显式”的通知容器，自己需要哪些Bean，可以通过构造器通知，public的setter方法通知，这些设计都是没问题的。

   但是对于private的filed来说，从设计的角度角度来讲，外部的容器是不应该感知到bean内部的private内容的，所以理论上，private的属性是没办法通知到容器的（不考虑反射，但从设计角度理解），所以从这个角度来看，我们不能通过字段注入

3. 不利于测试

   使用Autowired，说明这个类依赖了Spring容器，这让我们在进行UT的时候必须要启动一个Spring容器才可以测试这个类，显然太麻烦，这种测试方式非常重，对于大型项目来说，往往启动一个容器就要好几分钟，这样非常耽误时间。




# @Primary

只能修饰属性或带@Bean方法，配合@Autowired使用，当容器中同类型Bean有多个时，直接取带@Primary的

# @Order

用于修饰bean，常配合@Autowired使用

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

# @Priority

修饰bean，参数为数字，越小表示优先级越高（当容器中有多个@Priority修饰的同类bean时）

判断优先级：@Qualifier > @Primary > @Priority > @Order

# @Qualifier

也是配合@Autowired使用，修饰属性。由于@Autowired根据**类型**装配，因此容器中有多个同类型Bean时，需要加@Qualifier指定要注入的Bean名称，否则会报错

```java
@RestController
public class HelloController {
    @Autowired
    @Qualifier("Zhang")  //指定注入名为“Zhang"的User类型bean
    private User user;
    ...
}
// 配置类，向容器中注册两个同类不同名bean
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

# @Value

修饰属性。给属性注入值。可用于成员属性，或者方法参数。

```java
@Configuration
@ComponentScan
@PropertySource("app.properties") // 表示读取classpath的app.properties
public class AppConfig {
    @Value("${app.zone:Z}")  // 给属性注入
    String zoneId;

    @Bean
    ZoneId createZoneId(@Value("${app.zone:Z}") String zoneId) {  // 给方法参数注入
        return ZoneId.of(zoneId);
    }
}
```

唯一参数：字符串类型，有3种写法：

1. `@Value("abc")`

   直接将字符串”abc“赋值给属性

2. `@Value("${oidd.passwd}")`

   - **${}**：占位符，取Properties文件中的对应值，或Environment对应值（java启动时-D参数配置）

   - ${oidd.passwd:default}：取Properties的oidd.passwd，取不到则给默认值default

3. `@Value("#{orderService3}")`

   - **#{}**：Spring表达式，找容器中名为orderService3的bean

   - #{orderService3.host}：找orderService3的host属性

# yml 占位符语法

`${}`的用法与@Value一样，例如：

```yaml
exchange:
  config:
    # ${}语法:在yml文件中或启动命令中查key【TRADING_API】，如果没有，再取默认值http://localhost:8001
    trading-api: ${TRADING_API:http://localhost:8001}
```



# @Resource

修饰属性和方法，默认按照**byName**自动注入，找不到再**byType**。由**J2EE提供**（而不是spring，需要导入包javax.annotation.Resource）。

与@Autowired区别：

- @Autowired按照byType自动注入；
- @Autowired可以给集合List<T>、Map<T>注入，而@Resource不适合集合注入

参数：

1. name：bean名，使用**byName策略**（参数作为名字去找bean）
2. type：bean类型，使用**byType策略**（参数作为类型去找bean）

装配规则：

1. 如果同时指定了name和type，则从Spring上下文中找到唯一匹配的bean进行装配，找不到则抛出异常。

2. 如果指定了name，则从上下文中查找名称（id）匹配的bean进行装配，找不到则抛出异常。

3. 如果指定了type，则从上下文中找到类似匹配的唯一bean进行装配，找不到或是找到多个，都会抛出异常。

4. 如果不指定name和type，则自动用**属性名**找bean；找不到再用类型找。

```java
public class TestServiceImpl {
    // 下面两种@Resource只要使用一种即可
    @Resource(name="userDao")
    private UserDao userDao; // 用于字段上
    
    @Resource(name="userDao")
    public void setUserDao(UserDao userDao) { // 用于属性的setter方法上
        this.userDao = userDao;
    }
}
```


注：最好是将@Resource放在setter方法上，因为这样更符合面向对象的思想，通过set、get去操作属性，而不是直接去操作属性。

## Q：@Autowired和@Resource区别？

|              | @Autowired                           | @Resource                                                    |
| ------------ | ------------------------------------ | ------------------------------------------------------------ |
| 框架         | Spring                               | **J2EE提供**（而不是spring），需要导入包javax.annotation.Resource。 |
| 作用域       | 构造器、属性、setter                 | 属性、setter                                                 |
| static修饰   | 打印警告                             | 抛异常                                                       |
| 默认注入方式 | ByType                               | ByName                                                       |
| 使用场景     | 需要注入此类型的所有资源（注入集合） | 注入确定性的单一资源（不适用于注入集合                       |



# @Conditional

参数：条件类。根据条件类返回的布尔值决定是否加载该类

使用：

```java
@Component
@Conditional(CssCondition.class)
public class UserService {

   public void test(){
      System.out.println("test ");
   }
}
```

再写一个条件类，实现Condition接口

```java
public class CssCondition implements Condition {
   @Override
   public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
      try {
         context.getClassLoader().loadClass("com.zhouyu.service.user");
         return true;
      } catch (ClassNotFoundException e) {
         return false;
      }
   }
}
```

spring容器就会根据CssCondition的返回布尔值决定是否加载UserService

## @ConditionalOnMissingBean

实现基于@Conditional，搭配@Bean使用。分为带参和无参：

无参：当容器中**不存在该类型**Bean时，将这个bean注入容器。

带参：当容器中**不存在名字为name**的Bean时，将这个bean注入容器。

```java
@Bean
@ConditionalOnMissingBean(name = "user123")  // 若容器中不存在名为user123的组件
public User user123(User user1) {
    return user1;
}
```

## @ConditionalOnBean

与@ConditionalOnMissingBean作用相反，当容器中存在这个类型或名称的bean时，才注入当前bean。



# @DependsOn





# @PostConstruct

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





# @ControllerAdvice

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



# @RequestParam

参数：

- name（别名value）-- String类型

  name不能重复（即使不同类型取同名也不行）

- required -- 布尔类型

  默认为true，设为false才需要显式：

  ```java
  @RequestParam(value = "xxx", required = false) double d //xxx为传入参数名
  ```

  required参数为true的误区：
  required = true是在前端没有传参数（也就是null）的时候报错，并不能防止参数为空字符串""。

请求传来的参数实际上都是String类型，由框架转为相应类型，若超出类型取值范围，会报转换异常：

```
org.springframework.web.method.annotation.MethodArgumentTypeMismatchException: Failed to convert value of type 'java.lang.String' to required type 'int'; nested exception is java.lang.NumberFormatException: For input string: "2147483648"
```

# @Responsebody 与 @RequestBody

- @Responsebody：表示该方法的返回结果直接写入 HTTP response body 中
  一般在异步获取数据时使用，在使用 @RequestMapping 后，返回值通常解析为跳转路径，加上 @Responsebody 后返回结果不会被解析为跳转路径，而是直接写入 HTTP response body 中。
  比如：异步获取json数据，加上 @Responsebody 后，会直接返回json数据。
- @RequestBody：将 HTTP 请求正文（body）插入方法中，使用适合的 HttpMessageConverter 将请求体写入某个对象。一般在post方法中使用。

@Responsebody整合在**@RestController**中，搭配@RestController使用：

```java
@RestController
@Api(tags = "位置服务API", value = "cmp-xxx-map-api", description = "位置服务API")
@RequestMapping("/api/v1/map")
public class MapController extends CMPController {
    // get请求
    @GetMapping(value = "qryPositionTrackForWeb")  
    public String qryPositionTrackForWeb(@RequestParam(value = "accNum") String accNum,
                                         @RequestParam(value = "userId") Long userId ) {
        // 实现略
    }
    // post请求
    @PostMapping("/uploadImeiOrTacs") 
    public void uploadImeiOrTacs(@RequestBody UploadImeiTacInst uploadInfo) {
        // 实现略
    }
}
```



# @PreDestroy

修饰方法。容器关闭前执行。

只对单例bean有效。若多个方法都带此注解，执行顺序无法指定

# @Lookup

```java
@Component
public class UserService {
   @Autowired
   private  OrderService orderService;

   @Lookup("orderService")
   public OrderService a() {
      return null;
   }
   public void test(){
      System.out.println(a());
   }
}
@Component
@Scope("prototype")
public class OrderService  {
}
```

测试：会打印三个不同的OrderService

```java
public static void main(String[] args) {
   AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
   UserService userService = (UserService) context.getBean("userService");
   userService.test();  // OrderService@6ec8211c
   userService.test();  // OrderService@7276c8cd
   userService.test();  // OrderService@544a2ea6
}
```

# 参数校验（validation框架）

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

   

# @ConfigurationProperties

需要和@Configuration配合使用，我们通常在一个POJO里面进行配置：

```java
@Data
@Configuration
@ConfigurationProperties(prefix = "mail")
public class ConfigProperties {

    private String hostName;
    private int port;
    private String from;
}
```

上面的例子将会读取properties文件中所有以mail开头的属性，并和bean中的字段进行匹配：

```
#Simple properties
mail.hostname=host@mail.com
mail.port=9000
mail.from=mailer@mail.com
```

Spring的属性名字匹配支持很多格式，如下所示所有的格式都可以和`hostName`进行匹配：

```
mail.hostName
mail.hostname
mail.host_name
mail.host-name
mail.HOST_NAME
```



# @Async

标注在方法或者类上，从而可以方便的实现方法的异步调用。调用者在调用异步方法时将立即返回，方法的实际执行将提交给指定的线程池中的线程执行。

对应的线程池，默认的核心线程数是 8。

编写Task组件：

```java
@Component
public class Task {
    public static Random random =new Random();
	//@Async
    public void doTaskOne() throws Exception {
        System.out.println("开始做任务一");
        long start = System.currentTimeMillis();
        Thread.sleep(random.nextInt(10000));
        long end = System.currentTimeMillis();
        System.out.println("完成任务一，耗时：" + (end - start) + "毫秒");
    }
	//@Async
    public void doTaskTwo() throws Exception {
        System.out.println("开始做任务二");
        long start = System.currentTimeMillis();
        Thread.sleep(random.nextInt(10000));
        long end = System.currentTimeMillis();
        System.out.println("完成任务二，耗时：" + (end - start) + "毫秒");
    }
	//@Async
    public void doTaskThree() throws Exception {
        System.out.println("开始做任务三");
        long start = System.currentTimeMillis();
        Thread.sleep(random.nextInt(10000));
        long end = System.currentTimeMillis();
        System.out.println("完成任务三，耗时：" + (end - start) + "毫秒");
    }
}
```

编写单元测试：

```java
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = LearnSpringApplication.class)  // 填启动类
public class ApplicationTests {
    @Autowired
    private Task task;

    @Test
    public void test() throws Exception {
        // 正常情况下是顺序执行
        task.doTaskOne();
        task.doTaskTwo();
        task.doTaskThree();
    }
}
/* 输出：
开始做任务一
完成任务一，耗时：3753毫秒
开始做任务二
完成任务二，耗时：528毫秒
开始做任务三
完成任务三，耗时：5775毫秒
*/
```

改用异步：将Task中三个函数加上@Async 注解，在**启动类**加@EnableAsync，则三个函数异步执行，乱序输出：例如：开始做任务二，开始做任务三，开始做任务一……等。但都没有打印耗时，因为主程序不等待三个函数执行完成就结束了

**异步回调**

使用Future返回异步调用结果，do函数改造如下：

```java
@Async
public Future<String> doTaskOne() throws Exception {
    System.out.println("开始做任务一");
    long start = System.currentTimeMillis();
    Thread.sleep(random.nextInt(10000));
    long end = System.currentTimeMillis();
    System.out.println("完成任务一，耗时：" + (end - start) + "毫秒");
    return new AsyncResult<>("任务一完成");
}
// doTaskTwo doTaskThree略
```

test改造

```java
@Test
public void test() throws Exception {
    long start = System.currentTimeMillis();

    Future<String> task1 = task.doTaskOne();
    Future<String> task2 = task.doTaskTwo();
    Future<String> task3 = task.doTaskThree();

    while(true) {
        if(task1.isDone() && task2.isDone() && task3.isDone()) {
            // 三个任务都调用完成，退出循环等待
            break;
        }
        Thread.sleep(1000);
    }
    long end = System.currentTimeMillis();
    System.out.println("任务全部完成，总耗时：" + (end - start) + "毫秒");
}
/* 输出：
开始做任务一
开始做任务三
开始做任务二
完成任务三，耗时：4362毫秒
完成任务二，耗时：7272毫秒
完成任务一，耗时：7555毫秒
任务全部完成，总耗时：8015毫秒
/*
```

**注意**

- @Async标注在类上时，表示该类的所有方法都是异步方法。
- @Async注解的方法一定要通过**依赖注入**调用（因为要通过**代理对象调用**，基于aop），不能直接通过this对象调用，否则不生效。
- @Async注解的方法不能是static或final，同样因为是基于aop，静态方法无法被代理

## 配置自定义线程池

Spring首先会通过下面两种方式查找作为异步方法的默认线程池：

1. 查找唯一的一个TaskExecutor类型的bean
2. 或者是一个名称为“taskExecutor”的Executor类型的Bean。

如果上面两种方式都没有查找到，则使用 **SimpleAsyncTaskExecutor** 作为异步方法的默认线程池。

> 不建议使用SimpleAsyncTaskExecutor，因为默认每次执行异步任务的时候都会创建一个新的线程，本质上不能叫线程池

如果要配置自定义线程池，有多种方式：

1. 重新实现接口AsyncConfigurer，重写getAsyncExecutor方法
2. 继承AsyncConfigurerSupport
3. 自定义一个TaskExecutor类型的bean。
4. 自定义一个名称为“taskExecutor”的Executor类型的Bean。

方式1例：

```java
@Configuration
@EnableAsync  // 注意在配置类加这个注解
public class SpringAsyncConfig implements AsyncConfigurer {
    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(3);//核心池大小
        executor.setMaxPoolSize(6);//最大线程数
        executor.setKeepAliveSeconds(60);//线程空闲时间
        executor.setQueueCapacity(10);//队列程度
        executor.setThreadNamePrefix("my-executor1-");//线程前缀名称
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.AbortPolicy());//配置拒绝策略
        executor.setAllowCoreThreadTimeOut(true);// 允许销毁核心线程
        executor.initialize();
        return executor;
    }
}
```

这样所有@Async方法都由这个指定线程池执行

如果不同方法需要配置**不同线程池**，在@Async()参数上指定线程池的名称

```java
// 配置类
@Configuration
public class ExecutorConfig {
    @Bean("customExecutor-1")// 自定义线程池1
    public Executor customExecutor1() {
        ...
    }

    @Bean("customExecutor-2")// 自定义线程池2
    public Executor customExecutor2() {
        ...
    }
}

// 方法
@Async("customExecutor-1")  // 使用自定义线程池1
public void method1(){}

@Async("customExecutor-2") // 使用自定义线程池2
public void method2(){}
```

## 异常处理

当方法是带Future返回值的时候，Future.get()方法会抛出异常，所以异常捕获是没问题的。但是当方法是不带返回值的时候，那么此时主线程就不能捕获到异常，需要额外的配置来处理异常，可以有下面两种方式。

1. 通过try-catch处理异常

   直接在异步方法中使用try-catch来处理抛出的异常。这个方法也可以用于带Future返回值的异步方法。

2. 通过重写`getAsyncUncaughtExceptionHandler`方法

   ```java
   @Configuration
   @EnableAsync
   public class SpringAsyncConfig implements AsyncConfigurer {
       @Override
       public Executor getAsyncExecutor() {
           // 省略自定义线程池的代码
       }
   
       // 自定义异常处理
       @Override
       public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
           return new AsyncUncaughtExceptionHandler() {
               @Override
               public void handleUncaughtException(Throwable throwable, Method method, Object... objects) {
                   System.out.println(method.getName() + "发生异常！异常原因：" + throwable.getMessage() );
               }
           };
       }
   }
   ```

# @Transational

   见[Spring事务](Spring事务.md)

