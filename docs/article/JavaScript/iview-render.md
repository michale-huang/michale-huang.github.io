# iview render的使用
table组件的column中使用render函数，可以自定义渲染当前列，包括渲染自定义组件，它基于 Vue 的 Render 函数

使用渲染函数的例子：
 ```js
 Vue.components('my-components', {
    render: function (createElement) {
        return createElement('h1', this.text)
    },
    props: {
        title: {
            default: '',
            required: true
        }
    }
})
 ```
上述createElement函数到底返回的是什么？

其实并不是一个实际的 DOM 元素。它更准确的名字可能是`createNodeDescription`，因为它所包含的信息会告诉 Vue 页面上需要渲染什么样的节点，及其子节点。我们把这样的节点描述为“虚拟节点 (`Virtual Node`)", 也常简写它为“VNode”。“虚拟DOM”是我们对由Vue组件树建立起来的整个 VNode 树的称呼。

> 将 h 作为 createElement 的别名是 Vue 生态系统中的一个通用惯例，实际上也是 JSX 所要求的，如果在作用域中 h 失去作用，在应用中会触发报错。

 [参考:Vue的render函数](https://www.w3cplus.com/vue/vue-render-function.html)