# webpack配置工程师—实践

> 上篇主要讲了关于webpack的一些基础，那么本文则是针对上一篇的实践，也是实际开发中常常遇到的一些实践

<!-- `main.js`中需要loader，用了bable-loader依然没用，写法有误
加入lodash，文件过大，
```js
[BABEL] Note: The code generator has deoptimised the styling of "/Users/rice/lazy/webpack-demo/node_modules/lodash/lodash.js" as it exceeds the max of "500KB"
```
打包时间直接2000ms + -->


## 优化输出结果

减小打包输出结果，提升网页打开速度并节约带宽

* 压缩css

```js
    module.export = {
        module: {
            rules: [{test: /\.css$/, loader: "style-loader!css-loader?minimize"}]
        }
    }
```
给css-loader带上参数`minimize`即可，（style-loader是用于将编译完成的css插入html中的工具）

* 合并压缩JS
```js
```

* 合并压缩图片文件
```js
```











<!-- - [ ] webpack压缩合并图片怎么弄的？
- [ ] 合并压缩js文件代码怎么弄？
- [ ] 公共代码打包的目的？减少加载次数和量？
- [ ] 怎么让非首屏代码异步加载？
- [ ] 怎么按需加载不同页面代码？
- [ ] pre-commit配合eslint
- [ ] 怎么搞出hot-reload
- [ ] 自动发布，这个了解一下就好了
- [ ] 作用里的模块合并: ？？啥意思？？
- [ ] 多个entry之间是异步还是同步执行的？？ 
- [ ] 常用的webpack plugins
- [ ] -->
 


## 常用插件

 比较常见的plugins有：

 `HtmlWebpackPlugin`：自动为html引用打包后的文件；

 `copy-webpack-plugin`：用于拷贝静态资源，包括未被引用的资源;

 `clean-webpack-plugin`：用于打包前清空输出目录;

 `CommonsChunkPlugin`：提取公共模块，避免在不同bundle中重复引用；

 `uglifyjs-webpack-plugin`：用于压缩JS可以让输出的JS文件体积更小、加载更快、流量更省，还有混淆代码的加密功能;

 `extract-text-webpack-plugin`：分离项目中的css；因为CSS的下载和JS可以并行,当一个HTML文件很大的时候，我们可以把CSS单独提取出来加载

 上述插件使用方法简单介绍如下：

```js
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

const config = {
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            hash: true
        }),
        new CopyWebpackPlugin([{
            from: path.join(__dirname, 'public'),
            to: path.join(__dirname, 'dist', 'public')
        }]),
        new CleanWebpackPlugin([path.join(__dirname, 'dist')]),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
           name: 'common' // 指定公共 bundle 的名称
        }),
        new extractTextPlugin('css/[name].css')
    ]
 }
 module.exports = config

```
测试

```js
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
// npm i extract-text-webpack-plugin@next // @next可以安装下一个非正式版本
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
let cssExtract = new ExtractTextWebpackPlugin({
    filename: 'css/css.css',
    allChunks: true
});
let lessExtract = new ExtractTextWebpackPlugin('css/less.css');
let sassExtract = new ExtractTextWebpackPlugin('css/sass.css');
/**
 * 有些时候我们希望把页面中的CSS文件单独拉出来保存加载
 * extract-text-webpack-plugin
 */
//let pages = ['index', 'base'];
// pages = pages.map(page => new HtmlWebpackPlugin({
//     template: './src/index.html',//指定产的HTML模板
//     filename: `${page}.html`,//产出的HTML文件名
//     title: `${page}`,
//     chunks: ['common', `${page}`],//在产出的HTML文件里引入哪些代码块
//     hash: true,// 会在引入的js里加入查询字符串避免缓存,
//     minify: {
//         removeAttributeQuotes: true
//     }
// }));
module.exports = {
    //先找到每个入口(Entry)，然后从各个入口分别出发，找到依赖的模块(Module)，
    //然后生成一个Chunk(代码块),最后会把Chunk写到文件系统中(Assets)   
    entry: './src/main.js',
    output: {
        path: path.join(__dirname, 'dist'),//输出的文件夹，只能是绝对路径 
        //name是entry名字main,hash根据打包后的文件内容计算出来的一个hash值
        filename: '[name].[hash].js' //打包后的文件名
    },
    resolve: {
        //引入模块的时候，可以不用扩展名 
        extensions: [".js", ".less", ".json"],
        alias: {//别名
            "bootstrap": "bootstrap/dist/css/bootstrap.css"
        }
    },
    //表示监控源文件的变化，当源文件发生改变后，则重新打包
    watch: false,
    watchOptions: {
        ignored: /node_modules/,
        poll: 1000,//每秒钟询问的次数
        aggregateTimeout: 500//
    },
    //devtool: 'source-map',//单独文件，可以定位到哪一列出错了
    // devtool: 'cheap-module-source-map',//单独文件，体积更小，但只能定位到哪一行出错
    // devtool: 'eval-source-map',//不会生成单独文件，
    // devtool: 'cheap-module-eval-source-map',//不会生成单独文件 只定位到行，体积更小
    /*
    loader有三种写法
    use
    loader
    use+loader
    * */
    module: {
        rules: [
            {
                test: require.resolve('jquery'),
                use: {
                    loader: 'expose-loader',
                    options: '$'
                }
            },
            {
                test: /\.js/,
                use: {
                    loader: 'babel-loader',
                    query: {
                        presets: ["env", "stage-0", "react"]
                    }
                }
            },
            {
                //file-loader是解析图片地址，把图片从源位置拷贝到目标位置并且修改原引用地址
                //可以处理任意的二进制，bootstrap 里字体
                //url-loader可以在文件比较小的时候，直接变成base64字符串内嵌到页面中
                test: /\.(png|jpg|gif|svg|bmp|eot|woff|woff2|ttf)/,
                loader: {
                    loader: 'url-loader',
                    options: {
                        limit: 5 * 1024,
                        //指定拷贝文件的输出目录 
                        outputPath: 'images/'
                    }
                }
            },
            {
                test: /\.css$/,//转换文件的匹配正则
                //css-loader用来解析处理CSS文件中的url路径,要把CSS文件变成一个模块
                //style-loader 可以把CSS文件变成style标签插入head中
                //多个loader是有顺序要求的，从右往左写，因为转换的时候是从右往左转换
                //此插件先用css-loader处理一下css文件
                //如果压缩
                loader: cssExtract.extract({
                    use: ["css-loader?minimize"]
                })
                //loader: ["style-loader", "css-loader", "postcss-loader"]
            },
            {
                test: /\.less$/,
                loader: lessExtract.extract({
                    use: ["css-loader?minimize", "less-loader"]
                })
                //use: ["style-loader", "css-loader", "less-loader"]
            },
            {
                test: /\.scss$/,
                loader: sassExtract.extract({
                    use: ["css-loader?minimize", "sass-loader"]
                })
                // use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.(html|htm)/,
                loader: 'html-withimg-loader'
            }
        ]
    },
    plugins: [
        //用来自动向模块内部注入变量
        // new webpack.ProvidePlugin({
        //     $: 'jquery'
        // }),
        new UglifyjsWebpackPlugin(),
        new CleanWebpackPlugin([path.join(__dirname, 'dist')]),
        //此插件可以自动产出html文件
        new HtmlWebpackPlugin({
            template: './src/index.html',//指定产的HTML模板
            filename: `index.html`,//产出的HTML文件名
            title: 'index',
            hash: true,// 会在引入的js里加入查询字符串避免缓存,
            minify: {
                removeAttributeQuotes: true
            }
        }),
        new CopyWebpackPlugin([{
            from: path.join(__dirname, 'public'),
            to: path.join(__dirname, 'dist', 'public')
        }]),
        cssExtract,
        lessExtract,
        sassExtract
    ],
    //配置此静态文件服务器，可以用来预览打包后项目
    devServer: {
        contentBase: './dist',
        host: 'localhost',
        port: 8000,
        compress: true,//服务器返回给浏览器的时候是否启动gzip压缩
    }
}

```
