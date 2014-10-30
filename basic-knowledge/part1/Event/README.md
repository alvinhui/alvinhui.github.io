# 事件

Javascript与HTML之间的交互是通过事件实现的。事件，就是文档或浏览器窗口发声在一些特定的交互瞬间。可以使用监听器来预订事件，以便事件发生时执行相应的代码。

## 使用事件

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

## 事件对象

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

2. IE中的事件对象

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
