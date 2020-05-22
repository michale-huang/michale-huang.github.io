# 项目重构优化了解一下

## 背景
随着业务发展，公司现有的某个项目（代号F）越来越庞大复杂，原有项目架构在易维护性，易扩展性上体现得越来越吃力，一直在考虑重构。前段时间机缘巧合看到TalkingData团队发布了一个后台管理系统集成解决方案[iview-admin](https://github.com/iview/iview-admin)，clone下来后发现整个项目架构异常清奇，值得学习一波

个人认为，可从组件化、模块化、规范化、自动化四个方面来思考如何实现一个好的项目架构，达到易维护、易扩展、模块和模块间的低耦合性，使用一些工具解决一些通用型问题等目的, 下面从以上几个方面来分析iview-admin的架构

## 模块化

简单来说，模块化就是将一个大文件拆分成相互依赖的小文件，再进行统一的拼装和加载，是在文件层面上对代码和资源进行拆分。

项目F的每个路由页面是一个单独.vue文件，这些.vue文件中同时杂糅了html，js和scss，稍微大点的页面已经可怕到有上千行代码了：

```
├─components
│  ├─common
│  ├─ 一个长达千行的xxx.vue
│  ├─ 另一个长达千行的xxx.vue
│  └─ ...
```


而来看一下iview-admin的文件结构：

```
├─views
│  ├─common-components
│  ├─error-pages
│  │   ├─error-page.vue
│  │   ├─error-page.less
│  │   ├─404.vue
│  │   ├─404.less
│  │   ├─500.vue
│  │   ├─500.less
│  │   ├─403.vue
│  │   └─403.less
│  └─tables
│      ├─components
│      ├─data
│      ├─xxx.vue
│      └─xxx.less
```

首先明显可以看到一点，iview-admin将less文件单独拆分开来了，这样一来.vue文件明显可以小很多，由此得出模块拆分点：将html结构和css样式拆分，如果页面复杂，我们甚至可以将js文件也拆分开来。这样可以使得每一个文件职责单一，易于维护。

## 组件化

先说一下组件化，组件化是在设计层面上，对UI（用户界面）的拆分。从UI角度拆分下来的每个包含模板(HTML)+样式(CSS)+逻辑(JS)的功能完备的结构单元，称之为组件。

接下来看一下error-pages文件夹下的error-page.vue文件：

```js
...

<Row>
    <div class="error-page-show">
        <error404></error404>
    </div>
    <div class="error-page-cover"></div>
</Row>

...

<Row>
    <div class="error-page-show">
        <error403></error403>
    </div>
    <div class="error-page-cover"></div>
</Row>

...

<script>
import Error404 from './404.vue';
import Error403 from './403.vue';
export default {
    components: {
        Error404,
        Error403
    }
}
</script>
```

可以发现，errorPage中的404，403等页面是被拆分成了单独的组件来处理不同error情况，这里更重要的是体现一种分治思想。封装组件本身，还要合理处理组件之间的关系，比如（逻辑）继承、（样式）扩展、（模板）嵌套和包含等。


## 规范化

### 公用方法库的封装

可以将共用方法库统一放到一个叫做lib的文件夹下，这个libs文件夹下可以包括共用的方法库utils，封装的ajax请求等，而一些高频共用的方法比如权限判断等则可以将其封装到一个对象比如auth中，一般非常的高频的方法不会太多，为了避免反复引入带来的麻烦，可以将这个auth对象定义到vue根实例中方便调用。

### 目录结构的制定

```
├─src
│  ├─App.vue
│  ├─main.js
│  ├─assets
│  ├─common-components
│  │         └─dialog
│  │            ├─src
│  │            │  └─main.vue
│  │            └─index.js
│  ├─global-mixins
│  ├─router
│  ├─libs
│  ├─pages
│  │   ├─page01
│  │   │    ├─components
│  │   │    │     ├─modal.vue
│  │   │    │     └─modal.css
│  │   │    ├─page01.vue
│  │   │    └─page01.css
│  │   ├─page02
│  │   ├─page03
│  │   ├─...
```

一般项目可以按以上方法进行构建
如果是大型项目，整个项目中可以将其按大的功能模块进行初步划分。这些大的功能模块可以但是成为上述结构中的pages。
