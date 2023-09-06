SpringCloud-Netflix实战

# 一、springcloud-provider-dept-8001项目：服务提供者（生产者）

Controller:控制层。调用服务层，为其他模块（如消费者）提供接口

service：服务层。调用数据层

dao：数据层，是一个接口，对接mybatis

# springcloud-api：公共模块：提供部门实体类Dept

 

# 二、springcloud-consumer-dept-80项目：服务调用者

## 1.创建一个config类，用@Bean注入RestTemplate

### RestTemplate

提供了多种便捷访问远程Http服务的方法，是一种简单便捷的访问restful服务模板 类，是Spring提供的用于访问Rest服务的客户端模板工具集 使用RestTemplate访问restful接口非常的简单粗暴且无脑 （url，requsetMap，ResponseBean.class） 这三个参数分别代表REST请求地址，请求参数， Http响应转换 被 转换成的对象类型。

```java
@Configuration
public class ConfigBean {
    // 配置负载均衡RestTemplate
    @Bean
    public RestTemplate getRestTemplate() {
        return  new RestTemplate();
    }
}
```

## 2.创建Controller

```java
package com.kuang.springcloud.controller;

import com.kuang.springcloud.pojo.Dept;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
public class DeptConsumerController {
    // 理解：消费者，不应该有service层
    // RestTemplate。。。供我们直接调用就可以了。注册到spring中
    // url, 实体：Map, response类型
    @Autowired
    private RestTemplate restTemplate;  // 提供多种便捷访问远程http服务的方法，简单的restful服务模板

     private static final String REST_URL_PREFIX = "http://localhost:8001/";

    @RequestMapping("consumer/dept/add")
    public boolean add(Dept dept){
        return restTemplate.postForObject(REST_URL_PREFIX + "/dept/add", dept, Boolean.class);
    }

    @RequestMapping("consumer/dept/get/{id}")
    public Dept get(@PathVariable("id") Long id) {
        return restTemplate.getForObject(REST_URL_PREFIX + "/dept/get/" + id, Dept.class);
    }

    @RequestMapping("consumer/dept/list")
    public List<Dept> list() {
        return restTemplate.getForObject(REST_URL_PREFIX + "/dept/list", List.class);
    }
}
```

# 三、springcloud-eureka-7001项目：eureka注册中心

## pom中添加依赖：

```xml
<!-- eureka-server服务端 -->
<dependency>
	<groupId>org.springframework.cloud</groupId>
	<artifactId>spring-cloud-starter-eureka-server</artifactId>
	<version>1.4.7.RELEASE</version>
</dependency>
```

2.application.yml 配置

```yaml
#Eureka配置
eureka:
  instance:
    hostname: localhost #eureka服务端的实例名称
  client:
    register-with-eureka: false   # 是否将自己注册到Eureka服务器中，本身是服务器，无需注册
    fetch-registry: false   #false表示自己端就是注册中心，我的职责就是维护服务实例，并不需要去检索服务
    service-url:
    	defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka/   # 设置与Eureka Server交互的地址查询服务和注册服务都需要依赖这个defaultZone地址
```

eureka界面：

<img src="images\SpringCloud-Netflix实战\未命名图片-16473303533721.png" alt="未命名图片" />

System Status：系统信息
DS Replicas：服务器副本（集群）
 Instances currently registered with Eureka：已注册的微服务列表 
General Info：一般信息 
Instance Info：实例信息

## 将 8001 的服务入驻到 7001 的eureka中

## 1、修改8001服务的pom文件，增加eureka的依赖

```xml
<dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-eureka</artifactId>
        <version>1.4.7.RELEASE</version>
</dependency>
```

## 2、yaml 中配置 eureka 的注册

```yaml
eureka:
  client:
  service-url:
        defaultZone: http://localhost:7001/eureka
```



## 3、8001 的主启动类注解支持 

```java
// 启动类
@SpringBootApplication
@EnableEurekaClient // 在服务启动后自动注册到eureka中
public class DeptProvider_8001 {
    public static void main(String[] args) {
        SpringApplication.run(DeptProvider_8001.class, args);
    }
}
```

配置完成后启动8001，访问7001的eureka界面就能看到该服务

<img src="images\SpringCloud-Netflix实战\未命名图片-16473305920512-16473305939483.png" alt="未命名图片" />

 

# 四、actuator与注册微服务信息完善

主机名称：服务名称修改

<img src="images\SpringCloud-Netflix实战\未命名图片-16473306170794-16473306198685.png" alt="未命名图片" />

在8001的yaml中修改一下配置

```yaml
eureka:
  client:
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka,http://eureka7002.com:7002/eureka,http://eureka7003.com:7003/eureka
  instance:
    instance-id: springcloud-provider-dept8001 #修改eureka上的默认描述信息
```

重启，刷新后查看结果！

<img src="images\SpringCloud-Netflix实战\未命名图片-16473306528286-16473306545187.png" alt="未命名图片" style="zoom:150%;" />

## 访问信息有IP信息提示

鼠标移动到status上会显示地址：xxx/actuator/info

<img src="images\SpringCloud-Netflix实战\未命名图片-16473306778248-16473306793209.png" alt="未命名图片" style="zoom:150%;" />

yaml中增加一个配置 

```yaml
eureka:
  client:
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka,http://eureka7002.com:7002/eureka,http://eureka7003.com:7003/eureka
  instance:
    instance-id: springcloud-provider-dept8001 #修改eureka上的默认描述信息
        prefer-ip-address: true #true访问路径可以显示IP地址 
```

然后再yaml中增加配置

```yaml
#info配置
info:
  app.name: css-springcloud
  company.name: css.com
```

点击xxx/actuator/info就能看到服务info

<img src="images\SpringCloud-Netflix实战\未命名图片-164733073006210-164733073264611.png" alt="未命名图片" />

# 五、服务发现 ：Discovery

对于注册进eureka里面的微服务，可以通过服务发现来获得该服务的信息。【对外暴露服务】

## 1、修改springcloud-provider-dept-8001工程中的DeptController

<img src="images\SpringCloud-Netflix实战\未命名图片-164733075626312-164733075738113.png" alt="未命名图片" style="zoom:150%;" />

## 2、新增一个方法

```java
//注册进来的微服务，获取一些消息
@GetMapping("/dept/discovery")
public Object discovery() {
    // 获取微服务列表的清单
    List<String> services = client.getServices();
    System.out.println("discovery=>services: " + services);
    // 得到一个具体的微服务信息
    List<ServiceInstance> instances =  client.getInstances("SPRINGCLOUD-PROVIDER-DEPT");
    for (ServiceInstance instance: instances) {
        System.out.println(
                instance.getHost() + "\t"+
                instance.getPort() + "\t"+
                instance.getUri() + "\t"+
                instance.getServiceId()
        );
    }
    return this.client;
}
```

## 3、主启动类增加一个注解 @EnableDiscoveryClient

启动Eureka服务，启动8001提供者

 访问测试 http://localhost:8001/dept/discovery 

后台输出微服务的信息：

<img src="images\SpringCloud-Netflix实战\未命名图片-164733080392814-164733080522415.png" alt="未命名图片" />

# 集群配置

新建工程springcloud-eureka-7002、springcloud-eureka-7003 按照7001为模板粘贴POM 修改7002和7003的主启动类 修改映射配置 , windows域名映射

结构：每个eureka各自分别注册到另外两个eureka

<img src="images\SpringCloud-Netflix实战\未命名图片-164733084448216-164733084559617.png" />

例如eureka-7001的yml：

```yaml
server:
  port: 7001
#Eureka配置
eureka:
  instance:
    hostname: eureka7001.com #Eureka服务端的实例名称
  client:
    register-with-eureka: false #表示是否向Eureka注册中心注册自己
    fetch-registry: false #如果为false，则表示自己为注册中心
    service-url:  #监控页面
      #单机：http://${eureka.instance.hostname}:${server.port}/eureka/
      #集群（关联）：
      defaultZone: http://eureka7002.com:7002/eureka/, http://eureka7003.com:7003/eureka/
```

eureka-7002：

```yaml
server:
  port: 7002
#Eureka配置
eureka:
  instance:
    hostname: eureka7002.com #Eureka服务端的实例名称
  client:
    register-with-eureka: false #表示是否向Eureka注册中心注册自己
    fetch-registry: false #如果为false，则表示自己为注册中心
    service-url:  #监控页面
      defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7003.com:7003/eureka/
```

将8001微服务发布到3台eureka集群配置中，发现在集群中的其余注册中心也可以看到

```yaml
eureka:
  client:
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka,http://eureka7002.com:7002/eureka,http://eureka7003.com:7003/eureka
  instance:
    instance-id: springcloud-provider-dept8001 #修改eureka上的默认描述信息
```

# 六、Ribbon

需要修改客户端配置

## 1、修改pom.xml，添加Ribbon相关依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-ribbon</artifactId>
    <version>1.4.6.RELEASE</version>
</dependency>
```

## 2、对配置类ConfigBean的RestTemplate加上注解@LoadBalanced；

```java
@Configuration
public class ConfigBean {
    // 配置负载均衡RestTemplate
    @Bean
    @LoadBalanced // ribbon
    public RestTemplate getRestTemplate() {
        return  new RestTemplate();
    }
}
```



## 3、主启动类添加@EnableEurekaClient

 

## 4、修改客户端访问类DeptConsumerController

## 之前的写的地址是写死的，现在用服务名代替。

根据**服务名**访问服务，而无需再关心地址和端口号

服务名即eureka界面中的Application，此处为**SPRINGCLOUD-PROVIDER-DEPT**（不区分大小写）

<img src="images\SpringCloud-Netflix实战\未命名图片-164733093842218-164733094003519.png" alt="未命名图片" />

```java
@RestController
public class DeptConsumerController {
    // 理解：消费者，不应该有service层
    // RestTemplate。。。供我们直接调用就可以了。注册到spring中
    // url, 实体：Map, response类型
    @Autowired
    private RestTemplate restTemplate;  // 提供多种便捷访问远程http服务的方法，简单的restful服务模板

    // Ribbon，我们这里的地址，应该是一个变量，通过服务名来访问
    private static final String REST_URL_PREFIX = "http://SPRINGCLOUD-PROVIDER-DEPT/";  //用小写也可以

    @RequestMapping("consumer/dept/add")
    public boolean add(Dept dept){
        return restTemplate.postForObject(REST_URL_PREFIX + "/dept/add", dept, Boolean.class);
    }

    @RequestMapping("consumer/dept/get/{id}")
    public Dept get(@PathVariable("id") Long id) {
        return restTemplate.getForObject(REST_URL_PREFIX + "/dept/get/" + id, Dept.class);
    }

    @RequestMapping("consumer/dept/list")
    public List<Dept> list() {
        return restTemplate.getForObject(REST_URL_PREFIX + "/dept/list", List.class);
    }
}
```

# Ribbon负载均衡使用

## 1、新建两个服务端项目8002、8003，分别连接不同数据库db02和db03（查询时用db_source字段区分来源)：

<img src="images\SpringCloud-Netflix实战\未命名图片-164733096454920-164733096562721.png" alt="未命名图片" />

## 2、修改8002/8003各自的YML文件 

端口、数据库连接、实例名也需要修改  

```yaml
instance:
  instance-id: springcloud-provider-dept8002
```

```yaml
instance:
  instance-id: springcloud-provider-dept8003
```

对外暴露的统一的服务实例名【三个服务名字必须一致！】

```yaml
application:
  name: springcloud-provider-dept
```

## 3、启动3个Dept微服务并都测试通过 

http://localhost:8001/dept/list 
http://localhost:8002/dept/list 
http://localhost:8003/dept/list 

## 4、启动springcloud-consumer-dept-ribbon-80

http://localhost/consumer/dept/list

多刷新几次注意观察结果！ 

默认调度是**轮询**，即依次调用8001、8002、8003的服务

# Ribbon核心组件Irule

IRule：根据特定算法从服务列表中选取一个要访问的服务！

查看分析源码：

1.  IRule
2.  ILoadBalancer
3.  AbstractLoadBalancer
4. AbstractLoadBalancerRule：这个抽象父类十分重要！核心
5. RoundRobinRule

 

## 1、主启动类添加加@RibbonClient注解

```java
@SpringBootApplication
@EnableEurekaClient
// 在微服务启动时就加载自定义ribbon类
@RibbonClient(name = "SPRINGCLOUD-PROVIDER-DEPT")
public class DeptConsumer_80 {
    public static void main(String[] args) {
        SpringApplication.run(DeptConsumer_80.class);
    }
}
```

**注意配置细节**

官方文档明确给出了警告： 这个自定义配置类不能放在@ComponentScan所扫描的当前包以及子包下，否则我们自定义的这个配置 类就会被所有的Ribbon客户端所共享，也就是说达不到特殊化定制的目的了！ 

 

## 2、在主启动类上一级新建包com.kuang.myrule，存放自定义规则类

<img src="images\SpringCloud-Netflix实战\未命名图片-164733113428522-164733113625923.png" alt="未命名图片" />

## 3、新建自定义规则类CssRule

```java
@Configuration
public class CssRule {
    // IRule
    // RoundRobinRule: 轮询
    // RandomRule：随机
    // AvailabilityFilteringRule: 会先过滤掉跳闸、访问故障的服务，对剩下的进行轮询
    // RetryRule： 会先按照轮询获取服务，如果服务获取失败，则会在指定的时间内重试
    @Bean
    public IRule myRule() {
        return  new RandomRule();  // 默认时是轮询,此处选择RandomRule
    }
}
```

## 4、再配置主启动类的@RibbonClient，configuration为自定义的CssRule类

```java
@SpringBootApplication
@EnableEurekaClient
// 在微服务启动时就加载自定义ribbon类
@RibbonClient(name = "SPRINGCLOUD-PROVIDER-DEPT", configuration = CssRule.class)
public class DeptConsumer_80 {
    public static void main(String[] args) {
        SpringApplication.run(DeptConsumer_80.class);
    }
}
```

# IRule使用自定义规则

与上面类似

## 1、编写自定义规则类CssRandomRule

## 2、修改注入的myRule函数返回值，返回一个CssRandomRule类型

```java
@Configuration
public class CssRule {
    @Bean
    public IRule myRule() {
        return  new CssRandomRule();  // 默认时轮询,此处自定义为CssRandomRule
    }
}
```

# 七、Feign负载均衡：springcloud-consumer-dept-feign模块

Spring Cloud集成了Ribbon和Eureka，可在使用Feign时提供负载均衡的http客户端。 

只需要创建一个接口，然后添加注解即可

feign其实不是做负载均衡的,这是ribbon的功能。只是**feign内置了ribbon**

**feign的作用**：替代http的RestTemplate，用接口调用的方式完成http请求。虽然性能较低，但是增加了可读性。

## 1、在客户端增加依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-feign</artifactId>
    <version>1.4.6.RELEASE</version>
</dependency>
```

 

## 2、在api模块新增service，加上@FeignClient

```java
@FeignClient(value = "SPRINGCLOUD-PROVIDER-DEPT")
public interface DeptClientService {
    @GetMapping("/dept/get/{id}")
    public Dept qyeryById(@PathVariable("id") Long id);
    @GetMapping("/dept/list")
    public List<Dept> qyeryAll();
    @GetMapping("/dept/add")
    public boolean addDept(Dept dept);
}
```

##  

## 3、在客户端修改controller，直接注入第二步创建的service，就能直接拿来用

```java
@RestController
public class DeptConsumerController {
    @Autowired
    private DeptClientService deptClientService = null;

    @RequestMapping("consumer/dept/add")
    public boolean add(Dept dept){
        return this.deptClientService.addDept(dept);
    }
    @RequestMapping("/consumer/dept/get/{id}")
    public Dept get(@PathVariable("id") Long id) {
        return this.deptClientService.qyeryById(id);
    }
    @RequestMapping("consumer/dept/list")
    public List<Dept> list() {
        return this.deptClientService.qyeryAll();
    }
}
```

对比客户端原来Ribbon+RestTemplate的方式调用服务，不同之处在于feign不关心服务的地址，注入就能用

 

## 4、在客户端主启动类增加注解@EnableFeignClients

```java
@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients(basePackages = {"com.kuang.springcloud"})
@ComponentScan("com.kuang.springcloud")
public class FeignDeptConsumer_80 {
    public static void main(String[] args) {
        SpringApplication.run(FeignDeptConsumer_80.class);
    }
}
```

Feign通过接口的方法调用Rest服务，更有面向对象的意思 ( 之前是Ribbon+RestTemplate，需要知道服务地址 ) 

该请求由api模块发送给Eureka服务器 （http://MICROSERVICECLOUD-PROVIDER-DEPT/dept/list） ，通过Feign找到服务地址和接口

# 八、Hystrix断路器

作用：

服务降级 服务熔断 服务限流 接近实时的监控

# 服务熔断（在服务端进行）： springcloud-provider-dept-hystrix-8001 

## 1、添加依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-hystrix</artifactId>
    <version>1.4.6.RELEASE</version>
</dependency>
```



## 2、修改yml：eureka实例的id

<img src="images\SpringCloud-Netflix实战\未命名图片-164733144436024-164733144581725.png" alt="未命名图片" />

## 3、修改控制器

使用@HystrixCommand，传入fallbackMethod参数，指定程序错误时调用的方法

```java
@RestController
public class DeptController {
   @Autowired
    private DeptService deptService;

   @GetMapping("/dept/get/{id}")
   @HystrixCommand(fallbackMethod = "hystrixGet")  // 失败就调用备选方法
   public Dept get(@PathVariable("id") Long id) {
       Dept dept= deptService.queryById(id);
       if (dept == null) {
           throw new RuntimeException("id=>" + id + ",不存在用户，或信息无法找到");
       }
       return dept;
   }

   // 备选方法
    public Dept hystrixGet(@PathVariable("id") Long id) {
       return new Dept()
               .setDeptno(id)
               .setDname("id=>" + id + "没有对应的信息，null--@Hystrix")
               .setDb_source("no this database in mySQL");
    }
}
```

## 4、主启动类增加@EnableCircuitBreaker

添加对熔断的支持

测试：

当访问http://localhost/consumer/dept/get/8，查询数据库不存在的记录时，原本应该报错，添加了服务熔断后进入自定义的错误处理函数

<img src="images\SpringCloud-Netflix实战\未命名图片-164733146700426-164733146923827.png" alt="未命名图片" />

# 服务降级（客户端实现）：

## 1、修改springcloud-api工程，根据已经有的DeptClientService接口新建一个实现了FallbackFactory接 口的类DeptClientServiceFallbackFactory

```java
// 降级
@Component  //千万不要忘记
public class DeptClientServiceFallbackFactory implements FallbackFactory {
    @Override
    public DeptClientService create(Throwable throwable) {
        return new DeptClientService() {
            @Override
            public Dept qyeryById(Long id) {
                return new Dept()
                        .setDeptno(id)
                        .setDname("id=>" + id + "没有对应的信息，客户端提供了降级信息，该服务已被关闭")
                        .setDb_source("无数据");
            }

            @Override
            public List<Dept> qyeryAll() {
                return null;
            }

            @Override
            public boolean addDept(Dept dept) {
                return false;
            }
        };
    }
}
```

## 2、修改springcloud-api工程，DeptClientService接口，在注解 @FeignClient中添加fallbackFactory参数

```java
@FeignClient(value = "SPRINGCLOUD-PROVIDER-DEPT",fallbackFactory = DeptClientServiceFallbackFactory.class)
```

 

## 3、yml增加配置

```yaml
#开启降级feign.hystrix
feign:
  hystrix:
    enabled: true
```

 

## 测试 

1. 启动eureka集群

2. 启动 springcloud-provider-dept-hystrix-8001

3. 启动 springcloud-consumer-dept-feign-80

4. 正常访问测试 http://localhost/consumer/dept/get/1

5. 故意关闭微服务启动 springcloud-provider-dept-hystrix-8001 

6. 客户端自己调用 http://localhost/consumer/dept/get/1 ，提示：

 

<img src="images\SpringCloud-Netflix实战\未命名图片-164733156361628-164733156574229.png" alt="未命名图片" />

7. 访问http://localhost/consumer/dept/list，

页面空白，因为DeptClientServiceFallbackFactory中没有处理该请求，直接返回null

# 服务监控

hystrixDashboard 组件

新建工程springcloud-consumer-hystrix-dashboard

## 1、依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-hystrix</artifactId>
    <version>1.4.6.RELEASE</version>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-hystrix-dashboard</artifactId>
    <version>1.4.6.RELEASE</version>
</dependency>
```

## 2、yml

```yaml
server: 
  port: 9001
```

 

## 3、主启动类：新注解@EnableHystrixDashboard

 

## 4、所有服务端（8001、8002、8003）都配置监控依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

 

## 5、启动dashboard项目，访问http://localhost:9001/hystrix

<img src="images\SpringCloud-Netflix实战\未命名图片-164733169680630-164733169880031.png" alt="未命名图片" />

## 测试

1. 启动eureka集群 

2. 启动springcloud-consumer-hystrix-dashboard

3. 在 springcloud-provider-dept-hystrix-8001 启动类中增加一个bean 

   ```java
   // 增加一个servlet
   @Bean
   public ServletRegistrationBean hystrixMetricsStreamServlet() {
       ServletRegistrationBean registrationBean = new ServletRegistrationBean(new HystrixMetricsStreamServlet());
       registrationBean.addUrlMappings("/actuator/hystrix.stream");
       return registrationBean;
   }
   ```

   

4. 启动 springcloud-provider-dept-hystrix-8001

5. 在监控页面输入监控地址. http://localhost:8001/actuator/hystrix.stream ，点击monitor stream

6. 多次刷新 http://localhost:8001/dept/get/1 观察监控页面变化

<img src="images\SpringCloud-Netflix实战\未命名图片-164733177793832-164733178014933.png" alt="未命名图片" />



# 九、zuul路由网关

## 1、新建模块springcloud-zuul-9527，添加pom依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-zuul</artifactId>
    <version>1.4.6.RELEASE</version>
</dependency>
 
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-eureka</artifactId>
    <version>1.4.6.RELEASE</version>
</dependency>
```

## 2、yml

```yaml
server:
  port: 9527
spring:
  application:
    name: springcloud-zuul  #应用名与其他服务区分开

eureka:
  client:
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka,http://eureka7002.com:7002/eureka,http://eureka7003.com:7003/eureka
  instance:
    instance-id: zuul9527.com
    prefer-ip-address: true

info:
  app.name: com.css
  company.name: css

zuul:
  routes:
    mydept.serviceId: springcloud-provider-dept
    mydept.path: /mydept/**
#  ignored-services: springcloud-provider-dept  #不能再使用这个路径访问
  ignored-services: "*" #隐藏全部
  prefix: /css #设置公共前缀
```

## 3、修改host文件

  127.0.0.1  [www.css.com](http://www.css.com)  

 

## 4、主启动类增加@EnableZuulProxy

 

## 测试

启动eureka集群

启动服务端：springcloud-provider-dept-8001 

启动zuul路由

访问eureka ：http://localhost:7001/

<img src="images\SpringCloud-Netflix实战\未命名图片-164733189513334-164733189651835.png" alt="未命名图片" />

服务和路由都已注册上

访问服务：

不用路由：http://localhost:8001/dept/get/1

使用路由：http://www.css.com:9527/springcloud-provider-dept/dept/get/1

网关 / 微服务名字 / 具体的服务 

## 问题

http://myzuul.com:9527/springcloud-provider-dept/dept/get/2 这样去访问的话，就暴露了我 们真实微服务的名称！这不是我们需要的！怎么处理呢?

## 解决

yml配置修改，增加Zuul路由映射！

  **routes**:   **mydept.serviceId**: springcloud-provider-dept   **mydept.path**: /mydept/**  

配置前访问：http://www.css.com:9527/springcloud-provider-dept/dept/get/1

配置后访问：http://www.css.com:9527/mydept/dept/get/1

 

## 依然有问题

现在访问原路径依旧能看到服务名！这不是我们所希望的！

```yaml
zuul:
  routes:
    mydept.serviceId: springcloud-provider-dept
    mydept.path: /mydept/**
  ignored-services: springcloud-provider-dept  #不能再使用这个路径访问
```

此时访问http://www.css.com:9527/springcloud-provider-dept/dept/get/1就无效了

只能通过自定义的服务名mydept访问：http://www.css.com:9527/mydept/dept/get/1

 

## 此设置只针对某个服务名springcloud-provider-dept

若要隐藏所有服务名，用*

```yaml
zuul:
  routes:
    mydept.serviceId: springcloud-provider-dept
    mydept.path: /mydept/**
  ignored-services: "*" #隐藏全部
```

设置统一公共前缀

```yaml
zuul:
  routes:
    mydept.serviceId: springcloud-provider-dept
    mydept.path: /mydept/**
  ignored-services: "*" #隐藏全部
  prefix: /css #设置公共前缀
```

要加前缀才能 访问:http://www.css.com:9527/css/mydept/dept/get/1

# 十、分布式配置

Spring cloud config分为服务端和客户端

服务端也称分布式配置中心，是一个独立的微服务，用于连接配置服务器（github等）并为客户端提供获取配置信息、加密解密等信息的接口

客户端则通过指定的配置中心管理应用资源

用处：集中管理配置文件。运行期间动态调整配置，服务会向配置中心统一拉取配置

<img src="images\SpringCloud-Netflix实战\未命名图片-164733199273036-164733199415337.png" alt="未命名图片" />

# 创建springcloud-config-server-3344

## 1、依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-config-server</artifactId>
    <version>2.1.1.RELEASE</version>
</dependency>
```

 

## 2、yml

```yaml
server:
  port: 3344

spring:
  application:
    name: springcloud-config-server
  #连接远程仓库
  cloud:
    config:
      server:
        git:
          uri: https://github.com/caisense/springcloud-config.git
```



## 3、启动类增加@EnableConfigServer

## 4、编辑远端文件springcloud-config.git

注意三个文件为方便展示写在一起，用---分割

```yaml
spring:
  profiles:
    active: dev
---
spring:
  profiles: dev
  application:
    name: springcloud-config-dev
---
spring:
  profiles: test
  application:
    name: springcloud-config-test
```

根据文档 https://www.springcloud.cc/spring-cloud-config.html#_spring_cloud_config_client

```
HTTP服务具有以下格式的资源：
/{application}/{profile}[/{label}]
/{application}-{profile}.yml
/{label}/{application}-{profile}.yml
/{application}-{profile}.properties
/{label}/{application}-{profile}.properties
其中“应用程序”作为SpringApplication中的spring.config.name注入（即常规Spring Boot应用程序中通常为“应用程序”），“配置文件”是活动配置文件（或逗号分隔列表）的属性），“label”是可选的git标签（默认为“master”）。
```

访问http://localhost:3344/application-dev.yml

<img src="images\SpringCloud-Netflix实战\未命名图片-164733212629838-164733212763839.png" alt="未命名图片" />

说明config-server成功读取git上的配置

 

# 创建springcloud-config-client-3355

## 1、依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-config</artifactId>
    <version>2.1.1.RELEASE</version>
</dependency>
```



## 2、在resource创建bootstrap.yml和application.yml

这是系统级配置，优先级高于application.yml（用户级）

```yaml
#系统级配置
spring:
  cloud:
   #使用云端配置，本地不用再写配置了
    config:
      name: config-client #需要从git上读取资源名称，不需要后缀（.yml等）
       uri: http://localhost:3344  #连接本地config-server
      profile: test #指定配置文件
       label: master #使用主分支
```

Application.yml

```yaml
#用户级配置
spring:
  application:
    name: springcloud-config-client-3355
```

 

## 3、创建控制器

```java
@RestController
public class ConfigClientController {
    @Value("${spring.application.name}")  // 从配置文件读取
    private String applicationName;

    @Value("${eureka.client.service-url.defaultZone}")  // 从配置文件读取
    private String eurekaServer;

    @Value("${server.port}") // 从配置文件读取
    private String port;

    @RequestMapping("/config")
    public String getConfig() {
        return "applicationName:" + applicationName +
                "eurekaServer:" + eurekaServer +
                "port:" + port;
    }
}
```

启动项目测试

访问http://localhost:8202/config

<img src="images\SpringCloud-Netflix实战\未命名图片-164733219004540-164733219120141.png" alt="未命名图片" />

# eureka项目使用远端配置

## 1、新建项目springcloud-config-eureka-7001

代码基本都从springcloud-eureka-7001复制，除了配置文件用远端

## 2、配置

bootstrap.yml

```yaml
spring:
  cloud:
    config:
      name: config-eureka    #使用远端项目下的config-eureka.yml
      label: master
      profile: dev
      uri: http://localhost:3344  #连接本地config-server
```

application.yml

```yaml
spring:
  application:
    name: springcloud-config-dept-8001
```

启动即可

访问http://localhost:7001/，进入eureka界面

 <img src="images\SpringCloud-Netflix实战\未命名图片-164733223150542-164733223268343.png" alt="未命名图片" />

配置成功！

