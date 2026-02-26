---
category : Front-end
title: "前端编程规范"
description: "一套前端编码规范"
tags : [规范]
---

编程规范的制定很大程度上是为了弥补语言的不足。Javascript作为一门弱类型动态原型的语言，如果在团队开发中没有编程规范，后果将不堪设想。各花入各眼，欢迎交流。

目录
================

*   [前言](#preface)
    *   [约定](#convention)
        *    [代号](#number)
*   [编程风格](#style)
    *   [语言规范](#javaScript_Language_Rules)
        *    [变量](#var)
        *    [分号](#semicolons)
        *    [括号](#parentheses)
        *    [switch](#switch)
        *    [for-in](#for-in)
        *    [相等](#equal)
        *    [eval](#eval)
        *    [arguments](#arguments)
        *    [this](#this)
        *    [多级原型结构](#multi-level_prototype_hierarchies)
        *    [多行字符串字面量](#multiline_string_literals)
        *    [修改内置对象的原型](#modifying_prototypes_of_builtin_objects)
    *   [代码风格](#javaScript_Style_Rules)
        *    [缩进](#indentation)
        *    [引号](#quotation_marks)
        *    [空白](#blank)
        *    [括号的对齐方式](#parentheses_align)
        *    [行的长度](#line_limit)
        *    [换行](#wrap)
        *    [空行](#new_line)
        *    [命名](#naming)
*   [注释](#comment)
    *   [单行注释](#single_line_comments)
    *   [多行注释](#multi_line_comments)
    *   [文档注释](#multi_line_comments)
*   [文件和目录规划](#file)
*   [编程最佳实践](#practice)
    *   [避免使用全局变量](#no_global)
    *   [正确地使用parseInt](#parseInt)
    *   [+ 运算符](#plus)
    *   [假值](#falsy_values)
*   [感谢](#thanks)

<h2 id="preface">前言</h2>

目标：提高项目的可维护性和可扩展性

<h3 id="convention">约定</h3>

<h4 id="number">代号</h4>

编程风格的制定参考了以下业界文档：

1. (代号①)jQuery核心风格指南（[jQuery Core Style Guide](http://contribute.jquery.org/style-guide/js/)）
2. (代号②)Dauglas Crockford的JavaScript代码规范（[Code Conventions for the JavaScript Programming Language](http://javascript.crockford.com/code.html)）
3. (代号③)Google的JavaScript风格指南（[Google JavaScript Style Guide](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)）
4. (代号④)Dojo编程风格指南（[Dojo Style Guide](https://dojotoolkit.org/community/styleGuide)）

> 在编程风格章节，部分条目是参照以上的文档制定，在说明的最后会有如下注释，即代表该条目是参照《Google的JavaScript风格指南》
>> 参考：③

<h2 id="style">编程风格</h2>

> “程序是写给人读的，只是偶尔让计算机执行一下。” —— Donald Knuth

在团队开发中，所有的代码看起来一致是极其重要的，原因有以下几点：

* 任何开发者都不会在乎某个文件的作者是谁，也没有必要花费额外精力去理解代码逻辑并重新排版，因为所有代码排版格式看起来非常一致。
* 我能很容易地识别出问题代码并发现错误。

<h3 id="javaScript_Language_Rules">语言规范</h3>

总是开启严格模式，即在各模块顶部添加 `'use strict';` 声明。

关于严格模式参考 [MDN - Strict mode](https://developer.mozilla.org/en/JavaScript/Strict_mode)。

    define(function (require, exports, module) {
        'use strict';
     
        // ...
    });

    function doSomething () {
        'use strict';

        //...
    }

    <script>
        'use strict';

        //...
    </script>

<h4 id="var">变量</h4>

<h5 id="var-declare">声明</h5>

总是使用 `var` 来声明变量

    var name = 'alvin';

变量声明总是提前。

将所有的var语句合并为一个语句，每个变量的初始化独占一行。对于那些没有初始值的变量来说，它们应当出席在var语句的尾部。

    // Good
    function doSometingWithItems (items, count) {
        var value = 10,
            num = value + count,
            item,
            result,
            i,
            len;

        if (num > 0) {
            for (i = 0, len = items.length; i < len; i += 1) {
                item = items[i];
                result += item - num;
            }
        }

        return result;
    }

    // Bad
    function doSometingWithItems (items, count) {
        var value = 10;
        var num = value + count;

        if (num > 0) {
            var result;
            for (var i = 0, len = items.length; i < len; i += 1) {
                var item = items[i];
                result += item - num;
            }

            return result;
        }
    }

<h5 id="var-assignment">赋值</h5>

总是使用直接量

    // Good
    var name = 'alvin';
    var count = 100;
    var forever = true;
    var numbers = [1, 2, 3, 4];
    var book = {
        title: 'Javascript',
        author: 'Brendan Eich'
    };

    // Bad
    var name = new String('alvin');
    var count = new Number(100);
    var forever = new Boolean(true);
    var numbers = new Array(1, 2, 3, 4);
    var book = new Object();
    book.title = 'Javascript';
    book.author = 'Brendan Eich';

<h4 id="semicolons">分号</h4>

总是使用分号。

如果不加分号JS解释器也会按隐式分隔的标准去执行，但那样调试、压缩、合并的时候都很不方便。

而且在某些情况下，不写分号可是很危险的：

    MyClass.prototype.myMethod = function() {
      return 42;
    }  // 这个缺德的没写分号

    (function() {
      // 匿名函数的执行
    })();

上段代码会发生什么事情？

会报错（number is not a function）-第一个方法返回了42，因为没分号啊，后面就直接跟括号，所以第二个方法就很杯具的被当成一个参数传进来给42执行了（效果等同于 `42(func)()` ），可42并不是一个方法，报错。

<h4 id="parentheses">括号</h4>

`if...else...`，`while`，`for`，`do...while...`，`try...catch..finally...`总是使用括号

    // Good
    if (condition) {
        doSomething();
    } else if (otherCondition) {
        doOtherThing();
    } else {
        doSomethigElse()
    }

    // Bad
    if (condition)
        doSomething();
    else if (otherCondition)
        doOtherThing();
    else
        doSomethingElse();

    // Good
    var i;
    for (i in object) {
        doSomething();
    } 

    // Bad
    var i;
    for (i in object) 
        doSomething();

<h4 id="switch">Switch</h4>

1. 禁止出现连续执行（fall through）。每一个case代码块内都应当使用 `break`；
2. 当 `default` 什么都不做时，省略 `dafault` ，但必须写上注释。

    switch () {
        case 'first':
            //代码
            break;
        case 'second':
            //代码
            break;
        case 'third':
            //代码
            break;
        default:
            //代码
    }
    switch () {
        case 'first':
            //代码
            break;
        case 'second':
            //代码
            break;
        case 'third':
            //代码
            break;
        
        //没有default
    }

<h4 id="for-in">for-in循环</h4>

for-in循环是用来遍历对象属性的。不用定义任何控制条件，循环将会有条不紊地遍历每一个对象属性，并返回属性名。

for-in循环有一个问题，就是它不仅遍历对象的实例属性，同意还遍历原型继承来的属性。出于这个原因，最好使用 `hasOwnProperty()` 方法来为for-in循环过滤出实例属性。

    var person = {name: 'alvin'};
    var student = Object.create(person);
    student.age = 12;

    var i;
    for (i in student) {
        console.log(i);
        if (student.hasOwnProperty(i)) {
            console.log(student[i]);
        }
    }

<h4 id="equal">相等</h4>

使用 `===` 和 `!==` 而不是 `==` 和 `!=`，除非你百分百确定等式两边的类型是相等的。

<h4 id="eval">eval()</h4>

只用于反序列化。（反序列化的意思是从字节流中重构对象，这里指的应该是JSON字符串重构成对象，或是执行服务器返回的JS语句）

`eval()` 很不稳定，会造成语义混乱，如果代码里还包含用户输入的话就更危险了，因为你无法确切得知用户会输入什么。

然而 eval 很容易解析被序列化的对象，所以反序列化的任务还是可以交给它做的。

<h4 id="arguments">arguments</h4>

`arguments.callee` 和 `arguments.caller` 将在未来的 JavaScript 版本中被禁用，因此在代码中禁止使用。

<h4 id="this">this</h4>

仅在构造函数，方法，闭包中去使用它。

`this` 语义很特别。它大多数情况下会指向全局对象，有的时候却是指向调用函数的作用域的（使用 `eval` 时），还可能会指向DOM树的某个节点（绑定事件时），新创建的对象（构造函数中），也可能是其他的一些什么乱七八糟的玩意（如果函数被 `call()` 或者被 `apply()` ）。

很容易出错的，所以最好是以下这两种情况的时候再选择使用：

1. 在构造函数中（原型对象）
2. 在对象的方法中（包括创建的闭包）

<h4 id="multi-level_prototype_hierarchies">多级原型结构</h4>

不是怎么推荐使用。

多级原型结构指的是 JavaScript 实现继承。 

比如自定义类D，并把自定义类B作为D的原型，那就是一个多级原型结构了。

原型结构越来越复杂了就越难维护，所以无非必要，或许你非常确定你在做些什么，不要使用继承。

<h4 id="multiline_string_literals">多行字符串字面量</h4>

不要这样写：

    var myString = 'A rather long string of English text, an error message \
                    actually that just keeps going and going -- an error \
                    message to make the Energizer bunny blush (right through \
                    those Schwarzenegger shades)! Where was I? Oh yes, \
                    you\'ve got an error and all the extraneous whitespace is \
                    just gravy.  Have a nice day.';

空白字符开头字符行不能被很安全的编译剥离，以至于斜杠后面的空格可能会产生奇怪的错误。虽然大多数脚本引擎都支持这个，但它并不是ECMAScript标准的一部分。

可以用 `+` 号运算符来连接每一行：

    var myString = 'A rather long string of English text, an error message ' +
        'actually that just keeps going and going -- an error ' +
        'message to make the Energizer bunny blush (right through ' +
        'those Schwarzenegger shades)! Where was I? Oh yes, ' +
        'you\'ve got an error and all the extraneous whitespace is ' +
        'just gravy.  Have a nice day.';

<h4 id="modifying_prototypes_of_builtin_objects">修改内置对象的原型</h4>

永远不要修改原生对象及其原型中已存在的方法，如需增加方法要先做判断。

    var aProto = Array.prototype;
     
    aProto.isArray = aProto.isArray || function () {
        // ...
    };

<h3 id="javaScript_Style_Rules">代码风格</h3>

<h4 id="indentation">缩进</h4>

使用四空格字符为一个缩进层级

    // Good
    function doSomething () {
        var name = 'alvin';

        if (name = 'alvin') {
            for () {
                
            }
        }
    }

    // Not good
    function doSomething () {
      var name = 'alvin';

      if (name = 'alvin') {
        for () {
            
        }
      }
    }

<h4 id="quotation_marks">引号</h4>

使用单引号（'）比双引号（"）更好，特别是当创建一个HTML代码的字符串时候：

    var msg = 'This is some HTML<a href="">link</a>';

介于此，我们字符串的字面量以单引号为准。

<h4 id="blank">空白</h4>

1. 运算符两边总是留有一个空格

    // Good 
    var count = max + min;
    var result = condition ? goodOne : badOne;

    for (i = 0, l = o.leng; l > i; i++) {
        //...
    }

    // Bad
    var count=max+min;
    var result=condition?goodOne:badOne;

    for (i=0,l=o.leng;l>i;i++) {
        //...
    }
2. 块语句的间隔

    在左圆括号之前和右圆括号之后添加一个空格

    // Good
    if (condition) {
        //...
    }

    switch (condition) {
        //..
    }

    // Bad
    if(condition){
        //...
    }

    switch(condition){
        //..
    }

<h4 id="parentheses_align">括号的对齐方式</h4>

将左花括号放置在块语句中第一句代码的末尾

    // Good
    if () {
        //...
    } else if () {
        //...
    } else {
        //...
    }

    // Bad
    if () 
    {
        //...
    }
    else if ()
    {
        //...
    }
    else
    {
        //...
    }

    // Good
    switch () {
        
    }

    while () {
        
    }

    for () {
        
    }

    do {
        
    } while () {
        
    }

    try {
        
    } catch () {
        
    } finally {
        
    }

<h4 id="line_limit">行的长度</h4>

行的长度应限定在80个字符

<h4 id="wrap">换行</h4>

当一行长度达到了单行最大字符数限制时，就需要手动将一行拆成两行。__通常__我们会在运算符后换行，下一行会增加两个层级的缩进。

    // Good
    callAFunction(document, element, window, 'some string value', true, 123,
            navigator);

    // Bad
    callAFunction(document, element, window, 'some string value', true, 123,
        navigator);

    // Very bad
    callAFunction(document, element, window, 'some string value', true, 123
            , navigator);

    // 语句换行
    if (isLeapYear && isFebruary && day === 29 && itsYourBirthday &&
            noPlans) {
        waitAnotherFourYears();
    }

    // 变量赋值时：第二行的位置应当和赋值运算符的位置保持对齐
    var result = somethig + anotherThing + yetAnotherThing + someThingElse + 
                 anotherSomeThingElse;

<h4 id="new_line">空行</h4>

在下列场景中添加空行：

1. 在方法之间

    // Good
    function doSometing() {
        //...
    }

    function  doOtherThing () {
        //...
    }

    // Bad
    function doSometing() {
        //...
    }
    function  doOtherThing () {
        //...
    }

2. 在方法中的局部变量和第一条语句之间

    // Good
    function doSomething () {
        var name = 'Alvin',
            age = 23;

        if (condition) {

        }
    }

    // Bad
    function doSomething () {
        var name = 'Alvin',
            age = 23;
        if (condition) {

        }
    }

3. 在多行或单行注释之前

    // Good
    function doSomething() {
        var name = 'Alvin';

        // 如果代码执行到这里，则表明通过了所有安全性检查
        if (condition) {
            
        }
    }

    // Bad
    function doSomething() {
        var name = 'Alvin';
        // 如果代码执行到这里，则表明通过了所有安全性检查
        if (condition) {
            
        }
    }

4. 在方法内的逻辑片段之间插入空行，提高可读性。

    // Good
    if (w1 && w1.length) {
        
        for (i = 0, l = w1.length; i < l; i += 1) {
            p = w1[i];
            type = Y.Lang.type(r[p]);

            if (s.hasOwnProperty(p)) {

                if (merge && type =='object') {
                    Y.mix(r[p], s[p]);
                } else if (ov || ! (p in r)) {
                    r[p] = s[p];
                }
            }
        }
    }

    // Bad 
    if (w1 && w1.length) {
        for (i = 0, l = w1.length; i < l; i += 1) {
            p = w1[i];
            type = Y.Lang.type(r[p]);
            if (s.hasOwnProperty(p)) {
                if (merge && type =='object') {
                    Y.mix(r[p], s[p]);
                } else if (ov || ! (p in r)) {
                    r[p] = s[p];
                }
            }
        }
    }

<h4 id="naming">命名</h4>

采用驼峰式大小写命名法。

    var thisIsMyName;
    var anotherVariable;
    var aVeryLongVariableName;

<h5 id="variable">变量</h5>

变量命名应总是遵守小驼峰命名法。

1. 变量命名前缀应当是名词

    以名词作为前缀可以让变量和函数区分开来，因为函数名前缀应当是动词。

2. 命名长度应该尽可能短，并且抓住要点（有意义）。

    foo、bar和thisIsBannerAndBodyWidth之类的命名应当避免。

3. 尽量在变量名中体现出值的数据类型。
    
    比如：命名count、length、size表示数据类型是数字，而命名name、title和message表明数据类型是字符串。

    // Good
    var count = 10;
    var myName = 'Alvin';
    var found = true;

    // Bad
    var getCount = 10;
    var isFound = true;

<h5 id="properties_and_methods">属性和方法</h5>

私有的属性，变量和方法（在文件或类中）都应该改以下划线开头。

受保护的属性，变量和方法不需要用下划线（和公开的一样）。

<h5 id="function">函数</h5>

函数名的第一个单词应该是动词。这里有一些使用动词常见的约定。

1. can => 函数返回一个布尔值
2. has => 函数返回一个布尔值
3. is => 函数返回一个布尔值
4. get => 函数返回一个非布尔值
5. set => 函数用来保存一个值

<h5 id="constants">常量</h5>

使用大写字母和下划线来命名，下划线用以分隔单词，比如：

    var MAX_COUNT = 10;
    var URL = 'http://m.quecai.com';

<h5 id="constructor">构造函数</h5>

构造函数命名应总是遵守大驼峰命名法。

    function Person (name) {
        this.name = name;
    }

    Person.prototype.sayName = function() {
        alert(this.name);
    };

    var me = new Person('Alvin');

构造函数命名也常常是名词，因为它们是用来创建某个类型的实例的。

<h2 id="comment">注释</h2>

<h3 id="single_line_comments">单行注释</h3>

以两个斜线开始，双斜线后敲入一个空格。

    // 这是一个单行注释

使用方法：

1. 独占一行的注释，用来解释下一行代码。这行注释之前总是有一个空行，且缩进层级和下一行代码保持一致。

    // Good
    if (condition) {

        //如果代码执行到这里，则表明通过了所有安全性检查
        allowed();
    }

    // Bad
    if (condition) {
    //如果代码执行到这里，则表明通过了所有安全性检查
        allowed();
    }

2. 在代码行的尾部的注释。代码结束到注释之间至少有一个空格。

    // Good
    var result = something + somethingElse; // somethingElse不应当取值为null

    // Bad
    var result = something + somethingElse;// somethingElse不应当取值为null

3. 注释掉一大段代码

    // if (condition) {
    //     allowed();
    // }
    // var result = something + somethingElse;
    // var result = something + somethingElse;

<h3 id="multi_line_comments">多行注释</h3>

范例：

    /*
     * 另一段注释
     * 这段注释包含两行文本
     */

多行注释总是出现在将要描述的代码段之前，注释和代码之间没有空行间隔。多行注释之前应当有一个空行，且缩进层级和其描述的代码保持一致。

    // Good
    if (condition) {

        /*
         * 另一段注释
         * 这段注释包含两行文本
         */
        allowed();
    }

<h3 id="document_comments">文档注释</h3>

最流行的文档注释格式来自于[JavaDoc](http://www.oracle.com/technetwork/java/javase/documentation/index-137868.html)文档格式：多行注释以单斜线加双星号（/**）开始，接下来是描述信息，其中使用@符号来表示一个或多个属性。

关于文档注释，请参照：[JsDoc](http://usejsdoc.org/)

范例：

    /**
    返回一个对象，这个对象包含被提供对象的所有属性。
    后一个对象的属性会覆盖前一个对象的属性。
    传入一个单独的对象，会创建一个它的签拷贝。
    @method merge
    @param {Object} 被合并的一个或多个对象
    @return {Object} 一个新的合并后的对象
    **/
    merge () {
        
    }

<h2 id="file">文件和目录规划</h2>

<h2 id="practice">编程最佳实践</h2>

<h3 id="no_global">避免使用全局变量</h3>

全局变量就是在所有作用域中都可见的变量。

在浏览器中，window对象往往重载并等同于全局对象，因此在全局作用域中声明的变量和函数都是window对象的属性。

    var color = 'red';

    function sayColor () {
        alert(color);
    }

    console.log(window.color); // 'red'
    console.log(typeof window.sayColor); // 'function'

全局变量带来的问题

1. 命名冲突
    
    当脚本中的全局变量越来越多时，和浏览器未来的API或其他开发者的代码产生冲突的概率就越高。

2. 代码的脆弱性

    一个依赖全局变量的函数即是深度耦合于上下文环境之中。如果环境发生改变，函数有可能就失效了。

    // 如果全局变量color不存在，sayColor方法将会报错
    function sayColor () {
        alert(color);
    }
3. 难以调试

    任何依赖全局变量才能正常工作的函数，只有为其重新创建完整的全局环境才能正确地测试它。

<h3 id="parseInt">正确地使用parseInt</h3>

`parseInt` 是把字符串转换为整数的函数。它在遇到非数字时会停止解析，所以 `parseInt('16')` 和 `parseInt('16 coins')` 会产生一样的结果。

如果该字符串第一个字符是0，那么该字符串会基于八进制二不是十进制来求值。在八进制中，8和9不是数字，所以 `parseInt('08')` 和 `parseInt('09')` 都产生0的结果。

`parseInt` 可以接受一个基数作为参数，如此一来， `parseInt('08', 10)` 结果为8。请总是带上基数参数。

<h3 id="plus">+ 运算符</h3>

+运算符可以用于加法运算或字符串连接。它究竟会如何执行取决于其参数的类型。

1. 如果其中一个运算数是一个空字符串，它会把另一个运算符转换成字符串并返回。
2. 如果两个运算数都是数字，返回两者之和。
3. 其他情况，它把两个运算符都转换成字符串并连接起来。

<h3 id="falsy_values">假值</h3>

Javascript的众多假值：

1. 值：0；类型：Number
2. 值：NaN（非数字）；类型：Number
3. 值：''（空字符串）；类型：String
4. 值：false；类型：Boolean
5. 值：null；类型：Object
6. 值：undefined；类型：Undefined

但是这些值是不可以互换的。

<h2 id="thanks">感谢</h2>

最后，感谢两本书和它们的作者。

1. [《JavaScript语言精粹》](http://book.douban.com/subject/3590768/) [Douglas Crockford](http://www.crockford.com/)
2. [《编写可维护的JavaScript》](http://book.douban.com/subject/21792530/) [Nicholas C. Zakas](http://www.nczonline.net/)

本规范中很多条目都是直接引用或总结了两本书中的观点。
同时，两位作者的其他书籍或框架对学习Javascript可以提供很多帮助。