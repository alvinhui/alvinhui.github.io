# 盒模型

一个盒包括了内容(content)、边框(border)、内边距(padding)、外边距(margin)。下图展示了盒模型的直观意义：
![盒子模型](http://www.w3.org/TR/2011/REC-CSS2-20110607/images/boxdim.png)

盒的尺寸（width与height）定义受到box-sizing属性的影响。box-sizing可选择content-box(默认), padding-box和border-box三种模式。

在默认情况下（box-sizing: content-box）盒子本身的大小是这样计算的：
> Width     width + padding-left + padding-right + border-left + border-right

> Height    height + padding-top + padding-bottom + border-top + border-bottom
