# 函数柯里化 :full_moon_with_face:

## 前言
随着函数式编程的迅速发展，函数柯里化在许多应用程序中已经变得很普遍。 了解它们是什么，它们如何工作,以及如何充分利用它们非常重要。

## 定义
> 函数柯里化是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回 接受余下的参数而且返回结果的新函数的技术。

通俗一点说就是一种将使用多个参数的函数转换成一系列使用一个参数的函数的技术。

举个例子，一个接收3个参数的普通函数，在进行柯里化后，柯里化版本的函数a接收一个参数并返回接收下一个参数的函数b，函数b返回一个接收第三个参数的函数c，函数c在接收第三个参数后，将之前接收到的三个参数应用于原普通函数中，执行原普通函数并返回最终结果。将柯里化函数的思路应用到Javascript中，实际则是可以传递一个或多个参数。

## 作用
了解了柯里化函数是什么，那么它的作用呢？

### 一、参数复用
柯里化实际是把简单的问题复杂化了，但是复杂化的同时，让我们在使用函数时拥有了更多的自由度。 而对于函数参数的自由处理，正是柯里化的核心所在。 柯里化本质上是降低通用性，提高适用性。来看一个例子：

我们工作中会遇到各种需要通过正则检验的需求，比如校验电话号码、校验邮箱、校验身份证号、校验密码等，
这时我们会封装一个通用函数 `checkByRegExp` ,接收两个参数，校验的正则对象和待校验的字符串:
```js
function checkByRegExp(regExp,string) {
    return regExp.test(string)
}

checkByRegExp(/^1\d{10}$/, '18642838455'); // 校验电话号码
checkByRegExp(/\d{18}$/, '12345678910111213141516'); // 校验身份证号码
checkByRegExp(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/, 'test@163.com'); // 校验邮箱
```
上面这段代码，乍一看没什么问题，可以满足我们所有通过正则检验的需求。

但是我们考虑这样一个问题，如果我们需要校验多个电话号码或者校验多个邮箱呢？我们可能会这样做：
```js
checkByRegExp(/^1\d{10}$/, '18642838455'); // 校验电话号码
checkByRegExp(/^1\d{10}$/, '13109840560'); // 校验电话号码
checkByRegExp(/^1\d{10}$/, '13204061212'); // 校验电话号码

checkByRegExp(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/, 'test@163.com'); // 校验邮箱
checkByRegExp(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/, 'test@qq.com'); // 校验邮箱
checkByRegExp(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/, 'test@gmail.com'); // 校验邮箱
```
我们每次进行校验的时候都需要输入一串正则，再校验同一类型的数据时，相同的正则我们需要写多次，
这就导致我们在使用的时候效率低下，并且由于 `checkByRegExp` 函数本身是一个工具函数没有任何意义，
一段时间后我们重新来看这些代码时，如果没有注释，我们必须通过检查正则的内容才能知道我们校验的是电话号码还是邮箱，还是别的什么。

此时，我们可以借助柯里化对 `checkByRegExp` 函数进行封装，以简化代码书写，提高代码可读性。
```js
//进行柯里化
let _check = curry(checkByRegExp);
//生成工具函数，验证电话号码
let checkCellPhone = _check(/^1\d{10}$/);
//生成工具函数，验证邮箱
let checkEmail = _check(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/);

checkCellPhone('18642838455'); // 校验电话号码
checkCellPhone('13109840560'); // 校验电话号码
checkCellPhone('13204061212'); // 校验电话号码

checkEmail('test@163.com'); // 校验邮箱
checkEmail('test@qq.com'); // 校验邮箱
checkEmail('test@gmail.com'); // 校验邮箱
```
再来看看通过柯里化封装后，我们的代码是不是变得简洁又直观了呢。
经过柯里化后，我们生成了两个函数 `checkCellPhone` 和 `checkEmail`，
`checkCellPhone` 函数只能验证传入的字符串是否是电话号码，
`checkEmail` 函数只能验证传入的字符串是否是邮箱，
它们与原函数 `checkByRegExp` 相比，从功能上通用性降低了，但适用性提升了。
柯里化的这种用途正是：**参数复用**

### 二、提前返回
比如在下面实现柯里化的[方法一](/article/JavaScript/curring.html#方法一)中, 可以在柯里化函数的时候进行一些操作，方法一中即返回函数`collectParams`之前做一些操作，这些操作是在实际传入参数并调用原目标函数之前就能进行的，即提前返回。
### 三、延迟执行
这点其实非常直观，因为不是直接返回运算结果，而是返回新函数，直到参数收集完毕再执行并返回结果，当然也就是延迟运行。

## 如何实现
回想一下柯里化函数的作用是什么：接收一部分参数，返回一个函数接收剩余参数，接收到足够参数后，执行原函数。那么我们需要在多个函数调用中逐步收集参数，而不是在一个函数调用中一次收集，当收集到足够的参数时，返回函数执行结果。

我们可以从一个简单的模拟即**参数收集**开始：
```js
var collectParams = function() {
  console.log(arguments)
  return collectParams.bind(null, ...arguments)
}

var fn = collectParams(1); //[1]
fn = fn(2); //[1, 2]
fn = fn(3); //[1, 2, 3]
fn = fn(4); //[1, 2, 3, 4]
```
在`collectParams`内部，`bind()`方法创建一个新的函数，在`bind()`被调用时，这个新函数的`this`被`bind`的第一个参数指定，其余的参数将作为新函数的参数供调用时使用，而且这些参数将位于之后调用新函数时传的参数之前，因此，我们实现了逐步将参数收集到数组中的这么一个功能。（注意：此处`bind`的第一个参数传入`null`，非严格模式下，实际应用的是默认绑定规则，此时函数的`this` 指向全局对象(node环境为`global`，浏览器环境为`window`，严格模式抛出错误）

实现了参数收集之后，我们还需要解决两个问题：
1. 指定收集参数的终止点，不能一直无限收集参数撒
2. 参数收集终止后需要传递给原函数

第一个问题，即当收集的参数个数达到所期望的参数个数时停止收集，我们可以使之默认为原函数的形参个数，利用函数的`length`属性

第二个问题，既然需要将收集到的参数传递给原函数，那么我们需要在某处保留对原函数的引用，以便在适当时候调用它。

关于第二个问题，网上很不少解决的例子，但总归来说就是：除去存储参数以外，我们还需要在某处存储对于目标函数的引用。这里我把它们分为两种不同的方法，它们之间或多或少都有相似之处，理解它们能够帮助我们更好地理解背后的逻辑。

### 方法一
通过闭包保存对原函数的引用：
```js
var curry = function(targetFunc) {
    return function collectParams() {
        if (targetFunc.length > arguments.length) {
            return collectParams.bind(null, ...arguments)
        } else {
            targetFunc.apply(null, arguments)
        }
    }
}
// 让我们来检验一下：
function sum(a, b, c) {
    console.log(a + b + c)
}
var currySum = curry(sum)
currySum(1,2,3) // 6
currySum(1)(2)(3) // 6
currySum(1)(2,3) // 6
currySum(1, 2)(3) // 6
```

### 方法二
直接将`curry`用作参数收集器:
```js
var curry = function(targetFunc) {
    if (targetFunc.length > arguments.length - 1) {
        return curry.bind(null, ...arguments)
    } else {
        // 此处由于curry的第一个参数是原函数，所以需要去掉
        targetFunc.apply(null, Array.prototype.slice.call(arguments, 1))
    }
}
function sum(a, b, c) {
    console.log(a + b + c)
}
var currySum = curry(sum)
currySum(1,2,3) // 6
currySum(1)(2)(3) // 6
currySum(1)(2,3) // 6
currySum(1, 2)(3) // 6
```
有了上述基础，让我们再来看一下lodash的柯里化是怎样的：

`curry(func, [arity=func.length])`

可以看到`curry`接受两个参数，一个是原函数，另一个可选参数，是所需参数个数，默认是原函数的形参个数，和我们上述的两个方法基本类似。除此之外，lodash的`curry`还允许使用`_`(即lodash对象)作为输入参数的占位符, 并通过占位符的方式来改变传入参数的顺序。当传入一个占位符，本次调用传递的参数将略过占位符， 占位符所在的位置由下次调用的参数来填充，比如这样：

`curried(1)(_, 3)(2); // => [1, 2, 3]`

使用占位符，目的是改变参数传递的顺序，所以在 `curry` 函数实现中，每次需要记录是否使用了占位符，并且记录占位符所代表的参数位置。接下来我们来实现占位符的功能:
```js
function curry (targetFn, arity = targetFn.length, placeholder = myCurry, params = [], holders = []) {
    let _params = [] // 用于记录传入的原始参数
    return function collectParams (...args) {
        // copy一份占位符位置列表，避免造成混乱
        let _holders = Object.assign([], holders)
        // 每次调用柯里化后的函数时传入的参数
        let nextArgs = args.slice(_params.length)
        //循环入参，追加参数或替换占位符
        nextArgs.forEach(item => {
            if (item !== placeholder) {
                // 参数为真实参数
                if (holders.length) {
                    // 之前存在占位符，将占位符替换为真实参数
                    let index = holders.shift()
                    params[index] = item
                    _holders.splice(_holders.indexOf(index), 1)
                } else {
                    // 之前不存在占位符，直接将参数追加到参数列表中
                    params.push(item)
                }
            } else {
                // 参数为占位符
                if (holders.length) {
                    // 之前存在占位符，去除掉原占位符
                    holders.shift()
                } else {
                    // 之前不存在占位符，记录占位符的位置
                    params.push(item)
                    _holders.push(params.length - 1)
                }
            }
            _params.push(item)
        })
        // params 中前arity条记录中不包含占位符，执行函数
        if(params.length >= arity && Object.assign([],params).every(item => item !== placeholder)){
            let paramsBackup = Object.assign([], params)
            // 完成一次原目标函数的调用后进行一次reset
            params = []
            _params = []
            holders = []
            return targetFn.apply(this, paramsBackup)
        } else {
            holders = _holders
            return collectParams.bind(null, ...arguments)
        }
    }
}
// 检查一下：
function print(a, b, c, d, e) {
    console.log('print: ', a, b, c, d, e)
}

var _ = '_' // 定义占位符
var curryPrint = curry(print, 5, _)

curryPrint(1, 2, 3, 4, 5)                 // 1 2 3 4 5
curryPrint(_, 2, 3, 4, 5)(7)              // 7 2 3 4 5
curryPrint(1, _, 3)(_, 4, _)(2)(8)        // 1 2 3 4 8
curryPrint(1, _, _, 3)(_, 4, _)(2)(9)     // 1 2 4 3 9
```
至此，我们完整地实现了一个`curry`函数

## 结语
柯里化是函数式编程的产物，它生于函数式编程，也服务于函数式编程。由于把 JavaScript 代码写得符合函数式编程思想和规范的在实际项目较少，从而也限制了 Currying 等技术在 JavaScript 代码中的普遍使用。

假如我们还没有准备好去写函数式编程规范的代码，仅需要在 JSX 代码中提前绑定一次参数，那么 bind 或箭头函数就足够了，Currying 可以有更好的替代品。

柯里化的思想极大地助于提升函数的复用性， 也让我们在使用函数时有了很多的自由度。总之函数式编程及其思想，是值得关注、学习和应用的事物。

## 参考文章
[Implementation of lodash ‘curry’ function](https://medium.com/@kj_huang/implementation-of-lodash-curry-function-8b1024d71e3b)

[前端进阶-彻底搞懂柯里化](https://juejin.im/post/5d2299faf265da1bb67a3b65)

[柯里化了解一下](https://juejin.im/post/5af13664f265da0ba266efcf#heading-8)
