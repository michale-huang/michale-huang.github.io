# TypeScript

#####
 `Experimental support for decorators is a feature that is subject to change in a future release. Set the 'experimentalDecorators' option to remove this warning.`
In VSCode, Go to File => Preferences => Settings (or Control+comma) and it will open the User Settings file. Add "javascript.implicitProjectConfig.experimentalDecorators": true to the file and it should fix it.
in tsconfig.json
```js
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "allowJs": true
  }
}
```
#####
`Cannot find module './App.vue'`
改了目录之后，tsconfig.json中的include需要加入examples相关文件
```js
{
  "include": [
    "examples/**/*.ts",
    "examples/**/*.tsx",
    "examples/**/*.vue",
    ...
}
```
#####
```shims-vue.d.ts and shims.tsx.d.ts文件```
The first file helps your IDE to understand what a file ending in .vue is

The second file allows you to use .tsx files while enabling jsx sytnax support in your IDE to write JSX-style typescript code.


#####
```error in src/shims-vue.d.ts: Duplicate identifier 'Vue'```
tsconfig.json
  "typeAcquisition": {
    "enable": false,
    "exclude": [ "node" ]
  }

#####
```Property 'Vue' does not exist on type 'never'```
interface Foo {
  name: string;
}
let instance: Foo | null = null
访问instance.name会报错
```js
let instance: Foo | null = getFoo()
// 或者
if (instance == null) {
    console.log('Instance is null or undefined');
} else {
    console.log(instance!.name); // ok now
}
```

`window.test`报错
如下：`(window as any).test`即可

##### .d.ts文件
类型定义文件，typescript中有几类诸如string，number的类型，但有事需要定义自己的类型，就写在types里面，比如：
```js
// 对象
type user = {
  name:string,
  age:number
}
// 方法
type sayHello = (name:string) => string
// 类
type chen = {
  name:string,
  say: (age:number) => string
}
```

[解释](https://tasaid.com/blog/20171102225101.html)

##### vue-class-component 类式vue组件