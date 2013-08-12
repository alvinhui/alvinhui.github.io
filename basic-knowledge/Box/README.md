# 盒模型

一个盒包括了内容(content)、边框(border)、内边距(padding)、外边距(margin)。下图展示了盒模型的直观意义：
![盒子模型](http://www.w3.org/TR/2011/REC-CSS2-20110607/images/boxdim.png)

盒的尺寸（width与height）定义受到box-sizing属性的影响。box-sizing可选择content-box(现代浏览器默认), padding-box和border-box三种模式。

在默认情况下（box-sizing: content-box）盒子本身的大小是这样计算的：

```
Width     width + padding-left + padding-right + border-left + border-right
Height    height + padding-top + padding-bottom + border-top + border-bottom
```

根据 W3C 的规范，元素内容占据的空间是由 width 属性设置的，而内容周围的 padding 和 border 值是另外计算的。不幸的是，IE5.X 和 6 在怪异模式中使用自己的非标准模型。这些浏览器的 width 属性不是内容的宽度，而是内容、内边距和边框的宽度的总和。

```css
#mydiv{
    border: 1px solid red;
    width: 400px;
    padding: 10px;
}
/* ie7+和现代浏览器中，该层所占宽度为422px */
/* ie5, ie6中，该层所占宽度为400px */
```

在现代浏览器中，可以设置`box-sizing: border-box`达到和ie6-怪异模式中的效果。
