# 一台设备配置多个ssh key

## 1.生成ssh key:
```
$ ssh-keygen -t rsa -C "your_email@example.com"
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/your_user_directory/.ssh/id_rsa): /Users/rice/.ssh/id_rsa_test
Enter passphrase (empty for no passphrase):
Enter same passphrase again: 
```
上方的命令执行多次则会生成多个ssh key, 注意区别命名,如果不输入文件名，则会自动生成一对id_rsa, id_rsa.pub文件

可通过cat命令查看，如
```
$ cat ~/.ssh/id_rsa_test.pub
```
公钥大概长这样子

`ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom/BWDSU
GPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3
Pbv7kOdJ/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK/7XA
t3FaoJoAsncM1Q9x5+3V0Ww68/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw/Pb0rwert/En
mZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbx
NrRFi9wrf+M7Q== schacon@agadorlaptop.local`

## 2.为不同网站应用ssh key
修改.ssh下的config文件
```
$ sudo vim ~/.ssh/config
```
加上以下配置：
```
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_a

Host git.oschina.net
    HostName git.oschina.net
    User git
    IdentityFile ~/.ssh/id_rsa_b

Host test
 HostName xxx.xxx.x.xx
 User test
 IdentityFile ~/.ssh/id_rsa_c
 PreferredAuthentications publickey
...
```

## 3.将对应的公钥添加至对应的网站

## 4.为项目单独配置身份信息
像 github 或者 gitlab等网站都会要求验证身份,通常情况下配置一个全局信息就可以了:
```
$ git config --global user.name "Firstname Lastname"
$ git config --global user.email "your_email@example.com"
```
这个命令会在~/.gitconfig填入以下信息：
```
[user]
  name = Firstname Lastname
  email = your_email@example.com
```
如果需要修改信息，直接修改这个文件即可。

针对一些特殊情况，如果需要配置多个身份信息，可以为每个项目单独配置:
```
$ cd your_project
$ git config user.name "Firstname Lastname"
$ git config user.email "your_email@example.com"
```
这个命令会在项目目录下输出文件：/.git／.config

这里设置的姓名和邮箱地址会用在 Git 的提交日志中。

至此查看是否成功了，如果不成功，尝试debug, 比如测试github，`ssh -vT git@github.com`,根据log信息修改即可

中间遇到一个报错
```
ssh: Could not resolve hostname xxx nodename nor servname provided, or not known
```
将远程仓库的地址修改为非`ssh://`即可：
```
git remote remove xxx
git remote add xxx git://....
```
