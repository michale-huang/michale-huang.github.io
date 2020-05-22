# 关于Vue CLI 3 不同环境下打包代码

## 目标
实现三种环境（production, test, development）下的代码打包结构一致，并根据不同环境打包出的后端数据接口domain有所不同

## 问题
1. 在`test`和`development`模式下， Vue CLI 3打包出的js代码块是直接位于dist目录下，而 `production`环境下js代码块则是在一个js文件夹下，也就是说前两者环境打包出的代码与后者的文件目录不一致，虽然影响不大但实际上项目中更期望三种环境下打包出的代码结构一致

2. 使得不同环境使用不同的domain

## 实现
查阅[文档](https://cli.vuejs.org/zh/guide/mode-and-env.html)得知， 可以在`vue-cli-service`构建代码的时候通过参数`--mode`和`.env`文件配合来实现我们的目的

官方示例如下：

.env文件：
```js
VUE_APP_TITLE=My App
```
.env.staging文件：
```js
NODE_ENV=production
VUE_APP_TITLE=My App (staging)
```

>`vue-cli-service build` 会加载可能存在的 .env、.env.production 和 .env.production.local 文件然后构建出生产环境应用;  
>
>`vue-cli-service build --mode staging` 会在 staging 模式下加载可能存在的 .env、.env.staging 和 .env.staging.local 文件然后构建出生产环境应用;  
>
>这两种情况下，根据 NODE_ENV，构建出的应用都是生产环境应用，但是在 staging 版本中，process.env.VUE_APP_TITLE 被覆写成了另一个值。

由此可以想到, 想要使Vue CLI三种模式下都构建出与生产环境相同结构的代码，我们可以在build的时候分别传入mode为`test`或`development`，同时设置两者环境变量文件中的NODE_ENV变量：

传入mode参数：

package.json
```js
...
"scripts": {
    ...
    "build:dev": "vue-cli-service build --mode development",
    "build:test": "vue-cli-service build --mode test"
}
...
```
修改环境变量文件：

.env.test文件：
```js
NODE_ENV=production
```
.env.development文件：
```js
NODE_ENV=production
```
上述即可实现三种环境均构建出相同结构的应用，且都是生产环境应用；

至于不同的domain, 在各自的环境变量文件中分别设置即可(注：只有`VUE_APP_`开头的变量会被 webpack.DefinePlugin 静态嵌入到客户端侧的包中)：

.env.test文件：
```js
NODE_ENV=production
VUE_APP_API=http://test.com/
```
.env.development文件：
```js
NODE_ENV=production
VUE_APP_API=http://dev.com/
```
