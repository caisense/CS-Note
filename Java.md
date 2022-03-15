# 代理

是一种常用的设计模式，其目的就是为其他对象提供一个代理以控制对某个对象的访问。代理类负责为委托类**预处理**、**后处理**等增强操作。

![img](D:\CS-Note\images\Java\Center.png)

## 动态代理

动态代理有以下特点:

代理对象不需要实现接口，利用反射，在运行时构建代理对象（需要指定创建的类和接口）

### 1、jdk动态代理



#### 原理

1. 通过 Proxy.getProxyClass() 方法获取代理类 Class 对象；
2. 通过反射 aClazz.getConstructor() 获取构造器对象；
3. 定义InvocationHandler类并实例化，当然也可以直接使用匿名内部类；
4. 通过反射 constructor.newInstance() 创建代理类对象；
5. 调用代理方法，接口的所有方法实际上都会去执行 InvocationHandler 对象的 invoke方法

代理类所在包：java.lang.reflect.Proxy，jdk的Proxy类提供静态方法`newProxyInstance`完成上述操作

#### 使用

1. 实现一个`InvocationHandler`接口，它必须重写`invoke`方法
2. 创建被代理的类以及接口
3. 将1、2两步结果作为参数，传入`Proxy`的静态方法`newProxyInstance(ClassLoaderloader, Class[] interfaces, InvocationHandler h)`创建一个代理
4. 通过代理调用方法

#### 目的

对代理对象的方法进行了增强，即方法执行前后执行自定义的切面逻辑。

#### 例

代理工厂类:ProxyFactory.java

```java
public class ProxyFactory{
    //维护一个目标对象
    private Object target;
    public ProxyFactory(Object target){
        this.target=target;
    }

   //方法：给目标对象生成代理对象
    public Object getProxyInstance(){
        // 调用Proxy静态方法创建代理
        return Proxy.newProxyInstance(
                target.getClass().getClassLoader(),		// 目标对象的类加载器
                target.getClass().getInterfaces(),		// 目标对象实现的接口数组
                new InvocationHandler() {				// InvocationHandler接口实例
                    @Override
                    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                        // 执行目标对象方法前置操作
                        System.out.println("开始事务");
                        // 执行目标对象方法
                        Object returnValue = method.invoke(target, args);
                        // 执行目标对象方法后置操作
                        System.out.println("提交事务");
                        return returnValue;
                    }
                }
        );
    }

}
```

测试类:Test.java

```java
public class Test {
    public static void main(String[] args) {
        // 目标对象
        IUserDao target = new UserDao();
        // 原始的类型 class 【cn.itcast.b_dynamic.UserDao】
        System.out.println(target.getClass());

        // 给目标对象，创建代理对象，注意要强转
        IUserDao proxy = (IUserDao) new ProxyFactory(target).getProxyInstance();
        // class $Proxy0   内存中动态生成的代理对象
        System.out.println(proxy.getClass());

        // 执行方法   【代理对象】
        proxy.save();
    }
}
```





### 2、cglib动态代理

也叫**子类代理**，在内存中构建一个子类对象从而实现对目标对象功能的扩展。

jdk动态代理有限制：目标对象必须实现一个或多个接口，因此要代理未实现接口的类，使用cglib

Cglib是一个强大的高性能的代码生成包，底层是通过一个小而快的字节码处理框架ASM来转换字节码并生成新的类

#### 使用

1、引入cglib的jar文件（Spring已经集成）

2、目标类不能为final,否则报错

3、目标对象的方法不能为final/static

#### 例

目标对象类:UserDao.java,没有实现任何接口

```java
public class UserDao {
    public void save() {
        System.out.println("----已经保存数据!----");
    }
}
```

Cglib代理工厂:ProxyFactory.java

```java
public class ProxyFactory implements MethodInterceptor{
    //维护目标对象
    private Object target;

    public ProxyFactory(Object target) {
        this.target = target;
    }

    //给目标对象创建一个代理对象
    public Object getProxyInstance(){
        //1. 创建工具类
        Enhancer en = new Enhancer();
        //2. 设置父类（目标对象类）
        en.setSuperclass(target.getClass());
        //3. 设置回调（代理对象，此处为当前对象）
        en.setCallback(this);
        //4. 生成子类(代理对象)
        return en.create();
    }

    @Override
    public Object intercept(Object obj, Method method, Object[] args, MethodProxy proxy) throws Throwable {
        System.out.println("开始事务...");
        //执行目标对象的方法
        Object returnValue = method.invoke(target, args);
        System.out.println("提交事务...");
        return returnValue;
    }
}
```

测试类:

```java
public class Test {
    @Test
    public void test(){
        //目标对象
        UserDao target = new UserDao();
        //代理对象
        UserDao proxy = (UserDao)new ProxyFactory(target).getProxyInstance();
        //执行代理对象的方法
        proxy.save();
    }
}
```

### 总结

代理对象不需要实现接口。

但是目标对象如果实现了接口，就用jdk动态代理；目标对象没有实现任何接口，用cglib

# 反射

## 获取构造方法

- getConstructor(Class...)：获取某个public的Constructor；
- getConstructors()：获取所有public的Constructor；
- getDeclaredConstructor(Class...)：获取某个Constructor；
- getDeclaredConstructors()：获取所有Constructor。

## new、newnewInstance() 、Constructor.newInstance()区别

### 1. new和newnewInstance()

在执行Class.forName("a.class.Name")时，JVM会在classapth中去找对应的类并加载，这时JVM会执行该类的静态代码段。在使用newInstance()方法的时候，必须保证这个类已经加载并且已经连接了，而这可以通过Class的静态方法forName()来完成的。

使用关键字new创建一个类的时候，这个类可以没有被加载，一般也不需要该类在classpath中设定，但可能需要通过classlaoder来加载。

### 2. newnewInstance() 和Constructor.newInstance()

Class.newInstance() 只能够调用 **无参** 且**public**的构造函数，即**默认构造函数**； 
Constructor.newInstance() 调用 **任意**构造构造函数，甚至可以调用私有的。