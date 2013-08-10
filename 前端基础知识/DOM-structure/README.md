# DOM结构

1. 两个节点可能存在的关系：
    * 父子
    * 兄弟

2. 节点间移动：

    当前节点为node，<br>
    移动到父节点：`node.parentNode`<br>
    移动到上一个子节点：`node.nextSibling` <br>
    移动到下一个子节点：`node.previousSibling` <br>
    返回所有子节点：`node.childNodes`（包含文本节点及标签节点）<br>
    返回第一个子节点：`node.firstChild` <br>
    返回最后一个子节点： `node.lastChild` 