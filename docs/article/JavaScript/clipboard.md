# 原生JS实现粘贴到剪贴板

本文主要讨论原生方法，有时候项目一个小地方需要用到，直接上第三方库显得不够优雅

目前常见的实现粘贴到剪贴板主要有以下两种方法：

 - 第三方库 [clipboard](https://github.com/zenorocha/clipboard.js/)
 - 原生JS, 主要是 `document.execCommand`方法

第一种方法按照文档说明，设置触发元素的`data-clipboard-text` 或者 `data-clipboard-target`即可，不做说明，[详见文档](https://github.com/zenorocha/clipboard.js/)

第二种方法：
`document.execCommand`

这个方法的兼容性其实不算很好，特别是移动端，具体[这里](https://caniuse.com/#search=execCommand)有, 但clipboard针对部分机型也有问题，所以具体使用还是得看情况， 因此使用该方法前检查浏览器是否支持很有必要`bool = document.execCommand('copy')`

[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand)对上述方法的解释如下：

> 当一个HTML文档切换到**设计模式** designMode时，文档对象暴露 execCommand 方法，该方法允许运行命令来操纵**可编辑区域**的内容。

注意加粗部分，*设计模式* ，即：使用前我们需切换文档模式为设计模式
```js
document.designMode = 'on'
```
完成运行命令之后再设置值为`off`

还有个加粗部分，*可编辑区域* ，默认的input和textarea元素是可编辑(设置一个元素的`contenteditable="true"`也可激活元素的编辑模式)

先来看表单元素如何实现
```js
ele.addEventListener('click', () => {
    document.designMode = 'on'
    let bool = document.execCommand('copy')
    if (!bool) {
        alert('sorry, 手动复制吧')
    } else {
        let val = 'something'
        let inputEle = document.createElement('input')
        document.body.appendChild(inputEle)
        inputEle.setAttribute('value', val)
        inputEle.setAttribute('readonly', 'readonly')
        inputEle.select()
        document.execCommand('copy')
        document.body.removeChild(inputEle)
        alert('copied')
    }
    document.designMode = 'off'
})
```

为避免出现光标或者拉起输入法，需要给元素设置`readonly`属性

inputEle.select()方法在一些浏览器中有时不能选中所有内容，这时需要利用inputeElement的`setSelectionRange`方法：

> HTMLInputElement.setSelectionRange 方法可以从一个被 focused 的 input
> 元素中选中特定范围的内容。

综上加两行：
```js
...
inputEle.focus()
inputEle.setSelectionRange(0, inputEle.value.length)
document.execCommand('copy')
...
```

如果不是`input`等表单元素，不能使用`select`和`setSelectRange`的话，那么我们可以使用`getSelection`和`createRange`方法来模拟这个过程了，`Selection`对象表示用户选择的文本范围或光标的当前位置，满足执行execComman命令的可编辑活动区域，如下
```js
let range = document.createRange()
let tar = document.querySelector('#code')
range.selectNodeContents(tar)
let selection = window.getSelection()
selection.removeAllRanges()
selection.addRange(range)
document.execCommand('copy')
selection.removeAllRanges()
```
上述针对非input，textarea等表单元素也能实现了


