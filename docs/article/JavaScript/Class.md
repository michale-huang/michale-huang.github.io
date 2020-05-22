# Class :herb:

## 简介

### 概述

ES6 提供了更接近传统语言的写法，引入了 Class（类）这个概念，作为对象的模板。通过class关键字，可以定义类。

基本上，ES6 的class可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的class写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。

```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
};

var p = new Point(1, 2);

// 对比

Class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    toString() {
        return return '(' + this.x + ', ' + this.y + ')';
    }
}

// ES5 的构造函数Point，对应 ES6 的Point类的构造方法。
typeof Point // "function"
Point === Point.prototype.constructor // true
```

ES6 的类，完全可以看作构造函数的另一种写法。

```js
class B {}
let b = new B();

b.constructor === B.prototype.constructor // true
```
在类的实例上面调用方法，其实就是调用原型上的方法。

```
Point.prototype.constructor === Point // true
```
prototype对象的constructor属性，直接指向“类”的本身，这与 ES5 的行为是一致的。

```js
Class Point {
    ...
}
Object.keys(Point.prototype)
// []
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]

function Point (x, y) {
    ...
}
Object.keys(Point.prototype)
// ["toString"]
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]
```
类的内部所有定义的方法，都是不可枚举的（non-enumerable）,上述toString方法是Point类内部定义的方法，它是不可枚举的。这一点与 ES5 的行为不一致。

### constructor 方法

`constructor`方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。一个类必须有`constructor`方法，如果没有显式定义，一个空的`constructor`方法会被默认添加。

类必须使用new调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用new也可以执行。

### 类的实例

与ES5一致， 实例的属性除非是显示定义在其本身，否则都是定义在其原型上的
```js
class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }

}

var point = new Point(2, 3);

point.toString() // (2, 3)

point.hasOwnProperty('x') // true
point.hasOwnProperty('y') // true
point.hasOwnProperty('toString') // false
point.__proto__.hasOwnProperty('toString') // true

// 所有实例共享一个原型
var point2 = new Point(1, 2)
point.__proto__ === point2.__proto__ // true
```
`point`实例本身拥有的属性只有x, y 而没有toString， toString是在其原型上的，同时，类的所有实例共享一个原型对象，上述与ES5一致

### 取值函数（getter）和存值函数（setter）

与 ES5 一样，在“类”的内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。

存值函数和取值函数是设置在属性的 Descriptor 对象上的， 可通过`Object.getOwnPropertyDescriptor`获得

### 补充点
1. 类不存在变量提升（hoist）,如下会报错
```js
new Foo() // ReferenceError
Class Foo {
    ...
}
```
其实是跟继承有关，看个例子
```js
let Foo = Class {}
Class Bar extends Foo {
    ...
}
```
想象一下，如果类允许提升的话，那么Bar被提升，此时bar继承foo的时候就会报错了，因为Foo由let定义，还处于暂时性死区还没有定义，所以class被设计为是不能提升的

2. 静态方法

类相当于实例的原型，所有定义在类中的方法都会被实例继承，但如果在一个方法前面加上`static`关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这样的方法就称为 静态方法。
```js
class Foo {
    static bar () {
        return 'test'
    }
}
let a = new Foo()
a.bar() // TypeError: foo.classMethod is not a function
```
注意，静态方法中的`this`指向的就是当前类
```js
class Foo {
    static baz () {
        this.bar()
    }
    static bar () {
        console.log(1)
    }
    bar () {
        console.log(2)
    }
}
Foo.baz() // 1
```
上述静态方法baz调用了`this.bar()`，这里的`this`指向的是Foo类，等同于调用`Foo.bar()`
上述例子可看出，静态方法与非静态可以重名。

3. 实例属性的写法

实例的属性除了可以定义在constructor上，也可以直接写在类的顶层，建议采用这种写法，使得实例的属性一目了然。
```js
class Foo {
    _bar = 12
    _baz = 34
    constructor () {
        // ...
    }
    add () {
        this._bar++
    }
}
let a = new Foo()
let b = new Foo()
a.add()
a._bar // 13
b._bar // 12
console.log(Foo.prototype) // {constructor: ƒ, add: ƒ}
```
注意，直接写在类中的普通方法实际上是定义在类的原型上，而属性则不在原型上的，而在实例上的。所以打印Foo类的原型对象只有`constructor`方法和`add`方法，没有`_bar`、`_baz`属性。

4. new.target

ES6 为new命令引入了一个new.target属性，该属性一般用在构造函数之中，返回new命令作用于的那个构造函数。

如果构造函数不是通过new命令或Reflect.construct()调用的，new.target会返回undefined。

子类继承父类时，`new.target`返回的是子类,利用这个属性，可以写出不能独立使用只能继承后才能使用的类：
```js
class Foo {
    constructor () {
        if (new.target !== Foo) {
            console.log('本类不能直接实例化')
        }
    }
}
class Bar extends Foo {
    constructor () {
        super()
    }
}
```
## 继承
### 简介
#### es6如何做到继承？
```js
class Foo {
    constructor() {
        // ...
    }
}

class Bar extends Foo {
    constructor () {
        super()
        // ...
    }
}
```
上述例子即实现了子类Bar继承父类Foo, 其中子类Bar的constructor中的super，表示父类的构造函数，是用来新建父类的实例对象的。

在子类的constructor中必须调用super方法。这是因为子类并没有自己的this对象，而是需要调用super通过父类的构造函数来得到，同时也获得了与父类同样的实例属性和方法；然后再在得到的this对象基础上进行加工, 因此如果不调用super,就会报错：
```js
class Bar extends Foo {
    constructor () {
        this.baz = 1 // ReferenceError
        super()
        this.baz = 1 // 正确
    }
}
```
#### es5与es6的继承机制的异同
从这里也可看出es5与es6的继承机制的不同之处，es5是先创建子类的实例对象this, 再将父类的属性方法添加到其this上（`Parent.apply(this)`），而es6则是子类一开始没有实例对象this, 通过super继承父类的this后，才能对其进行加工加上子类自己的实例属性和方法。

如果子类没有显示定义constructor方法，这个方法也会被默认添加，代码如下：
```js
class Bar extends Foo {
}

// 等同于
class Bar extends Foo {
  constructor(...args) {
    super(...args)
  }
}
```
注意下面例子，`new.target`指向当前正在执行的函数：
```js
class A {
  constructor() {
    console.log('running', new.target.name)
  }
}
class B extends A {
  constructor() {
    super()
  }
}
let a = new A() // running A
let b = new B() // running B
```
可以看到在生成B的实例时，输出正在执行的是子类 B 的构造函数而不是父类A的构造函数。即super虽然代表了父类A的构造函数，但是返回的是子类B的实例， 其内部的this实际指向的是B的实例，因此`super()`在这里相当于`A.prototype.constructor.call(this)`。

下面是生成子类实例的代码：
```js
let b = new Bar()

b instanceof Bar // true
b instanceof Foo // true
```
上面代码中，实例对象b同时是Bar和Foo两个类的实例，这与 ES5 的行为完全一致。

最后，父类的静态方法，可以被子类继承。
```js
class Foo {
  static classMethod() {
    return 'hello';
  }
}

class Bar extends Foo {
}

Bar.classMethod() // 'hello'
```

### Object.getPrototypeOf
Object.getPrototypeOf() 方法返回指定对象的原型（内部[[Prototype]]属性的值）

```js
Object.getPrototypeOf(Bar) === Foo
// true
```
因此，可以使用这个方法判断，一个类是否继承了另一个类。

### super 关键字
第一种方式是作为函数使用，只能用在子类的构造函数之中，ES6 要求，子类的构造函数必须执行一次super函数。

第二种方式是作为对象使用, 由于对象总是继承自其他对象的，所以可以在任意一个对象中使用super关键字。
当在子类静态方法中使用，或者在子类普通方法中使用时，有以下几种规定：
>1. 用在静态方法之中，指向的是父类本身。
>2. 用在普通方法之中（包括constructor），指向的是父类的原型对象。
>3. 补充第2点，在子类普通方法中通过super来调用父类方法时，此时父类方法内部的this指向的是当前的子类实例。
>4. 补充第1点，在子类静态方法中通过super来调用父类方法时，此时父类方法内部的this指向的是当前的子类。

记住上述几个规定，来看下面的各种情况各会输出什么😊
```js
class A {
  p() {
    return 1
  }
}
A.prototype.q = 2

class B extends A {
  constructor() {
    super()
    console.log(super.p())
    console.log(super.q)
  }
}

let b = new B()
```
<details>
    <summary><b>答案</b></summary>
    <p>1, 2</p>
    <p>super对象用在普通方法之中，指向的是父类的原型对象</p>
</details>

```js
class A {
    static test () {
        console.log('from static')
    }
    test () {
        console.log('from instance')
    }
}
class B extends A {
    static myFunc () {
        super.test()
    }
    myFunc () {
        super.test()
    }
}
B.myFunc()

let b = new B()
b.myFunc()
```
<details>
    <summary><b>答案</b></summary>
    <p>from static,  from instance</p>
    <p>super对象用在静态方法之中，指向的是父类本身。</p>
    <p>子类B调用自身的静态方法myFunc时，此时myFunc内部的super指向的是父类A, 因此父类A的静态方法test被调用。</p>
    <p>当子类的实例调用其myFunc方法时，此时普通方法myfunc内部的super指向的是父类A的原型，因此父类A的普通方法test被调用</p>
</details>

```js
class A {
  q = 1
  constructor() {
    this.p = 2
  }
}

class B extends A {
  get valueP() {
    return super.p
  }
  get valueQ() {
    return super.q
  }
}

let b = new B()
console.log(b.valueP)
console.log(b.valueQ)
```
<details>
    <summary><b>答案</b></summary>
    <p>`undefined`,`undefined`</p>
    <p>父类的原型对象上并没有属性`p`,`q`，`p`,`q`均是定义在父类的实例上</p>
</details>

```js
class A {
  constructor() {
    this.x = 1
  }
  print() {
    console.log(this.x)
  }
}

class B extends A {
  constructor() {
    super()
    this.x = 2
  }
  myFunc() {
    super.print()
  }
}

let b = new B()
b.myFunc()
```
<details>
    <summary><b>答案</b></summary>
    <p>2</p>
    <p>super.print()虽然调用的是A.prototype.print()，但是A.prototype.print()内部的this指向子类B的实例，所以输出的是2，而不是1。也就是说，实际上执行的是super.print.call(this)</p>
</details>

```js
class A {
  constructor() {
    this.x = 1
  }
}

class B extends A {
  constructor() {
    super()
    this.x = 2
    super.x = 3
    console.log(super.x)
    console.log(this.x)
  }
}

let b = new B()
```
<details>
    <summary><b>答案</b></summary>
    <p>`undefined`  3</p>
    <p>当对`super.x`赋值时，我是这么理解的，实际上赋值的过程是调用的`setter`方法，在这个setter方法内部执行的是`this.x = value`, 那么根据上述第三条规则，this的指向实际上是子类B的实例，所以`super.x = 3`实际上是将B的实例属性x赋值为3，所以打印`this.x`的时候输出3</p>
    <p>而直接在普通方法中打印`super.x`就是打印父类A的原型对象上的属性x, 所以是`undefined`</p>
</details>

```js
class A {
  constructor() {
    this.x = 1
  }
  static print() {
    console.log(this.x)
  }
}

class B extends A {
  constructor() {
    super()
    this.x = 2
  }
  static test() {
    super.print()
  }
}

B.x = 3
B.test()
```
<details>
    <summary><b>答案</b></summary>
    <p>3</p>
    <p>根据第四条规则，父类A的静态方法print内部此时的this指向的是子类B本身，因此输出3</p>
</details>

### 类的 prototype 属性和__proto__属性
每一个对象都有`__proto__`属性，指向对应的构造函数的prototype属性
>（1）子类的__proto__属性，表示构造函数的继承，总是指向父类。
>
>（2）子类prototype属性的__proto__属性，表示方法的继承，总是指向父类的prototype属性。
```js
class A {
}

class B extends A {
}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```
如图：

![class-inherit](https://image-static.segmentfault.com/310/626/3106261649-5af2df69126e2_articlex)

再来讨论关键字`extends`，`extends`关键字后面可以跟多种类型的值。
```js
class B extends A {
    // ...
}
```
上面代码的A，只要是一个有prototype属性的函数，就能被B继承。由于函数都有prototype属性（除了Function.prototype函数），因此A可以是任意函数。

下面，讨论两种情况。第一种，子类继承Object类。
```js
class A extends Object {
}

A.__proto__ === Object // true
A.prototype.__proto__ === Object.prototype // true
```
这种情况下，A其实就是构造函数Object的复制，A的实例就是Object的实例。

第二种情况，不存在任何继承。
```js
class A {
    // ...
}

A.__proto__ === Function.prototype // true
A.prototype.__proto__ === Object.prototype // true
```
这种情况下，A作为一个基类（即不存在任何继承），就是一个普通函数，所以直接继承Function.prototype。但是，A调用后返回一个空对象（即Object实例），所以A.prototype.__proto__指向构造函数（Object）的prototype属性。
### 实例的 __proto__ 属性
子类实例的__proto__属性的__proto__属性，指向父类实例的__proto__属性。也就是说，子类的原型的原型，是父类的原型。
```js
class Point {
    // ...
}
class ColorPoint extends Point {
    // ...
}
var p1 = new Point(2, 3)
var p2 = new ColorPoint(2, 3, 'red')

p2.__proto__ === p1.__proto__ // false
p2.__proto__.__proto__ === p1.__proto__ // true
```
上面代码中，ColorPoint继承了Point，导致前者原型的原型是后者的原型。

因此，通过子类实例的__proto__.__proto__属性，可以修改父类实例的行为,如下：
```js
p2.__proto__.__proto__.printName = function () {
  console.log('Ha');
};

p1.printName() // "Ha"
```
上面代码在ColorPoint的实例p2上向Point类添加方法，结果影响到了Point的实例p1。
### 原生构造函数的继承
[详见](http://es6.ruanyifeng.com/#docs/class-extends)
### Mixin 模式的实现
Mixin 指的是多个对象合成一个新的对象，新对象具有各个组成成员的接口。它的最简单实现如下。
```js
const a = {
  a: 'a'
};
const b = {
  b: 'b'
};
const c = {...a, ...b}; // {a: 'a', b: 'b'}
```
上面代码中，c对象是a对象和b对象的合成，具有两者的接口。

下面是一个更完备的实现，将多个类的接口“混入”（mix in）另一个类。
```js
function mix(...mixins) {
  class Mix {
    constructor() {
      for (let mixin of mixins) {
        copyProperties(this, new mixin()); // 拷贝实例属性
      }
    }
  }

  for (let mixin of mixins) {
    copyProperties(Mix, mixin); // 拷贝静态属性
    copyProperties(Mix.prototype, mixin.prototype); // 拷贝原型属性
  }

  return Mix;
}

function copyProperties(target, source) {
  // 静态方法 Reflect.ownKeys() 返回一个由目标对象自身的属性键组成的数组。Reflect的所有属性和方法都是静态的（就像Math对象）
  for (let key of Reflect.ownKeys(source)) {
    if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}
```
上面代码的mix函数，可以将多个对象合成为一个类。使用的时候，只要继承这个类即可。
```js
class DistributedEdit extends mix(Loggable, Serializable) {
  // ...
}
