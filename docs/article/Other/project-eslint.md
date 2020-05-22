# 项目eslint配置

### 问题：
1. 项目中配置了eslintrc.js但无效，不符合规则的代码不报错

2. vscode中检测不出不符合规则的代码

只对js文件有效，settings.json配置了如下language依然无效
```js
 "eslint.validate": [
        "javascript",
        "javascriptreact",
        {
          "language": "html",
          "autoFix": true
        },
        {
          "language": "vue",
          "autoFix": true
        }
    ]
```
`"vetur.validation.template": true`设置后能对.vue中的`template`部分进行校验，但是下面的script依然没用
