# DOM操作

## 创建节点

1. 创建元素节点

    使用 `document.createElement()` 来创建一个新的元素节点。

    ```javascript
    var eDiv =document.createElement('div');
    document.body.appendChild(eDiv);
    ```

2. 创建属性节点

    使用 `document.createAttribute()` 来创建一个新的属性节点。

    ```javascript
    var attr = document.createAttribute('data-name');
    attr.nodeValue = 'value';
    eDiv.setAttributeNode(attr);
    ```

3. 创建文本节点

    使用 `document.createTextNode()` 来创建新的文本节点。

    ```javascript
    var nText = document.createTextNode('Hello word!');
    eDiv.appendChild(nText);
    ```

4. 创建注释节点

    使用 `document.createComment()` 方法创建一个新的注释节点。

    ```javascript
    var nComment = document.createComment('comment here...');
    eDiv.appendChild(nComment);
    ```

5. 创建文档碎片节点

    使用 `document.createDocumentFragment()` 方法创建一个新的文档碎片节点。

    ```javascript
    var eDiv2 = document.createElement('div');
    eDiv2.setAttribute('id', 'test_div');
    document.body.appendChild(eDiv2);
    var oFragmeng = document.createDocumentFragment();  //先创建文档碎片  
    for(var i=0;i<10;i++){  
        var op = document.createElement('p');  
        var oText = document.createTextNode(i);  
        op.appendChild(oText);  
        oFragmeng.appendChild(op); //先附加在文档碎片中  
    }  
    eDiv2.appendChild(oFragmeng);//最后一次性添加到eDiv2中 
    ```

## 删除节点

1. 删除元素节点

    使用 `document.removeChild()` 方法删除指定的节点。

    ```javascript
    document.body.removeChild(eDiv2);
    ```

2. 删除属性节点

    可以根据名称，调用`removeAttribute`删除指定的属性节点。
    ```javascript
    eDiv.removeAttribute('data-name'); 
    ```

    也可以根据对象删除属性节点
    `removeAttributeNode(node)` 方法通过使用 Node 对象作为参数，来删除属性节点。
    ```javascript
    eDiv.removeAttributeNode(attr); 
    ```

## 添加节点

1. 添加节点

    `appendChild()` 方法向已存在的节点添加子节点。

    ```javascript
    var eP = document.createElement('p');
    eP.appendChild(document.createTextNode('Test appendChild'));
    ```

2. 插入节点

    `insertBefore()` 方法用于在指定的子节点之前插入节点。

    ```javascript
    var eP2 = document.createElement('p');
    eP2.appendChild(document.createTextNode('test insertBefore'));
    document.body.insertBefore(eP2,eP);
    ```

3. 替换节点

    `replaceChild()` 方法用于替换节点。

    ```javascript
    var eP3 = document.createElement('p');
    eP3.appendChild(document.createTextNode('test replaceChild'));
    document.body.replaceChild(eP3, eP);
    ```

## 复制节点

`cloneNode()` 方法创建指定节点的副本。
`cloneNode()` 方法有一个参数（true 或 false）。该参数指示被复制的节点是否包括原节点的所有属性和子节点。

```javascript
eP2.setAttribute('data-name', 'value');
var eP2Clone = eP2.cloneNode();
var eP2CloneAll = eP2.cloneNode(true);
console.log(eP2Clone);
console.log(eP2CloneAll);
```

## 查找节点

1. 根据标签名

    `getElementsByTagName()` 方法可返回带有指定标签名的对象的集合。

    ```javascript
    document.getElementsByTagName('p');
    ```

2. 根据name属性

    `getElementsByName()` 方法可返回带有指定名称的对象的集合。

    ```javascript
    document.getElementsByName('test');
    ```

3. 根据id属性

    `getElementById()` 方法可返回对拥有指定 ID 的第一个对象的引用。

    ```javascript
    document.getElementById('myId');
    ```