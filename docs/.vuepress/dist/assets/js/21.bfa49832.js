(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{292:function(v,t,_){"use strict";_.r(t);var s=_(14),r=Object(s.a)({},(function(){var v=this,t=v._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[t("p",[v._v("存储的物理层实际无非就是磁盘（disk），即磁记录技术存储数据的存储器。")]),v._v(" "),t("p",[v._v("存储磁盘常见的三大指标：吞吐量、IOPS、时延。三个指标之间存在着关系，具体呈现为如下公式：每秒吞吐 =  I/Osize * IOPS * 并行度（IOPS-延时）。")]),v._v(" "),t("blockquote",[t("p",[t("strong",[v._v("吞吐量")]),v._v("是指对网络、设备、端口、虚电路或其他设施，单位时间内成功地传送数据的数量（以比特、字节、分组等测量）。")]),v._v(" "),t("p",[t("strong",[v._v("IOPS")]),v._v("（Input/Output Operations Per Second）是一个用于计算机存储设备（如机械硬盘HDD、固态硬盘SSD、混合硬盘HHD或存储区域网络SAN等）性能测试的量测方式，可以视为是每秒的读写次数。")]),v._v(" "),t("p",[v._v("时延是发起读取数据请求到读取到数据之间的时间间隔。")])]),v._v(" "),t("p",[v._v("阿里云存储是在物理层的磁盘资源上利用虚拟化技术将物理存储资源池化，架构分布式资源调度系统——盘古系统，可以为用户、客户提供类似于水电煤资源使用按量付费、按需取用的使用体验。")]),v._v(" "),t("h1",{attrs:{id:"oss、nas、ebs比较"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#oss、nas、ebs比较"}},[v._v("#")]),v._v(" OSS、NAS、EBS比较")]),v._v(" "),t("table",[t("thead",[t("tr",[t("th",[v._v("存储产品")]),v._v(" "),t("th",[v._v("文件存储NAS")]),v._v(" "),t("th",[v._v("对象存储OSS")]),v._v(" "),t("th",[v._v("块存储EBS")])])]),v._v(" "),t("tbody",[t("tr",[t("td",[v._v("存储方式")]),v._v(" "),t("td",[v._v("文件和文件夹")]),v._v(" "),t("td",[v._v("管理数据并将其链接至关联的元数据，存在"),t("strong",[v._v("bucket")]),v._v("中（就像文件目录）")]),v._v(" "),t("td",[v._v("数据拆分到任意划分且大小相同的"),t("strong",[v._v("卷")]),v._v("中")])]),v._v(" "),t("tr",[t("td",[v._v("时延")]),v._v(" "),t("td",[v._v("毫秒级")]),v._v(" "),t("td",[v._v("几十毫秒级")]),v._v(" "),t("td",[v._v("微秒级")])]),v._v(" "),t("tr",[t("td",[v._v("吞吐")]),v._v(" "),t("td",[v._v("数百Gbps")]),v._v(" "),t("td",[v._v("数百Gbps")]),v._v(" "),t("td",[v._v("数十Gbps")])]),v._v(" "),t("tr",[t("td",[v._v("协议")]),v._v(" "),t("td",[v._v("NFS、SMB")]),v._v(" "),t("td",[v._v("HTTP、HTTPS（Restful API）")]),v._v(" "),t("td",[v._v("自研协议")])]),v._v(" "),t("tr",[t("td",[v._v("访问模式（虚机访问存储数据的接口）")]),v._v(" "),t("td",[v._v("上千个ECS通过POSIX接口并发访问，随机读写")]),v._v(" "),t("td",[v._v("数百万客户端通过Web并发，追加写")]),v._v(" "),t("td",[v._v("单ECS通过POSIX接口访问，随机读写")])]),v._v(" "),t("tr",[t("td",[v._v("应用场景")]),v._v(" "),t("td",[v._v("高并发访问、在线修改、直读直写的场景")]),v._v(" "),t("td",[v._v("互联网架构的海量数据的上传下载和分发")]),v._v(" "),t("td",[v._v("适合IO密集型的数据库/单ECS高性能、低时延应用工作负载")])]),v._v(" "),t("tr",[t("td"),v._v(" "),t("td"),v._v(" "),t("td"),v._v(" "),t("td")])])]),v._v(" "),t("h2",{attrs:{id:"文件存储nas"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#文件存储nas"}},[v._v("#")]),v._v(" 文件存储NAS")]),v._v(" "),t("p",[v._v("NAS文件系统存储架构是目录树状结构，可以支持上千台虚拟机通过POSIX接口同时、高并发访问，支持随机读写、在线修改、直读直写。")]),v._v(" "),t("h2",{attrs:{id:"块存储ebs"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#块存储ebs"}},[v._v("#")]),v._v(" 块存储EBS")]),v._v(" "),t("p",[v._v("EBS的优势是性能高、时延低，适合于OLTP数据库、NoSQL数据库等IO密集型的高性能、低时延应用工作负载，支持随机读写。")]),v._v(" "),t("p",[v._v("EBS是裸磁盘，挂载到ECS后"),t("strong",[v._v("不能被操作系统应用直接访问，需要格式化成文件系统（ext3、ext4、NTFS等）后才能被访问。")])]),v._v(" "),t("p",[v._v("EBS无法实现"),t("strong",[v._v("容量弹性扩展")]),v._v("，单盘最大容量为32TB，并且对共享访问的支持有限，需要配合类Oracle RAC、WSFC Windows故障转移集群等集群管理软件才能进行共享访问。因此，块存储EBS主要还是针对单ECS的高性能，低时延的存储产品。")]),v._v(" "),t("h2",{attrs:{id:"对象存储oss"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#对象存储oss"}},[v._v("#")]),v._v(" 对象存储OSS")]),v._v(" "),t("p",[v._v("OSS存储架构为S3（Simple Storage Service 简单存储服务）扁平化文件组织形式，不支持文件随机读写，主要适用于互联网架构的海量数据的上传下载和分发。")]),v._v(" "),t("p",[v._v("对象存储在存储段bucket中，对象就像是文件，存储段就像是文件夹或目录，对象和存储段通过统一资源标识符（Uniform Resource Identifier，URI）进行查找，虽然在控制台界面是好像是有树状结构，但实际显示的文件夹/.resource只是前缀。")]),v._v(" "),t("h2",{attrs:{id:"q-接口和协议区别"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#q-接口和协议区别"}},[v._v("#")]),v._v(" Q：接口和协议区别？")]),v._v(" "),t("p",[v._v("协议是多个通信实体之间互通的规则和范式。接口是按照协议规定规则的具体实现。")]),v._v(" "),t("ul",[t("li",[v._v("二者的联系：协议是接口的既定规则，接口是协议的具体实现。")]),v._v(" "),t("li",[v._v("二者的区别：不需要过分区分协议和接口，他们的联系更加紧密。")])]),v._v(" "),t("h2",{attrs:{id:"posix协议"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#posix协议"}},[v._v("#")]),v._v(" POSIX协议")]),v._v(" "),t("p",[v._v("可移植操作系统接口POSIX（Portable Operating System Interface）是IEEE为要在各种UNIX操作系统上运行软件，而定义API的一系列互相关联的标准的总称。")])])}),[],!1,null,null,null);t.default=r.exports}}]);