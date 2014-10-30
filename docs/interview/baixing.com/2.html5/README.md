# 使用任何一个以上的 HTML5 特性完成百姓网某个页面/模块/组件


## 1. 要求

- 在百姓网上找到一个应用场景
- 使用一个以上 HTML5 特性
- 说明实现对现有功能上增强的点
- 考虑不支持浏览器的兼容解决方案

## 2. 解决方案

### 应用场景
百姓网登录功能：表单

### 使用一个以上 HTML5 特性
1. 表单新的 input 属性：placeholder
2. 表单新的 input 属性：required
3. 表单新的 input 属性：autofocus

### 说明实现对现有功能上增强的点
1. placeholder 属性提供一种提示（hint），描述输入域所期待的值。
   * 百姓网登录表单已经用上了，但是在ie7下有一个双input的bug。具体请看下面2图：
![IE7 bug 1](http://bizresponsible.com/images/test2.png)
![IE7 bug 2](http://bizresponsible.com/images/test3.png)
2. required 属性规定必须在提交之前填写输入域（不能为空）。
   * 使用该属性能减少不少js验证代码，并且能让用户更快地获得的反馈。
2. autofocus 属性规定在页面加载时，域自动地获得焦点。
   * 使用该属性能让用户快速定焦表单，减少用户操作，提高用户体验。

### 考虑不支持浏览器的兼容解决方案
1. placeholder：引用alice的工具库兼容低版本浏览器[http://aralejs.org/placeholder/](http://aralejs.org/placeholder/)，做了少量的修改。
2. required：判断浏览器是否支持required属性，不支持则为form添加submit事件处理,查找所有含有required属性的input，当遇到input的value为空时，阻止表单提交，显示错误提示，定焦元素。
3. autofocus：判断浏览器是否支持autofocus属性，不支持则触发最后一个表单最后一个含有autofocus属性的input获得焦点。

## 3. 文件目录结构说明

```html
---
  |---- www/                                    项目文件夹
        |---- css                               样式表文件夹
              |---- base.css                    基础样式表
              |---- screen.css                  主样式表
        |---- js                                js文件夹
              |---- libs                        基础库    
                    |---- jquery                DOM操作库                    
              |---- plugins                     插件库 - 外部引用
                    |---- jquery.placeholder    UI组件
              |---- requirejs                   require.js
              |---- tools                       工具库 - 自主编写的工具函数
                    |---- clickFeedback.js      绑定document的click事件，若是非传入节点则反馈             
                    |---- testInputAttr.js      测试浏览器是否支持html5的input新属性
              |---- app.js                      主应用js
              |---- main.js                     requireJS配置文件
        |---- index.html                        响应式样式  
  |---- www-production/                         生产环境文件夹
  |---- tools                                   构建工具箱
        |---- build.js                          构建规则
        |---- r.js                              requireJS提供的构建工具
        |---- rebuild.txt                       构建过程记录
        |---- rebuild-www-production.sh         构建自动处理shell文件
  |---- readme.md
```

