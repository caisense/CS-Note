

# 数据结构

## 一、基本数据类型

是CPU可以直接进行运算的类型。Java定义了以下几种基本数据类型：

一、整数类型：byte，short，int，long

二、浮点数类型：float，double

三、布尔类型：boolean

四、字符类型：char

八种基本类型比较：

| **类型名称** | **字节空间** | 包装类    | **应用场景**         | 默认值（基本类型） | 数据范围                        |
| ------------ | ------------ | --------- | -------------------- | ------------------ | ------------------------------- |
| byte         | 1Byte        | Byte      | 字节数据             | 0                  | `-2^7~2^7-1`                    |
| short        | 2Byte        | Short     | 短整数               | 0                  | `-2^15~2^15-1`                  |
| int          | 4Byte        | Integer   | 普通整数             | 0                  | `-2^31~2^31-1`                  |
| long         | 8Byte        | Long      | 长整数               | 0                  | `-2^63~2^63-1`                  |
| float        | 4Byte        | Float     | 浮点数               | 0.0                | 1.4E-45~3.4028235E38            |
| double       | 8Byte        | Double    | 双精度浮点数         | 0.0                | 4.9E-324~1.7976931348623157E308 |
| char         | 2Byte        | Character | 一个字符             | 空                 | 0~65535                         |
| boolean      | 1Byte        | Boolean   | 逻辑变量(true,flase) | false              | true或false                     |

**注意**：默认值只有基本类型才有，包装类默认为null

表示的范围：

| `类型`  | `占据空间`       | `表示整数范围`                                | `计算方式`     |
| ------- | ---------------- | --------------------------------------------- | -------------- |
| `byte`  | `1Byte（8bit)`   | `-128  ~ 127`                                 | `-2^7~2^7-1`   |
| `short` | `2Byte  (16bit)` | `-32768  ~ 32767`                             | `-2^15~2^15-1` |
| `int`   | `4Byte  (32bit)` | `-2147483648  ~ 2147483647`                   | `-2^31~2^31-1` |
| `long`  | `8Byte  (64bit)` | `-9223372036854775808  ~ 9223372036854775807` | `-2^63~2^63-1` |

### 1、整形

对于整型类型，Java只定义了带符号的整型，因此，最高位的bit表示符号位（0表示正数，1表示负数），其余位用二进制来表示一个整数 

赋值：

```java
int i = 2147483647;
int i2 = -2147483648;  // 负数用-开头
int i3 = 2_000_000_000;  // 可以加下划线，便于计数，不影响数值
int i4 = 0xff0000; // 0x开头代表十六进制数，表示16711680
int i5 = 0b1000000000; // 0b开头代表二进制，表示512
long l = 9000000000000000000L;  // long型的结尾需要加L
```

### 2、浮点型

对于float类型，需要加上`f`后缀。

```java
float f1 = 3.14f;
float f2 = 3.14e38f; // 科学计数法表示的3.14x10^38
double d = 1.79e308;
double d2 = -1.79e308;
double d3 = 4.9e-324; // 科学计数法表示的4.9x10^-324
```

### 3、布尔类型

只有`true`和`false`两个值

### 4、字符类型

char表示一个字符。事实上是一个16位无符号整数（0~65535），这个值是对应字符的编码；

Java字符串类型采用Unicode字符集编码。Unicode是世界通用的长度字符集，所有的字符串都是16位；

char赋值有三种方式：

```java
char ch1= 'N';  // 字符赋值
char ch2= 705;   // 整形赋值
char ch3= '\u0031';  // unicode，16进制形式
```

注意char类型字符使用单引号`'a'`，且仅有**一个字符**，要和双引号`"a"`的String类型区分开。

### BigInteger

不可变，范围无限。但速度慢。

做运算只能用实例方法：

```java
BigInteger i1 = new BigInteger("1234567890");
BigInteger i2 = new BigInteger("12345678901234567890");
BigInteger sum = i1.add(i2); // 12345678902469135780
```

### BigDecimal

不可变，范围无限，精度无限，所以没有损失

比较要用`compareTo()`

### 类型间转换

类型的转换关系如下：

![92a2d60aba1ca69c33ec051a89941c1a](D:\CS-Note\images\Java\92a2d60aba1ca69c33ec051a89941c1a.png)

- 自动类型转换(隐式类型转换)：从小类型到大类型可以**自动完成**。
- 强制转换：从大类型到小类型需要加括号，但这样转换有可能会造成**精度损失或溢出**。

```java
long l = 100L;
double d = l;  // long自动转double
 
double d = 0.1d;
long l = (long)d;  // double转long必须强制转换，否则报错
```

**注意**：

1. long为8字节，float仅为4字节，但long可以自动转换为float（简单来说因为浮点数用科学计数法存储的，而整数是用二进制存储的。所以虽然long型是64位的，float型是32位，但是float型所能表示的数要远远大于long型。来自 <https://www.jianshu.com/p/94b6fde08a74> ）
2. char为2字节，可以自动转换为int，但不能自动转同为2字节的short

### 几种特殊转换

多种基本类型参与的表达式运算中，运算结果会**自动转换称较大的类型**；比如：

```java
int a = 4；
int b = 10;
double c = a/b；//结果为0.4，自动转换为double类型
```

byte、char、short三种类型实际存储的数据都是整数，在实际使用中遵循如下规则：

1、Int直接量可以直接赋值给byte、char和short，只要不超过其表示范围。

2、byte、char、short三种类型参与运算时，先一律转换成int类型再进行运算。

## 二、引用类型

除了上述基本类型的变量，剩下的都是引用类型，也就是对象。例如，引用类型最常用的就是String字符串

### String

#### 空和非空判断

```java
// string为空有两种情况：1.为null；2.不为null，且长度为0
public static boolean isEmpty(String str) {
    return str == null || str.length() = 0;
}
// 非空：首先不为null，其次长度大于0
public static boolean isNotEmpty(String str) {
    return str != null && str.length() > 0;
}
```

#### 判断空白

```java
// 空白符包含：空格、tab 键、换行符
public static boolean isBlank(String str) {
    if (isEmpty(str)) {
        return true;
    } else {
        int strLen = str.length();
        for(int i = 0; i < strLen; ++i) {
            if (!Character.isWhitespace(str.charAt(i))) {
                return false;
            }
        }
        return true;
    }
}
```

#### String s = new String(“abc”) 会创建几个对象

使用这种方式一共会创建两个字符串对象（前提是 String Pool 中还没有 “abc” 字符串对象）。

“abc” 属于字符串字面量，因此编译时期会在 String Pool 中创建一个字符串对象，指向这个 “abc” 字符串字面量；

而使用 new 的方式会在堆中创建一个字符串对象。



#### String, StringBuffer and StringBuilder区别

可变性：String不可变，剩下两个可变。

线程安全：StringBuffer 是线程安全的（内部使用 synchronized 进行同步），而 StringBuilder 是非线程安全的，但 StringBuilder 的性能却高于 StringBuffer，所以在单线程环境下推荐使用 StringBuilder，多线程环境下推荐使用 StringBuffer。



### 自动装箱和拆箱

Java 1.5引入，目的是将原始类型值转自动地转换成对应的对象。该机制可以让我们在Java的变量赋值或方法调用等情况下，使用原始类型或者对象类型更加简单直接。

- 装箱：将初始类型的变量转换成封装类对象
- 拆箱：将封装类对象转换成初始类型

java中数字1，2，3,…,1000等，都是初始类型，只是平常使用时没有注意到，如创建一个Integer：

```java
Integer n1  = new Integer(1);  // 常规写法，创建对象  
Integer n2  = 1;   // 自动装箱，直接赋值  
```

#### 包装类型

| 原始类型 | byte | short | char      | int     | long | float | double | boolean |
| -------- | ---- | ----- | --------- | ------- | ---- | ----- | ------ | ------- |
| 封装类   | Byte | Short | Character | Integer | Long | Float | Double | Boolean |

包装类**默认值**都为`null`

#### 规则

以int加法为例

1. 封装类 + 基本类型，结果为封装类

   ```java
   Integer i = 0;
   i += 1;  // 等价于 i = i + 1;
   System.out.println(i); // 1
   System.out.println(i.getClass()); // class java.lang.Integer 
   ```

2. 基本类型+封装类，结果还是基本类型

   ```java
   int i1 = 0;
   i1 += new Integer(1);  // 等价于i1 = i1 +  new Integer(1);
   System.out.println(i1);  // 1
   // System.out.println(i1.getClass());  // 报错
   ```

其他类型和运算同理

#### 弊端

例如在一个循环中进行自动装箱操作的情况，自动拆装箱是消耗时间的：

```java
Integer sum = 0;	// 包装类
for(int i=1000; i<5000; i++){
    sum += i;	// 与基本类型相加，自动装箱
}
```

**正确做法**

合理声明变量类型，避免因为自动装箱引起的性能问题

#### 底层实现

自动装箱：编译器调用**包装类的静态方法**`valueOf()`方法将原始类型值转换成对象，如`Integer.valueOf()`

```java
int b = 1;
Integer a = Integer.valueOf(b);
```

自动拆箱：编译器通过调用**包装对象**的`intValue()`,`doubleValue()`这类的方法将对象转换成原始类型值。

```java
Integer a = 1;
int b = a.intValue();  // 1
```



#### 方法重载与自动装箱

若同时实现了参数为基本类型和包装类型的方法，则调用时会根据参数类型选择相应方法，不发生自动装箱拆箱

```java
public void test(int num){	// 重载，入参为初始类型int
    System.out.println("method with primitive argument");
}
public void test(Integer num){	// 重载，入参为包装类型Integer
    System.out.println("method with wrapper argument");
}
public static void main(String[] args) {
    AutoBoxingTest autoTest = new AutoBoxingTest();
    int n1 = 3;
    autoTest.test(3);  // 调用初始类型test

    Integer n2 = 4;
    autoTest.test(n2);  // 调用包装类型test
}
```

#### ==运算符与自动装箱

1. 用于初始类型的比较时，比较值是否相等

   ```java
   int i1 = 1;
   int i2 = 1;
   System.out.println(i1 == i2); // true
   ```

   

2. 用于封装类型比较时，比较是否同一对象（用equals）

   ```java
   // 情况1
   Integer obj1 = 1; // autoboxing will call Integer.valueOf()
   Integer obj2 = 1; // same call to Integer.valueOf() will return same
   // cached Object
   System.out.println(obj1 == obj2); // true
   
   // 情况2
   Integer one = new Integer(1); // no autoboxing
   Integer anotherOne = new Integer(1);
   System.out.println(one == anotherOne); // false
   ```

   对于情况1，自动装箱创建的Integer，实际上调用了Integer.valueOf()方法，出于节省内存的考虑，JVM会缓存-128~127的Integer对象，即**缓存池**，因此obj1与obj2实际上指向同一对象。

   对于情况2，使用new创建的Integer，不再从缓存池取，因此地址肯定不一样。

3. 用于初始类型和封装类比较时，发生自动拆箱。规则是封装类转成初始类型，比较**值是否相等**

   ```java
   Integer num1 = 1; // autoboxing
   int num2 = 1;
   System.out.println(num1 == num2); // true
   ```

### 缓存池

只要不是用new显式创建包装类型，当值在一定范围内，jvm优先从缓存池中获取对象，不会另外创建

```java
Integer obj1 = 1; //从缓存池取 
Integer obj2 = Integer.valueOf(1); //从缓存池取
System.out.println(obj1 == obj2); // true 
Integer obj3 = new Integer(1);  //另外创建
System.out.println(obj3 == obj2); // false
```

缓存池范围

| 包装类型    | 缓存池             |
| ----------- | ------------------ |
| `Integer`   | `-128  ~ 127`      |
| `Short`     | `-128  ~ 127`      |
| `Bytes`     | `-128  ~ 127`      |
| `Long`      | `-128  ~ 127`      |
| `Boolean`   | `true和false`      |
| `Character` | `\u0000  - \u007F` |

String和浮点数没有缓存池很好理解：String取值原本就没规律，浮点数的范围也很难限定

注意：Int的上限high可以用jvm命令 `-XX:AutoBoxCacheMax=<high>` 设置，high大于127时有效，小于等于时上限仍为127
Long的范围无法设置

### 常量

定义变量的时候，如果加上final修饰符，这个变量就变成了常量

```
final double PI = 3.14; // PI是一个常量
```

常量在定义时进行初始化后就**不可再次赋值**，再次赋值会导致编译错误。

常量的作用是用有意义的变量名来避免魔术数字（Magic number）。根据习惯，常量名通常全部大写。

### var关键字

有些时候，类型的名字太长，写起来比较麻烦。例如：

```
StringBuilder sb = new StringBuilder();
```

如果想省略变量类型，可以使用var关键字：

```
var sb = new StringBuilder();
```

编译器会根据赋值语句**自动推断**出变量sb的类型是StringBuilder。

因此，使用var定义变量，**仅仅是少写了变量类型而已**。



## 三、集合

### 数组 `[]`

1.是一种引用数据类型（非基本类型），实际上并不属于java集合，但功能类似

2.数组中的数据类型必须一致

3.长度在**运行期间**不可改变，用属性`.length`获取

#### 创建：

1.创建时若不初始化，则必须指定长度。元素值为该类型默认值

```
int [] intArray0 = new int [3];  // 创建长度为3的整数数组，每个元素都是0
```

2.若初始化（赋初值），则不能指定长度（因为长度由初始化元素个数决定）

```
int intArray1 [] = new int []{20, 21, 22};
```

可以省略new:

```
int intArray2 [] = {23, 24, 25};
```

#### 数组的类型

由初始化时的类型type决定：[type]

```java
Object oa [] = {};
int intArray [] = {23, 24, 25};
String stringArray[] = {"abc", "def", "ghi"};
System.out.println(oa.getClass());		//class [Ljava.lang.Object
System.out.println(intArray.getClass());    //class [I
System.out.println(stringArray.getClass());    //class [Ljava.lang.String
```

### ArrayList

#### 扩容

使用 ensureCapacityInternal() 方法来保证容量足够，如果不够时，需要使用 grow() 扩容

新容量大小为1.5倍

### 数组与ArrayList区别

|          | 数组                            | ArrayList                        |
| -------- | ------------------------------- | -------------------------------- |
| 底层实现 | 继承Object，不属于集合          | 实现Collection接口，是集合的一种 |
| 长度     | .length属性获取，一旦创建不可变 | size()方法获取，可动态增减       |
| 元素类型 | 单一类型即可                    | 单一类型，且必须为**引用类型**   |

#### 注意

1. 单一类型指的是泛型，默认**向下兼容**。

   ```java
   // 数组类型是Number，但是可以放入Number及其子类型Integer、float和double
   Number numArray [] = {23, 0.1f, 0.2d};
   // ArrayList同理
   ```

2. Arrays.asList返回的是**静态List**，不能进行增加和删除操作，只能对元素值修改



### ArrayList和LinkedList区别

相同：都实现List接口

|                                    | ArrayList                              | LinkedList                                     |
| ---------------------------------- | -------------------------------------- | ---------------------------------------------- |
| 底层                               | 基于动态数组，地址连续                 | 基于**双向**链表，地址分散                     |
| 随机（下标）访问速度：`get(index)` | 快，get()瞬间获取                      | 慢。除了头和尾能瞬间获得，其余位置需要遍历链表 |
| 插入（指定位置）：`add(index, e)`  | 慢，因为数组要整体移动。若触发扩容更慢 | 快，且不会扩容，但要遍历链表                   |
| 插入（不指定位置，尾插）：`add(e)` | 快。若触发扩容慢                       | 快，且不会扩容                                 |

### HashMap

#### 1.存储结构

内部包含一个Entry类型数组，Entry 存储着键值对，包含四个字段

<img src="https://cs-notes-1256109796.cos.ap-guangzhou.myqcloud.com/image-20191208234948205.png" alt="img" style="zoom:50%;" />

#### 2.扩容

注意：这里的扩容指table扩容，而不是桶（因为桶是链表，没有上限）。

相关参数主要有4个：

- capacity：Entry数组长度，初始为16。
- size：键值对数量。
- loadFactor：加载因子，表示table数组填满的程度，取0~1之间的值，默认0.75
- Threshold = loadFactor * capacity：扩容临界值，当HashMap中的元素个数超过该值时，就会进行Entry数组扩容（capacity*2）

# 方法

# 代理

是一种常用的设计模式，其目的就是为其他对象提供一个代理以控制对某个对象的访问。代理类负责为委托类**预处理**、**后处理**等增强操作。

![img](D:\CS-Note\images\Java\Center.png)

## 动态代理

动态代理有以下特点:

代理对象不需要实现接口，利用反射，在运行时构建代理对象（需要指定创建的类和接口）

### 1、jdk动态代理



[TOC]



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