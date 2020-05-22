# 前后端接口规范

## request

### 请求方式
获取资源：GET

新增资源：POST

修改资源：PUT

删除资源：DELETE

### 协议
1. http
2. https
3. tcp
4. ws

### 域名

测试环境：
`test.xxx.com`

线上环境：
`xxx.com`

### 端口号
看后端同学心情咯

### 路径
统一按照 ***模块/用途名称***，同时需注意需区分不同端：

pc端`service`, 如： `http://xxx.com/service/driver/liscense`

移动端`app`,  如：`http://xxx.com/app/driver/liscense`

公用`common`  如： `http://xxx.com/common/login`

### 参数
参数上传格式统一采用formdata格式，{key: value}

参数命名统一采用蛇形,如：`user_name`

### GET/POST/PUT/DELETE
均采用formdata格式，如
```js
{
    type: 1,
    query: '',
    page: 1,
    version: 1.0
}
```

## response
后端返回数据统一采用json格式

```js
常规：
{
    code: 200,
    msg: '',
    data: {}
}
分页：
{
    code: 200,
    msg: '',
    data: {
        list: [],
        page: int,
        total: int,
        isEnd: false
    }
}
```

### 常用code约定
```js
// 200 成功
// 401 权限异常
// ...
```
### 数据为空返回规则

数组：空数组

字符串：null

对象：''

## 注意事项
1.测试端口，允许localhost跨域
2.本地node服务器允许局域网中其他用户访问

### 分页
栗子：
```js
// request
// https://test.xxx.com:9995/service/user?page=1
// response
{
    code: 200,
    msg: '',
    data: {
        list: [],// 数据信息
        page: int, //当前页（前端传什么后端返回什么）
        total: int,// 所有数据项count
        inEnd: boolean //是否还有数据
    }
}
```

### 上传图片
统一接口，不同场景采用imageType字段加以区分
formdata格式，如：
```js
{
    imageType: 'driver_license'
    files: ...
}
```

# 文档规范

### 获取用户信息
method: `GET`

path: `/service/user/{type}`
```js
// pathParams:
{
    type: 2 // 用户类型
}
// params:
{
    page: 1
}
// https://test.tengbo.com:9995/service/user/2?page=1
```

```js
// response
{
    code: 200,
    msg: '',
    data: {
        list: [{
            name: '', // 用户名
            nickname: '', // 昵称
            avator: '', // 用户头像
            phone: 12312312345 //手机号
        }, {...}],
        page: 1,
        total: 50,
        isEnd: false
    }
}
```

### 登录
method: `POST`

path：`/service/login`
```js
// params: 
{
    name: '', // 登录名
    password: '' // 密码
}
```
```js
//response:
{
    code: 200,
    msg: '登录成功',
    accessToken: xxx,
    refreshToken: xxx,
    data: {
        name: '', // 用户名
        nickname: '', //昵称
        avator: '', //用户头像
        phone: '' //手机号
    }
}
```

### 删除用户
method: `DELETE`

path: `/service/user/{id}`
```js
// pathParams:
{
    id: 12 //用户ID
}
```
```js
// response:
{
    code: 200,
    msg: '删除成功'
}
```
