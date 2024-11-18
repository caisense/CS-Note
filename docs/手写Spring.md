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

