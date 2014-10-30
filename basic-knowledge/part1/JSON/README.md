# JSON

## JSON是什么？

JSON(JavaScript Object Notation) 是一种轻量级的数据交换格式。 它基于[JavaScript Programming Language](http://www.crockford.com/javascript), [Standard ECMA-262 3rd Edition - December 1999](http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf)的一个子集。 

## JSON建构于两种结构：

* “名称/值”对的集合（A collection of name/value pairs）。不同的语言中，它被理解为对象（object），纪录（record），结构（struct），字典（dictionary），哈希表（hash table），有键列表（keyed list），或者关联数组 （associative array）。
* 值的有序列表（An ordered list of values）。在大部分语言中，它被理解为数组（array）。

## JSON具有以下这些形式：
    
1. 对象 object

    对象是一个无序的“‘名称/值’对”集合。一个对象以“{”（左括号）开始，“}”（右括号）结束。每个“名称”后跟一个“:”（冒号）；“‘名称/值’ 对”之间使用“,”（逗号）分隔。

    ！[object](http://www.json.org/object.gif)        

    ```
    {"name":"value", "name2":"value2"}
    ```

2. 数组 array

    数组是值（value）的有序集合。一个数组以“[”（左中括号）开始，“]”（右中括号）结束。值之间使用“,”（逗号）分隔。

    ![array](http://www.json.org/array.gif)   

    ```
    ["value1", "value2", "value3"]
    ```
3. 值 value

    值（value）可以是双引号括起来的字符串（string）、数值(number)、true、false、 null、对象（object）或者数组（array）。这些结构可以嵌套。

    ![value](http://www.json.org/value.gif)   
    
4. 字符串 string

    字符串（string）是由双引号包围的任意数量Unicode字符的集合，使用反斜线转义。一个字符（character）即一个单独的字符串（character string）。

    ![string](http://www.json.org/string.gif)   

5. 数值 number

    数值（number）也与C或者Java的数值非常相似。除去未曾使用的八进制与十六进制格式。除去一些编码细节。

    ![number](http://www.json.org/number.gif)   
           
## 使用JSON

## 为什么要使用JSON？

JSON易于人阅读和编写。同时也易于机器解析和生成。 JSON采用完全独立于语言的文本格式，但是也使用了类似于C语言家族的习惯（包括C, C++, C#, Java, JavaScript, Perl, Python等）。 这些特性使JSON成为理想的数据交换语言。

## 如何使用JSON？

JSON的基础是Javascript语法中的一个子集，特别是对象和数组的字面量。使用JSON能够创建与XML相同的数据结构，例如，一组名-值对可以使用下面这个包含命名属性的对象来表示：

```
{
    "name": "Alvin",
    "age": 23,
    "author": true,
    "title": "Software Engineer"
}
```

这个例子展示的就是一个包含4个属性的数据对象。每个属性名必须用双引号引起来。这个数据对象同时还是Javascript中有效的对象字面量，因此可以将它直接赋值给一个变量，例如：

```javascript
var person = {
    "name": "Alvin",
    "age": 23,
    "author": true,
    "title": "Software Engineer"
};
//要注意的是，虽然Javascript不要求给对象的属性加引号，但未加引号的属性在JSON中则被视为一个语法错误。
```

Javascript中运用JSON格式：

```javascript
var jsonText = '[{"name": "Alvin", "age": "23"}, {"name": "Javascript", "age": "15"}]';

//我们可以将JSON格式的字符串传递给eval()函数，让其解析并返回一个对象或数组的实例：
var people = eval(jsonText);
alert(people[0].name);

//需要注意大括号问题
var object1 = eval('{"name": "Alvin"}'); //抛出错误
var object2 = eval('({"name": "Alvin"})'); //没问题
alert(object2.name);

var object3 = eval("("+jsonText+")"); //通用解决方案

/*
 * eval在对输入的文本求值时，是将其作为Javascript代码来看待的，在对以左大括号开头的对象求值时，
 * 就好像遇到一个没有名字的javascript语句，结果就会导致错误。
 * if(){}; for(){}; 所以大括号会被认为是语句
 */ 
```

### JSON解析器和序列化器（json2.js）

为了能够方便地让字符串形式的json数据转化为javascript里的对象/数组（解析），或将javascript对象转化为字符串形式json数据（序列化），可以利用一个[Json2.js](https://github.com/douglascrockford/JSON-js)的库来处理JSON数据。

1. 解析
    
    ```javascript
    var jsonText = "{\"name\":\"Nicholas C. Zakas\", \"age\":29, \"author\":true }";
    var object = JSON.parse(jsonText);

    alert(object.name);  //"Nicholas C. Zakas"
    ```

2. 序列化

    ```javascript
    var contact = {
        name: "Ted Jones",
        email: "tedjones@some-other-domain.com"        
    };
    alert(JSON.stringify(contact));
    ```
