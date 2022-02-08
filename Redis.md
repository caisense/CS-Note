

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

![GetImage](D:\CS-Note\images\Redis\GetImage.png)

特殊的链式架构，中间的结点整体作为从机，但同时也是最右边从机的主机。 

![GetImage](D:\CS-Note\images\Redis\GetImage-16442891132211.png)

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

# 单线程为何高效

文件事件Proc使用**IO多路复用程序**监听多个socket，实现高性能网络通信模型

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

