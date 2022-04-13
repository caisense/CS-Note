

# Java与JDK版本对应关系

从 Java1.0 到 Java9 ，每个Java版本对应一个JDK版本 ：JDK1.0、JDK1.2 ... JDK1.8、JDK1.9。

Java10以后，JDK版本号与Java版本号数字一致：JDK10、JDK11、JDK12。

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

![92a2d60aba1ca69c33ec051a89941c1a](./images/Java基础/92a2d60aba1ca69c33ec051a89941c1a.png)

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

String 类被声明为 final，因此它不可被继承。(Integer 等包装类也不能被继承）

String底层实现数组也被声明为 final，意味着数组初始化后地址不能改变，且内部不提供改变数组的方法，保证了**String不可变**。

#### 底层实现

在 jdk1.8 中，String 内部使用 **char 数组 **存储数据。

jdk1.9 起，String 类的实现改用 **byte 数组** 存储字符串，同时使用 `coder` 来标识使用了哪种编码。

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

#### String s = new String("abc") 会创建几个对象

- 若String Pool 中不存在 “abc” 字符串对象：创建两个对象

  “abc” 属于字符串字面量（或称字符串常量），因此编译时期会检查 String Pool（运行时常量池，在**方法区**） 中是否存在“abc”，若不存在就创建一个字符串对象，指向这个 “abc” 字符串字面量；

  而使用 new 的方式会在**堆**中创建一个字符串对象。

- 若存在：只创建一个new



#### String, StringBuffer and StringBuilder区别

|          | String           | StringBuffer                     | StringBuilder            |
| -------- | ---------------- | -------------------------------- | ------------------------ |
| 可变性   | 不可变           | 可变（操作不生成新对象）         | 可变（操作不生成新对象） |
| 线程安全 | 无（因为不可变） | 是（内部使用 synchronized 同步） | 否                       |
| 性能     | 无               | 低                               | 高                       |

所以在单线程环境下推荐使用 StringBuilder，多线程环境下推荐使用 StringBuffer。



#### jdk1.8 String + 操作自动转换为StringBuilder操作

- 如果是变量拼接

  ```java
  String c = "gc";
  c = c + "hc";
  // 第二行操作会由jvm转换为如下等价操作
  StringBuilder sbc1 = new StringBuilder();
  sbc1.append("gc");
  sbc1.append("hc");
  return sbc1.toString();
  ```

- 如果是常量拼接，则编译阶段直接优化

  ```java
  String s = "a" + "b" + "c";  // 编译器优化为s="abc"
  ```

如果string pool中存在字符串常量“abc”则不再新建对象。

### 包装类型

| 原始类型 | byte | short | char      | int     | long | float | double | boolean |
| -------- | ---- | ----- | --------- | ------- | ---- | ----- | ------ | ------- |
| 封装类   | Byte | Short | Character | Integer | Long | Float | Double | Boolean |

包装类**默认值**都为`null`

包装类提供了多种**静态方法**，主要是parsexxx（将string转为基本类型）和valueOf（将string或基本类型转为包装类）

#### parsexxx

是封装类型提供的将String转换为基本类型的api，常用一个参数（默认十进制），还支持第二个参数表示进制radix

注意String没有parse

| `api`                | 参数类型 | 返回类型 |
| -------------------- | -------- | -------- |
| `Integer.parseInt`   | `String` | `int`    |
| `Float.parseFloat`   | `String` | `float`  |
| `Double.parseDouble` | `String` | `double` |
| `Long.parseLong`     | `String` | `long`   |

#### valueOf

是封装类型提供的将String或基本类型转换为封装类型的api，常用一个参数（默认十进制），也支持第二个参数表示进制
String.valueOf 返回其他基本类型的String形式

| `api`             | 参数类型                  | 返回类型  |
| ----------------- | ------------------------- | --------- |
| `Integer.valueOf` | String、int               | `Integer` |
| `Float.valueOf`   | String 、float            | `Float`   |
| `Double.valueOf`  | String  、double          | `Double`  |
| `Long.valueOf`    | String  、long            | `Long`    |
| `String.valueOf`  | int,  float, double, long | `String`  |

### 自动装箱和拆箱

Java 1.5引入，目的是将原始类型值转自动地转换成对应的对象。该机制可以让我们在Java的变量赋值或方法调用等情况下，使用原始类型或者对象类型更加简单直接。

- 装箱：将初始类型的变量转换成封装类对象
- 拆箱：将封装类对象转换成初始类型

java中数字1，2，3,…,1000等，都是初始类型，只是平常使用时没有注意到，如创建一个Integer：

```java
Integer n1  = new Integer(1);  // 常规写法，创建对象  
Integer n2  = 1;   // 自动装箱，直接赋值  
```



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

    若封装类型未初始化或为null，则与原始类型比较，自动拆箱时调用obj.xxxValue()，会抛空指针异常
   
4. 不仅是==运算符，其他比较运算符<、>等同理。

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

**注意**：只有Integer的上限可以修改。

用jvm命令 `-XX:AutoBoxCacheMax=<high>` 设置，high应大于127，若小于等于127则上限不变。额
Long的范围无法设置

### 字符串常量池

字符串常量池（String Pool）保存着所有字符串字面量（literal strings），这些字面量在编译时期就确定。

**intern方法**

调用 intern() 方法时，如果 String Pool 中已经存在一个字符串和该字符串值相等（使用 equals() 方法判断），那么就会返回 String Pool 中字符串的引用；否则，就会在 String Pool 中添加一个新串

```java
String s1 = new String("aaa");
String s2 = new String("aaa");
System.out.println(s1 == s2);        // false
String s3 = s1.intern();
String s4 = s2.intern();
System.out.println(s3 == s4);        // true
String s5 = "bbb";
String s6 = "bbb";
System.out.println(s5 == s6);       // true
```



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

### 1.数组 `[]`

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

### 2.ArrayList

#### 扩容

使用 ensureCapacityInternal() 方法来保证容量足够，如果不够时，需要使用 grow() 扩容

新容量大小为1.5倍

### 数组与ArrayList区别

|          | 数组                            | ArrayList                        |
| -------- | ------------------------------- | -------------------------------- |
| 底层实现 | 继承Object，不属于集合          | 实现Collection接口，是集合的一种 |
| 长度     | .length属性获取，一旦创建不可变 | size()方法获取，可动态增减       |
| 元素类型 | 单一类型即可                    | 单一类型，且必须为**引用类型**   |

#### 单一类型默认向下兼容

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

### 3.HashMap

#### 1.存储结构

本质是一个链表数组table。

内部包含一个Entry类型数组，Entry 存储着键值对，包含四个字段，next字段表示 Entry 是一个链表。即数组中的每个位置被当成一个**桶**，一个桶存放一个链表。HashMap 使用拉链法来解决冲突，同一个链表中存放**hashCode 和 桶大小 取模运算结果**相同的 Entry。

<img src="images\Java基础\image-20191208234948205.png" alt="img" style="zoom:50%;" />

#### 2.put方法(1.7与1.8变化)

1. 根据key和哈希算法计算数组下标：**index = hashCode(Key) & (capacity - 1)**，相当于对hashCode取模：`hashCode % capacity`，前提是 capacity = 2 ^ n 。

    **使用&运算原因：位运算比取模更快**。

    **1.8中对hashCode计算还做了改进**

    <img src="D:\CS-Note\images\Java基础\45205ec2.png" alt="img" style="zoom:50%;" />

    优化了高位运算的算法：hash**无符号右移**16位后与自身异或，目的是当桶长度较小时，也能保证高低位的bit都参与到hash计算中，同时不会有太大开销。

2. 如果数组下标位置桶为空，则将key和value封装为Entry对象（1.7是Entry，1.8是Node），并放入该桶

3. 如果数组下标位置桶不为空，则分情况：

    - jdk1.7：先判断是否需要扩容

     若不用则生成Entry，并用头插法加入桶。
   
   - jdk1.8：先判断当前位置桶类型是红黑树还是链表
   
     - 若是红黑树Node，则封装节点并插入红黑树，判断红黑树是否存在当前key，存在则直接更新value
     - 若是链表Node，则封装节点并用尾插法，遍历链表过程中判断是否存在当前key，存在则直接更新value。插入后统计链表长度，**若>=8则转红黑树**
   
     - 插入之后再判断是否扩容
   

##### 链表转红黑树的阈值被设置为8的原因

1. 当选用的hash算法离散性很好时，数组中同一位置出现碰撞的概率很低，几乎不会出现达到阈值的情况；然而采用随机hash算法时，离散性可能会变差，理想情况下随机hash算法计算出的位置分布遵循**泊松分布**，根据概率统计，同一位置的元素达到8个概率只有大约1亿分之6，几乎是不可能事件。**若这种小概率事件都发生了，说明HashMap的元素个数相当多，有提高查找效率的必要。**
2. 另一种解释是链表查找的平均查找次数是n/2，而红黑树的平均查找次数是log(n)，8/2=4而log(8)=3，3<4因此有必要转换，但这种说法存在问题，如果是这个理由那应该选择在节点数达到5时就转换，5/2同样大于log(5)。

树退化的阈值被设为6而不是7，主要是为了避免频繁的树结构的转换，减少系统开销。

##### 使用红黑树的原因

首先二叉搜索树（BST）的查找肯定效率比链表高。

但BST有缺点，在元素插入时会导致树倾斜，插入顺序会影响树的高度，而树的高度直接影响了BST的查找效率，在极端情况下BST会退化成链表（所有节点都在一条斜线上）。

红黑树具有性质：任一节点到其子树中的每个叶子节点的路径都包含相同数量的黑色节点，可推导出从红黑树的根节点到叶子节点的最长可能路径不超过最短可能路径的两倍，即红黑树可以保持其大致是平衡的。因此红黑树可以保持**在最坏情况下都相对高效**。作为代价，红黑树的插入删除操作可能会引起树的旋转。

为什么不直接使用红黑树：

由于TreeNodes占用空间是普通Nodes的两倍（相较于链表结构，链表只有指向下一个节点的指针，二叉树则需要左右指针，分别指向左节点和右节点），因此使用红黑树取代链表需要以**额外的空间为代价**。只有当节点较多时，才有转换的必要。

#### 3.扩容

注意：这里的扩容指table扩容，而不是桶（因为桶是链表，没有上限）。

相关参数主要有3个：

- capacity：Entry数组长度，初始为16，且始终保持capacity = 2 ^ n。

- size：键值对数量。

- loadFactor：加载因子，表示table数组填满的程度，取0~1之间的值，默认0.75

扩容时机：由扩容临界值决定，Threshold = loadFactor * capacity。当HashMap中的元素个数超过该值时，就会进行Entry数组扩容（**翻倍**，capacity * 2）

**capacity = 2^n 的原因**

前面已经解释过，求元素放几号桶时用&运算代替取模，前提是要求capacity = 2^n 。

这是一种非常规的设计，常规设计是把桶大小设为**素数**（hashTable初始化桶大小就是11），相对来说素数的hash冲突概率小于合数



扩容操作：

1. 扩容：创建新的Entry空数组，长度是原数组2倍

2. ReHash：遍历原Entry数组，把所有Entry重写Hash到新数组

   需要reHash的原因：hashMap计算数组下标逻辑是`index = HashCode(Key) & (Length - 1)`，数组长度倍增后，需要重新计算下标

扩容结果：

jdk1.7：由于ReHash，可能导致原来在一个桶的结点分散到不同桶

jdk1.8：也是由于ReHash，可能导致原来的红黑树退化为链表，或链表进化为红黑树

![image-20220322102957906](images\Java基础\image-20220322102957906.png)

#### hashMap线程不安全分析

线程1和线程2分别将Entry1、Entry2插入同一个桶时，无论桶空还是非空，都会出现竞争问题。

由于jdk1.7使用头插法，扩容时还可能造成**循环链表**问题。假设有线程1和线程2，都尝试向HashMap中插入新的条目，并触发了HashMap的扩容，两个线程都新建了新的扩容数组nextTable。假设在原table某位置，存在一个链表，其顺序为A-->B-->C，线程1在执行到头节点A时就挂起了，但此时对线程1而言，A的next节点是B。在这同时线程2执行了完整的迁移操作，扩容后新的链表顺序为C-->B-->A。随后线程1恢复，但由于其挂起时，已经将当前位置指向了节点A，而next节点指向了B，此时就出现了loop，A-->B-->A

jdk1.8虽然用尾插法不会出现循环链表，但还是会有某个桶**覆盖问题**。例如线程1和2都争抢table位置A的空桶，线程1先插入，线程2认为此时A桶仍为空，覆盖了线程1插入的Entry

#### 为什么重写equals()方法一定要重写hashCode()方法

如果我们要使用自定义类的对象作为Entry的key，那么就有必要重写equals()方法，确定判断key相等的规则。

但重写equals()方法后又会产生新的问题，如果不重写Object的hashCode()，则默认基于内存地址计算hashcode，可能会出现两个key相等但hashcode不同的情况，这样即使两个Entry的key相等，却落入不同的桶。

因此重写hashCode应满足：

1. 如果两个对象**等价**（即用equals比较返回true），那么它们的hashCode值一定要相同；
2. 如果两个对象的hashCode相同，它们并不一定等价；

**hashCode和地址的关系**：地址相同，hashcode一定相等；hashcode相等，地址不一定相同。

### 4.ConcurrentHashMap

![image-20191209001038024](images\Java基础\image-20191209001038024.png)

和 HashMap 实现上类似，主要差别是 ConcurrentHashMap 使用**两级数组**：

第一级 Segment （分段锁）数组，segment个数就是并发度，表示同时支持几个线程并发，多线程同时操作不同的segment不冲突。

第二级：每个Segment维护着一个Entry数组（HashEntry链表)

ConcurrentHashMap 中的重要变量有：

- table：默认为null，**延迟初始化**，第一次插入操作时初始化，默认大小为**16**的数组，size总是2的幂次方，用来存储Node节点数据，扩容时大小总是2的幂次方；
- nextTable：默认为null，扩容时新生成的数组，其大小为原数组的两倍；
- Node：保存key，value及key的hash值的数据结构；
- sizeCtl：table数组的容量阈值，默认为0，用来控制table的初始化和扩容操作；
- ForwardingNode：一个特殊的Node节点，hash值为-1，其中存储nextTable的引用。只有table发生扩容的时候，ForwardingNode才会发挥作用，作为一个占位符放在table中表示当前节点为null或已经被移动。

ConcurrentHashMap 包含两个核心内部类：Segment 和 HashEntry



#### 初始化的线程安全

table初始化操作会延缓到第一次put操作。在ConcurrentHashMap在构造函数中只会初始化sizeCtl值，并不会直接初始化table，sizeCtl的默认初始值为0，若构造方法传入了自定义的initialCapacity值，那么sizeCtl的值默认为大于initialCapacity的最小的2的次幂。但是put操作是可以并发执行的，在put操作中进行了如下处理：

尝试执行put操作的线程会判断table是否已经被初始化，若table尚未被初始化，则尝试进行初始化操作。初始化方法中，线程会执行Unsafe.compareAndSwapInt方法修改sizeCtl为-1，并且只有一个线程可以执行成功，其余的线程如果进来发现sizeCtl=-1，那么就会执行Thread.yield()让出CPU时间片等待table初始化完成。

#### put操作的线程安全

执行put操作的线程在判断table已经初始化的前提下，还会对put操作的目标位置Node进行如下判断：

- 若目标位置的Node为null，则说明该位置第一次插入数据，利用Unsafe.compareAndSwapObject安全插入数据，两种可能结果：
  - CAS成功，则说明操作成功，退出；
  - CAS失败，则说明其他线程抢先一步插入了数据，进行自旋，再次尝试插入数据，后续逻辑与目标位置已存在数据的逻辑相同；
- 若目标位置的Node为ForwardingNode，表明有其他线程在进行扩容操作，当前线程会帮助扩容；
- 若目标位置已存在普通Node，则将新的Node节点按链表或红黑树的方式插入到合适的位置，这个过程采用Synchronized实现并发；

#### 数组扩容的线程安全

当table数组的元素个数达到容量阀值sizeCtl的时候，需要对table进行扩容，扩容氛围两个阶段：

- 构建一个新的nextTable，容量为原先table的两倍；

- 把原先table中的数据进行迁移；


第一步nextTable的构建只能单线程进行操作，同样是通过对sizeClt值进行CAS操作，确保只有一个线程能初始化nextTable成功。

第二步中的逻辑则类似put操作，对每个尝试复制数据的位置进行CAS操作，若失败则说明已有别的线程对该位置进行扩容，后续使用Synchronized锁进行并发的迁移操作。

#### jdk1.7和1.8变化

JDK 1.7 使用分段锁机制来实现并发更新操作，核心类为 Segment，它继承自重入锁 ReentrantLock充当锁。

JDK1.8 使用CAS 操作支持更高并发度，CAS失败时使用内置锁 synchronized。底层与HashMap相同，链表长度大于8时转红黑树

# 方法

# 面向对象

## Object

所有类的父类，本身再无父类。是java继承树的根。

通用方法

```java
public native int hashCode()

public boolean equals(Object obj)

protected native Object clone() throws CloneNotSupportedException

public String toString()

public final native Class<?> getClass()

protected void finalize() throws Throwable {}

public final native void notify()

public final native void notifyAll()

public final native void wait(long timeout) throws InterruptedException

public final void wait(long timeout, int nanos) throws InterruptedException

public final void wait() throws InterruptedException
```

### 等价与相等

- 对于基本类型，== 判断两个值是否相等，基本类型没有 equals() 方法。
- 对于引用类型，== 判断两个变量是否引用同一个对象（地址相同），而 equals() 判断引用的对象是否等价。

# JVM

意义：从软件层面屏蔽不同操作系统在底层硬件与指令上的区别。（一次编译，处处运行，而没有虚拟机的语言，如c++，在win和linux上执行要编译为不同的程序

## JVM模型

这段代码运行时的jvm模型如下图

```java
public class Math {
    public static final int initDate = 666;
    public User user = new User();

    public Math() {
    }

    public int compute() {
        int a = 1;
        int b = 2;
        int c = (a + b) * 3;
        return c;
    }

    public static void main(String[] args) {	// 主函数调用compute
        Math math = new Math();
        math.compute();
    }
}
```

![20200904134738400](images\Java基础\20200904134738400.png)

图中蓝色区域（栈、本地方法栈、程序计数器）是**线程私有**的。

例如，执行main方法的主线程会在内存中开启一片区域，存放其私有的程序计数器、虚拟机栈、本地方法栈等，如图左边所示，框住只是为了说明其逻辑上的关系，物理上并不在一起。

1. 虚拟机栈 VM Stack：又称栈 or 线程栈。创建一个线程就在虚拟机栈中分配一块私有的栈，每个线程中的方法**调用**又会在本栈中创建一个**栈帧**。存储局部变量、对象指针、操作栈、动态链接、方法出口。

   - 局部变量表： 存放着方法中的局部变量，包括基本类型和引用类型。在编译期间就已确定空间大小，运行期间大小不变。

   - 操作数栈：用来操作方法中的数的一个临时栈

   - 动态链接： 把符号引用（字面量，例如方法名）转换为直接引用（指针，指向真实地址）存在内存空间中

   - 方法出口：记录该方法调用完毕应该回到的地方 (放到我们这个例子中就是回到Main函数的下一行)

   栈由多个栈帧组成，栈帧具有栈数据结构FIFO的特性，栈顶存放**当前执行方法**的栈帧，下一层调用上一层。

   JVM为这个区域规定了两种异常状况：

   - StackOverflowError：线程请求的栈深度大于虚拟机所允许的深度时抛出；
   - OutOfMemoryError：虚拟机栈无法申请到足够的内存时抛出。

2. 本地方法栈Native Method Stack：为JVM使用的Native方法（C、C++代码）提供运行空间。功能上与虚拟机栈是类似。

   该区域JVM也规定了StackOverflowError和OutOfMemoryError异常。

3. 程序计数器 Program Counter Register：当前线程所执行的**字节码的行号**指示器，指向下一条要执行的命令。方法执行完返回时必须要用到。

   该区域没有规定任何异常。

图中黄色区域（堆、方法区）是**线程共享**的，虽然逻辑上分区，但物理上是**连续的区域**。

1. 堆 Heap：存储所有对象实例。JVM的垃圾回收主要发生在该区域。（与栈具有数据结构FIFO特性不同，jvm的堆和数据结构的堆没有关系）

   从结构上，堆被划分为新生代和老年代；而新生代又分为Eden区、To Survivor区、From Survivor区，大小比例为8:1:1。

   当堆中没有内存可供完成实例分配，且堆也无法再扩展时，将会抛出OutOfMemoryError异常。

2. 方法区 Method Area：存储类的静态信息（.class）、常量、静态变量（指针，指向堆）、即时编译器（JIT）编译产生的代码

   由于HotSpot虚拟机将GC算法拓展到了该区域，因此方法区有时也被称为**永久代**，1.8之后改称元空间metaspace。

   当方法区无法满足内存分配需求时，将抛出OutOfMemoryError异常。
   
   **运行时常量池**
   
   是方法区的一部分。Class 文件中的常量池（编译器生成的字面量和符号引用）会在类加载后被放入这个区域。
   
   除了在编译期生成的常量，还允许动态生成，例如 String 类的 intern()。

**直接内存**

JDK 1.4 中新引入了 NIO 类，它可以使用 Native 函数库直接分配**堆外内存**，然后通过 Java 堆里的 DirectByteBuffer 对象作为这块内存的引用进行操作。这样能在一些场景中显著提高性能，因为避免了在堆内存和堆外内存来回拷贝数据。

## JVM版本的更新

jdk1.7版本中，将字符串常量池从方法区移动到了堆中，避免方法区内存有限从而出现OOM错误。而jdk1.8版本则将方法区从运行时内存移动到了本地内存中，方法区不再与堆相连。

## Java内存模型

Java Memory Model（JMM）是一种规范，规定了以下两点：

1. 一个线程如何以及何时可以看到其他线程修改过后的共享变量的值（共享变量的可见性）；
2. 如何在需要的时候对共享变量进行同步。

**JMM定义了Java虚拟机（JVM）在计算机内存（RAM）中的工作方式。**

并发编程中的两个关键问题就是这两条标准的体现：**线程之间如何通信和线程之间如何同步**。

在命令式的编程中，线程之间的通信和同步机制有两种：**共享内存和消息传递**。

- 通信机制：

  在共享内存的并发模型里，线程之间共享程序的公共状态，线程之间通过读-写内存中的公共状态来隐式进行通信。典型的共享内存通信方式就是通过**共享对象**进行通信。

  在消息传递的并发模型里，线程之间没有公共状态，线程之间必须通过明确的发送消息来显示进行通信，在Java中典型的消息传递方式就是` wait() `和` notify() `。

- 同步机制：

  同步是指程序用于控制不同线程之间操作发生相对顺序的机制。

  在共享内存的并发模型里，同步是显示进行的，必须显示指定某个方法或某段代码需要在线程之间互斥进行。

  在消息传递的并发模型里，由于消息的发送必须在消息的接受之前，因此同步是隐式进行的。

Java的并发采用的是共享内存模型，Java线程之间的通信总是隐式进行的。

在JMM中，线程之间的共享变量存储在主内存（main memory）中，每个线程都有一个私有的本地内存（local memory），本地内存中存储了共享变量的副本。本地内存是JMM中的抽象概念，并不真实存在。

## Java类加载机制

### 什么是类加载

类是在运行期间第一次使用时动态加载的，而不是一次性加载所有类。

JVM将类的`.class `文件中的二进制数据读入到内存中，将其放在方法区内，然后在堆区创建一个 `java.lang.Class`对象。 `Class`对象封装了类在方法区内的数据结构，并提供访问方法区内的数据结构的接口。

### 类加载的时机

类加载的时机：JVM规范允许类加载器在预料某个类将要被使用时就预先加载它，不需要等到某个类被“首次主动使用”时再加载。如果在预先加载的过程中遇到了` .class `文件缺失或存在错误，类加载器必须在程序首次主动使用该类时才报告错误（LinkageError错误）如果这个类一直没有被程序主动使用，那么类加载器就不会报告错误。

### 类加载的过程

类加载包括3个阶段：加载（Load）、链接（Link）、初始化（Init），其中**链接**又分为3个具体步骤（验证、准备、解析）。

1. 加载

    查找并加载类的二进制数据。

    - 通过一个类的全限定名来获取其定义的二进制字节流。
    - 将这个字节流所代表的静态存储结构转化为方法区的运行时数据结构。
    - 在Java堆中生成一个代表这个类的 `java.lang.Class`对象，作为对方法区中这些数据的访问入口。

    可以使用系统提供的类加载器或自定义自己的类加载器来完成加载。

2. 验证

    确保被加载的类的正确性，确保` .Class `文件的字节流中包含的信息符合当前虚拟机的要求，并且不会危害虚拟机自身的安全。

    - 文件格式验证：验证字节流是否符合Class文件格式的规范；
    - 元数据验证：对字节码描述的信息进行语义分析以保证其描述的信息符合Java语言规范的要求；
    - 字节码验证：通过数据流和控制流分析，确定程序语义是合法的、符合逻辑的；
    - 符号引用验证：确保解析动作能正确执行。

    验证阶段非常重要但不是必须的，它对程序运行期没有影响。如果所引用的类经过反复验证，可以考虑采用 `-Xverifynone`参数来关闭大部分的类验证措施，以缩短虚拟机类加载的时间。

3. 准备

    为类的静态变量（static）分配内存，并将其初始化为**默认值**。这些内存都在**方法区**中分配。

    - 该阶段进行内存分配的仅包括static变量，不包括实例变量，实例变量会在对象实例化时随着对象分配在Java堆中；

    - 如果只是静态变量static，则初始化为默认值（int是0），而不是代码中的显式赋值；

      ```java
      public static int value = 123;
      ```

    - 如果是常量（final），那就会被初始化为指定的值。

      ```java
      public static final int value = 123;
      ```

4. 解析

    把类中的符号引用转换为直接引用。

    符号引用就是一组符号来描述目标，可以是任何字面量。

    直接引用就是直接指向目标的指针、相对偏移量或一个间接定位到目标的句柄。

5. 初始化

   为类的静态变量赋予正确的初始值。步骤如下：
   
   - 假如该类还没有被加载和链接，则程序先加载并连接该类；
   
   - 假如该类的直接父类还没有被初始化，则先初始化其直接父类；
   
   - 假如类中有初始化语句，则系统依次执行这些初始化语句。
   

### 类初始化的时机

1. 主动引用

    jvm规范并未强制要求何时加载，但规定了只有当对类进行**主动引用**时必须对类初始化。类的主动引用包括六种情况：

    - 创建类的实例（new）；
    - 访问某个类或接口的静态变量，或者对该静态变量赋值；
    - 调用类的静态方法；
    - 反射：使用 java.lang.reflect 包的方法对类进行反射调用
    - 初始化某个类，则其父类也会被初始化；
    - Java虚拟机启动时被标明为启动类的类（ `JavaTest`），直接使用 `java.exe`命令来运行某个主类。

2. 被动引用

    除主动引用的场景外，其余均为被动引用，不会触发初始化。被动引用主要有三种情况

    - 通过子类引用父类的静态字段，不会导致子类初始化。

    ```java
    System.out.println(SubClass.value);  // value 字段在 SuperClass 中定义
    ```

    - 通过**数组**定义来引用类，不会触发此类的初始化。

      该过程会对数组类进行初始化，**数组类**是一个由虚拟机自动生成的、直接继承自 Object 的子类，其中包含了数组的属性和方法。

    ```java
    SuperClass[] sca = new SuperClass[10];
    ```

    - **常量**在编译阶段会存入调用类的常量池中，本质上并没有直接引用到定义常量的类，因此不会触发定义常量的类的初始化。

    ```java
    System.out.println(ConstClass.HELLOWORLD);
    ```

### 类与类加载器

两个类相等，需要类本身相等，并且使用**同一个类加载器**进行加载。这是因为每一个类加载器都拥有一个独立的类名称空间。

这里的相等，包括类的 Class 对象的

-  equals() 方法
- isAssignableFrom() 方法
- isInstance() 方法
-  instanceof 关键字

的返回结果为 true

### 类加载器

类加载器包括：

- Bootstrap ClassLoader 启动类加载器
- ExtClassLoader 扩展类加载器
- AppClassLoader 应用类加载器
- User ClassLoader 自定义类加载器

从JVM的角度而言，类加载器只分为两种：启动类加载器和其他类加载器。启动类加载器由C++实现，是JVM的一部分（Hotspot虚拟机），其他所有类加载器都由Java实现，独立于虚拟机之外，继承自抽象类` java.lang.ClassLoader `，需要由启动类加载器加载到内存后才能去加载其他类。

具体地：

启动类加载器负责加载存放在 `\jre\lib`下的类库（如所有的java.开头的类）。启动类加载器无法被Java程序直接引用。

扩展类加载器负责加载 `\jre\lib\ext`目录中的所有类库（如javax.开头的类）。开发者可以直接使用扩展类加载器。

应用程序类加载器负责加载用户类路径（ClassPath）所指定的类，开发者可以直接使用该类加载器。如果应用程序中没有自定义类加载器，一般情况下这就是程序中默认的类加载器。

#### JVM类加载机制

- **全盘负责**，当一个类加载器负责加载某个Class时，该Class所依赖的和引用的其他Class也将由该类加载器负责载入，除非显示使用另外一个类加载器来载入；
- **父类委托**，先让父类加载器试图加载该类，只有在父类加载器无法加载该类时才尝试从自己的类路径中加载该类；
- **缓存机制**，缓存机制保证所有加载过的Class都会被缓存，当程序中需要使用某个Class时，类加载器先从缓存区寻找该Class，只有缓存区不存在，系统才会读取该类对应的二进制数据，并将其转换成Class对象，存入缓存区。当修改了Class后，必须重启JVM，程序的修改才会生效。

#### 类加载的方式

- 启动应用时候由JVM初始化加载
- 通过Class.forName()方法动态加载
- 通过ClassLoader.loadClass()方法动态加载

#### Class.forName()和ClassLoader.loadClass()的区别？

- `Class.forName()`除了将类的.class文件加载到jvm中之外，还会对类进行解释，执行类中的static块；
- `ClassLoader.loadClass()`只将.class文件加载到jvm中，不会执行static中的内容，只有在newInstance()创建实例时才会去执行static块。
- `Class.forName(name,initialize,loader)`通过传入参数也可控制是否加载static块。

#### 双亲委派机制

如果一个类加载器收到了类加载的请求，它首先不会自己去尝试加载这个类，而是**把请求委托给父加载器**去完成，依次向上，因此，所有的类加载请求最终都应该被传递到顶层的启动类加载器中，只有当父加载器在它的搜索范围中没有找到所需的类时，即无法完成该加载时，子加载器才会尝试自己去加载该类。

**双亲委派模型（Parents Delegation Model）**

该模型要求除了顶层的启动类加载器外，其它的类加载器都要有自己的父类加载器。这里的父子关系一般通过**组合**关系（Composition）来实现，而不是继承关系（Inheritance）。

<img src="D:\CS-Note\images\Java基础\0dd2d40a-5b2b-4d45-b176-e75a4cd4bdbf.png" alt="img" style="zoom:50%;" />

双亲委派机制意义：

- 防止内存中出现多份同样的字节码；
- 保证Java程序安全稳定运行。如，即使重写` java.lang.System `类，在类加载的过程中，启动类加载器还是会加载Java提供的System类，避免System类遭到恶意修改。

#### Java反射

通常情况下，Java中使用某个类时，需要先知道它是什么类，对外暴露了哪些方法，然后创建类的实例，之后通过类的对象进行操作。

所谓反射就是并不知道要初始化的类是什么，而是通过类的全限定名，调用class.forName()方法获取类，然后再通过类对象的getMethod()方法获取要调用的方法的对象，再通过类的getConstructor()方法获取类的构造器，最后通过Constructor的getInstance()方法创建类的实例，并通过方法对象的invoke()方法调用真正想要使用的方法。

总之，反射就是在**运行时**才知道要操作的类是什么，并且可以在运行时获取类的完整构造，并调用对应的方法。

Java反射的基本流程大致如下：

```java
Class clz = Class.forName("com.xxx.xxx");
Method method = clz.getMethod("methodName", int.class);
Constructor constructor = clz.getConstructor();
Object object = constructor.newInstance();
method.invoke(object, 1);
```

#### 静态代码块、构造代码块、构造函数以及Java类初始化顺序？

执行顺序：**静态块——main()——构造块——构造方法**。

1. 静态代码块：类中以static开头的`{}`代码块

   - 类加载阶段执行，因此**只执行一次**，且在main函数之前

   - 一个类中可以有多个静态代码块，jvm将其拼接后一次执行

   - 无法访问非静态变量（因为此时尚未创建）

   - 静态块中的变量，外部无法访问（局部）

     ```java
     public class Test{
         static int cnt = 6;
         int a = 1;
         // 1. 静态块1，先于主函数执行
         static {
             cnt += 9;
             a += 1;  // 报错，a是非静态变量
             int b = 1;
         }
         // 3. 最后执行
         public static void main(String[] args) {
             System.out.println(cnt);
         }
         // 2. 静态块2，先于主函数执行，但在静态块1之后
         static {
            cnt /= 3;
            b += 1; // 报错，b是上一个静态块的局部变量
         }
     }  // 最终输出：5
     ```

     

2. 构造代码块：类中的花括号`{}`代码块

   对象创建时调用，即new时，因此可能多次执行（静态块只一次）

   可以访问静态变量和非静态变量

   构造块中 的变量，外部也无法访问（局部）

   

   ```java
   public class HelloA {
       public HelloA(){	//构造函数
           System.out.println("A的构造函数");
       }
       {	//构造代码块
           System.out.println("A的构造代码块");
       }
       static {	//静态代码块
           System.out.println("A的静态代码块");
       }
   }
   public class HelloB extends HelloA{
       public HelloB(){  //构造函数
           System.out.println("B的构造函数");
       }
       {  //构造代码块
           System.out.println("B的构造代码块");
       }
       static {  //静态代码块
           System.out.println("B的静态代码块");
       }
       public static void main(String[] args) {
           HelloB b = new HelloB();
       }
   }
   // 输出：
   A的静态代码块
   B的静态代码块
   A的构造代码块
   A的构造函数
   B的构造代码块
   B的构造函数
   ```

   

## 垃圾回收（GC）

就是将没有引用的对象回收，主要是针对堆和方法区进行。

程序计数器、虚拟机栈和本地方法栈这三个区域属于线程私有的，只存在于线程的生命周期内，线程结束之后就会消失，因此不需要回收。

![image-20220324020703131](images\Java基础\image-20220324020703131.png)

新生代与老年代是1：3；

新生代包括eden区、s0和s1（Survivor缩写），大小比例是8：1：1。

### Minor GC 和 Full GC

HotSpot虚拟机中的GC可分为两种：Partial GC和Full GC。

- YGC（Young GC，或minor GC）：对新生代堆gc，在eden区（也包含某个s0/s1）满时发生。使用**拷贝算法**，频率较高，性能耗费小

- FGC（Full GC，或Major GC）：全堆（新生代+老年代）范围gc，在老年代满时发生。使用**标记压缩**算法，比YGC慢。需要两类垃圾收集器结合使用。

  FGC触发时机：

  1. 手动调用System.gc
  2. 在Minor GC之后，若JVM判断老年代的连续内存空间已少于先前每次Minor GC结束后晋升至老年代的对象总大小的平均值，则JVM会进行Full GC（具体的判断逻辑随着收集器不同有所区别）；
  3. 方法区（永久代）的空间不足时。

  

### 堆对象生命周期

1. 新建对象，默认先放入eden区，此时年龄为0。

   - eden区放满，触发YGC，还存活的对象放入s0，且年龄+1。

   - eden区放不下（大对象，如长字符串或数组），直接放老年代。

     `-XX:PretenureSizeThreshold`，大于此值的对象直接放老年代

3. 下一次YGC，扫描并回收eden + s0，还存活的对象放s1，且年龄+1

   也就是每次YGC，存活的交替放入s0或s1

3. 当**年龄足够**时（一般15，CMS是6），放入老年代

   若YGC的存活对象s区装不下，不管年龄多少，**多余的**直接放入老年代。见下文年龄动态判断

   -XX:MaxTenuringThreshold 用来定义年龄的阈值

4. 当老年代放满，触发FGC

#### 对象年龄动态判断机制

当单个 Survivor 区占用超过 50% (`-XX:TargetSurvivorRatio`)，则年龄最老的，即使没到15，也直接放入老年代。例如50%的对象最大年龄为8，则年龄>8的放入老年代。



#### JVM如何判断对象存活？

1. 引用计数法

   为每个对象设置一个引用计数器，每当有引用时，计数器+1，引用失效时计数器-1。当对象引用为0时，判断对象失效。

   优点：实现简单，效率高；缺点：难以解决垃圾对象间循环引用，但实际上已经无法寻址的情况。

2. 根可达分析法

   从**GC Roots**出发，与之直接或间接关联的对象就是有效对象，反之就是无效对象。

   可作为GC Roots的对象包括：

   - 虚拟机栈中引用的对象（局部变量）
   - 方法区中类静态属性引用的对象（静态变量）
   - 方法区中常量引用的对象（常量）
   - 本地方法栈中JNI引用的对象（JNI指针）

#### Minor GC如何避免全堆扫描

由于**老年代的对象可能引用新生代的对象**，在标记存活对象的时候，需要扫描老年代的对象，如果该对象拥有对新生代对象的引用，那么这个引用也会被作为 GC Roots。这相当于就做了**全堆扫描**。

HotSpot虚拟机通过**卡表**技术避免Minor GC触发全堆扫描。具体策略是将老年代的空间分成大小为 512B的若干张卡，并且维护一个卡表。卡表本身是字节数组，数组中的每个元素对应着一张卡，本质上就是维护一个标识位，这个标识位代表对应的卡是否可能存有指向新生代对象的引用，如果可能存在，那么这张卡就是所谓的**脏卡**。

在进行Minor GC的时候，只需要在卡表中寻找脏卡，并将脏卡中的老年代指向新生代的引用加入到GC Roots中，当完成所有脏卡的扫描之后，将所有脏卡的标识位清零。

#### Java中引用的类型

JDK1.2之后，Java中存在4种引用类型，从强到弱包括：强、软、弱、虚

- 强引用 Strong Reference

  Java中的**默认引用**声明就是强引用，如new instance语句和显式赋值语句等。只要强引用存在，垃圾回收器永远不会回收被引用的对象，即使内存不足时，JVM也会直接抛出OutOfMemoryError，而不会回收对象。

  将引用赋值为null，则中断强引用。

- 软引用 Soft Reference

  用于描述一些非必需但有用的对象，可通过` java.lang.ref.SoftReference `来使用软引用，如：

  ```java
  SoftReference<Object> obj = new SoftReference<>();
  ```

  在内存足够的时候，软引用对象不会被回收；内存不足时，JVM则会回收软引用对象。如果回收了软引用对象之后仍然没有足够的内存，JVM才会抛出OutOfMemoryError。

  软引用的特性可以很好地解决OOM问题，适用于很多缓存场景，如网页缓存、图片缓存等。

- 弱引用 Weak Reference

  弱引用的强度比软引用要更弱，无论内存是否足够，只要 JVM 开始进行垃圾回收，那被弱引用关联的对象都会被回收。可通过` java.lang.ref.WeakReference ` 来使用弱引用，如：

  ```java
  WeakReference<Object> obj = new WeakReference<>();
  ```

- 虚引用 Phantom Reference

  最弱的引用类型，如果一个对象仅持有虚引用，那么它等同于没有持有任何引用。

  ```java
  PhantomReference<Object> obj = new PhantomReference<>();
  ```

  无法通过虚引用获得对象。虚引用必须与**引用队列**配合使用。虚引用的实际应用场景为当对象被回收时，收到系统通知。

  > **引用队列**
  >
  > 可以与软引用、弱引用以及虚引用一起配合使用，当垃圾回收器准备回收一个对象时，如果发现它还有引用，那么就会在回收对象之前，把这个引用加入到与之关联的引用队列中去。程序可以通过判断引用队列中是否已经加入了引用，来判断被引用的对象是否将要被垃圾回收，这样就可以在对象被回收之前采取一些必要的措施。  

#### 被标记为失效的对象是否一定会被回收？

被标记为失效的对象被回收前会经历如下步骤：

1. JVM判断对象是否重写了finalize()方法：

   - 若重写了finalize()，则将其放入F-Queue队列中；
   - 若未重写，则直接回收。

2. 执行队列中的finalize()方法：

   JVM自动创建一个优先级较低的线程执行队列中的finalize()方法，只负责触发，不保证执行完毕。若finalize()方法执行了耗时操作，则JVM会停止执行方法并立刻回收对象。

3. 对象销毁/重生：

   若finalize()方法中将this赋值给了某个引用，则该对象会重生，否则会被回收。

#### 为什么年龄达15时放入老年代？

因为对象markword中的分代年龄用4bit表示，最大15

对象内存布局

<img src="images\Java基础\未命名图片-16485691371701.png" alt="未命名图片" style="zoom:50%;" />

markword结构（64位系统中是8B=64bit）

![20180322153316377](images\Java基础\20180322153316377.jpg)

### 主流垃圾收集器

![微信截图_20220324211950](images\Java基础\微信截图_20220324211950.png)

实线连接表示配合使用

发展路线：内存越来越大，**STW**（stop the world，停止所有用户线程）时间越来越短。从分代到不分代。

|                   | 管理内存 | STW时间 |
| ----------------- | -------- | ------- |
| Serial            | 几十M    |         |
| Parallel Scavenge | 几个G    |         |
| CMS               | 几十G    | 200ms   |
| G1                | 上百G    | 10ms    |
| ZGC               | 4TB      | 1ms     |



#### 为什么要STW机制？

如果不暂停线程，让其继续执行，会破坏GC Root的依赖关系，导致某些对象被回收，增加gc的复杂性

#### 垃圾回收算法

1. 标记清除：缺点是不连续。只有CMS使用

   <img src="D:\CS-Note\images\Java基础\005b481b-502b-4e3f-985d-d043c2b330aa.png" alt="img" style="zoom:50%;" />

2. 拷贝算法：优点是无碎片，缺点是浪费空间

   <img src="D:\CS-Note\images\Java基础\b2b77b9e-958c-4016-8ae5-9c6edd83871e.png" alt="img" style="zoom:50%;" />

3. 标记整理（标记压缩）：优点是无碎片，缺点是时间长

   <img src="D:\CS-Note\images\Java基础\ccd773a5-ad38-4022-895c-7ac318f31437.png" alt="img" style="zoom:50%;" />
   
   回收器主要使用2和3

#### 年轻代垃圾收集器

1. Serial 串行垃圾回收器：串行回收，STW

   <img src="images\Java基础\image-20220325014554879.png" alt="image-20220325014554879" style="zoom:50%;" />

2. ParNew 并行垃圾回收器：可以理解为Serial回收器的多线程版，STW时多个线程并行回收。

   默认开启的线程数与CPU数量相同，在CPU核数很多的机器上，可以通过参数`-XX:ParallelGCThreads`来设置线程

   <img src="images\Java基础\image-20220325014725018.png" alt="image-20220325014725018" style="zoom:50%;" />

3. Parallel Scavenge（ParallelGC）

#### 老年代垃圾收集器

1. SerialOld：可理解为Serial回收器的老年代版本，同样是一个单线程回收器，使用的是**标记整理**算法。其作用主要有：

   - 在JDK1.5及之前的版本中与Parallel Scavenge收集器搭配使用；
   - 作为CMS收集器的后备预案，如果CMS出现Concurrent Mode Failure，则SerialOld将作为后备收集器进行垃圾回收；
   - JVM使用的实际上是基于SerialOld改进的PS MarkSweep收集器。

2. ParallelOld：类似新生代的Parallel Scavenge，也是一种多线程的回收器，关注的重点同样在于吞吐量。使用了标记-整理算法进行垃圾回收。

3. CMS：

   CMS即Concurrent Mark Sweep，并发标记清除，使用的是**标记清除**算法，主要关注系统停顿时间。

   共有四个阶段：

   初始标记：STW，但是非常短

   并发标记：用户线程与gc线程**并发执行**（最耗时，因此才用并发，不会产生长时间STW）

   重新标记：STW，因为上一个阶段可能会存在标记失误（从线程角度理解），需要再次标记保证正确性  

   并发清理：一次性完成回收
   
   <img src="images\Java基础\未命名图片.png" alt="未命名图片" style="zoom:50%;" />



#### 不分代垃圾收集器

1. G1（Garbage First，垃圾优先）：也有STW。逻辑分代，但物理不分代

   三色标记 + SATB

2. ZGC：oracle官方，java11引入，逻辑和物理都不分代

   颜色指针 + 读屏障

3. Shenandoah ：redhat开发，和ZGC差不多

4. Epsilon：啥也不干（调试用，或确认不用GC的场景）

### JVM默认回收器

- 1.7和1.8：PS+PO （Parallel Scavenge + ParallelOld）
- 1.9：G1

### 调优

减少FGC（实际上是减少STW）

## JVM命令

- 标准：-开头，所有Hotspot都支持

- 非标准：-X开头，特定版本hotspot支持特定命令

- 不稳定：-XX开头，下个版本可能取消

  -XX: +PrintCommandLineFlags 打印命令行参数值

#### 线上JVM启动参数

```shell
/usr/java/default/jre/bin/java -server -Xmx4g -Xms4g -Xmn2g -Xss256K -XX:SurvivorRatio=8 -XX:MetaspaceSize=512m -Xnoclassgc -XX:MaxTenuringThreshold=7 -XX:GCTimeRatio=19 -XX:+DisableExplicitGC -XX:+UseParNewGC -XX:+UseConcMarkSweepGC -XX:+UseCMSCompactAtFullCollection -XX:CMSFullGCsBeforeCompaction=0 -XX:+CMSParallelRemarkEnabled -XX:+CMSClassUnloadingEnabled -XX:+UseCMSInitiatingOccupancyOnly -XX:CMSInitiatingOccupancyFraction=70 -XX:SoftRefLRUPolicyMSPerMB=0 -XX:+UseFastAccessorMethods -XX:+UseCompressedOops -XX:+PrintGCDetails -XX:+PrintGCDateStamps -XX:+PrintGCTimeStamps -Xloggc:/data/logs/xxx/debug/gc.20210331_082950.log -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/data/logs/xxx/debug/xxx.20210331_082950.dump -Dfile.encoding=UTF-8 -Djava.awt.headless=true -Djetty.logging.dir=/data/logs/xxx -Djava.io.tmp=/tmp -jar xxx.jar --spring.profiles.active=prod
```

\####

```shell
-server 服务器模式
-Xmx4g 最大堆内存4g
-Xms4g 初始堆内存4g
-Xmn2g 新生代内存大小
-Xss256K 线程栈大小
-XX:SurvivorRatio=8 eden与survivor比例
-XX:MetaspaceSize=512m 元空间大小
-XX:MaxTenuringThreshold=7 该参数主要是控制新生代需要经历多少次GC晋升到老年代中的最大阈值。
-XX:GCTimeRatio=19 吞吐量 垃圾收集时间为1/(1+19),默认值为99，即1%时间用于垃圾收集。
-XX:+UseParNewGC 使用ParNew收集器
-XX:+CMSParallelRemarkEnabled 开启并发标记
-XX:+UseConcMarkSweepGC 使用CMS收集器
-XX:+UseCMSCompactAtFullCollection 和-XX:CMSFullGCsBeforeCompaction=0配合使用 意思就是GC之后对堆内存进行压缩整理
-XX:CMSFullGCsBeforeCompaction=0 
-XX:+UseCompressedOops 开启对象压缩
-XX:+PrintGCDetails 打印gc详情
-XX:+HeapDumpOnOutOfMemoryError OOM时生成dump文件
-XX:HeapDumpPath=/data/logs/xxx/debug/xxx.20210331_082950.dump dump存放路径
```

# 代理

是一种常用的设计模式，其目的就是为其他对象提供一个代理以控制对某个对象的访问。代理类负责为委托类**预处理**、**后处理**等增强操作。

<img src="images\Java基础\Center.png" alt="img" style="zoom:50%;" />

## 动态代理

动态代理有以下特点:

代理对象不需要实现接口，利用反射，在运行时构建代理对象（需要指定创建的类和接口）

### 1、jdk动态代理

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