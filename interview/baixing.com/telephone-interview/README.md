# 电话面试

## 初步了解

- 做个简单的自我介绍，说说为什么从事前端开发？
- 介绍一下现在的公司以及公司的主营项目，描诉一下你在团队中的角色以及在项目中所担任的职责。
- 项目有什么可以优化的地方，如要重构，思路是怎样的。

## 针对线上测试第一题

- meta content属性内特性的兼容情况如何？例如target-densitydpi

    ```html
    <meta name="viewport" 
    content="
    target-densitydpi=device-dpi, 
    width=device-width, 
    initial-scale=1.0, 
    maximum-scale=1">
    ```

- 语义化和UI组件化的衡量：组件内如何写h标签？考虑组件可能放到任何的层次里，但是我又想用h3,h4等标签，如何处理？
- 响应式的体验问题，针对手机写的响应式应该要有更适合手机显示的样式。
- 你最常用的HTML 5标签有哪些？适用场景是什么？以百姓网为例说明那些地方适用header,nav,footer等。
- 你最常用的HTML标签有哪些？说说 ol/ul/dl 标签的适用场景：以百姓网，新微博为例。
- 你最常用的CSS选择器有哪些？说说怎么使用这些选择器。

## 针对线上测试第二题 

- 使用requireJS带来了什么实际好处？
- 为什么要尽量减少http文件请求？并行加载不行吗？
- autofocus属性为什么会被html5内置实现？

## 针对线上测试第三题

- mouseover和mouseenter的区别，mouseenter兼容情况如何？不兼容的浏览器如何实现监听该事件？
- 事件监听的声明是按顺序执行的吗？

    ```javascript
    $('a').bind('click', function(){
        alert(1);
    });
    $('a').bind('click', function(){
        alert(2);
    });
    ```

- Juqery为event对象加入的新方法e.stopImmediatePropagation()意义何在？
