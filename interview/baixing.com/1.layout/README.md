![设计图](http://bizresponsible.com/images/test1.jpg)


# 写一个百姓网首页列表


## 1. 要求

- 语义化
- 模块化
- 兼容所有主流浏览器（IE6+ / Chrome / Firefox / Safari / Opera）
- 适合后台程序循环输出逻辑

## 2. 解决方案

1. HTML语义化：
   * 尽量采用用有意义的标签，为标签添加适当的属性
   * HTML结构尽量保持简单清晰
   * Class命名采用中横线分割，以名词叠加方式区分层次

2. 模块化
   * 将控制布局的样式与控制表现的样式分离： ui-container / ui-box
   * 模块间相互独立，功能完备：第一，无论是ui-container / ui-box离开了彼此，都仍是可以正常工作的；第二，模块高度独立，功能完备，在总页面上加载了base.css，里面有一些css reset的代码，尝试不加载base.css，页面总体布局仍然正常。
   * 模块粒度问题：应当需要考虑到ui-box-list内样式可能出现的变化。例如新版百姓网中采用了小字体显示子分类；这个变化应当被封装在ui-box内，不可再分。可以向ui-box-list的目标标签再添加另一个class例如：list-style-one；然后样式表内：.ui-box .list-style-one定义新样式。

3. 兼容性
   * 原则是：写法优先，尽量避免写Hack；
   * 向下兼容方案：只要在不破坏布局的情况下，允许浏览器间的细微差异。
   * 处理IE BUG的方法：针对IE对应的浏览器写一份新的样式。

4. 适合后台程序循环输出逻辑
   * 在开始构建HTML结构前，观察设计图，结合可能的数据结构，规划好HTML结构

## 3. 文件目录结构说明

```html
---
  |---- css/                                 样式文件夹
        |---- base.css                       Alice(https://github.com/alipay/alice)样式库的的基础，所有样式均基于它
        |---- screen.css                     主样式文件
        |---- responsive.css                 响应式样式  
        |---- ie6.css                        针对IE 7以下浏览器的Hack样式
  |---- dynamic/                             一个动态数据的demo文件夹
        |---- function.php                   公用函数
        |---- index.php                      动态数据的demo
  |---- index.html                           演示入口文件
  |---- readme.md
```

