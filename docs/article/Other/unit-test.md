# Vue Test Utils测试初探 :running:

[Vue Test Utils](https://vue-test-utils.vuejs.org/zh/) 是 Vue.js 官方的单元测试实用工具库。

在开始之前，我们需要一些准备工作，如下：

## 准备工作
### 选择一个测试运行器
* **Jest**

    优点： 功能最全，且配置较少
    缺点：单文件组件导入测试需要一个预处理器，基本的单文件组件功能可以通过`vue-jest`, 涉及样式块和自定义块只能通过 webpack + vue-loader 进行设置。

* **mocah-webpack**

    优点：通过 webpack + vue-loader 得到完整的单文件组件支持
    缺点：配置多

## 浏览器环境
Vue Test Utils是依赖于浏览器环境的，理论上可以将其运行在一个真实的浏览器环境，但运行多个不同浏览器比较复杂，推荐是用 [JSDOM](https://github.com/jsdom/jsdom) 在 Node 虚拟浏览器环境运行测试。Jest 测试运行器自动设置了 JSDOM。

## 单文件组件
上面也提到了，Vue 的单文件组件在它们运行于 Node 或浏览器之前是需要预编译的。可以通过一个 Jest 预编译器，或直接使用 webpack。[用Jest测试单文件组件](https://vue-test-utils.vuejs.org/zh/guides/testing-single-file-components-with-jest.html)

有了上述基础，我们可以运行一个[简单项目](https://github.com/vuejs/vue-test-utils-jest-example)试一试

## 常用技巧


