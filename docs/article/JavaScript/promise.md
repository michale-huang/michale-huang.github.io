# Promise异步编程原理初探

先来看下面，依次打印的结果是什么？
```js
let p = new Promise((resolve, reject) => {
    setTimeout(resolve, 100)
})
```