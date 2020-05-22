# Vue项目架构与工程化实践

### 使用vue-cli搭建项目基础架构

1. npm升级: 

   `sudo npm update npm -g`, 升级好后可通过`npm -v` 查看当前版本进行确认

2. node.js升级到稳定版本

   `sudo n stable`, `node -v`版本确认

3. 升级vue-cli   

   `npm update vue-cli -g`, `vue -V`版本确认,

上述准备之后即可搭建出项目基础架构了

### webpack升级到4.x

接下来就是平稳过渡到webpack 4了

1. 升级webpack: `npm update webpack@4.16.2`

此时build会报错：
```js
// Error: webpack.optimize.CommonsChunkPlugin has been removed, please use config.optimization.splitChunks instead.
```
原因在于webpack 4 使用`optimization.splitChunks`替代了`CommonsChunkPlugin`。

以前的`CommonsChunkPlugin`主要用来抽取代码中的共用部分，webpack runtime之类的代码，结合chunkhash，实现最好的缓存策略。而`optimization.splitChunks`则实现了相同的功能，并且配置更加灵活，关于这块的详细介绍[点这里](https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693)

修改webpack.prod.conf.js
```js
const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          name: 'vendors',
        },
        'async-vendors': {
          test: /[\\/]node_modules[\\/]/,
          minChunks: 2,
          chunks: 'async',
          name: 'async-vendors'
        }
      }
    },
    runtimeChunk: { name: 'runtime' }
  },
  ...
})
```

此时遇到一些warning，都是版本兼容问题，一一升级即可，最终使用版本包括：

```
/*
html-webpack-plugin@3.2.0
extract-text-webpack-plugin@next
mini-css-extract-plugin@0.4.1
vue-loader@^14.2.2
*/
```

遇到一个报错：
```js
// Error: Path variable [contenthash] not implemented in this context: static/css/[name].[contenthash].css
```
这里需要特别注意的一个依赖包`extract-text-webpack-plugin`(这个包会将所有入口chunk中引用的\*.css文件移动到独立分离的css文件中，这样样式将不再内嵌在js bundle中，因为css和js是并行加载的，当css比较大的时候可以明显加快加载速度)

报错就在于其最新正式版还没有对webpack4.x进行支持，所以有两个选择，第一个是：`yarn upgrade extract-text-webpack-plugin@next`升级到测试版，第二个是换成`mini-css-extract-plugin`

`npm run dev`报错
```js
// Error: Cannot find module 'webpack/bin/config-yargs'
```
因为与`webpack-dev-server`版本不兼容，需升级；同时缺少webpack-cli，需安装；

```js
// ReferenceError: portfinder is not defined
```


Runtime + compiler ???

test runer 选择的是Jest [对比](https://www.cnblogs.com/lihuanqing/p/8533552.html)


**部分参考来源**

[vue cli升级webpack4](https://blog.csdn.net/w1170375057/article/details/80831801)
[vue cli 平稳升级webapck4](https://juejin.im/post/5ac3854af265da237d033606)
[webpack 4 升级指南](https://juejin.im/entry/5aaa400e5188257bf550ca55)

