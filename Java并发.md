# 多线程

## 创建线程

实例化一个Thread实例，然后调用它的start()方法。但是这个线程启动后实际上什么也不做就立刻结束了。我们希望新线程能执行指定的代码，都需要重写run方法

**注意：run()无参数，无返回值。**

有三种方法：



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

## 线程作用域

线程私有的只有两种：线程**非静态**的私有变量，以及线程函数内定义的局部变量。

其余外部变量，或**线程类内定义的静态变量**，都是线程间共享的

例：统计一个线程类创建过多少个线程，并为每个线程进行编号。 

```java
class MyThread extends Thread {
    private static int sn = 0;    //线程数，MyThread类静态变量，线程间共享
    private int x = 0;      //线程编号，线程私有

    MyThread() {
        x = sn++;
    }

    @Override
    public void run() {
        Thread t = Thread.currentThread();
        System.out.println(t.getName() + "\t" + x);
    }
}
public class ThreadVarTest {
    public static void main(String[] args) {
        // 每个线程创建时，其x值都已确定
        Thread t1 = new MyThread();
        Thread t2 = new MyThread();
        Thread t3 = new MyThread();
        Thread t4 = new MyThread();
        // 只是输出的顺序不定
        t1.start();
        t2.start();
        t3.start();
        t4.start();
    }
}
```

输出：

Thread-1	1
Thread-3	3
Thread-2	2
Thread-0	0

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

   

4. `Object.wait() / wait(long timeout)`

   必须在synchronized块或方法中使用

   当前线程调用对象的wait()方法，当前线程**释放对象锁**并进入WAITING/TIMED_WAITING状态，**当前线程**进入等待队列。依靠**同一个被锁的对象**调用notify() / notifyAll()唤醒，或timeout时间到自动唤醒。

5. `Object.notify() / notifyAll()`

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





## volatile关键字（共享变量）

volatile关键字解决的是可见性问题：当一个线程修改了某个共享变量的值，其他线程能够立刻看到修改后的值。但是volatile无法保证线程安全，因为不能保证原子性，例如两个线程同时写冲突

在 Java 内存模型中，允许编译器和处理器对指令进行重排序，重排序过程不会影响到单线程程序的执行，却会影响到多线程并发执行的正确性。

volatile 关键字通过添加**内存屏障**的方式来禁止指令重排，即重排序时不能把后面的指令放到内存屏障之前。

Java内存模型中定义的8种工作内存和主内存之间的原子操作

<img src="https://cs-notes-1256109796.cos.ap-guangzhou.myqcloud.com/8b7ebbad-9604-4375-84e3-f412099d170c.png" alt="img" style="zoom:50%;" />

  Lock unlock read load use assign store write

- lock：作用于主内存的变量
- unlock

如果赋值了一个变量volatile后，该变量对对象的操作更严格 限制use之前不能被read和load，assign之后必须紧跟store和write，将read-load-use和assign-store-write成为一个原子操作

  synchronized 互斥锁来保证操作的原子性。它对应的内存间交互操作为：lock 和 unlock，在虚拟机实现上对应的字节码指令为 monitorenter 和 monitorexit。

## 线程同步

### 1. synchronized关键字

1. 用于代码块

   保证了代码块在任意时刻最多只有一个线程能执行。

   ```java
   class Counter {
       public static final Object lock = new Object();
       public static int count = 0;
   }
   class AddThread extends Thread {
   	public void run() {
       	for (int i=0; i<10000; i++) {
           	synchronized(Counter.lock) {  // 对Counter类的静态实例lock加锁，进行互斥操作
               	Counter.count += 1;
           	}
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

### 2. Lock

Java内置的synchronized关键字锁相对比较重量级，且使用时存在以下局限：

- 当一个线程获取了对应的锁，并执行同步代码块时，其他线程只能一直等待，等待获取锁的线程释放锁，而获取锁的线程释放锁只会有两种情况：

  - 获取锁的线程执行完了代码块，线程释放对锁的占有；
  - 线程执行发生异常，JVM自动释放锁；

  如果这个获取锁的线程由于要等待IO或者其他原因（如调用sleep方法）被阻塞了，但是又没有释放锁，其他线程便会长时间地等待下去。等待中的线程**不会响应中断**。

- 如果多个线程都只是进行读操作，当一个线程在进行读操作时，其他线程也只能等待无法进行读操作。

- synchronized机制无法感知线程是否成功获取了锁。

因此Java中提供了**Lock接口**，用于在部分场景下取代synchronized关键字，进行更轻量级的实现。但注意，采用Lock方式获取必须主动去释放锁，且Lock在发生异常时，不会自动释放锁。因此一般来说，使用Lock必须配合try-catch块，在try之前获取锁，并且在finally释放锁，以保证锁一定被被释放，防止死锁。

#### 可重入锁ReentrantLock

ReentrantLock实现了Lock接口。可重入锁即表示可反复进入的锁，但仅限于当前线程。当前线程可以反复加锁，但也需要释放同样加锁次数的锁，即重入了多少次，就要释放多少次，不然也会导入锁不被释放。

**几个重要方法：**

1. lock()

   获取锁，有三种情况：

   - 锁空闲：直接获取锁并返回，同时设置锁持有者数量为：1；

   - 当前线程持有锁：直接获取锁并返回，同时锁持有者数量+1；

   - 其他线程持有锁：当前线程会休眠等待，直至获取锁为止；

     ```java
     Lock lock = new ReentrantLock();
     lock.lock();
     try {
         // 处理任务
     } catch(Exception e) {
         
     } finally {
         lock.unlock(); // 释放锁
     }
     ```

     注意，lock()方法的调用在try之前，原因是加锁操作可能会抛出异常，如果加锁在try块之前，那么出现异常时try-finally块不会执行；如果加锁操作在try块中，由于finally一定会执行，此时try中的加锁操作出现异常，finally依然会执行解锁操作，而此时并没有获取到锁，执行解锁操作会抛出另外一个异常，可能将加锁的异常信息覆盖，导致信息丢失。

     因此应该将加锁操作放在try块之前。

2. tryLock()

   尝试获取锁，与lock()相比多了**返回值**。获取成功返回：true，获取失败返回：false。

   还可以带参数`tryLock(long time, TimeUnit unit)`，在拿不到锁时会等待重试一定的时间time，在时间期限之内如果还拿不到锁，就返回false

   同样有以下三种情况：

   - 锁空闲：直接获取锁并返回：true，同时设置锁持有者数量为：1；

   - 当前线程持有锁：直接获取锁并返回：true，同时锁持有者数量+1；

   - 其他线程持有锁：获取锁失败，返回：false；

     ```java
     Lock lock = new ReentrantLock();
     if (lock.tryLock(1, TimeUnit.SECONDS)) {  // 尝试获取锁，最多等待1秒
          try {
              // 处理任务
          } catch(Exception e){
              
          } finally{
              lock.unlock();   // 释放锁
          } 
     } else {
         // 如果不能获取锁，则直接做其他事情
     }
     ```

     

3. unlock()

   释放锁，每次锁持有者数量递减 1，直到 0 为止。

lock()方法和unlock()方法间的代码块即为加锁的代码块。Lock只有代码块加锁的方式，不能对方法加锁。

### synchronized和ReentrantLock区别

|      | synchronized       | ReentrantLock                    |
| ---- | ------------------ | -------------------------------- |
|      | 能锁方法和代码块   | 只能锁代码块                     |
|      | 是关键字           | 是实现类                         |
|      | jvm层面            | api层面                          |
|      | 非公平锁           | 公平或非公平                     |
|      | 锁信息保存在对象头 | 通过代码中int类型state标识锁状态 |
|      | 有锁升级过程       |                                  |



## 线程池

线程池内部维护了若干个线程，没有任务的时候，这些线程都处于等待状态。如果有新任务，就分配一个空闲线程执行。如果所有线程都处于忙碌状态，新任务要么放入队列等待，要么增加一个新线程进行处理。

Java标准库提供了ExecutorService接口表示线程池，通过Executor类创建

几个常用实现类：

1. `FixedThreadPool(int n)`：线程数**固定**的线程池；
2. CachedThreadPool：线程数根据任务**动态调整**的线程池；
3. SingleThreadExecutor：仅单线程执行的线程池，相当于大小为1的`FixedThreadPool`。
4. ScheduledThreadPool：线程任务可以定期反复执行

**线程池7个参数**

1. `int corePoolSize`： 核心线程数

2. `int maximumPoolSize`： 最大线程数，一般要大于核心线程数

3. `long keepAliveTime`： 最大空闲时间，表示线程没有任务执行时最多保持多久时间会终止（只有当线程池中的线程数大于 corePoolSize 时，keepAliveTime 才会起作用）

4. `TimeUnit unit`： 时间单位

5. `BlockingQueue workQueue`： 阻塞队列

   以下这几种选择：ArrayBlockingQueue、LinkedBlockingQueue、SynchronousQueue。

6. `ThreadFactory threadFactory`： 线程工厂，主要用来创建线程。

7. `RejectedExecutionHandler handler`： 拒绝策略

   有以下四种策略：

   - ThreadPoolExecutor.AbortPolicy：丢弃任务并抛出 RejectedExecutionException 异常；

   - ThreadPoolExecutor.DiscardPolicy：也是丢弃任务，但是不抛出异常；

   - ThreadPoolExecutor.DiscardOldestPolicy：丢弃队列最前面的任务，然后重新尝试执行任务（重复此过程）；

   - ThreadPoolExecutor.CallerRunsPolicy：由调用线程处理该任务。

**执行流程**

![img](images/Java并发/bVcO4HQ.png)

1. 线程池创建时，线程数为0，当有任务提交给线程池时，在核心池corePool创建一个线程执行，直到线程数达到corePoolSize 
2. 当线程数达到corePoolSize 时，再有任务提交进来，就放到阻塞队列，当有线程执行完任务，就从队列中取任务执行（按先进先出顺序）
3. 当阻塞队列也满了，corePool还是没有空闲，则新来任务就在maxPool创建线程
4. 当maxPool也满了，则对新来任务执行拒绝策略
5. 当线程数大于corePoolSize时，keepAliveTime参数起作用，关闭没有任务执行的线程，直到线程数不超过corePoolSize。线程池通过这个机制动态调节线程数。



### Q：为什么核心线程满后，先放阻塞队列，而不是创建非核心线程？

因为创建线程消耗资源，因此先考虑将任务缓存起来等待执行。

### Q：为什么一般不建议使用JDK提供的线程池？

阿里规约，由于FixedThreadPool和SingleThreadPool里面的阻塞队列基本是没有上限的（默认队列长度Integer.MAX_VALUE=21亿），这就可能会导致任务过多，内存溢出（OOM），而CachedThreadPool和ScheduledThreadPool则可能会创建大量线程（< 21亿），也可能会导致内存溢出（OOM）

### Q：线程数如何设置？

最佳线程数目 =(( 线程等待时间 + 线程 CPU 时间 )/线程 CPU 时间 )* CPU 数目



**线程池状态变化**

![在这里插入图片描述](images/Java并发/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aW95aW9546pX3R5cmFudA==,size_20,color_FFFFFF,t_70,g_se,x_16.png)

1. RUNNING：正常运行，既接受新任务，也处理队列中任务
2. SHUTDOWN：正常状态调用shutdown()方法，就进入SHUTDOWN状态，不再接受新任务，但会继续处理队列中任务
3. STOP：正常状态调用shutdownNow()方法，就进入STOP状态，不接受新任务，也不处理队列中的任务，正在运行的线程也会中断
4. TIDYING：过渡状态，表示线程池即将结束。由两种状态转变而来：1）SHUTDOWN状态处理完队列中的任务，且没有线程在运行；2）或者STOP状态的工作线程为空（必然为空，因为线程全中断）
5. TERMINATED：终止状态，TIDYING状态调用terminated()方法，就进入TERMINATED状态。该方法是一个空方法，留给用户扩展。

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

<img src="images\Java并发\image-20220329110107310.png" alt="image-20220329110107310" style="zoom:50%;" />

Entry 中的 key 只能是 **ThreadLocal 对象**，value可以是任意类型。设计目的是只能通过 ThreadLocal 索引存储的数据。

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

synchronized关键字是Java内置的原子性锁，使用者看不到，是一种监视器（Monitor）锁。当对象锁升级为重量级锁时，markWord存储指向Monitor的指针。

<img src="images\Java并发\未命名图片-164978366864511.png" alt="未命名图片" style="zoom: 50%;" />

Monitor是线程私有的数据结构，也是一个对象，每一个被锁住的对象都会和一个monitor关联，每个线程都有一个可用monitor record列表，同时还有一个全局的可用列表。

使用synchronized关键字会在编译后的同步代码块前后加上 **monitorenter** 和 **monitorexit** 字节码指令，依赖操作系统底层的互斥锁（Mutex Lock）实现。当一个线程执行到 monitorenter 指令时，就会获得对象所对应的 `monitor` 的所有权，也就获得到了对象的锁

在jvm中，monitor对象由**ObjectMonitor**实现（C++），其跟同步相关的数据结构如下：

```c++
ObjectMonitor() {
    _header       = NULL; // 锁对象oop的原始对象头
    _count        = 0;   // 【重要】计数器，用来记录该对象被线程获取锁的次数
    _waiters      = 0;
    _recursions   = 0;   // 锁的重入次数
    _owner        = NULL; //【重要】指向持有ObjectMonitor对象的线程 
    _WaitSet      = NULL; // 处于wait状态的线程，会被加入到_WaitSet队列（先入先出）
    _WaitSetLock  = 0 ;
    _EntryList    = NULL ; //处于等待锁block状态的线程，会被加入到该列表
    _cxq          =  NULL; // 另一个争抢锁的队列
}
```

Owner字段存放拥有该锁的线程的唯一标识，表示该锁被这个线程占用。

count是锁计数器。执行monitorenter指令时会尝试获取对象锁，如果对象未加锁或者线程已获得了锁，锁的计数器count +1；此时其他尝试竞争锁的线程会进入等待队列中。执行monitorexit指令时会将count -1，当count归零时锁会被释放，处于等待队列中的线程则会尝试竞争锁。



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

![20180322153316377](images\Java并发\20180322153316377.jpg)

**可重入性**

由synchronized底层原理可知，若当前线程已经持有锁对象，在其再次申请锁时，锁的计数器会+1，当前线程依然可以获取锁。因此，从逻辑上讲，synchronized关键字属于可重入锁。

**线程中断**

对于synchronized关键字来说，如果一个线程在等待锁，那么结果只有两种，要么它获得这把锁继续执行，要么保持等待，即使调用中断线程的方法，也不会生效。

**等待唤醒机制**

在使用notify()、notifyAll()和wait()方法时，必须处于synchronized代码块或者synchronized方法中，否则会抛出IllegalMonitorStateException异常，这是因为调用这几个方法前必须拿到当前对象的监视器monitor对象。

**执行过程**

线程进入synchronized代码块前后，执行过程如下：

- 线程获得互斥锁；
- 线程清空工作内存；
- 线程从主内存拷贝共享变量最新的值到工作内存成为副本；
- 线程执行同步代码；
- 线程将修改后的副本的值刷新回主内存中；
- 线程释放锁；



## 乐观锁 VS 悲观锁

乐观锁与悲观锁是一种广义上的概念，体现了看待线程同步的不同角度。在Java和数据库中都有此概念对应的实际应用。

**悲观锁**

读过程中拒绝写入（写入必须等待）。因此线程在获取数据的时候会先加锁，确保数据不会被别的线程修改。

例：synchronized关键字和Lock的实现类

**乐观锁**

乐观估计读的过程**大概率**不会有写入，所以不会添加锁，只是在写时判断是否有其他线程写。如果没有则直接写，反之则根据不同的实现方式执行不同的操作（如：报错或者自动重试）。

例：CAS算法（自旋）

<img src="images\Java并发\c8703cd9.png" alt="img" style="zoom:33%;" />

## 公平锁 VS 非公平锁

公平锁是指多个线程按照申请锁的顺序来获取锁，线程直接进入队列中排队，队列中的第一个线程才能获得锁。公平锁的优点是等待锁的线程不会饿死。缺点是整体吞吐效率相对非公平锁要低，等待队列中除第一个线程以外的所有线程都会阻塞，CPU唤醒阻塞线程的开销比非公平锁大。

非公平锁是多个线程加锁时直接尝试获取锁，获取不到才会到等待队列的队尾等待。但如果此时锁刚好可用，那么这个线程可以无需阻塞直接获取到锁，所以非公平锁有可能出现后申请锁的线程先获取锁的场景。非公平锁的优点是可以减少唤起线程的开销，整体的吞吐效率高，因为线程有几率不阻塞直接获得锁，CPU不必唤醒所有线程。缺点是处于等待队列中的线程可能会饿死，或者等很久才会获得锁。

ReentrantLock里面有一个内部类Sync，Sync继承AQS（AbstractQueuedSynchronizer），添加锁和释放锁的大部分操作实际上都是在Sync中实现的。它有公平锁FairSync和非公平锁NonfairSync两个子类。ReentrantLock默认使用非公平锁，也可以通过构造器来显示的指定使用公平锁。

<img src="images\Java并发\6edea205.png" alt="img" style="zoom:50%;" />

公平锁与非公平锁的lock()方法

<img src="images\Java并发\bc6fe583.png" alt="img" style="zoom:33%;" />

唯一的区别就在于公平锁在获取同步状态时多了一个限制条件：hasQueuedPredecessors()。该方法主要做一件事情：主要是判断当前线程是否位于同步队列中的第一个。如果是则返回true，否则返回false。

![img](images\Java并发\bd0036bb.png)



## 可重入锁 VS 非可重入锁

可重入锁又名递归锁，是指在同一个线程在外层方法获取锁的时候，再进入该线程的内层方法会自动获取锁（前提锁对象得是同一个对象或者class），不会因为之前已经获取过还没释放而阻塞。Java中ReentrantLock和synchronized都是可重入锁，可重入锁的一个优点是可一定程度**避免死锁**。

```Java
public class Widget {
    public synchronized void doSomething() {
        System.out.println("方法1执行...");
        doOthers();
    }

    public synchronized void doOthers() {
        System.out.println("方法2执行...");
    }
}
```

在上面的代码中，类中的两个方法都是被内置锁synchronized修饰的，doSomething()方法中调用doOthers()方法。因为内置锁是可重入的，所以同一个线程在调用doOthers()时可以直接获得当前对象的锁（见前文synchronized修饰方法），进入doOthers()进行操作。

如果是一个不可重入锁，那么当前线程在调用doOthers()之前需要将执行doSomething()时获取当前对象的锁释放掉，实际上该对象锁已被当前线程所持有，且无法释放。所以此时会出现死锁。

例如，有多个人在排队打水，此时管理员允许锁和同一个人的多个水桶绑定。这个人用多个水桶打水时，第一个水桶和锁绑定并打完水之后，第二个水桶也可以直接和锁绑定并开始打水，所有的水桶都打完水之后打水人才会将锁还给管理员。这个人的所有打水流程都能够成功执行，后续等待的人也能够打到水。这就是可重入锁。

<img src="images\Java并发\58fc5bc9.png" alt="img" style="zoom: 33%;" />

但如果是非可重入锁的话，此时管理员只允许锁和同一个人的一个水桶绑定。第一个水桶和锁绑定打完水之后并不会释放锁，导致第二个水桶不能和锁绑定也无法打水。当前线程出现死锁，整个等待队列中的所有线程都无法被唤醒。

<img src="images\Java并发\ea597a0c.png" alt="img" style="zoom:33%;" />

通过重入锁ReentrantLock以及非可重入锁NonReentrantLock的源码来对比分析一下为什么非可重入锁在重复调用同步资源时会出现死锁。

首先ReentrantLock和NonReentrantLock都继承父类AQS，其父类AQS中维护了一个同步状态**status**来计数重入次数，status初始值为0。

当线程尝试获取锁时，可重入锁先尝试获取并更新status值，如果status == 0表示没有其他线程在执行同步代码，则把status置为1，当前线程开始执行。如果status != 0，则判断当前线程是否是获取到这个锁的线程，如果是的话执行status+1，且当前线程可以再次获取锁。而非可重入锁是直接去获取并尝试更新当前status的值，如果status != 0的话会导致其获取锁失败，当前线程阻塞。

释放锁时，可重入锁同样先获取当前status的值，在当前线程是持有锁的线程的前提下。如果status-1 == 0，则表示当前线程所有重复获取锁的操作都已经执行完毕，然后该线程才会真正释放锁。而非可重入锁则是在确定当前线程是持有锁的线程之后，直接将status置为0，将锁释放。

<img src="images\Java并发\32536e7a.png" alt="img" style="zoom: 50%;" />

## 独享锁 VS 共享锁

独享锁也叫排他锁，是指该锁一次只能被一个线程所持有。如果线程T对数据A加上排它锁后，则其他线程不能再对A加任何类型的锁。获得排它锁的线程即能读数据又能修改数据。JDK中的synchronized和JUC中Lock的实现类就是互斥锁。

共享锁是指该锁可被多个线程所持有。如果线程T对数据A加上共享锁后，则其他线程只能对A再加共享锁，不能加排它锁。获得共享锁的线程只能读数据，不能修改数据。

独享锁与共享锁也是通过AQS来实现的，通过实现不同的方法，来实现独享或者共享。

ReentrantReadWriteLock的部分源码

![img](images\Java并发\762a042b.png)

ReentrantReadWriteLock有两把锁：ReadLock和WriteLock，由词知意，一个读锁一个写锁，合称“读写锁”。再进一步观察可以发现ReadLock和WriteLock是靠内部类Sync实现的锁。Sync是AQS的一个子类，这种结构在CountDownLatch、ReentrantLock、Semaphore里面也都存在。

在ReentrantReadWriteLock里面，读锁和写锁的锁主体都是Sync，但读锁和写锁的加锁方式不一样。读锁是共享锁，写锁是独享锁。读锁的共享锁可保证并发读非常高效，而读写、写读、写写的过程互斥，因为读锁和写锁是分离的。所以ReentrantReadWriteLock的并发性相比一般的互斥锁有了很大提升。

那读锁和写锁的具体加锁方式有什么区别呢？在了解源码之前我们需要回顾一下其他知识。 在最开始提及AQS的时候我们也提到了state字段（int类型，32位），该字段用来描述有多少线程获持有锁。

在独享锁中这个值通常是0或者1（如果是重入锁的话state值就是重入的次数），在共享锁中state就是持有锁的数量。但是在ReentrantReadWriteLock中有读、写两把锁，所以需要在一个整型变量state上分别描述读锁和写锁的数量（或者也可以叫状态）。于是将state变量“按位切割”切分成了两个部分，高16位表示读锁状态（读锁个数），低16位表示写锁状态（写锁个数）。如下图所示：

![img](images\Java并发\8793e00a.png)

再回头看一下互斥锁ReentrantLock中公平锁和非公平锁，它们添加的都是独享锁。根据源码所示，当某一个线程调用lock方法获取锁时，如果同步资源没有被其他线程锁住，那么当前线程在使用CAS更新state成功后就会成功抢占该资源。而如果公共资源被占用且不是被当前线程占用，那么就会加锁失败。所以可以确定ReentrantLock无论读操作还是写操作，添加的锁都是都是独享锁。



参考：[不可不说的Java“锁”事](https://tech.meituan.com/2018/11/15/java-lock.html)



## 锁优化

主要是指 JVM 对 synchronized 的优化。

为减少获得锁和释放锁带来的性能消耗，JDK1.6引入了“偏向锁”和“轻量级锁”。锁优化机制包括：自适应锁、锁消除、锁粗化、轻量级锁和偏向锁。

### CAS

全称 Compare And Swap（比较与交换），是一种无锁算法。在不使用锁（没有线程被阻塞）的情况下实现多线程之间的变量同步。java.util.concurrent包中的原子类就是通过CAS来实现了乐观锁。

CAS算法涉及到三个操作数：

- 需要读写的内存值 V。
- 进行比较的值 A。
- 要写入的新值 B。

当且仅当 V 的值等于 A 时，CAS通过原子方式用新值B来更新V的值（“**比较+更新**”整体是一个原子操作），否则不会执行任何操作。一般情况下，“更新”是一个不断重试的操作。

CAS虽然高效，但也存在三大问题：

1. ABA问题。CAS需要在操作值的时候检查内存值是否发生变化，没有发生变化才会更新内存值。但是如果内存值原来是A，后来变成了B，然后又变成了A，那么CAS进行检查时会发现值没有发生变化，但是实际上是有变化的。ABA问题的解决思路就是在变量前面添加版本号，每次变量更新的时候都把版本号加一，这样变化过程就从“A－B－A”变成了“1A－2B－3A”。

   - JDK从1.5开始提供了AtomicStampedReference类来解决ABA问题，具体操作封装在compareAndSet()中。compareAndSet()首先检查当前引用和当前标志与预期引用和预期标志是否相等，如果都相等，则以原子方式将引用值和标志的值设置为给定的更新值。

2. **循环时间长开销大**。CAS操作如果长时间不成功，会导致其一直自旋，给CPU带来非常大的开销。

3. 只能保证一个共享变量的原子操作。对一个共享变量执行操作时，CAS能够保证原子操作，但是对多个共享变量操作时，CAS是无法保证操作的原子性的。

   - Java从1.5开始JDK提供了AtomicReference类来保证引用对象之间的原子性，可以把多个变量放在一个对象里来进行CAS操作。

### 自旋锁

阻塞或唤醒一个Java线程需要操作系统切换CPU状态来完成，这种状态转换需要耗费处理器时间。如果同步代码块中的内容过于简单，状态转换消耗的时间有可能比用户代码执行的时间还要长。

在许多场景中，同步资源的锁定时间很短，为了这一小段时间去切换线程，线程挂起和恢复现场的花费可能会让系统得不偿失。如果物理机器有多个处理器，能够让两个或以上的线程同时并行执行，我们就可以让后面那个请求锁的线程不放弃CPU的执行时间，看看持有锁的线程是否很快就会释放锁。

而为了让当前线程“稍等一下”，我们需让当前线程进行自旋，如果在自旋完成后前面锁定同步资源的线程已经释放了锁，那么当前线程就可以不必阻塞而是直接获取同步资源，从而避免切换线程的开销。这就是自旋锁。

自旋锁在JDK1.4.2中引入，使用-XX:+UseSpinning来开启。在 JDK 1.6 中默认开启自旋锁，并且引入了自适应的自旋锁。自适应意味着自旋的次数不再固定了，而是由前一次在同一个锁上的自旋次数及锁的拥有者的状态来决定。

​           

### 锁消除

锁消除是指对于被检测出不可能存在竞争的共享数据的锁进行消除。

锁消除主要是通过**逃逸分析**来支持，如果堆上的共享数据不可能逃逸出去被其它线程访问到，那么就可以把它们当成私有数据对待，也就可以将它们的锁进行消除。

对于一些看起来没有加锁的代码，其实隐式的加了很多锁。例如下面的字符串拼接代码就隐式加了锁：

```java
public static String concatString(String s1, String s2, String s3) {
    return s1 + s2 + s3;
}
```

String 是一个不可变的类，编译器会对 String 的拼接自动优化。在 JDK 1.5 之前，会转化为 StringBuffer 对象的连续 append() 操作：

```java
public static String concatString(String s1, String s2, String s3) {
    StringBuffer sb = new StringBuffer();
    sb.append(s1);
    sb.append(s2);
    sb.append(s3);
    return sb.toString();
}
```

每个 append() 方法中都有一个同步块。虚拟机观察变量 sb，很快就会发现它的动态作用域被限制在 concatString() 方法内部。也就是说，sb 的所有引用永远不会逃逸到 concatString() 方法之外，其他线程无法访问到它，因此可以进行消除。



## 锁升级

无锁 -> 偏向锁 -> 轻量级锁 -> 重量级锁

<img src="images\Java并发\markword-64.png" alt="markword-64" style="zoom:50%;" />

### **无锁**

无锁没有对资源进行锁定，所有的线程都能访问并修改同一个资源，但同时只有一个线程能修改成功。

无锁的特点就是修改操作在循环内进行，线程会不断的尝试修改共享资源。如果没有冲突就修改成功并退出，否则就会继续循环尝试。如果有多个线程修改同一个值，必定会有一个线程能修改成功，而其他修改失败的线程会不断重试直到修改成功。上面我们介绍的CAS原理及应用即是无锁的实现。无锁无法全面代替有锁，但无锁在某些场合下的性能是非常高的。

### 偏向锁

偏向锁是指一段同步代码一直被一个线程所访问，那么该线程会自动获取锁，降低获取锁的代价。在大多数情况下，锁总是由同一线程多次获得，不存在多线程竞争，所以出现了偏向锁。目的是在只有一个线程执行同步代码块时能够提高性能，无多线程竞争的情况下尽量减少不必要的轻量级锁执行路径，因为轻量级锁的获取及释放依赖多次CAS原子指令，而偏向锁只需要在置换ThreadID的时候依赖一次CAS原子指令即可。

当一个线程访问同步代码块并获取锁时，会使用 CAS 操作在Mark Word里存储锁偏向的线程ID，如果 CAS 操作成功，即获得**偏向锁**。这个线程以后每次进入这个锁相关的同步块就不需要再进行任何同步操作（CAS），而是检测Mark Word里是否存储着指向当前线程的偏向锁。

偏向锁只有遇到**其他线程**尝试竞争偏向锁时，持有偏向锁的线程才会释放锁，线程不会主动释放。偏向锁的撤销，需要等待**全局安全点**（在这个时间点上没有字节码正在执行），它会首先暂停拥有偏向锁的线程，判断锁对象是否处于被锁定状态。撤销偏向锁（Revoke Bias）后，恢复无锁状态或者轻量级锁状态。



### 轻量级锁

当锁是偏向锁的时候，被另外的线程所访问，就会升级为轻量级锁，其他线程通过自旋的 CAS 操作尝试获取锁，避免重量级锁使用互斥量的开销（阻塞）。对于绝大部分的锁，在整个同步周期内都是不存在竞争的，因此也就不需要都使用互斥量进行同步，可以先采用 CAS 操作进行同步，如果 CAS 失败了再改用互斥量进行同步。

当尝试获取一个锁对象（要锁住的对象）时，如果锁对象标记为 0 01，说明锁对象处于无锁（unlocked）状态。此时虚拟机：

1. 在**当前线程的虚拟机栈**中创建 Lock Record，拷贝对象头中的Mark Word到此处
2. 使用 CAS 操作将对象的 Mark Word 更新为 Lock Record 指针，并将Lock Record里的owner指针指向对象的Mark Word。

如果 CAS 成功，线程获得该对象上的锁，将对象的 Mark Word 的锁标记变为 00，表示该对象锁升级为轻量级锁。

如果 CAS 失败，虚拟机首先会检查对象的 Mark Word 是否指向当前线程的虚拟机栈

- 如果是的话说明当前线程已经拥有了这个锁对象，那就可以直接进入同步块继续执行
- 否则说明多个线程竞争锁。
  - 若当前只有一个等待线程（2个竞争），则该线程通过自旋进行等待。自旋超过一定次数，升级重量级锁。
  - 若自旋时又来一个竞争线程（3个以上竞争），则轻量级锁要膨胀为重量级锁。
  - 

### 重量级锁

升级为重量级锁时，锁标志的状态值变为“10”，此时Mark Word中存储的是指向重量级锁的指针（hotspot中的ObjectMonitor），此时等待锁的线程都会进入阻塞状态。

**锁升级过程**

1. 对象刚创建：无锁态

2. 第一个线程拿到对象的锁：升级为**偏向锁**。覆盖原来的markword，记录指向该线程指针JavaThread*，修改偏向锁位为1

3. 线程间发生竞争时：升级为**轻量级锁（自旋锁）**。覆盖原markword，记录指向**拿到锁的**线程的栈（线程独立内存区域）中LockRecord的指针，修改所标志位为01
    - 自旋即线程进行CAS操作，不停尝试修改markword获取锁，设置为指向自己线程栈LockRecord的指针，操作成功的线程获得锁。（缺点：空转，消耗cpu，因此需要升级）


4. 自旋超过10次（或者自旋线程数超过CPU核数的一半），或自旋期间又来一个竞争线程，升级为重量级锁，向操作系统申请资源（linux mutex，互斥量），修改markword为指向互斥量的指针



总而言之，开销从小到大：

检测markword的偏向状态 < CAS < 操作系统互斥量mutex

### 一致性哈希码

一致性哈希码指对Object::hashCode()或者System::identityHashCode(Object)方法的调用，一般情况下是保持不变的，第一次计算后就存储在对象头markword中，因此：

1.当一个对象已经计算过**一致性哈希码**后，它就再也无法进入偏向锁状态了

- 因为偏向锁markword中没有地方存储hashcode，只能存在线程栈的LockRecord

2.当一个对象当前正处于偏向锁状态，又收到需要计算其一致性哈希码请求时，它的偏向状态会被立即撤销，并且锁会膨胀为重量级锁。

- 重量锁markword中也没有地方存储hashcode，只有指向ObjectMonitor的指针，ObjectMonitor的_header字段可记录非加锁状态下（标志位01）的markword，里面记录了hashcode

