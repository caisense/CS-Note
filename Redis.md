

# 数据结构

Redis本质都是**k - v键值对**，用一个唯一的字符串key来标识存储，数据结构指value的存储结构。

- Key的大小上限为512MB，但建议不超过1KB，这样既节约存储空间，也利于检索。

基本数据结构共有5种：字符串string、列表list、字典hash、集合set、有序集合zset。

此外还有3种特殊类型：

- Geo：地理位置定位，用于存储地理位置信息，并对存储的信息进行操作（Redis 3.2 推出）。
- HyperLogLog：用来做基数统计算法的数据结构，如统计网站的 UV。
- Bitmaps：用一个比特位来映射某个元素的状态，在 Redis 中，它的底层是基于字符串类型实现的，可以把 bitmaps 成作一个以比特位为单位的数组。

<img src="D:\CS-Note\images\Redis\640.png" alt="图片" style="zoom:50%;" />

## String（字符串）

- 简介：最常用的数据结构，是一个k-v键值对，v是字符串。它是二进制安全的，最大存储为 512M
- 简单使用举例：set key value、get key 等
- 应用场景：共享session、分布式锁，计数器、限流、存储图片或序列化的对象
- 内部编码有 3 种：
  1. int（8 字节，java的Long）
  2. embstr（小于等于 39 字节字符串）
  3. raw（大于 39 个字节字符串）

## List（列表）

- 简介：k-v 键值对，v是列表（list）类型，从左向右存储多个有序的字符串，一个列表最多可存储 **2^32-1** 个元素

- 简单实用举例：lpush key value [value ...] 、lrange key start end

- 内部编码：ziplist（压缩列表）、linkedlist（链表）

- 应用场景：消息队列，文章列表。

  异步队列：将需要延后处理的任务结构体序列化为字符串，放入Redis列表，再用一个线程从列表中轮询处理。

## Hash（哈希）

- 简介：存储二级map，无序，第一级是 k - v 键值对，其中 v 本身又是一个 k-v 键值对
- 简单使用举例：hset key field value 、hget key field
- 内部编码：ziplist（压缩列表） 、hashtable（哈希表）
- 应用场景：缓存用户信息等



## Set（集合）

- 简介：k-v 键值对，其中v是字符串集合（元素不重复），无序
- 简单使用举例：sadd key element [element ...]、smembers key
- 内部编码：intset（整数集合）、hashtable（哈希表）
- 应用场景：用户标签,生成随机数抽奖、社交需求



## 有序集合（zset）

- 简介：k-v 键值对，v是**已排序**的字符串集合
- 简单格式举例：zadd key score member [score member ...]，zrank key member
- 底层内部编码：ziplist（压缩列表）、skiplist（跳跃表）
- 应用场景：排行榜，社交需求（如用户点赞）。



- Redis采用渐进式rehash，同时保留新旧两个hash结构，在后续的定时任务和hash操作中，逐渐将旧hash的内容转移到新hash中。


# 主从复制

是指将一台Redis服务器的数据，复制到其他的Redis服务器。前者称为主节点(master/leader)，后者称为从节点(slave/follower)； 

数据的复制是**单向**的，只能由主节点到从节点。 

Master可写可读，Slave 只能读。 

## 优点

1. 数据冗余：主从复制实现了数据的热备份，是持久化之外的一种数据冗余方式。 

2. 故障恢复：当主节点出现问题时，可以由从节点提供服务，实现快速的故障恢复；实际上是一种服务 

   的冗余。 

3. 负载均衡：在主从复制的基础上，配合读写分离，可以由主节点提供写服务，由从节点提供读服务 

   （即写Redis数据时应用连接主节点，读Redis数据时应用连接从节点），分担服务器负载；尤其是在写 

   少读多的场景下，通过多个从节点分担读负载，可以大大提高Redis服务器的并发量。 

4. 高可用基石：除了上述作用以外，主从复制还是哨兵和集群能够实施的基础，因此说主从复制是 

   Redis高可用的基础。 

## 经典架构 

一主多从，一对多。 

<img src="D:\CS-Note\images\Redis\GetImage.png" alt="GetImage" style="zoom:50%;" />

特殊的链式架构，中间的结点整体作为从机，但同时也是最右边从机的主机。 

<img src="D:\CS-Note\images\Redis\GetImage-16442891132211.png" alt="GetImage" style="zoom:50%;" />

## 复制原理 

Slave 启动成功连接到 master 后会发送一个sync命令 

Master 接到命令，启动后台的存盘进程，同时收集所有接收到的用于修改数据集命令，在后台进程执行完毕之后，master将传送整个数据文件到slave，并完成一次完全同步。 

全量复制：而slave服务在接收到数据库文件数据后，将其存盘并加载到内存中。 

增量复制：Master 继续将新的所有收集到的修改命令依次传给slave，完成同步。 

但是只要是重新连接master，一次完全同步（全量复制）将被自动执行 

## 哨兵模式 

主从切换的方法是：当主服务器宕机后，需要手动把一台从服务器切换为主服务器，需要人工干预，不推荐。更多时候优先考虑哨兵模式。Redis从2.8开始正式提供了Sentinel（哨兵） 架构来解决这个问题。 

哨兵是一个独立的进程，作为进程，它会独立运行。其原理是哨兵通过发送命令，等待Redis服务器响应，从而监控运行的多个Redis实例。 

哨兵有两个作用： 

（1）通过发送命令，让Redis服务器返回监控其运行状态，包括主服务器和从服务器。 

（2）当哨兵监测到master宕机，会根据投票算法，自动决定将哪个slave切换成master，然后通过发布订阅模式通知其他的从服务器，修改配置文件，让它们切换主机。之前的master恢复后，也只能做slave。 

## 主要配置 

编辑sentinel.conf 文件 

\# 哨兵sentinel监控的redis主节点的 ip port 

\# master-name 可以自己命名的主节点名字 只能由字母A-z、数字0-9 、这三个字符".-_"组成。 

\# quorum 配置多少个sentinel哨兵统一认为master主节点失联 那么这时客观上认为主节点失联了 

\# sentinel monitor <master-name> <ip> <redis-port> <quorum> 

sentinel monitor mymaster 127.0.0.1 6379 2 

 

## 启动 

linux下，使用命令（sentinel.conf是配置文件名，可自定义）： 

$ redis-sentinel sentinel.conf 



# 如何实现定时机制

Redis server是**事件驱动**的程序，要处理两种事件：

文件事件：server对**socket**的抽象

时间事件：server对**定时操作**的抽象

定时机制通过**时间事件**实现，由三个属性组成：

1. id：时间事件标识
2. when：记录时间事件的到达时刻
3. timeProc：时间事件处理器

# 为何高效？

1. 单线程

   在4.0之前是单线程，具体而言网络I/O以及Set 和 Get操作是单线程，持久化、集群同步还是用其他线程完成

   4.0之后添加多线程，主要是体现在大数据的异步删除功能上，例如 `unlink key`、`flushdb async`、`flushall async` 等

2. 基于内存存储实现，省去磁盘IO开销

1. 文件事件Proc使用**IO多路复用程序**监听多个socket，基于非阻塞IO模型，实现高性能网络通信模型



# 如何实现数据不丢失？

把数据从内存存储到磁盘上（持久化），三种方式

- AOF 日志（Append Only File，文件追加方式）：记录所有的操作命令，并以文本的形式追加到文件中。
- RDB 快照（Redis DataBase）：将某一个时刻的内存数据，以二进制的方式写入磁盘。
- 混合持久化方式：Redis 4.0 新增了混合持久化的方式，集成了 RDB 和 AOF 的优点。

# 淘汰策略

内存满时就会执行淘汰（回收）

1. no-eviction：不删除

2. allkey-lru

3. volatile-lru

4. allkey-random

5. volatile-random

   allkey前缀：从所有 Key 的哈希表（`server.db[i].dict`）中挑选

   volatile前缀：从已设置过期时间的哈希表（`server.db[i].expires`）中挑选

   带-lru后缀的：先随机挑，再从挑出的用lru算法淘汰最近最少使用

   带-random后缀的：直接随机

6. volatile-ttl：从已设置过期时间的哈希表中随机挑选多个 Key，然后选择**剩余时间最短**的数据淘汰掉

