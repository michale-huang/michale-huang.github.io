# 开发模式下动态传入API地址进行构建

## 背景

开发中常常遇到一个场景，需要与不同的后端er对接调试接口，而不同后端er开的接口地址通常又是不同的，如果每次都在代码里直接去改接口的baseURL显然并不那么友好。我们希望的是这种因调试而产生的修改并不直接体现在代码里，如果能在编译之前通过一个参数将baseURL传进去，再进行编译调试这样问题就可以得到解决。

这里以webpack-dev-server为例，按刚才的思路，只需要在起本地的dev-server时传入baseURL即可

## 技能点

要实现上述想法，我们需要了解三个技能点：
1. **传入需要的参数并启动server**

2. **node.js中process模块的`process.argv`属性**

3. **webpack的`DefinePlugin`插件**


## 传参
我们需要在起dev-server时传入参数，先看下项目中`package.json`中起dev-server的script命令：

```js
"scripts": {
    "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js"
}
```

加入一个参数`--api`

```
"scripts": {
    "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js --api"
}
```
接下来在起dev-server时则运行：

```
npm run dev "http://test.com:9995"
```

到此参数已经传入，那么我们要怎么获得呢？接下来第二点

## process.argv

process是node中的一个模块，`process.argv`属性会返回一个数组，这个数组包含了启动Node.js进程时的命令行参数。第一个元素为`process.execPath`，第二个元素为当前执行的JavaScript文件路径, 剩余元素则为其他命令行参数。

通过上述属性，我们就可以拿到传入的参数，接下来是如何使用参数了

## DefinePlugin插件

> DefinePlugin 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。例如如果在开发构建中，而不在发布构建中执行日志记录，则可以使用全局常量来决定是否记录日志。这就是 DefinePlugin 的用处. 

拿到API地址后，可以通过DefinePlugin插件来创建一个全局常量，如：
```js
function getApiBase () {
    let idx = process.argv.indexOf('--api')
    if (~idx) {
        return process.argv[idx + 1]
    }
 }
new webpack.DefinePlugin({
    API_BASE: JSON.stringify(getApiBase())
})
```
这里需要注意的是，API_BASE的值通过JSON.stringify处理过，这是因为这个DefinePlugin插件是直接执行文本替换，因此给定的值必须包含字符串本身内的实际引号, 如果不加字符串引号可能就被当成变量来处理了。通常有两种方式来达到这个效果，使用 '"production"', 或者使用 JSON.stringify('production')

接下来就是最后一步了，当在开发模式下，将API_BASE赋给请求的baseURL:
```js
let devBaseUrl = process.env.NODE_ENV === 'production' ? '' : API_BASE ? API_BASE : 'xxx' //此处xxx可为线上地址

axios.default.baseURL = devBaseUrl
```
到此，当每次需要用不同的接口地址进行调试时，直接执行`make dev URL="xxx"`即可，不需要再做代码进行任何修改。
