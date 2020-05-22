# webpack配置工程师—基础

## webpack是什么？有什么作用
[webpack](https://webpack.js.org/) 是一个模块打包工具。它将一堆文件中的每个文件都作为一个模块，找出它们的依赖关系，将它们打包为可部署的静态资源。它能做的事情包括以下：

- 代码转换：通过各种loader，将我们写的一些浏览器不能直接运行的扩展语言解析打包成合适的格式供浏览器使用; 比如将ES6, CoffeeScript, TypeScript转换为ES5, 将SCSS装换成CSS等;
- 文件处理与优化：处理html或css中引用的图片，将其移动到配置的路径中并使用md5 hash重命名；压缩合并图片，压缩JS,CSS,HTML代码
- 代码分割：提取项目中公共代码；提取首屏不需要执行的代码让其异步加载；不同页面代码按需加载
- 模块合并: 在采用模块化的项目里会有很多个模块和文件，需要构建功能把模块分类合并成一个文件
- 代码校验：在代码提交到仓库前需要校验代码是否符合规范，以及单元测试是否通过，配合eslint，pre-commit
- 自动刷新：监听本地源代码的变化，自动重新构建、刷新浏览器。
- 自动发布：更新完代码后，自动构建出线上发布代码并传输给发布系统。

小结一下：
> Webpack 启动后会从 Entry 里配置的 Module 开始递归解析 Entry 依赖的所有 Module。 每找到一个 Module， 就会根据配置的Loader去找出对应的转换规则，对 Module 进行转换后，再解析出当前 Module 依赖的 Module。 这些模块会以 Entry 为单位进行分组，一个 Entry 和其所有依赖的 Module 被分到一个组也就是一个 Chunk。最后 Webpack 会把所有 Chunk 转换成文件输出。 在整个流程中 Webpack 会在恰当的时机执行 Plugin 里定义的逻辑。


## webpack核心概念
### 1. entry
  
 webpack把整个项目当作一个整体，需要根据给定的主文件来执行构建的第一步，可以理解为入口文件，webpack会从entry开始递归找出所有依赖的模块; 可以有多个entry，每个entry对应最后生成的一个chunk；

`context`：基础目录，绝对路径。用于从配置中解析入口，默认使用当前目录，推荐传递一个值，使得配置文件独立于当前工作目录。当配置文件和入口文件不在用一层目录结构时，例如配置文件在config文件夹下，入口文件在src文件夹下，那么配置应如下：
```js
const config = {
    context: path.resolve(__dirname, '..'),
    entry: './src/main.js'
}
module.exports = config
```
最后打包出的chunk会被命名为main[hash].js

当项目是多页面应用时配置多个入口如下：
```js
const config = {
    context: path.resolve(__dirname, '..'),
    entry: {
        home: "./src/home.js"，
        category: "./src/category.js",
        about: "./src/about.js"
    }
}
module.exports = config
```
多页面传给entry的是一个对象，最终打包出的各个chunk名称分别是该对象的key

### 2. output
 
输出结果。webpack经过一系列处理并得到最终输出结果，output可配置如何输出最终打包的文件以及在哪里输出bundle、assets等，entry可以有多个但只能指定一个output配置

`publicPath`： 公共路径，为所有静态资源（css,image,js）提供一个基础路径，这个基础路径要配合具体资源中指定的路径一起使用，简单来说就是：

> 静态资源最终访问路径 = output.publicPath + 资源loader或plugins配置的路径

例如：

```js
output.publicPath = '/'

// image
modele: {
    rules: [{
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
            name: 'static/img/[name].[hash:7].[ext]'
        }
    }]
}
// 最终图片访问地址
output.publicPath + 'static/img/[name].[hash:7].[ext]' = '/dist/static/img/[name].[hash:7].[ext]'
```

一般情况下publicPath是以'/'结尾，而其他loader或插件的配置不要以'/'开头

当`output.publicPath`设置为相对路径后，是相对于build后的index.html的;

如果将静态资源托管到cdn上，则需要使用其他URL比如相对于协议的

 `publicPath: "https://cdn.example.com/assets/"`

```js
 const path = require('path')
 const config = {
    output: {
        path: path.resolve(__dirname, 'dist'), // 输出目录的绝对路径
        publicPath: '/',
        filename: '[name].[hash].bundle.js', //使用入口名称和每次构建的唯一hash
        chunkFilename: '[name].bundle.js' // 非入口chunk的名称
    }
 }
 module.exports = config
```
 
### 3. module
 
在webpack中一切皆模块，即所有格式的文件（.html, .css, .js, .png, .jpg...）都是一个模块，一个文件则对应一个模块
 
关于module的配置是用于处理项目中的不同模块的，主要配置在rules中。

`noParse`: 可用于忽略解析某些与正则相匹配的文件，而忽略一些大型的library可提高构建性能，比如：

```js
module.exports = {
    module: {
        rules: [],
        noParse: function (content) {
            return /jquery|lodash/.test(content) //忽略jquery文件解析，直接编译打包
        }
    }
}
```
忽略的文件中不应包含import，require等任何导入机制

`rules`: 创建模块时，匹配请求的规则，这些规则能够修改模块的创建方式、对模块应用loaders、修改解析器;
 
 每条rule分为三部分: 

  * condititon条件: 
  
    condition包括两类：被请求的资源(resource)和资源请求者(issuer); 属性`test`, `include`, `exclude` 和 `resource` 是针对被请求资源的，`issuer`是针对资源请求者的
  * result结果:
  
    只有在condition匹配的情况下result才会起作用

    resule有两种配置：loader和parse
  * nested-rule嵌套条件
  
    用于在condition匹配时进行取值，可以使用`rules`和`oneOf`来指定规则

```js
module.exports = {
    module: {
        noParse: function (content) {
            return /jquery|lodash/.test(content)
        },
        rules: [{
            test: /\.css$/, // 绝对路径符合该正则的则满足条件需要走这个规则
            include: [
                path.resolve(__dirname, 'app') // 指定该目录中文件需要走这个规则
            ],
            exclude: [
                path.resolve(__dirname, 'app/demo') // 排除该目录中文件，不需要走该规则
            ],
            use: 'css-loader'
        }, {
            resource: {
                test: /\.css$/,
                include: [
                    path.resolve(__dirname, 'app')
                ],
                exclude: [
                    path.resolve(__dirname, 'app/demo')
                ]
            },
            issure: {
                test: /\.css$/,
                include: [
                    path.resolve(__dirname, 'app')
                ],
                exclude: [
                    path.resolve(__dirname, 'app/demo')
                ]
            },
            use: 'css-loader'
        }, {
            test: /\.(png|jpeg|gif|svg)$/,
            oneOf: [{
                resourceQuery: /one/,
                loader: 'url-loader'
            }, {
                loader: 'file-loader'
            }]
        }]
    }
}
```
上面rules中两条其实是一样的效果，只是不同写法，后者只是将`test`,`include`,`exclude`包装成了一个对象放在resource或issuer中

第三条rule中`oneOf`表示对该资源只应用第一个规则，`resourceQuery`针对的是"?"后面的路径参数，比如：

path/to/foo.png?one: 会匹配url-loader

path/to/foo.png?two:会匹配file-loader

path/to/foo.png: 会匹配file-loader

### 4. loader
 
 模块转化器，将原模块内容按要求转换为新的内容; 上文已有介绍
```js
 const path = require('path')
 const config = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: 'css-loader'
            }, {
                test: /\.vue$/,
                use: 'vue-loader'
            }]
    }
 }
 module.exports = config
```

### 5. resolve

resolve能够设置模块如何被解析

`alias`：创建 `import`和 `require`的别名来使模块导入更加简单，比如
```js
modules.exports = {
    alias: {
        Utils: path.resolve(__dirname, 'src/utilities/'),
        Templates: path.resolve(__dirname, 'src/templates/')
    }
}
// 配置前
import Utility from '../../utils/utility';
// 配置后
import Utility from 'Utils/utility';
```

`enforceExtension`：Boolean, 当值为false时引用时不需要扩展名

`modules`：告诉webpack解析模块时候应该搜索的目录
```js
modules.export = {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'] //搜索时src目录会有优先于node_modules
}
```

### 6. chunk
 
 代码块，一个代码块由多个模块组成，用于将代码拆分合并；

 代码分离是webpack最引人注目的地方之一，该特性可以将代码分离到不同的bundle中，然后按需加载或者并行加载这些bundle，以及控制加载的优先级，这将极大影响加载时间，提升性能。


### 7. plugins

插件可以说是webpack的支柱，webpack本身就是一个复杂度较高的插件集合,利用其插件机制构建出来的；使用各种plugins，可以使得webpack在构建流程的特定时机注入扩展逻辑并执行相应操作从而改变构建结果；
 
举个例子：`HtmlWebpackPlugin`（自动为html引用打包后的文件）

```js
const webpack = require('webpack') // to access webpack build-in plugins
const HtmlWebpackPlugin = require('html-webpack-plugin') // extra installed via package manager
 const path = require('path')
 const config = {
    plugins: [
        new webpack.optimize.UglifyJsPlugin(), // a build-in plugin, use UglifyJs to compress/beautifier your js
        new HtmlWebpackPlugin({template: './src/index.html'})
    ]
 }
 module.exports = config
```

[更多常用插件实践戳这里](./webpack-s2.html#插件)
### 8. webpack-dev-server

在开发阶段，利用webpack-dev-server启动一个本地的node服务器进行开发，webpack-dev-server打包的内容是放在内存中的，至于打包后的资源对外的的根目录就是上文提到过的`publicPath`

```js
modules.exports = {
    devServer: {
        contentBase: path.join(__dirname, "dist"), //指定本地服务器在哪里寻找资源，dist目录将作为可访问文件
        compress: true, //是否压缩文件
        port: 9000, //开发测试端口号
        hot: true, //是否启用热更新
        open: true, // 是否自动打开浏览器
        proxy: {
            "/api": "http://localhost:3000" // 设置代理url, 请求到 /api/users 现在会被代理到请求 http://localhost:3000/api/users
        }
    }
}
```


<!-- 参考来源：

[webpack入门](https://juejin.im/entry/57b3035f2e958a00546f8774)

[webpack从此不再是我们的痛点](https://juejin.im/post/5ad1d85f518825651d081c68#heading-6) -->

<!-- [细谈webpack插件](https://zoumiaojiang.com/article/what-is-real-webpack-plugin/)

[FED细说webpack流程篇](http://taobaofed.org/blog/2016/09/09/webpack-flow/) -->

