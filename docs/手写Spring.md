声明：本文是对廖雪峰大神的  [手写Spring教程](https://liaoxuefeng.com/books/summerframework/introduction/index.html) 的学习笔记，仅限于学习交流之用途！

# 0.架构
目标是以Spring框架为原型，专注于实现Spring的核心功能，编写一个迷你版的Spring，命名为Summer Framework，设计目标如下：

context模块：实现ApplicationContext容器与Bean的管理；

aop模块：实现AOP功能；

jdbc模块：实现JdbcTemplate，以及声明式事务管理；

web模块：实现Web MVC和REST API；

boot模块：实现一个简化版的“Spring Boot”，用于打包运行。

# 1.实现IoC容器
## 1.1 实现ResourceResolver

在编写IoC容器之前，首先要实现`@ComponentScan`，即解决**“在指定包下扫描所有Class”**的问题。

Java的ClassLoader机制可以在指定的Classpath中根据类名加载指定的Class。

但遗憾的是，给出一个包名（例如`org.example`），它并不能获取到该包下的所有Class，也不能获取子包。

要在Classpath中扫描指定包名下的所有Class，包括子包，实际上是**在Classpath中搜索所有文件**，找出文件名匹配的`.class`文件。例如，Classpath中搜索的文件`org/example/Hello.class`就符合包名`org.example`，需要根据文件路径把它变为`org.example.Hello`，就相当于获得了类名。因此，搜索Class变成了搜索文件。

先定义一个`Resource`类型表示文件：

```java
public record Resource(String path, String name) {
}
```

再仿造Spring提供一个`ResourceResolver`，定义`scan()`方法来获取扫描到的`Resource`：

```java
public class ResourceResolver {
    String basePackage;

    public ResourceResolver(String basePackage) {
        this.basePackage = basePackage;
    }

    public <R> List<R> scan(Function<Resource, R> mapper) {
        ...
    }
}
```

这样就可以扫描指定包下的所有文件。

我们的目的是扫描`.class`文件，如何过滤出Class？

注意到`scan()`方法传入了一个映射函数，我们传入`Resource`到Class Name的映射，就可以扫描出Class Name：

```java
// 客户端使用时，先定义一个扫描器:
ResourceResolver rr = new ResourceResolver("org.example");
List<String> classList = rr.scan(res -> {
    String name = res.name(); // 资源名称"org/example/Hello.class"
    if (name.endsWith(".class")) { // 如果以.class结尾
        // 把"org/example/Hello.class"变为"org.example.Hello":
        return name.substring(0, name.length() - 6).replace("/", ".").replace("\\", ".");
    }
    // 否则返回null表示不是有效的Class Name:
    return null;
});
```

像上面这样使用，`ResourceResolver`只负责扫描并列出所有文件，由客户端决定是找出`.class`文件，还是找出`.properties`文件。

在ClassPath中扫描文件的代码是固定模式，可以在网上搜索获得，例如StackOverflow的[这个回答](https://stackoverflow.com/questions/520328/can-you-find-all-classes-in-a-package-using-reflection#58773038)。要注意的一点是，Java支持在jar包中搜索文件，所以，不但需要在普通目录中搜索，也需要在Classpath中列出的jar包中搜索，核心代码如下：

```java
// 通过ClassLoader获取URL列表:
Enumeration<URL> en = getContextClassLoader().getResources("org/example");
while (en.hasMoreElements()) {
    URL url = en.nextElement();
    URI uri = url.toURI();
    if (uri.toString().startsWith("file:")) {
        // 在目录中搜索
    }
    if (uri.toString().startsWith("jar:")) {
        // 在Jar包中搜索
    }
}
```

几个要点：

1. ClassLoader首先从`Thread.getContextClassLoader()`获取，如果获取不到，再从当前Class获取，因为Web应用的ClassLoader不是JVM提供的基于Classpath的ClassLoader，而是Servlet容器提供的ClassLoader，它不在默认的Classpath搜索，而是在`/WEB-INF/classes`目录和`/WEB-INF/lib`的所有jar包搜索，从`Thread.getContextClassLoader()`可以获取到Servlet容器专属的ClassLoader；
2. Windows和Linux/macOS的路径分隔符不同，前者是`\`，后者是`/`，需要正确处理；
3. 扫描目录时，返回的路径可能是`abc/xyz`，也可能是`abc/xyz/`，需要注意处理末尾的`/`。

这样我们就完成了能扫描指定包以及子包下所有文件的`ResourceResolver`。

## 1.2 实现PropertyResolver

Spring的注入分为`@Autowired`和`@Value`两种。对于`@Autowired`，涉及到Bean的依赖，而对于`@Value`，则仅仅是将对应的配置注入，不涉及Bean的依赖，相对比较简单。为了注入配置，我们用`PropertyResolver`保存所有配置项，对外提供查询功能。

### @value查询

本节我们来实现`PropertyResolver`，它支持3种查询方式：

1. 按配置的key查询，例如：`getProperty("app.title")`;
2. 以`${abc.xyz}`形式的查询，例如，`getProperty("${app.title}")`，常用于`@Value("${app.title}")`注入；
3. 带默认值的，以`${abc.xyz:defaultValue}`形式的查询，例如，`getProperty("${app.title:Summer}")`，常用于`@Value("${app.title:Summer}")`注入。



Java本身提供了按key-value查询的`Properties`，传入`Properties`，内部按key-value存储：

```java
public class PropertyResolver {
    Map<String, String> properties = new HashMap<>();
    public PropertyResolver(Properties props) {
        // 存入环境变量:
        this.properties.putAll(System.getenv());
        // 存入Properties:
        Set<String> names = props.stringPropertyNames();
        for (String name : names) {
            this.properties.put(name, props.getProperty(name));
        }
    }
}
```

在`PropertyResolver`内部，通过一个`Map<String, String>`存储了所有的配置项，包括环境变量。对于按key查询的功能，可以简单实现如下：

```java
@Nullable
public String getProperty(String key) {
    return this.properties.get(key);
}
```

下一步，准备解析`${abc.xyz:defaultValue}`这样的key，先定义一个`PropertyExpr`，把解析后的key和defaultValue存储起来：

```java
record PropertyExpr(String key, String defaultValue) {
}
```

然后按`${...}`解析：

```java
PropertyExpr parsePropertyExpr(String key) {
    if (key.startsWith("${") && key.endsWith("}")) {
        // 是否存在defaultValue?
        int n = key.indexOf(':');
        if (n == (-1)) {
            // 没有defaultValue: ${key}
            String k = key.substring(2, key.length() - 1);
            return new PropertyExpr(k, null);
        } else {
            // 有defaultValue: ${key:default}
            String k = key.substring(2, n);
            return new PropertyExpr(k, key.substring(n + 1, key.length() - 1));
        }
    }
    return null;
}
```

把`getProperty()`改造一下，即可实现查询`${abc.xyz:defaultValue}`：

```java
@Nullable
public String getProperty(String key) {
    // 解析${abc.xyz:defaultValue}:
    PropertyExpr keyExpr = parsePropertyExpr(key);
    if (keyExpr != null) {
        if (keyExpr.defaultValue() != null) {
            // 带默认值查询:
            return getProperty(keyExpr.key(), keyExpr.defaultValue());
        } else {
            // 不带默认值查询:
            return getRequiredProperty(keyExpr.key());
        }
    }
    // 普通key查询:
    String value = this.properties.get(key);
    if (value != null) {
        return parseValue(value);
    }
    return value;
}
```

每次查询到value后，我们递归调用`parseValue()`，这样就可以**支持嵌套的key**，例如：

```plain
${app.title:${APP_NAME:Summer}}
```

这样可以先查询`app.title`，没有找到就再查询`APP_NAME`，还没有找到就返回默认值`Summer`。

> 注意到Spring的`${...}`表达式实际上可以做到组合，例如：
>
> ```plain
> jdbc.url=jdbc:mysql//${DB_HOST:localhost}:${DB_PORT:3306}/${DB_NAME}
> ```
>
> 而我们实现的`${...}`表达式只能嵌套，不能组合，因为要实现Spring的表达式，需要编写一个完整的能解析表达式的复杂功能，而不能仅仅依靠判断`${`开头、`}`结尾。由于解析表达式的功能过于复杂，因此我们决定不予支持。
>
> Spring还支持更复杂的`#{...}`表达式，它可以引用Bean、调用方法、计算等：
>
> ```plain
> #{appBean.version() + 1}
> ```
>
> 为此Spring专门提供了一个`spring-expression`库来支持这种更复杂的功能。按照一切从简的原则，我们不支持`#{...}`表达式。

### 实现类型转换

除了String类型外，@Value注入时，还允许`boolean`、`int`、`Long`等基本类型和包装类型。此外，Spring还支持`Date`、`Duration`等类型的注入。我们既要实现类型转换，又不能写死，否则，将来支持新的类型时就要改代码。

我们先写类型转换的入口查询：

```java
@Nullable
public <T> T getProperty(String key, Class<T> targetType) {
    String value = getProperty(key);
    if (value == null) {
        return null;
    }
    // 转换为指定类型:
    return convert(targetType, value);
}
```

再考虑如何实现`convert()`方法。对于类型转换，实际上是从String转换为指定类型，因此，用函数式接口`Function<String, Object>`就很合适：

```java
public class PropertyResolver {
    // 存储Class -> Function:
    Map<Class<?>, Function<String, Object>> converters = new HashMap<>();

    // 转换到指定Class类型:
    <T> T convert(Class<?> clazz, String value) {
        Function<String, Object> fn = this.converters.get(clazz);
        if (fn == null) {
            throw new IllegalArgumentException("Unsupported value type: " + clazz.getName());
        }
        return (T) fn.apply(value);
    }
}
```

这样就已经实现了类型转换，下一步是把各种要转换的类型放到`Map`里。在构造方法中放入常用的基本类型转换器：

```java
public PropertyResolver(Properties props) {
    ...
    // String类型:
    converters.put(String.class, s -> s);
    // boolean类型:
    converters.put(boolean.class, s -> Boolean.parseBoolean(s));
    converters.put(Boolean.class, s -> Boolean.valueOf(s));
    // int类型:
    converters.put(int.class, s -> Integer.parseInt(s));
    converters.put(Integer.class, s -> Integer.valueOf(s));
    // 其他基本类型...
    // Date/Time类型:
    converters.put(LocalDate.class, s -> LocalDate.parse(s));
    converters.put(LocalTime.class, s -> LocalTime.parse(s));
    converters.put(LocalDateTime.class, s -> LocalDateTime.parse(s));
    converters.put(ZonedDateTime.class, s -> ZonedDateTime.parse(s));
    converters.put(Duration.class, s -> Duration.parse(s));
    converters.put(ZoneId.class, s -> ZoneId.of(s));
}
```

如果再加一个`registerConverter()`接口，就可以对外提供扩展，让用户自己编写自己定制的Converter，这样一来，我们的PropertyResolver就准备就绪，读取配置的初始化代码如下：

```java
// Java标准库读取properties文件:
Properties props = new Properties();
props.load(fileInput); // 文件输入流
// 构造PropertyResolver:
PropertyResolver pr = new PropertyResolver(props);
// 后续代码调用...
// pr.getProperty("${app.version:1}", int.class)
```



### 使用YAML配置

Spring Framework并不支持YAML配置，但Spring Boot支持。因为YAML配置比`.properties`要方便，所以我们把对YAML的支持也集成进来。

首先引入依赖`org.yaml:snakeyaml:2.0`，然后我们写一个`YamlUtils`，通过`loadYamlAsPlainMap()`方法读取一个YAML文件，并返回`Map`：

```java
public class YamlUtils {
    public static Map<String, Object> loadYamlAsPlainMap(String path) {
        return ...
    }
}
```

我们把YAML格式：

```yaml
app:
  title: Summer Framework
  version: ${VER:1.0}
```

读取为`Map`，其中，每个key都是完整路径，相当于把它变为`.properties`格式：

```plain
app.title=Summer Framework
app.version=${VER:1.0}
```

这样就无需改动`PropertyResolver`的代码，使用YAML时，可以按如下方式读取配置：

```java
Map<String, Object> configs = YamlUtils.loadYamlAsPlainMap("/application.yml");
Properties props = new Properties();
props.putAll(config);
PropertyResolver pr = new PropertyResolver(props);
```

读取YAML的代码比较简单，注意要点：

1. SnakeYaml默认读出的结构是树形结构，需要**“拍平”**成`abc.xyz`格式的key；
2. SnakeYaml默认会自动转换`int`、`boolean`等value，需要禁用自动转换，把所有value均按`String`类型返回。



## 1.3 创建BeanDefinition

现在，我们可以用`ResourceResolver`扫描Class，用`PropertyResolver`获取配置，下面，我们开始实现IoC容器。

在IoC容器中，每个Bean都有一个唯一的名字标识。Spring还允许为一个Bean定义多个名字，这里我们简化一下，一个Bean只允许一个名字，因此，很容易想到用一个`Map<String, Object>`保存所有的Bean：

```java
public class AnnotationConfigApplicationContext {
    Map<String, Object> beans;
}
```

这么做不是不可以，但是丢失了大量Bean的定义信息，不便于我们创建Bean以及解析依赖关系。合理的方式是先定义`BeanDefinition`，它能从Annotation中提取到足够的信息，便于后续创建Bean、设置依赖、调用初始化方法等：

```java
public class BeanDefinition {
    // 全局唯一的Bean Name:
    String name;
    // Bean的声明类型:
    Class<?> beanClass;
    // Bean的实例:
    Object instance = null;
    // 构造方法/null:
    Constructor<?> constructor;
    // 工厂方法名称/null:
    String factoryName;
    // 工厂方法/null:
    Method factoryMethod;
    // Bean的顺序:
    int order;
    // 是否标识@Primary:
    boolean primary;
    // init/destroy方法名称:
    String initMethodName;
    String destroyMethodName;
    // init/destroy方法:
    Method initMethod;
    Method destroyMethod;
}
```

对于自己定义的带`@Component`注解的Bean，我们需要获取Class类型，获取构造方法来创建Bean，然后收集`@PostConstruct`和`@PreDestroy`标注的初始化与销毁的方法，以及其他信息，如`@Order`定义Bean的内部排序顺序，`@Primary`定义存在多个相同类型时返回哪个“主要”Bean。一个典型的定义如下：

```java
@Component
public class Hello {
    @PostConstruct
    void init() {}

    @PreDestroy
    void destroy() {}
}
```

对于`@Configuration`定义的`@Bean`方法，我们把它看作Bean的工厂方法，我们需要获取方法返回值作为Class类型，方法本身作为创建Bean的`factoryMethod`，然后收集`@Bean`定义的`initMethod`和`destroyMethod`标识的初始化于销毁的方法名，以及其他`@Order`、`@Primary`等信息。一个典型的定义如下：

```java
@Configuration
public class AppConfig {
    @Bean(initMethod="init", destroyMethod="close")
    DataSource createDataSource() {
        return new HikariDataSource(...);
    }
}
```

### Bean的声明类型

这里我们要特别注意一点，就是Bean的声明类型。对于`@Component`定义的Bean，它的声明类型就是其Class本身。

然而，对于用`@Bean`工厂方法创建的Bean，它的**声明类型与实际类型不一定是同一类型**。比如上述`createDataSource()`定义的Bean，声明类型是`DataSource`，实际类型却是某个子类（例如`HikariDataSource`）。

因此要特别注意，我们在`BeanDefinition`中，存储的`beanClass`是**声明类型**，实际类型不必存储，因为可以通过`instance.getClass()`获得：

```java
public class BeanDefinition {
    // Bean的声明类型:
    Class<?> beanClass;

    // Bean的实例:
    Object instance = null;
}
```

这也引出了下一个问题：如果我们按照 **名字查找** Bean或BeanDefinition，要么拿到唯一实例，要么不存在，即通过查询`Map<String, BeanDefinition>`即可完成：

```java
public class AnnotationConfigApplicationContext {
    Map<String, BeanDefinition> beans;

    // 根据Name查找BeanDefinition，如果Name不存在，返回null
    @Nullable
    public BeanDefinition findBeanDefinition(String name) {
        return this.beans.get(name);
    }
}
```

但是通过 **类型查找** Bean或BeanDefinition，我们没法定义一个`Map<Class, BeanDefinition>`，原因就是Bean的声明类型与实际类型不一定相符，举个例子：

```java
@Configuration
public class AppConfig {
    @Bean
    AtomicInteger counter() {
        return new AtomicInteger();
    }
    
    @Bean
    Number bigInt() {
        return new BigInteger("1000000000");
    }
}
```

当我们调用`getBean(AtomicInteger.class)`时，我们会获得`counter()`方法创建的唯一实例，但是，当我们调用`getBean(Number.class)`时，`counter()`方法和`bigInt()`方法创建的实例均符合要求，此时，如果有且仅有一个标注了`@Primary`，就返回标注了`@Primary`的Bean，否则，直接报`NoUniqueBeanDefinitionException`错误。

因此，对于`getBean(Class)`方法，必须遍历找出所有符合类型的Bean，如果不唯一，再判断`@Primary`，才能返回唯一Bean或报错。

我们编写一个找出所有类型的`findBeanDefinitions(Class)`方法如下：

```java
// 根据Type查找若干个BeanDefinition，返回0个或多个:
List<BeanDefinition> findBeanDefinitions(Class<?> type) {
    return this.beans.values().stream()
        // 按类型过滤:
        .filter(def -> type.isAssignableFrom(def.getBeanClass()))
        // 排序:
        .sorted().collect(Collectors.toList());
    }
}
```

我们再编写一个`findBeanDefinition(Class)`方法如下：

```java
// 根据Type查找某个BeanDefinition，如果不存在返回null，如果存在多个返回@Primary标注的一个:
@Nullable
public BeanDefinition findBeanDefinition(Class<?> type) {
    List<BeanDefinition> defs = findBeanDefinitions(type);
    if (defs.isEmpty()) { // 没有找到任何BeanDefinition
        return null;
    }
    if (defs.size() == 1) { // 找到唯一一个
        return defs.get(0);
    }
    // 多于一个时，查找@Primary:
    List<BeanDefinition> primaryDefs = defs.stream().filter(def -> def.isPrimary()).collect(Collectors.toList());
    if (primaryDefs.size() == 1) { // @Primary唯一
        return primaryDefs.get(0);
    }
    if (primaryDefs.isEmpty()) { // 不存在@Primary
        throw new NoUniqueBeanDefinitionException(String.format("Multiple bean with type '%s' found, but no @Primary specified.", type.getName()));
    } else { // @Primary不唯一
        throw new NoUniqueBeanDefinitionException(String.format("Multiple bean with type '%s' found, and multiple @Primary specified.", type.getName()));
    }
}
```

现在，我们已经定义好了数据结构，下面开始获取所有`BeanDefinition`信息，实际分两步：

```java
public class AnnotationConfigApplicationContext {
    Map<String, BeanDefinition> beans;

    public AnnotationConfigApplicationContext(Class<?> configClass, PropertyResolver propertyResolver) {
        // 扫描获取所有Bean的Class类型:
        Set<String> beanClassNames = scanForClassNames(configClass);
        // 创建Bean的定义:
        this.beans = createBeanDefinitions(beanClassNames);
    }
    ...
}
```

第一步是扫描指定包下的所有Class，然后返回Class名字，这一步比较简单：

```java
Set<String> scanForClassNames(Class<?> configClass) {
    // 获取@ComponentScan注解:
    ComponentScan scan = ClassUtils.findAnnotation(configClass, ComponentScan.class);
    // 获取注解配置的package名字,未配置则默认当前类所在包:
    String[] scanPackages = scan == null || scan.value().length == 0 ? new String[] { configClass.getPackage().getName() } : scan.value();

    Set<String> classNameSet = new HashSet<>();
    // 依次扫描所有包:
    for (String pkg : scanPackages) {
        logger.atDebug().log("scan package: {}", pkg);
        // 扫描一个包:
        var rr = new ResourceResolver(pkg);
        List<String> classList = rr.scan(res -> {
            // 遇到以.class结尾的文件，就将其转换为Class全名:
            String name = res.name();
            if (name.endsWith(".class")) {
                return name.substring(0, name.length() - 6).replace("/", ".").replace("\\", ".");
            }
            return null;
        });
        // 扫描结果添加到Set:
        classNameSet.addAll(classList);
    }

    // 继续查找@Import(Xyz.class)导入的Class配置:
    Import importConfig = configClass.getAnnotation(Import.class);
    if (importConfig != null) {
        for (Class<?> importConfigClass : importConfig.value()) {
            String importClassName = importConfigClass.getName();
            classNameSet.add(importClassName);
        }
    }
    return classNameSet;
}
```

注意到扫描结果是指定包的所有Class名称，以及通过`@Import`导入的Class名称，下一步才会真正处理各种注解：

```java
Map<String, BeanDefinition> createBeanDefinitions(Set<String> classNameSet) {
    Map<String, BeanDefinition> defs = new HashMap<>();
    for (String className : classNameSet) {
        // 获取Class:
        Class<?> clazz = null;
        try {
            clazz = Class.forName(className);
        } catch (ClassNotFoundException e) {
            throw new BeanCreationException(e);
        }
        // 是否标注@Component?
        Component component = ClassUtils.findAnnotation(clazz, Component.class);
        if (component != null) {
            // 获取Bean的名称:
            String beanName = ClassUtils.getBeanName(clazz);
            var def = new BeanDefinition(
                beanName, clazz, getSuitableConstructor(clazz),
                getOrder(clazz), clazz.isAnnotationPresent(Primary.class),
                // init/destroy方法名称:
                null, null,
                // 查找@PostConstruct方法:
                ClassUtils.findAnnotationMethod(clazz, PostConstruct.class),
                // 查找@PreDestroy方法:
                ClassUtils.findAnnotationMethod(clazz, PreDestroy.class));
            addBeanDefinitions(defs, def);
            // 查找是否有@Configuration:
            Configuration configuration = ClassUtils.findAnnotation(clazz, Configuration.class);
            if (configuration != null) {
                // 查找@Bean方法:
                scanFactoryMethods(beanName, clazz, defs);
            }
        }
    }
    return defs;
}
```

### 递归查找@Component

上述代码需要注意的一点是，查找`@Component`时，并不是简单地在Class定义查看`@Component`注解，因为Spring的`@Component`是可以扩展的，例如，标记为`Controller`的Class也符合要求：

```java
@Controller
public class MvcController {...}
```

原因就在于，`@Controller`注解的定义包含了`@Component`：

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Controller {
    String value() default "";
}
```

所以，判断是否存在`@Component`，不但要在当前类查找`@Component`，还要在当前类的所有注解上，查找该注解是否有`@Component`，因此，我们编写了一个能递归查找注解的方法：

```java
public class ClassUtils {
    public static <A extends Annotation> A findAnnotation(Class<?> target, Class<A> annoClass) {
        A a = target.getAnnotation(annoClass);
        for (Annotation anno : target.getAnnotations()) {
            Class<? extends Annotation> annoType = anno.annotationType();
            if (!annoType.getPackageName().equals("java.lang.annotation")) {
                A found = findAnnotation(annoType, annoClass);
                if (found != null) {
                    if (a != null) {
                        throw new BeanDefinitionException("Duplicate @" + annoClass.getSimpleName() + " found on class " + target.getSimpleName());
                    }
                    a = found;
                }
            }
        }
        return a;
    }
}
```

带有`@Configuration`注解的Class，视为Bean的工厂，我们需要继续在`scanFactoryMethods()`中查找`@Bean`标注的方法：

```java
void scanFactoryMethods(String factoryBeanName, Class<?> clazz, Map<String, BeanDefinition> defs) {
    for (Method method : clazz.getDeclaredMethods()) {
        // 是否带有@Bean标注:
        Bean bean = method.getAnnotation(Bean.class);
        if (bean != null) {
            // Bean的声明类型是方法返回类型:
            Class<?> beanClass = method.getReturnType();
            var def = new BeanDefinition(
                ClassUtils.getBeanName(method), beanClass,
                factoryBeanName,
                // 创建Bean的工厂方法:
                method,
                // @Order
                getOrder(method),
                // 是否存在@Primary标注?
                method.isAnnotationPresent(Primary.class),
                // init方法名称:
                bean.initMethod().isEmpty() ? null : bean.initMethod(),
                // destroy方法名称:
                bean.destroyMethod().isEmpty() ? null : bean.destroyMethod(),
                // @PostConstruct / @PreDestroy方法:
                null, null);
            addBeanDefinitions(defs, def);
        }
    }
}
```

注意到`@Configuration`注解本身又用`@Component`注解修饰了，因此，对于一个`@Configuration`来说：

```java
@Configuration
public class DateTimeConfig {
    @Bean
    LocalDateTime local() { return LocalDateTime.now(); }

    @Bean
    ZonedDateTime zoned() { return ZonedDateTime.now(); }
}
```

实际上创建了3个`BeanDefinition`：

- DateTimeConfig本身；
- LocalDateTime；
- ZonedDateTime。

不创建`DateTimeConfig`行不行？不行，因为后续没有`DateTimeConfig`的实例，无法调用`local()`和`zoned()`方法。因为当前我们只创建了`BeanDefinition`，所以对于`LocalDateTime`和`ZonedDateTime`的`BeanDefinition`来说，还必须保存`DateTimeConfig`的名字，将来才能通过名字查找`DateTimeConfig`的实例。

### Q：为何同时存储`initMethodName`和`initMethod`？

注意：我们同时存储了`initMethodName`和`initMethod`，以及`destroyMethodName`和`destroyMethod`，这是因为在`@Component`声明的Bean中，我们可以根据`@PostConstruct`和`@PreDestroy`直接拿到Method本身，而在`@Bean`声明的Bean中，我们拿不到Method，只能从`@Bean`注解提取出字符串格式的方法名称，因此，存储在`BeanDefinition`的方法名称与方法，其中至少有一个为`null`。

最后，仔细编写`BeanDefinition`的`toString()`方法，使之能打印出详细的信息。我们编写测试，运行，打印出每个`BeanDefinition`如下：

```plain
define bean: BeanDefinition [name=annotationDestroyBean, beanClass=com.itranswarp.scan.destroy.AnnotationDestroyBean, factory=null, init-method=null, destroy-method=destroy, primary=false, instance=null]

define bean: BeanDefinition [name=nestedBean, beanClass=com.itranswarp.scan.nested.OuterBean$NestedBean, factory=null, init-method=null, destroy-method=null, primary=false, instance=null]

define bean: BeanDefinition [name=createSpecifyInitBean, beanClass=com.itranswarp.scan.init.SpecifyInitBean, factory=SpecifyInitConfiguration.createSpecifyInitBean(String, String), init-method=null, destroy-method=null, primary=false, instance=null]

...
```

现在，我们已经能扫描并创建所有的`BeanDefinition`，只是目前每个`BeanDefinition`内部的`instance`还是`null`，因为我们后续才会创建真正的Bean。

## 1.4 创建Bean实例



## 1.5 初始化Bean



## 1.6 实现BeanPostProcessor



## 1.7 完成IoC容器



# 2 实现AOP



# 3 实现JDBC和事务



# 4 实现Web MVC



# 5 实现Boot



# 6 总结

