# 块级元素与行内元素

“块级”和“行内”是指元素的表现形式，是CSS中对元素的分类。

以下是W3C CSS2.1规范中对块元素和内联元素的定义：

> Block-level elements are those elements of the source document that are formatted visually as blocks (e.g., paragraphs). The following values of the ‘display’  property make an element block-level: ‘block’, ‘list-item’, and ‘table’.

> Inline-level elements are those elements of the source document that do not form new blocks of content; the content is distributed in lines (e.g., emphasized pieces of text within a paragraph, inline images, etc.). The following values of the ‘display’ property make an element inline-level: ‘inline’, ‘inline-table’, and ‘inline-block’. Inline-level elements generate inline-level boxes, which are boxes that participate in an inline formatting context.

## 块级的表现和控制

块级元素默认是从新的一行开始，多个块级元素按垂直方向排列。块级元素宽度默认是占满可填充的空间。看看效果：

```css
div{
    border: 1px solid red;
    margin-bottom: 10px;
}
```
```html
<body>
    <div>Div 1</div>
    <div>Div 2</div>
</body>
```

可以通过`width`属性设置宽度，通过`margin`属性设置外间距（上下左右四个方向都可以设置），通过`padding`属性设置内填充（上下左右四个方向都可以设置）。看看效果：

```css
#mydiv{
    border: 1px solid red;
    width: 400px;
    padding: 10px;
    margin: 10px;
}
```
```html
<body>
    <div id="mydiv">
        Long text here...
    </div>
</body>
```

## 行内的表现和控制

行内元素默认在同一行显示，默认宽度就是内容的所填充的空间。对行内元素设置width, height, 垂直方向margin无效。

```css
div{
    border: 1px solid #000;
}
.block{
    margin-bottom: 10px;
}
.inline{
    border: 1px solid red;
    margin-top: 100px;/* 无效 */
    margin-bottom: 100px;/* 无效 */
    margin-left: 100px;
    padding-top: 100px;
    padding-left: 100px;

    width: 600px;/* 无效 */
    height: 50px;/* 无效 */

    line-height: 50px;
}
```
```html
<body>
    <div class="block">
        BlockBlockBlockBlockBlockBlockBlockBlockBlockBlockBlock
    </div>
    <div>
        <span class="inline">Inline</span> 123
    </div>
</body>  
```



