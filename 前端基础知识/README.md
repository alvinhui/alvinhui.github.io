# 

## Nicholas C. Zakas认为前端工程师应该具备的基本知识

* __DOM结构__: 两个节点之间可能存在哪些关系以及如何在节点之间任意移动。
* __DOM操作__: 怎样添加、删除、移动、复制、创建和查找节点。
* __事件__: 怎样使用事件以及IE和DOM事件模型之间存在哪些主要差别。
* __XMLHttpRequest__: 这是什么、怎样完整地执行一次GET请求、怎样检测错误。
* __JSON__: 它是什么、为什么应该使用它、到底该怎么使用它，说出实现细节来。
* __HTML与XHTML__: 二者有什么区别，你觉得应该使用哪一个并说出理由。
* __严格模式与混杂模式__: 如何触发这两种模式，区分它们有何意义。
* __盒模型__: 外边距、内边距和边框之间的关系，IE < 8中的盒模型有什么不同。
* __块级元素与行内元素__: 怎么用CSS控制它们、它们怎样影响周围的元素以及你觉得应该如何定义它们的样式。
* __浮动元素__: 怎么使用它们、它们有什么问题以及怎么解决这些问题。

### DOM结构

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
    返回最后一个子节点： node.lastChild 

### DOM操作

#### 创建节点

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

#### 删除节点

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

#### 添加节点

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

#### 复制节点

`cloneNode()` 方法创建指定节点的副本。
`cloneNode()` 方法有一个参数（true 或 false）。该参数指示被复制的节点是否包括原节点的所有属性和子节点。

```javascript
eP2.setAttribute('data-name', 'value');
var eP2Clone = eP2.cloneNode();
var eP2CloneAll = eP2.cloneNode(true);
console.log(eP2Clone);
console.log(eP2CloneAll);
```

#### 查找节点

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

### 事件

Javascript与HTML之间的交互是通过事件实现的。事件，就是文档或浏览器窗口发声在一些特定的交互瞬间。可以使用监听器来预订事件，以便事件发生时执行相应的代码。

#### 使用事件

1. 传统模式：HTML事件处理程序

    ```html
    <input type="button" value="Click Me" onClick="alert('Clicked')">
    ```
    ```html
    <script type="text/javascript">
    function showMessage(){
        alert('Hello world!');
    }
    </script>
    <input type="button" value="Click Me" onClick="showMessage()">
    ```
    使用该模式的缺陷：
    * 时差问题：用户可能会在HTML元素一出现在页面上就触发相应的事件，但当时的事件处理程序有可能还不具备执行的条件。以上面的第二个例子来说，如果showMessage()函数是在按钮下方，页面最底部定义的，如果用户在页面解析该函数前就单击了按钮，就会引发错误；
    * HTML于Javascript代码过于耦合。如果要更换事件处理程序，就需要改动2个地方：HTML代码和Javascript代码。

2. DOM 0级事件处理程序

    ```javascript
    var ele = document.getElementById('btn');
    ele.onclick = function(){
        // 注意this指向当前节点
        alert(this.id);
    };

    ele.onclick = null; //删除事件处理程序
    ```

3. DOM2 级事件处理程序

    “DOM2级事件”定义了两个方法，用于处理指定和删除处理程序的操作：`addEventListener()`和`removeEventListener()`。所有DOM节点中都包含这两个方法，并且它们都接受3个参数：要处理的事件名，作为事件处理程序的函数和一个布尔值。最后一个布尔值如果是true，标示在捕获阶段调用事件处理函数，flase则表示在冒泡阶段调用事件处理程序。

    ```javascript
    var handleClick = function(){
        alert(this.id);
    };
    var btn = document.getElementById('btn');
    btn.addEventListener('click', handleClick, false);

    //可以为同一个节点添加多个事件处理函数，它们是按照添加它们的顺序触发的。
    //所以在此列中，会先输出id再输出hello word
    btn.addEventListener('click', function(){
        alert('Hello word!!');
    }, false);

    //删除一个监听
    btn.removeEventListener('click', handleClick, false);
    ```

3. IE事件处理函数

    IE实现了与DOM中类似的两个方法：`attachEvent()`和`detachEvent()`。两个方法接受相同的两个参数：事件处理程序名称与事件处理程序函数。由于IE只支持事件冒泡，所以通过`attachEvent`添加的事件处理程序都会被添加到冒泡阶段。

    ```javascript
    var btn = document.getElementById('btn');
    var handleClick = function(){
        alert(this===window);//输出true；注意！IE处理函数的作用域是全局
    };
    btn.attachEvent('onclick', handleClick);

    //也可以为同一节点添加多个事件处理函数，不过与DOM2方法不同的是，这些事件不是以添加它们的顺序执行，而是以相反的顺序被触发。
    //所以在此列中，首先看到的是hellow word然后才是id
    btn.attachEvent('onclick', function(){
        alert('Hello word!');
    });

    //使用detachEvent移除事件处理程序
    btn.detachEvent('onclick', handleClick);
    ```

#### 事件对象

在触发DOM上某个事件时，会产生一个事件对象event，这个对象中包含着所有与事件有关的信息。包括导致事件的元素，事件的类型，以及其他与特定事件相关的信息。例如，鼠标操作导致的事件对象中，会包含鼠标位置的信息。

1. DOM中的事件对象

    兼容DOM的浏览器会将一个event对象传入到事件处理程序中。无论指定事件处理程序时使用什么方法（DOM O or DOM 2）。

    ```javascript
    var ele = document.getElementById('btn');
    ele.onclick = function(event){
        alert(event.type);
    };
    btn.addEventListener('click', function(event){
        alert(event.type);
    }, false);
    ```

    几个常用的event对象属性和方法

    1. currentTarget, target属性

        ```html
        <body>
            <input id="btn2" type="button" value="Click Me">
            <script type="text/javascript">
            document.body.onclick = function(event){
                alert(event.currentTarget === document.body);//true
                alert(this === document.body);//true
                alert(event.target === document.getElementById('btn2'));//true
            };
            </script>
        </body>
        ```

    2. preventDefault()方法

        阻止特定事件的默认行为。例如，链接的默认行为就是在被单击时会导航到其href特性指定的URL。如果你想阻止该行为，可以通过链接的onclick事件处理程序取消它。

        ```html
        <a href="http://alvinhui.github.io/" id="myLink">Alvin的github</a>
        <script type="text/javascript">
        document.getElementById('myLink').onclick = function(event){
            event.preventDefault();
        };
        </script>
        ```

        __注意__：只有event的cancelabel属性为true（默认）的事件，才可以使用preventDefault()来取消其默认行为。

    3. stopPropagation()方法

        该方法用于立即停止事件在DOM层次中的传播，即取消进一步的冒泡或捕获。

        ```html
        <body>
            <button id="btn3">Click Me</button>
            <script>
                var btn = document.getElementById('btn3');
                btn.onclick = function(event){
                    alert('Clicked!');
                    event.stopPropagation();
                };
                document.body.onclick = function(){
                    alert('Body clicked!');//点击btn时不会输出，因为冒泡没有传播到body
                };
            </script>
        </body>
        ```

    4. eventPhase属性

        事件的eventPhase属性，可以用来确定事件当前正位于事件流的哪个阶段；如果是在捕获阶段调用程序，那么eventPhase等于1；如果事件处理程序处于目标对象上，则eventPhase等于2；如果是在冒泡阶段调用事件处理，则eventPhase等于3。

        ```html
        <button id="btn4">Click Me</button>
        <script>
        var btn = document.getElementById("btn4");
        btn.onclick = function(event){
            alert(event.eventPhase);   //2
        };

        document.body.addEventListener("click", function(event){
            alert(event.eventPhase);   //1
        }, true);

        document.body.onclick = function(event){
            alert(event.eventPhase);   //3
        };
        </script>
        ```

2. DOM中的事件对象

    与DOM中的Event对象不同，要访问ie中的event对象有几种不同的方式，取决于指定事件处理程序的方法。

    ```javascript
    var btn = document.getElementById('btn');
    btn.onclick = function(){
        var event = window.event;
        alert(event.type);//click
    };

    btn.attachEvent('onclick', function(event){
        alert(event.type);
        alert(window.event.type); //也可以通过window.event来访问
    });
    ```

    几个常用的event属性：

    1. cancelBubble

        默认为false，但将其设置为true就可以取消事件冒泡。（与DOM的stopProgagation()方法作用相同）

        ```javascript
        var btn3 = document.getElementById('btn3');
        btn3.onclick = function(){
            alert('Clicked');
            window.event.cancelBubble = true;
        };
        document.body.onclick = function(){
            alert('body Clicked!');
        };
        ```

    2. returnValue

        默认为true，但将起设置为false就可以取消事件的默认行为（与DOM的preventDefault()方法作用相同）

        ```javascript
        var btn4 = document.getElementById('btn4');
        btn4.onclick = function(){
            window.event.returnValue = false;
        };
        ```

    3. srcElement

        事件的目标。（与DOM的target属性相同）

        ```html
        <button id="btn5">Btn5</button>
        <script>
        document.body.onclick = function(){
            alert(window.event.srcElement==document.getElementById('btn5'))
        };
        </script>
        ```

### XMLHttpRequest
    
XMLHttpRequest（以下简称XMR）是一组API函数集，可被JavaScript、JScript、VBScript以及其它web浏览器内嵌的脚本语言调用，通过HTTP在浏览器和web服务器之间收发XML或其它数据。

#### 创建XMR

1. IE中

    微软最先创建了XML HTTP请求对象。IE5是第一款引入XHR对象的浏览器。在IE5中，XHR对象是通过MSXML库中的一个ActiveX对象实现的。

    > That's a long long long history....IE是第一个原生支持XML的浏览器，而这一支持是通过ActiveX对象实现的。为了方便桌面应用程序开发人员处理XML，微软创建了MSXML库。但微软并没有针对Javascript创建不同的对象，而只是让web开发人员能够通过浏览器访问相同的对象。

    在IE中，有3种不同版本的XHR对象，分别是：MSXML2.XMLHttp，MSXML2.XMLHttp.3.0和MXSML2.XMLHttp.6.0。要使用MSXML库中的XHR对象，我们需要写一个兼容函数：

    ```javascript
    //适用于IE7以下浏览器
    var createXMLHTTP(){
        var versions = [
            "MSXML2.XMLHttp.6.0", 
            "MSXML2.XMLHttp.3.0",
            "MSXML2.XMLHttp"
        ];
        if (typeof arguments.callee.activeXString != "string")
        {
            for (var i=0,len=versions.length; i < len; i++){
                try {
                    var xhr = new ActiveXObject(versions[i]);
                    arguments.callee.activeXString = versions[i];
                    return xhr;
                } catch (ex){
                    //skip
                }
            }
        }
        return new ActiveXObject(arguments.callee.activeXString);
    }
    ```

2. 现代浏览器

    IE7，Firefox, Opera, Chrome和Safari都支持原生的XHR对象，在这些浏览器创建XHR对象，就要像下面这样使用XHLHttpRequest构造函数：

    ```javascript
    var xhr = new XMLHttpRequest();
    ```

    ```javascript
    //一个兼容所有浏览器的创建XHR对象的方法：
    function createXHR(){
        if (typeof XMLHttpRequest != "undefined"){
            return new XMLHttpRequest();
        } else if (typeof ActiveXObject != "undefined"){
            if (typeof arguments.callee.activeXString != "string"){
                var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                                "MSXML2.XMLHttp"];
        
                for (var i=0,len=versions.length; i < len; i++){
                    try {
                        var xhr = new ActiveXObject(versions[i]);
                        arguments.callee.activeXString = versions[i];
                        return xhr;
                    } catch (ex){
                        //skip
                    }
                }
            }
        
            return new ActiveXObject(arguments.callee.activeXString);
        } else {
            throw new Error("No XHR object available.");
        }
    }
    ```        

#### 使用

1. open()

    在使用XHR对象时，要调用的第一个方法是`open()`，它接受3个参数：要发送的请求的类型（'get', 'post'等），请求的URL和标示是否异步发送请求的布尔值。

    ```javascript
    //开启一个针对example.php的GET请求
    xhr.open('get', 'example.php', fasle);
    ```

    URL是相对于执行代码的当前页面（也可以使用绝对路径）；open方法不会真正发送请求，而只是启动一个请求以备发送。<br>
    __注意__：只能向同一个域中使用相同端口和协议的URL发送请求，如果URL与启动请求的页面有任何差别，都会引发安全错误。

2. send()

    要发送特定的请求，必须调用`send()`方法：

    ```javascript
    xhr.open('get', 'example.php', fasle);//第三个参数为false,所以请求是同步的，Javascript代码会等到服务器响应之后再继续执行。
    xhr.send(null);//该方法接受一个参数，即要作为请求主体发送的数据。如果不需要通过请求主体发送数据，则必须传入null，因为这个参数对于有些浏览器来说是必需的。
    ```

    在服务器收到响应后，响应的数据会自动填充XHR对象的属性，相关属性如下：
    * responseText：作为响应主体被返回的文本
    * responseXML：如果响应的内容类型是'text/xml'或'application/xml'，这个属性将保存包含响应数据的XML DOM文档
    * status：响应的HTTP状态
    * statusText：HTTP状态的说明

    ```javascript
    var xhr = createXHR();        
    xhr.open("get", "example.txt", false);
    xhr.send(null);

    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
        alert(xhr.statusText);
        alert(xhr.responseText);
    } else {
        alert("Request was unsuccessful: " + xhr.status);
    }
    ```

3. 异步

    为了让Javascript代码继续执行而不必等待响应，我们需要发送异步请求。此时，可以检测XHR对象的readyState属性，该属性标示请求/响应过程的当前活动阶段。这个属性的取值如下：
        * 0：未初始化。尚未调用`open()`方法。
        * 1：启动。已经调用了`open()`但尚未调用`send()`方法。
        * 2：发送。已经调用`send()`方法，但尚未接收到响应。
        * 3：接收。已经收到部分响应数据。
        * 4：完成。已经接收到全部响应数据，而且已经可以在客户端使用了。
    只要readyState属性由一个值变成另一个值时，都会触发一次readyStatechange事件。我们可以利用这个事件来检测每次状态变化后readyState的值。

    ```javascript
    var xhr = createXHR();      
    //必须在open()之前指定onreadystatechange事件处理程序才能确保跨浏览器兼容性  
    //为了获得更好的兼容性，使用DOM0级方法添加事件处理程序
    xhr.onreadystatechange = function(event){
        if (xhr.readyState == 4){
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                alert(xhr.responseText);
            } else {
                alert("Request was unsuccessful: " + xhr.status);
            }
        }
    };
    xhr.open("get", "example.txt", true);
    xhr.send(null);
    ```

    使用abort()方法来取消异步请求。例如：
    ```javascript
    var xhr = createXHR();      
    xhr.onreadystatechange = function(event){
        if (xhr.readyState == 3){
            xhr.abort();// 在请求状态变成4前取消请求
        }
    };
    xhr.open("get", "example.txt", true);
    xhr.send(null);
    ```
 
4. HTTP头

    默认情况下，在发送XHR请求的同时，还会发送下列头部信息：
    * Accept: 浏览器能够处理的内容类型
    * Accept-Charset: 浏览器能够显示的字符集
    * Accept-Encoding: 浏览器能够处理的压缩编码
    * Accept-Language: 浏览器当前设置的语言
    * Cookie: 当前页面设置的任何Cookie
    * Host：发出请求的页面所在的域
    * Referer：发出请求的页面的URL
    * User-Agent: 浏览器的用户代理字符串

    每个HTTP请求和响应都会带有响应的头部信息，XHR对象提供了操作这两种头部信息的方法。
    * setRequestHeader()

        使用`setRequestHeader()`方法可以设置自定义的请求头部信息。

        ```javascript
        var xhr = createXHR();      
        xhr.open("get", "example.php", true);
        //要成功发送请求头部信息，必须在open()方法之后且调用send()之前调用setRequestHeader()
        xhr.setRequestHeader("MyHeader", "MyValue");
        xhr.send(null);
        ``` 
    * getResponseHeader(), getAllResponseHeaders()   
    
        调用XHR对象的`getResponseHeader()`方法并传入头部字段名称，可以取得响应的响应头部信息。<br>
        调用`getAllResponseHeaders()`方法则可以取得一个包含所有头部信息的长字符串。

        ```javascript
        var xhr = createXHR();        
        xhr.onreadystatechange = function(event){
            if (xhr.readyState == 4){
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                    alert(xhr.getAllResponseHeaders());
                } else {
                    alert("Request was unsuccessful: " + xhr.status);
                }
            }
        };
        xhr.open("get", "example.php", true);
        xhr.send(null);
        ```

5. Get请求和Post请求

    1. get请求
    
        ```javascript
        //get请求格式：xhr.open('get', 'example.php?name1=value1&name2=value2', true);
        
        //创建一个函数用于对url进行编码
        function addURLParam(url, name, value){
            url += (url.indexOf('?')==-1 ? '?' : '&');
            url += encodeURIComponent(name) + '=' + encodeURIComponent(value);
            return url;
        }

        var url = 'example.php';
        url = addURLParam(url, 'name', 'Alvin');
        url = addURLParam(url, 'age', '23');
        
        xhr.open('get', url, false);
        xhr.send(null);
        ```

    2. post请求

        ```javascript
        var xhr = createXHR();        
        xhr.onreadystatechange = function(event){
            if (xhr.readyState == 4){
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                    alert(xhr.responseText);
                } else {
                    alert("Request was unsuccessful: " + xhr.status);
                }
            }
        };
        
        xhr.open("post", "postexample.php", true);

        //模拟浏览器行为，所有由浏览器发出的post请求都将'content-type'头部设置为'application/x-www-form-urlencoded'
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");        
        xhr.send('name=alvin&age=23');
        ```

### 盒模型

一个盒包括了内容(content)、边框(border)、内边距(padding)、外边距(margin)。下图展示了盒模型的直观意义：
![盒子模型](http://www.w3.org/TR/2011/REC-CSS2-20110607/images/boxdim.png)

盒的尺寸（width与height）定义受到box-sizing属性的影响。box-sizing可选择content-box(默认), padding-box和border-box三种模式。

在默认情况下（box-sizing: content-box）盒子本身的大小是这样计算的：
> Width	    width + padding-left + padding-right + border-left + border-right

> Height	height + padding-top + padding-bottom + border-top + border-bottom








