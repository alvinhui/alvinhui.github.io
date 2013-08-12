# XMLHttpRequest
    
XMLHttpRequest（以下简称XMR）是一组API函数集，可被JavaScript、JScript、VBScript以及其它web浏览器内嵌的脚本语言调用，通过HTTP在浏览器和web服务器之间收发XML或其它数据。

## 创建

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

## 使用

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
    var xhr2 = createXHR();      
    //必须在open()之前指定onreadystatechange事件处理程序才能确保跨浏览器兼容性  
    //为了获得更好的兼容性，使用DOM0级方法添加事件处理程序
    xhr2.onreadystatechange = function(event){
        if (xhr2.readyState == 4){
            if ((xhr2.status >= 200 && xhr2.status < 300) || xhr2.status == 304){
                alert(xhr2.responseText);
            } else {
                alert("Request was unsuccessful: " + xhr2.status);
            }
        }
    };
    xhr2.open("get", "example.txt", true);
    xhr2.send(null);
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
        var xhr3 = createXHR();      
        xhr3.onreadystatechange = function(event){
            if (xhr3.readyState == 4){
                if ((xhr3.status >= 200 && xhr3.status < 300) || xhr3.status == 304){
                    alert(xhr3.getAllResponseHeaders());//获取全部头部信息的字符串
                } else {
                    alert("Request was unsuccessful: " + xhr3.status);
                }
            }
        };
        xhr3.open("get", "example.php", true);
        xhr3.send(null);
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

        var url = 'get.php';
        url = addURLParam(url, 'name', 'Alvin');
        url = addURLParam(url, 'age', '23');

        var xhr4 = createXHR();     
        xhr4.onreadystatechange = function(event){
            if (xhr4.readyState == 4){
                if ((xhr4.status >= 200 && xhr4.status < 300) || xhr4.status == 304){
                    alert(xhr4.responseText);
                } else {
                    alert("Request was unsuccessful: " + xhr4.status);
                }
            }
        };
        xhr4.open('get', url, false);
        xhr4.send(null);
        ```

    2. post请求

        ```javascript
        var xhr5 = createXHR();        
        xhr5.onreadystatechange = function(event){
            if (xhr5.readyState == 4){
                if ((xhr5.status >= 200 && xhr5.status < 300) || xhr5.status == 304){
                    alert(xhr5.responseText);
                } else {
                    alert("Request was unsuccessful: " + xhr5.status);
                }
            }
        };
        
        xhr5.open("post", "postexample.php", true);

        //模拟浏览器行为，所有由浏览器发出的post请求都将'content-type'头部设置为'application/x-www-form-urlencoded'
        xhr5.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");        
        xhr5.send('name=alvin&age=23');
        ```
