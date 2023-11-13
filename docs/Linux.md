

# 文件

## 文件属性

用户分为三种：文件拥有者、群组以及其它人，对不同的用户有不同的文件权限。

使用 ls 查看一个文件时，会显示一个文件的信息，例如 `drwxr-xr-x 3 root root 17 May 6 00:14 .config`，对这个信息的解释如下：

- drwxr-xr-x：第 1 位为**文件类型**字段，后 9 位为**文件权限**字段

  常见的文件类型及其含义有：

  - `d`：目录
  - `-`：文件
  - `l`：链接文件（link）

  文件权限：9 位的文件权限字段中，每 3 个为一组，共 3 组，9 位的文件权限字段中，每 3 个为一组，共 3 组。一组权限有以下选择：

  - `r`：读

  - `w`：写

  - `x`：执行

  - `-`：没有该种权限


  其中rwx三种权限从左向右排列，如图所示：

  <img src="images/Linux/file-permissions-rwx.jpg" alt="img" style="zoom:50%;" />

  

- 3：链接数

- root：文件拥有者

- root：所属群组

- 17：文件大小

- May 6 00:14：文件最后被修改的时间

  文件时间有以下三种：

  - modification time (mtime)：文件的内容更新就会更新；
  - status time (ctime)：文件的状态（权限、属性）更新就会更新；
  - access time (atime)：读取文件时就会更新。

- .config：文件名

## 修改权限 chmod

可以将一组权限用数字来表示，此时一组权限的 3 个位当做二进制数字的位，从左到右每个位的权值为 4、2、1，即每个权限对应的数字权值为 r : 4、w : 2、x : 1。三者相加7就是改组权限的值。例如将 .bashrc 文件的权限修改为 `-rwxr-xr--`：

```bash
chmod 754 .bashrc
```

![img](images/Linux/rwx-standard-unix-permission-bits.png)

##  默认权限

- 文件默认权限：文件默认没有可执行权限，因此为 666，也就是 -rw-rw-rw- 。
- 目录默认权限：目录必须要能够进入，也就是必须拥有可执行权限，因此为 777 ，也就是 drwxrwxrwx。

## 目录的权限

文件名不是存储在一个文件的内容中，而是存储在一个文件所在的目录中。因此，拥有文件的 w 权限并不能对文件名进行修改。还需要有文件所在**目录的w权限**。

目录存储文件列表，一个目录的权限也就是对其文件列表的权限。因此，目录的 r 权限表示可以读取文件列表；w 权限表示可以修改文件列表，也就是添加删除文件，以及修改文件名；

> x 权限可以让该目录成为工作目录，x 权限是 r 和 w 权限的基础，如果不能使一个目录成为工作目录，也就没办法读取文件列表以及对文件列表进行修改了。
>
> 即：对目录而言，没有x权限就没有w和r权限。



##  设置所有者 chown

用于设置文件所有者和文件关联组。需要超级用户 **root** 的权限

Linux/Unix 是多人多工操作系统，所有的文件皆有拥有者。利用 chown 将指定文件的拥有者改为指定的用户或组，用户可以是用户名或者用户 ID，组可以是组名或者组 ID，文件是以空格分开的要改变权限的文件列表，支持通配符。



把 /var/run/httpd.pid 的所有者设置 root：

```bash
chown root /var/run/httpd.pid
```

将文件 file1.txt 的拥有者设为 runoob，群体的使用者 runoobgroup :

```bash
chown runoob:runoobgroup file1.txt
```

# 用户

## 创建用户账号 useradd

帐号建好之后，再用 passwd 设定帐号的密码

可用 userdel 删除帐号。

使用 useradd 指令所建立的帐号，实际上是保存在 /etc/passwd 文本文件中。

添加一般用户：

```bash
useradd tt
```

为添加的用户指定相应的用户组：

```bash
useradd -g root tt
```

创建一个系统用户：

```bash
useradd -r tt
```

为新添加的用户指定home目录：

```bash
useradd -d /home/myd tt
```

## 删除用户账号 userdel

userdel可删除用户帐号与相关的文件。若不加参数，则仅删除用户帐号，而不删除相关文件。
