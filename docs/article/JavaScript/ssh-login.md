# ssh简写免密登录服务器

### ssh 免密登录
将公钥上传到服务器即可实现免密登录：
```
ssh-copy-id username@remote-server //注：该工具会将本地所有公钥上传到服务器
```
### 使用简写登录服务器
编辑 .ssh文件夹下的config文件
```
sudo vim ~/.ssh/config
```
在该文件中添加以下：
```
Host test // 简写
HostName xxx.xxx.x.xxx //服务器地址
User root //用户
IdentitiesOnly yes
```
有了上述两步登录远程服务器的时候直接`ssh test`就可以服务器啦
