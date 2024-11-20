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

### 1.2.1 @value查询

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

### 1.2.2 实现类型转换

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



### 1.2.3 使用YAML配置

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



## 1.4 创建Bean实例



## 1.5 初始化Bean



## 1.6 实现BeanPostProcessor



## 1.7 完成IoC容器



# 2 实现AOP



# 3 实现JDBC和事务



# 4 实现Web MVC



# 5 实现Boot



# 6 总结

