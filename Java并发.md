# 多线程

## 创建线程

实例化一个Thread实例，然后调用它的start()方法。但是这个线程启动后实际上什么也不做就立刻结束了。我们希望新线程能执行指定的代码，都需要重写run方法，有三种方法：



1. 继承Thread类

   定义一个类继承Thread，重写其run()方法（因为Thread类实现了Runnable），然后new一个该类实例：

   ```java
   public class Main {
       public static void main(String[] args) {
           Thread t = new MyThread();
           t.start();  // 启动新线程
       }
   }
   
   class MyThread extends Thread {
       @Override
       public void run() {
           System.out.println("start new thread!");
       }
   }
   ```

 

2. 实现Runnable接口

   创建Thread时，传入一个Runnable接口**实例**，接口实例中重写run方法

   ```java
   public class Main {
       public static void main(String[] args) {
           Thread t = new Thread(new MyRunnable());
           t.start();  // 启动新线程
       }
   }
   
   class MyRunnable implements Runnable {
       @Override
       public void run() {
           System.out.println("start new thread!");
       }
   }
   ```

   

3. 实现Callable接口

   通过Runnable接口定义任务执行的内容并开启线程的方式无法得到返回值，也无法让执行端捕获到异常。可通过Callable接口，使任务在完成后返回指定类型的值或抛出异常。

   由于Callable任务是异步执行的，且不能明确是得到了返回值还是捕获了异常，因此需要对其进一步封装，即Future接口。

   FutureTask实现了RunnableFuture接口，表示FutureTask本质上也是表征了一个任务。可以传入Runnable（无返回值）或Callable（有返回）

   - 创建FutureTask时传入Callable实例，再创建Thread传入FutureTask实例
   
     ```java
     public class MyCallable implements Callable<Integer> {
             public Integer call() {
                 return 123;
             }
         }
         public static void main(String[] args) throws ExecutionException, InterruptedException {
             MyCallable mc = new MyCallable();
             FutureTask<Integer> ft = new FutureTask<>(mc);
             Thread thread = new Thread(ft);
             thread.start();
             System.out.println(ft.get());
         }
     ```
   
   - Future + Callable + ThreadPool
   
     在任务的执行处接收Future，通过Future来获取结果：
   
     ```java
     //进行异步任务列表
     public static List<FutureTask<NaResult<MsgResult>>> futureTasks = new ArrayList<>();
     //常驻内存线程池 初始化3个线程 和JDBC连接池是一个意思 实现重用
     public static ExecutorService executorService = Executors.newFixedThreadPool(3);
     // 异步并行任务
     for (QrySimCardCond condBean : condBeanList) {
         Callable callable = () -> {
             // 处理逻辑略
             return simCard;
         };
         FutureTask<SimCard> futureTask = new FutureTask<>(callable);
         futureTasks.add(futureTask);	// 将futureTask加入任务队列
         executorService.submit(futureTask);		// 将futureTask提交到线程池执行
     }
     ```

## 

**三种方法区别**

- 方法一 extends Thread    单继承
- 方法二 implements Runnable  多实现 重写run方法，没有返回值
- 方法三 implements Callable 多实现 重写call方法，**有返回值**（通过 FutureTask 封装，用get取）



### 线程的优先级

```java
Thread.setPriority(int n) //  1~10, 默认值5 
```

优先级高的线程被操作系统调度的优先级较高，操作系统对高优先级线程可能调度更频繁

但不能保证高优先级的线程一定会先执行，低优先级也不一定后执行。

## 线程的生命周期

Java中线程的状态有以下几种：

1. NEW ：新建。

   新创建的线程对象（下文统称“线程”），但还没有调用start()方法；

2. RUNNABLE：可运行。

   就绪（ready）和运行中（running）两种状态统称为“运行态RUNNABLE”。线程对象创建后，其他线程(比如main线程）调用了该线程的start()方法，线程进入运行态。

   该状态的线程位于可运行线程池中，等待被线程调度选中，获取CPU的使用权，此时处于就绪状态（ready）。

   就绪状态的线程在获得CPU时间片后变为运行中状态（running）；

3. BLOCKED：阻塞状态。

   表示线程阻塞在进入synchronized关键字修饰的方法或代码块（获取锁）时的状态。

4. WAITING：无限期等待状态。

   进入该状态的线程不会被分配CPU时间片，需要等待其他线程**显式唤醒**（通知或中断）；

5. TIMED_WAITING：限期等待。

   进入该状态的线程不会被分配CPU时间片，但不同于WAITING，线程可以在**指定的时间后自动唤醒**；

6. TERMINATED：终止。

   - 该线程已经执行完毕（当线程的run()方法return，或者主线程的main()方法return），则线程终止。

   - 若抛出异常未捕获，也导致线程终止。

   调用一个终止状态的线程会报出java.lang.IllegalThreadStateException异常。

   调用线程`stop`方法，可以强制终止（**强烈不推荐**）。

## 线程方法

1. `Thread.start()`

   启动线程

2. `Thread.sleep(long millis)`

   当前线程放弃获取的CPU时间片，进入TIMED_WAITING状态，**但不释放对象锁**，millis毫秒后线程自动苏醒进入就绪状态。

   作用：给其它线程执行机会。

   

3. `Thread.yield()`

   由**当前线程**调用此方法，当前线程放弃获取的CPU时间片，**但不释放锁资源**，由运行状态变为**就绪状态**，让OS再次选择线程。 作用：让相同优先级的线程轮流执行，但并不保证一定会轮流执行。实际中无法保证yield()达到让步目的，因为让步的线程还有可能被线程调度程序再次选中。Thread.yield()**不会导致阻塞**。该方法与sleep()类似，只是不能由用户指定暂停多长时间。

   

4. `thread.join()/thread.join(long millis)`

   在当前线程里调用其它线程T的join方法，会等待T执行结束。

   当前线程进入**WAITING/TIMED_WAITING**状态，且**不会释放对象锁**。

   **线程T执行完毕，或millis时间到，当前线程一般情况下进入RUNNABLE状态，也有可能进入BLOCKED状态（因为join是基于wait实现的）。**

   要保证n个线程按顺序执行，可以在主线程中依次调用它们的join()方法，如：

   ```java
   ...
   Thread A = new Thread(...);
   Thread B = new Thread(...);
   Thread C = new Thread(...);
   
   A.start();
   A.join();
   
   B.start();
   B.join();
   
   C.start();
   C.join();
   ...
   ```

   

4. `Object.wait()/wait(long timeout)`

   必须在synchronized块或方法中使用

   当前线程调用对象的wait()方法，当前线程**释放对象锁**并进入WAITING/TIMED_WAITING状态，**当前线程**进入等待队列。依靠**同一个被锁的对象**调用notify() / notifyAll()唤醒，或timeout时间到自动唤醒。

5. `Object.notify()/notifyAll()`

   也必须在synchronized块或方法中使用

   随机唤醒一个(notify)或所有(notifyAll)正在this锁等待的线程（就是在下文例1中getTask()中位于this.wait()的线程），从而使得等待线程从this.wait()方法返回。让等待的线程被重新唤醒
   **注意**

   wait和notify必须对同一个对象使用才有效

  例1

  ```java
  class TaskQueue {
      Queue<String> queue = new LinkedList<>();
      public synchronized void addTask(String s) {
         this.queue.add(s);
         this.notify(); // 唤醒在this锁等待的线程
      }
      public synchronized String getTask() {
          while (queue.isEmpty()) {
  	    	// 释放this锁:
     			this.wait();
          	// 重新获取this锁
          }
          return queue.remove();
      }
  }
  ```

  完整例子：例2

  ```java
  public class ThreadWait {
      public static void main(String[] args) throws InterruptedException {
          // 任务队列
          TaskQueue taskQueue = new TaskQueue();
          List<Thread> ts = new ArrayList<Thread>();
          // 启动5个线程，都在等待从任务队列取出task,并执行
          for (int i=0; i<5; i++) {
              Thread t = new Thread() {
                  @Override
                  public void run() {
                      while (true) {
                          try {
                              String s = taskQueue.getTask();
                              System.out.println(this.getName() + " execute task: " + s);
                          } catch (InterruptedException e) {
                              return;
                          }
                      }
                  }
              };
              t.start();
              ts.add(t);
          }
          Thread add = new Thread(() -> {
              // 不断放入task（10次）
              for (int i=0; i<10; i++) {
                  String s = "t-" + i;
                  System.out.println("add task: " + s);
                  taskQueue.addTask(s);
                  try { Thread.sleep(100); } catch(InterruptedException e) {}
              }
          });
          add.start();
          add.join();
          Thread.sleep(100);
          for (Thread t : ts) {
              // ts中的线程都是死循环，需要强制中断
              t.interrupt();
          }
      }
  }
  
  class TaskQueue {
      Queue<String> queue = new LinkedList<>();
      public synchronized void addTask(String s) {
          this.queue.add(s);
          this.notifyAll();   // 唤醒所有线程
      }
      public synchronized String getTask() throws InterruptedException {
          // if (queue.isEmpty()) {  // 如果这里用if判断，则只有一个线程能执行，另外四个线程都报错退出
          while (queue.isEmpty()) {
              this.wait();
          }
          return queue.remove();
      }
  }
  // 输出
  add task: t-0
  Thread-4 execute task: t-0
  add task: t-1
  Thread-0 execute task: t-1
  add task: t-2
  Thread-3 execute task: t-2
  add task: t-3
  Thread-3 execute task: t-3
  add task: t-4
  Thread-3 execute task: t-4
  add task: t-5
  Thread-1 execute task: t-5
  add task: t-6
  Thread-3 execute task: t-6
  add task: t-7
  Thread-2 execute task: t-7
  add task: t-8
  Thread-2 execute task: t-8
  add task: t-9
  Thread-0 execute task: t-9
  Process finished with exit code 0
  ```

  重点关注addTask()方法，内部调用了this.notifyAll()而不是this.notify()，使用notifyAll()将唤醒所有当前正在this锁等待的线程，而notify()只会唤醒其中一个（具体哪个依赖操作系统，有一定的**随机性**）。

  这是因为可能有多个线程正在getTask()方法内部的wait()中等待，使用notifyAll()将一次性全部唤醒。通常来说，notifyAll()更安全。有些时候，如果我们的代码逻辑考虑不周，用notify()会导致只唤醒了一个线程，而其他线程可能永远等待下去醒不过来了。

### 在多线程环境中，检查条件是否成立，应该用while而不是**if**

上面例2，判断队列是否为空用while而不是if。notifyAll()唤醒所有线程后，只有一个线程能获取this锁，此时该线程执行queue.remove()就能获取任务。而此后其他线程执行queue.remove()就会报错。最终结果是第一次取得任务的线程继续执行完所有任务。

问题的本质在于if是**一次性**的，而while是**一直判断**。当队列非空，多个线程都进入if，其中随机一个线程先执行，取出队列的任务后队列变为空然后释放锁，这时其他线程wait结束获得锁开始执行，会一直执行到queue.remove()，因为if语句只能保证当前队列为空，而while可以保证队列始终为空。遇到使用wait暂停执行的情况，用常规思维加if判断就失效了。

### run和start区别

直接调用Thread实例的run()方法是无效的，相当于调用了一个普通的Java方法，当前线程并没有任何改变，也不会启动新线程。

必须调用Thread实例的start()方法才能启动新线程，start()会自动调用重写的run()

### wait()和sleep()的区别

|          | sleep()                                                      | wait()                                                       |
| :------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 所属的类 | Thread                                                       | Object                                                       |
| 释放锁   | 不（不会失去对任何监视器（monitor）的所有权，也就是不会释放锁，仅仅会让出CPU的执行权） | 是（不仅会让出CPU的执行权，还会释放锁（即monitor的所有权），并且进入wait set） |
| 使用方式 | 使用sleep()方法需要捕获InterruptedException异常              | 使用wait()方法则必须放在synchronized代码块里面，同样需要捕获InterruptedException异常，并且需要获取对象的锁。 |
| 使用场景 | 当前线程休眠，或者轮循暂停操作                               | 多线程之间的通信                                             |





## 共享变量（volatile关键字）

volatile关键字解决的是可见性问题：当一个线程修改了某个共享变量的值，其他线程能够立刻看到修改后的值。但是volatile无法保证线程安全，因为不能保证原子性，例如两个线程同时写冲突

在 Java 内存模型中，允许编译器和处理器对指令进行重排序，重排序过程不会影响到单线程程序的执行，却会影响到多线程并发执行的正确性。

volatile 关键字通过添加内存屏障的方式来禁止指令重排，即重排序时不能把后面的指令放到内存屏障之前。

Java内存模型中定义的8种工作内存和主内存之间的原子操作

<img src="https://cs-notes-1256109796.cos.ap-guangzhou.myqcloud.com/8b7ebbad-9604-4375-84e3-f412099d170c.png" alt="img" style="zoom:50%;" />

  Lock unlock read load use assign store write

- lock：作用于主内存的变量
- unlock

如果赋值了一个变量volatile后，该变量对对象的操作更严格 限制use之前不能被read和load，assign之后必须紧跟store和write，将read-load-use和assign-store-write成为一个原子操作

  synchronized 互斥锁来保证操作的原子性。它对应的内存间交互操作为：lock 和 unlock，在虚拟机实现上对应的字节码指令为 monitorenter 和 monitorexit。

## 线程同步（synchronized关键字）

1. 用于代码块

   保证了代码块在任意时刻最多只有一个线程能执行。

   ```java
   class Counter {
       public static final Object lock = new Object();
       public static int count = 0;
   }
   public void run() {
       for (int i=0; i<10000; i++) {
           synchronized(Counter.lock) {  // 对Counter类的静态实例lock加锁，进行互斥操作
               Counter.count += 1;
           }
       }
   }
   ```

   注意：加锁目标必须是**对象**（锁不了基本类型）；且加锁对象必须**唯一**

   ```java
   class Counter {
       public static Integer count = 0;
   }
   class AddThread extends Thread {
       public void run() {
           for (int i=0; i<10000; i++) {
               synchronized(Counter.count) {  // 对Counter类的静态变量count进行互斥操作。加1一万次
                   Counter.count += 1;
               }
           }
       }
   }
   class DecThread extends Thread {
       public void run() {
           for (int i=0; i<10000; i++) {
               synchronized(Counter.count) {  // 对Counter类的静态变量count进行互斥操作。减1一万次
                   Counter.count -= 1;
               }
           }
       }
   }
   ```

   这里的执行结果count是不确定的，因为count引用的地址会随加减操作变化（Integer常量池）。

   每次对count加锁，锁的都不是同一个东西，因此无法保证互斥操作。

   

2. 用于方法

   - 非静态方法

     ```java
     public synchronized void add(int n) { // 锁住this
         count += n;
     } // 解锁
     ```

     其实就是锁住方法所属实例，即this。等价于同步代码块：

     ```java
     public void add(int n) {
         synchronized(this) { // 代码块，锁住this
             count += n;
         } // 解锁
     }
     ```

   - 静态方法

     ```java
     public synchronized static void test(int n) {
         ...
     }
     ```

     对于static方法，是没有this实例的，因为static方法是针对类而不是实例。因此静态方法加锁就是锁住该类。等价于代码块：

     ```java
     public class Counter {
         public static void test(int n) {
             synchronized(Counter.class) {
                 ...
             }
         }
     }
     ```

     

3. 不需要synchronized的操作

   **单条原子操作的语句**

   > JVM规范定义了几种**原子操作**：
   >
   > 1. 基本类型赋值操作，例如：int n = m；（long和double除外，但x64平台jvm已包括）
   > 2. 引用类型赋值，例如：`List <String> list = anotherList`。

   但是多条语句操作就需要同步。

## 线程池



Java标准库提供了ExecutorService接口表示线程池，通过Executor类创建

几个常用实现类有：

1. `FixedThreadPool(int n)`：线程数**固定**的线程池；
2. CachedThreadPool：线程数根据任务**动态调整**的线程池；
3. SingleThreadExecutor：仅单线程执行的线程池，相当于大小为1的`FixedThreadPool`。

## ThreadLocal

### **场景和用法**

使用事务时，需要保证数据库连接`conn`是同一个，因此最简单方法是将conn在需要函数间传递（service层--dao层）

然而这样降低代码耦合度，而且如果用到第三方库，则无法修改源码

解决方法：使用java标准库的`ThreadLocal<T>`，核心api有：

1. `set(T t)`：存储
2. `get()`：取
3. `remove()`：清除

实例总是以**静态字段**初始化如下：

```java
// 创建一个存储User类型的ThreadLocal
static ThreadLocal<User> ctx = new ThreadLocal<>();
```

**好处**

ThreadLocal相当于给**每个线程**都开辟了一个独立的存储空间，同一个线程共享同一个ThreadLocal，各个线程的ThreadLocal关联的实例互不干扰。

普通的方法之间调用一定是**同一个线程**执行的（详情见jvm栈部分），因此一定能访问同一个ThreadLocal，实现共享变量，从而避免方法参数传递带来的代码耦合

### 内部结构

ThreadLocalMap 是 ThreadLocal 的 **内部类**，没有实现 Map 接口，用独立的方式实现了 Map 的功能，其内部的 Entry 也是独立实现。

<img src="D:\CS-Note\images\Java并发\image-20220329110107310.png" alt="image-20220329110107310" style="zoom:50%;" />

Entry 中的 key 只能是 ThreadLocal 对象，value可以是任意类型。设计目的是只能通过 ThreadLocal 索引存储的数据。

key使用**弱引用**WeakReference，目的是将ThreadLocal 对象的生命周期和线程的生命周期解绑

```java
static class Entry extends WeakReference<ThreadLocal<?>> {
    object value;
    Entry(ThreadLocal<?> k, object v){
    	super(k);
    	value = v;
	}
}
```

**使用弱引用就一定能避免内存泄漏吗**？

<img src="https://mmbiz.qpic.cn/mmbiz_png/emOFDDdibbjJS9CaEEQta2bLHwCCT5OAhuaRokLu3DE9nMoYibYjN28icaNZoJ9LOEAT7N2uJliarDCVh6EqIrNicgg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1" alt="图片" style="zoom:50%;" />

如图，由于 ThreadLocalMap 只持有 ThreadLocal 的弱引用，没有任何强引用指向 threadlocal 实例，所以**threadlocal** 就可以顺利被 gc 回收，此时 Entry 中的 key=null 。

但是在没有手动删除这个 Entry 以及 CurrentThread 依然运行的前提下，也存在有强引用链 CurrentThreadRef->CurrentThread -> threadLocalMap -> Entry -> value，因此**value** 不会被回收，只是由于key为null，这块 value 永远不会被访问到了，导致 value 内存泄漏。



#### 什么情况会造成内存泄露？

在线程池中使用ThreadLocal。因为当ThreadLocal对象使用完后，应把设置的<key, value>回收，即回收Entry。

但线程池中的线程不会回收，而线程对象通过强引用指向ThreadLocalMap，Map也是通过强引用指向Entry，因此Entry对象也不会回收，从而导致内存泄露。还有可能当线程再次启用执行其他代码时，将上一次的状态带入。

因此ThreadLocal一般搭配**try...finally**语句，保证最后一定执行remove

**解决方法**

手动调用remove。优化：通过AutoCloseable接口配合try-with-resource语句，见下面例子

上面场景的实现：

为了保证能释放ThreadLocal关联的实例，我们可以通过AutoCloseable接口配合try-with-resource语句结构，让编译器自动为我们关闭

```java
public class ConnContext implements AutoCloseable {
    // ThreadLocal初始化
    static final ThreadLocal<Connection> ctx = new ThreadLocal<>();
    public UserContext() {
        conn = ds.getConnection();
        ctx.set(conn);
    }
    // 静态方法：获取conn
    public static Connection currentConn() {
        return ctx.get();
    }
        
    @Override
    public void close() {
        ctx.remove();
    }
}

// 实际使用时，安全获取连接，无需手动释放
try (var ctx = new UserContext()) {
    Connection conn = ConnContext.currentConn();
} 
```

### 



# Java锁机制

## synchronized原理

synchronized关键字是Java提供的原子性锁，是一种监视器锁（java内置，使用者看不到）。

使用synchronized关键字会在编译后的同步代码块前后加上monitorenter和monitorexit字节码指令，依赖操作系统底层的互斥锁实现。



执行monitorenter指令时会尝试获取对象锁，如果对象未加锁或者线程已获得了锁，锁的计数器+1；此时其他尝试竞争锁的线程会进入等待队列中。执行monitorexit指令时会将计数器-1，当计数器归零时锁会被释放，处于等待队列中的线程则会尝试竞争锁。

synchronized关键字的主要作用是实现原子性操作和解决共享变量的内存可见性问题。从内存语义来说，加锁的过程会清除工作内存中的共享变量，再从主内存中读取；释放锁的过程则是将工作内存的变量写回主内存。

### 对象在内存中布局

对象存放在jvm的堆中，大致分为三部分：对象头、对象实例和对齐填充

<img src="https://img2018.cnblogs.com/blog/1090126/201812/1090126-20181203193441990-1729189612.png" alt="img" style="zoom:50%;" />

1. 对象头：由MarkWord和KlassPoint（类型指针）组成。

   - KlassPoint指向类元数据，jvm通过其确定对象是哪个类的实例，大小8B

   - Mark Word用于存储对象自身的运行时数据， 大小8B。

   - Length用于存储**数组对象**长度，大小8B

     如果对象是非数组对象，那么对象头占用8B + 8B = 16B；

     如果对象是数组对象，那么对象头占用16B + 8 = 24B。

     > 注：
     >
     > 1.  以上均假设64位系统，若32位则大小减半。
     > 1.  在64位开启指针压缩的情况下 `-XX:+UseCompressedOops`，存放KlassPoint的空间大小是4B
     >

     

3. 对象实例：存储对象的属性信息，包括父类的属性信息，按照4字节对齐

4. 对齐填充：因为虚拟机要求对象字节必须是**8字节的整数倍**（64位jvm默认，可修改为16），填充字符用于凑齐


Synchronized不论是修饰方法还是代码块，都是通过持有修饰对象的锁来实现同步，原因就是Synchronized锁存在锁对象的对象头的**MarkWord**中，如下图（64位系统）

![20180322153316377](D:\CS-Note\images\Java并发\20180322153316377.jpg)

#### 可重入性

由synchronized底层原理可知，若当前线程已经持有锁对象，在其再次申请锁时，锁的计数器会+1，当前线程依然可以获取锁。因此，从逻辑上讲，synchronized关键字属于可重入锁。

#### 线程中断

对于synchronized关键字来说，如果一个线程在等待锁，那么结果只有两种，要么它获得这把锁继续执行，要么保持等待，即使调用中断线程的方法，也不会生效。

#### 等待唤醒机制

在使用notify()、notifyAl()l和wait()方法时，必须处于synchronized代码块或者synchronized方法中，否则会抛出IllegalMonitorStateException异常，这是因为调用这几个方法前必须拿到当前对象的监视器monitor对象。

#### 执行过程

线程进入synchronized代码块前后，执行过程如下：

- 线程获得互斥锁；
- 线程清空工作内存；
- 线程从主内存拷贝共享变量最新的值到工作内存成为副本；
- 线程执行同步代码；
- 线程将修改后的副本的值刷新回主内存中；
- 线程释放锁；