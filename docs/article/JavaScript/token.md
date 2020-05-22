# 聊聊token那些事

## 作用

 * 用户标示／通行证： http请求是无状态的，无法识别用户身份
 * 减少服务器压力：减少直接校验userid和paassword的过程即减少了不断从主数据库查询数据的压力

## 原理
用户第一次登录，服务器通过数据库校验其UserId和Password合法，则再根据
随机数字+userid+当前时间戳， 再经过DES加密生成一个token串并返回给客户端

## 当token过期时

当一个token过期时，前端通常有两种方式来重新获得token：

 * 直接跳转到登录用户，引导用户重新登录去获得新token

 * 自动发起请求去拿新的token

第一种方案，首先需要与后端的同学约定token过期时返回的`status code`，比如:401, 然后前端的请求拦截器处理当code为401时，路由自动跳转到登录页面;

如果token失效时间很短，采用第一种方案让用户一直重新登录显然是非常影响用户体验的，那么就需要采用第二种方案

当前端请求拦截器拦截到返回的code为401时，此时发起一个请求去获取新的token，这里需要考虑一个问题，既然token已经过期了，又不能让用户输入用户名密码，那么怎么获取新的token呢？

这时需要了解两个东西：`accessToken`和`refreshToken`，前文提到的服务端通过token来辨识用户，这里的token确切的说应该叫`accessToken`,用于资源访问；而当`accessToken`过期时，则可以通过`refreshToken`获得新的`accessToken`

了解了以上，那么第二种方案完整描述如下：

> 用户登录 —> 服务端校验其用户名密码是否合法，合法则返回一对`accessToken`与`refreshToken` —> 客户端将一对token存储起来并在之后的请求中带上`accessToken` —> `accessToken`过期时服务端返回token过期信息如`status code: 401` —> 客户端拦截到返回code 401的请求，并发起获取新token的请求，该请求会带上`refreshToken` —> 服务端校验通过后返回一对新的`accessToken`与`refreshToken` 

## token和session

token和session的功能是一样的，都是为了与浏览器建立连接并获取服务端的用户数据，二者只是实现方式不一样。

用户登录时，服务端将user存入session并生成一个唯一ID, 然后将该sessionID存入浏览器的cookie中，再次访问时根据cookie即可查找到相应的user
