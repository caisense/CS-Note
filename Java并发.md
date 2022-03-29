# 多线程

## 创建线程

实例化一个Thread实例，然后调用它的start()方法。但是这个线程启动后实际上什么也不做就立刻结束了。我们希望新线程能执行指定的代码，都需要重写run方法，有三种方法：

> **注意**：直接调用Thread实例的run()方法是无效的，相当于调用了一个普通的Java方法，当前线程并没有任何改变，也不会启动新线程。
>
> 必须调用Thread实例的start()方法才能启动新线程，start()会自动调用重写的run()



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

1. NEW ：初始状态。

   新创建的线程对象（下文统称“线程”），但还没有调用start()方法；

2. RUNNABLE：运行状态。

   就绪（ready）和运行中（running）两种状态统称为“运行态RUNNABLE”。线程对象创建后，其他线程(比如main线程）调用了该线程的start()方法，线程进入运行态。

   该状态的线程位于可运行线程池中，等待被线程调度选中，获取CPU的使用权，此时处于就绪状态（ready）。

   就绪状态的线程在获得CPU时间片后变为运行中状态（running）；

3. BLOCKED：阻塞状态。

   表示线程阻塞在进入synchronized关键字修饰的方法或代码块（获取锁）时的状态。

4. WAITING：等待状态。

   进入该状态的线程不会被分配CPU时间片，需要等待其他线程显式唤醒（通知或中断）；

5. TIMED_WAITING：超时等待状态。

   进入该状态的线程不会被分配CPU时间片，但不同于WAITING，线程可以在指定的时间后自行返回；

6. TERMINATED：终止状态。

   表示该线程已经执行完毕，当线程的run()方法完成时，或者主线程的main()方法完成时，线程就被认为是终止的。调用一个终止状态的线程会报出java.lang.IllegalThreadStateException异常。

#### 有关线程状态的几种方法的比较

- `Thread.sleep(long millis)`

  当前线程放弃获取的CPU时间片，进入TIMED_WAITING状态，**但不释放对象锁**，millis毫秒后线程自动苏醒进入就绪状态。

  作用：给其它线程执行机会。

- `Thread.yield()`

  由**当前线程**调用此方法，当前线程放弃获取的CPU时间片，**但不释放锁资源**，由运行状态变为**就绪状态**，让OS再次选择线程。 作用：让相同优先级的线程轮流执行，但并不保证一定会轮流执行。实际中无法保证yield()达到让步目的，因为让步的线程还有可能被线程调度程序再次选中。Thread.yield()**不会导致阻塞**。该方法与sleep()类似，只是不能由用户指定暂停多长时间。

- `thread.join()/thread.join(long millis)`

  在当前线程里调用其它线程T的join方法，会等待T执行结束。

  当前线程进入**WAITING/TIMED_WAITING**状态，且**不会释放对象锁**。

  **线程T执行完毕，或millis时间到，当前线程一般情况下进入RUNNABLE状态，也有可能进入BLOCKED状态（因为join是基于wait实现的）。**

- `Object.wait()/wait(long timeout)`

  必须在synchronized块中使用

  当前线程调用对象的wait()方法，当前线程**释放对象锁**并进入WAITING/TIMED_WAITING状态，**当前线程**进入等待队列。依靠**同一个被锁的对象**调用notify() / notifyAll()唤醒，或timeout时间到自动唤醒。

- `Object.notify()/notifyAll()`

  也必须在synchronized块中使用

  唤醒一个(notify)或所有(notifyAll)正在this锁等待的线程（就是在下文例1中getTask()中位于this.wait()的线程），从而使得等待线程从this.wait()方法返回。让等待的线程被重新唤醒
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

  完整例子

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
          // if (queue.isEmpty()) {  // 另外四个线程都报错退出
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



## 共享变量（volatile）

## 线程同步（synchronized）

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