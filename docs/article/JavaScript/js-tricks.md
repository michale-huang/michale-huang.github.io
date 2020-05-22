# JavaScript中常用的小技巧

## 逻辑操作符

如果左右两边有一个操作数不是布尔值，则`&&`和`||`操作符就不一定返回布尔值，遵循以下规则：

> **逻辑非（||）**
> 看左边的值是真是假，如果是真，则返回左边值，如果是假，则返回右边值

> **逻辑与（&&）**
> 看左边的值是真是假，如果是真，返回的是右边的值; 如果是假，则返回左边的值；

*⚠️ 注：只有 false 、0、NaN、null、undefined、空字符串为假, 其余都是真*
 
根据以上规则，可以有以下一些例子：

 - 默认值 
```js
console.log(message || '默认提示信息')
```
如果message为非false 、0、NaN、null、undefined，则打印出message，否则打印出“默认提示信息”

 - 类似三元运算
 ```js
 console.log(isTrue && 'yes' || 'no')
 ```
 如果isTrue为true的话，则打印yes, 反之no

 - 类似if true
 ```js
 hasAuth() && getData()
 ```

当hasAuth()返回true时则执行getData()
 
## 按位非运算符

> 按位非运算 NOT 由否定号（~）表示，它是 ECMAScript 中为数不多的与二进制算术有关的运算符之一。
> 位运算 NOT 是三步的处理过程：
把运算数转换成 32 位数字
把二进制数转换成它的二进制反码（0->1, 1->0）
把二进制数转换成浮点数

举例子🌰：
 - 判断数组中是否有某元素
 ```js
 //易读
if(arr.indexOf(ele) > -1) {

}
 //简洁
if(~arr.indexOf(ele)) {

}
 ```
 - 更高效的parseInt
 ```js
 parseInt(value)
 ~~value //更搞笑
 ```
