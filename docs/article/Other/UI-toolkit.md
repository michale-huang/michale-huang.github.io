# 使用Vue-CLI 3 搭建组件库并发布到npm
先上：[vue插件官文](https://cn.vuejs.org/v2/guide/plugins.html)
## 步骤
1. 搭建项目
2. 配置webpack
3. 发布至npm


## 大纲

1. 目录结构
2. 编写组件
3. 编写示例
4. 单元测试
5. 配置使用库模式来打包
6. 发布到npm

ps: 测试， unit test（单元测试-代码功能测试） 和 e2e test（end-to-end，从用户角度将程序视为一个黑箱测试是否符合需求）


#### 1.目录结构

1. 新建packages存放示例
2. 将src文件夹重命名为example，放置示例

三个事情：
    * 将packages加入webpack的处理中，默认是不对packages做处理的
    * 配置vue.config.js，将入口src改examples
    * vue.config.js和tsconfig.json中的alias中的@符号指向examples
    ```js
    chainWebpack: (config) => {
      config.resolve.alias
        .set('@', pathResolve('/examples'))
    }
    ```
    ```json
    "paths": {
      "@/*": ["examples/*"]
    }
    ```
    * tsconfig.json中需要include examples和packages文件夹中的相关文件

至此，项目可以跑起来了,遇到的一些问题见下方Typescript部分

#### 2.编写组件
改造packages文件，内含src, types等，组件放在src里面，一些公用的方法也放在src里面

    a. 编写组件，需要用到`vue-property-decorator`，导出为一个继承了vue相关属性的class, 比如AnnButton
    b. 在components文件中新建一个index.ts文件，汇总所有组件为Ann, 并且需要给Ann提供install方法供后续安装组件时use，这里的install方法，由于用到typescript，需要定义一些自定义类型，用到类型定义文件，放在types/index.d.ts中，(详见另一篇文章)[https://translate.google.com/?hl=zh-CN]


#### 3.编写示例
在示例项目的main.ts中，导入Ann, 并在new Vue之前use(Ann)，接下来就可以使用Ann下的各种组件了
`<ann-button msg="sleep" />`

#### 4.单元测试


#### 5.库模式打包


#### 6.发布




