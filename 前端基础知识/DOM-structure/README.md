# DOM结构

1. 两个节点可能存在的关系：
    * 父子
    * 兄弟

2. 节点间移动：

    HTML结构:
    ```html
    <div id="div1">123
        <span id="span1">span1</span>
        <span id="span2">span2</span>
    </div>
    <div id="div2">
        <span id="span3">span3</span>
        <span id="span4">span4</span>
    </div>
    ```
    当前节点为node，`var node = document.getElementById('span3')`<br>

    1. parentNode

        移动到父节点：`node.parentNode`

        ```javascript
        var nodeParent = node.parentNode;
        console.log(nodeParent.id);//div2
        ```

    2. previousSibling

        移动到上一个兄弟节点：`node.previousSibling` 

        ```javascript
        var nodeParentPrev = nodeParent.previousSibling;
        console.log(nodeParentPrev);//blank text

        var nodeParentPrevPrev = nodeParentPrev.previousSibling;
        console.log(nodeParentPrevPrev.id);//div1
        ```

    3. childNodes

        返回所有子节点：`node.childNodes`（包含文本节点及标签节点）

        ```javascript
        console.log(nodeParentPrevPrev.childNodes);
        console.log(nodeParentPrevPrev.childNodes.length);//5: 2 blank text, 2 span, 1 text
        ```

    4. nextSibling

        移动到下一个兄弟节点：`node.nextSibling` 

        ```javascript
        console.log(nodeParentPrevPrev.firstChild.nextSibling.id);//span1 
        ```
    
    5. firstChild

        返回第一个子节点：`node.firstChild`

    6. lastChild     
        
        返回最后一个子节点： `node.lastChild` 

        ```javascript
         console.log(nodeParentPrevPrev.lastChild.previousSibling.id);//span2
        ```