# DOM操作

## 创建节点

1. 创建元素节点

    使用 `document.createElement()` 来创建一个新的元素节点。

    ```javascript
    var eDiv =document.createElement('div');
    document.body.appendChild(eDiv);
    // or like this in IE
    var div = document.createElement('<div id=\"myDiv">div</div>');
    ```

    >第二种方法一般用户解决IE7以下动态创建元素的某些问题

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

3. 删除name节点
    
    `removeNameItem(name)`从列表中移除nodeName属性等于name的节点
    ```javascript
    element.removeNameItem(name);
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
>注意：cloneNode()不会复制javascript属性，比如绑定的事件，但IE会复制事件处理事件，建议
>复制前最好移除事件处理

## 查找节点

1. 根据标签名

    `getElementsByTagName()` 方法可返回带有指定标签名的对象的集合。

    ```javascript
    document.getElementsByTagName('p');
    div.getElementsByTagName('*');// 获取目标div里的所有元素
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
    > 注意，IE8以下不区分ID的大小写，会把"Div"和"div"当作相同的元素

4. namedItem()
    
    存在name属性的元素，可以使用namedItem来获取
    ```html
    <img src="img.jpg" name="myImage" alt="">
    ```
    ```javascript
    var myImage = images.namedItem('myImage');
    var myImage = images['myImage'];
    ```

5. 其他
    
    `document.anchors`,包含文档中所有带name特性的a元素
    `document.applets`,包含文档中的<applet>元素，比较少见
    `document.forms`,包含文档中的<form>元素，相等于`document.getElementsByTagName('form')`
    `document.images`,包含文档中的<img>元素，相等于`document.getElementsByTagName('img')`
    `document.links`,包含文档中所有带href的a元素