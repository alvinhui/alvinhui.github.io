---
layout: post
category : Front-end
title: "一套 Javascript 测试题"
description: "对一套 javascript 测试题进行讲解"
tags : [Javascript, 试题]
---
{% include JB/setup %}

前些天阮一峰老师在微博转发的一套 Javascript 测试题传得挺火。我初次回答正确率仅为65%，恼羞成怒，痛定思痛，总结了一下。

原微博：[http://weibo.com/1400854834/AvM7yeoiJ](http://weibo.com/1400854834/AvM7yeoiJ)
题目出处：[JavaScript Puzzlers! or: do you really know JavaScript?](http://javascript-puzzlers.herokuapp.com/)

1. __`["1", "2", "3"].map(parseInt)`__

    答案：`[1, NaN, NaN]`

    解答：题目考查的是对 map 方法和 parseInt 方法以及二进制的了解。

    `Array.pototype.map` 方法第一个参数是函数时，传递2三个参数给函数，分别是：element, index, array

    `parseInt(string, radix)` 有两个参数，分别意义是：

    `string` 必需。要被解析的字符串。
    `radix` 可选。表示要解析的数字的基数。该值介于 2 ~ 36 之间。如果省略该参数或其值为 0，则数字将以 10 为基础来解析。如果它以 “0x” 或 “0X” 开头，将以 16 为基数。如果该参数小于 2 或者大于 36，则 `parseInt()` 将返回 NaN。

    在问题中，将1,0传给 `parseInt`，得出1；将2,1传给 `parseInt`，得出 NaN；将3,2传给 `parseInt`，得出 NaN（2进制中没有3）。

2. __`[typeof null, null instanceof Object]`__

    答案：`["object", false]`

    解答：题目考查的是对 null 字面量的理解。

    字面量 null 的 typeof 结果为 "object" 被普遍认为是一个 ECMAscript 标准的 bug。理解 null 的最好方式时将它当做对象占位符。

    在使用 typeof 运算符时采用引用类型存储值会出现一个问题，无论引用的是什么类型的对象，它都返回 "object"。ECMAScript 引入了另一个 Java 运算符 instanceof 来解决这个问题。
    instanceof 被用作检测引用值。例如：

    ```javascript
    var oStringObject = new String("hello world");
    alert(oStringObject instanceof String); //输出 "true"
    ```

    这段代码问的是“变量 oStringObject 是否为 String 对象的实例？” oStringObject 的确是 String 对象的实例，因此结果是 "true"。

    而 `null instanceof Object` 就像在问“null 是否为 Object 对象的实例？” 显然不是。

3. __`[ [3,2,1].reduce(Math.pow), [].reduce(Math.pow)] ]`__

    答案：an error

    解答：题目考查对 reduce 方法和 Math.pow 方法的熟悉度

    关于 reduce 方法参考：[ECMAScript 5.1](http://es5.github.io/#x15.4.4.21)
    关于 Math.pow 方法参考：[ECMAScript 5.1](http://es5.github.io/#x15.8.2.13)

    很明显，对于第二个表达式由于是空数组且调用 reduce 时没有提供第二个参数，将引发 TypeError 异常。

    我们来看看第一个表达式的结果：
    reduce 方法向第一个参数函数传递四个值 previousValue, currentDigit, currentIndex, array ； Match.pow 只接受两个参数。
    reduce 第一次调用 Match.pow 时传入 3,2 返回 9
    reduce 第二次调用 Match.pow 时传入 9,1 返回 9
    所以最后的结果是 9

4. __下面代码的运行结果是？__

    ```javascript
    var val = 'smtg';
    console.log('Value is ' + (val === 'smtg') ? 'Something' : 'Nothing');
    ```

    答案：`"Something"`

    解答：题目考查对运算符优先级的认识。

    `+` 号运算符的优先级比 `?` 号高。所以表达式的意思是：'Value is true' 是否为真；结果为真，所以输出 "Something"

5. __详见第二题__

6. __下面代码的运行结果是？__

    ```javascript
    var name = 'World!';
    (function () {
        if (typeof name === 'undefined') {
            var name = 'Jack';
            console.log('Goodbye ' + name);
        } else {
            console.log('Hello ' + name);
        }
    })();
    ```

    答案：`"Goobye Jack"`

    解答：题目考查对作用域链和变量对象的理解。

    关于作用域链请参考：[作用域链(Scope Chain)](http://www.cnblogs.com/TomXu/archive/2012/01/18/2312463.html)
    关于变量对象请参考：[变量对象（Variable Object）](http://www.cnblogs.com/TomXu/archive/2012/01/16/2309728.html)

    简单地理解就是：变量声明会提前，变量取值遵循就近原则。
    所以var name; 在if之前已经声明，因为条件判断正确。而name的取值则以最近的为准所以为 "Jack" 。

7. __下面代码的运行结果是？__

    ```javascript
    var END = Math.pow(2, 53);
    var START = END - 100;
    var count = 0;
    for (var i = START; i <= END; i++) {
        count++;
    }
    console.log(count);
    ```

    答：死循环

    解答：题目考查对 Javascript 数字范围的了解。

8. __下面代码的运行结果是？__

    ```javascript
    var ary = [0,1,2];
    ary[10] = 10;
    ary.filter(function(x) { return x === undefined;});
    ```

    答案：`[]`

    解答：题目考查对数组和 filter 方法的了解。

    ary[10] 将会将ary数组长度扩展为11，3-10的项都是不存在的。
    filter 方法不会调用不存在的项。

9. __下面代码的运行结果是？__

    ```javascript
    var two   = 0.2
    var one   = 0.1
    var eight = 0.8
    var six   = 0.6
    [two - one == one, eight - six == two]
    ```

    答案：`[true, false]`

    解答：题目考查对浮点数的认识。

    二进制的浮点数不能正确地处理十进制的小数，因此0.8-0.6不等于0.2。这是 Javascript 中最经常被报告的 bug，并且它是遵循二进制浮点数算术标准(IEEE 754)而有意导致的结果。

    通常的最佳编程实践是，通过指定精度来避免小数表现处理的错误。

10. __下面代码的运行结果是？__

    ```javascript
    function showCase(value) {
        switch(value) {
        case 'A':
            console.log('Case A');
            break;
        case 'B':
            console.log('Case B');
            break;
        case undefined:
            console.log('undefined');
            break;
        default:
            console.log('Do not know!');
        }
    }
    showCase(new String('A'));
    ```

    答案：`"Do not know!"`

    解答：题目考查对 String 对象和 switch 语句的认识。

    switch的比较采用的是 '===' ，因为对象不等于字符串，所以语句掉入最后的条件中输出 "Do not know"

11. __下面代码的运行结果是？__

    ```javascript
    function showCase2(value) {
        switch(value) {
        case 'A':
            console.log('Case A');
            break;
        case 'B':
            console.log('Case B');
            break;
        case undefined:
            console.log('undefined');
            break;
        default:
            console.log('Do not know!');
        }
    }
    showCase(String('A'));
    ```

    答案：`"Case A"`

    解答：题目考查对 String() 函数的认识。

    String 用途是强制转换类型。

12. __下面代码的运行结果是？__

    ```javascript
    function isOdd(num) {
        return num % 2 == 1;
    }
    function isEven(num) {
        return num % 2 == 0;
    }
    function isSane(num) {
        return isEven(num) || isOdd(num);
    }
    var values = [7, 4, '13', -9, Infinity];
    values.map(isSane);
    ```

    答案：`[true, true, true, false, false]`
    
    解答：题目考查对 % 和 || 运算符的了解。

    7 % 2 == 1 => true；
    4 % 2 == 0  => true；
    '13' % 2 == 1 => true；
    -9 % 2 == -1 => false
    Infinity % 2 == NaN => false

13. __下面代码的运行结果是？__

    ```javascript
    parseInt(3, 8)
    parseInt(3, 2)
    parseInt(3, 0)
    ```

    答案：`3, NaN, 3`

    解答：考查对 parseInt 函数和进制的了解。详见第一题。

14. __`Array.isArray( Array.prototype )`__

    答案：`true`

    解答：考查对 Array.prototype 的认识。

15. __下面代码的运行结果是？__

    ```javascript
    var a = [0];
    if ([0]) { 
      console.log(a == true);
    } else { 
      console.log("wut");
    }
    ```

    答案：`false`

    解答：题目考查对if语句， == 运算符的认识。非空数组在if语句里是为true，但用作 == 运算符时，它有完全不同的转换规则。

16. __下面代码的运行结果是？__

    ```javascript
    []==[] 
    ```

    答案：`false`

    解答：题目考查对 == 运算符的认识。 == 有着复杂的转换规律，有时候会表现出令人意外的结果。

17. __下面代码的运行结果是？__

    ```javascript
    '5' + 3  
    '5' - 3  
    ```

    答案：`"53", 2`

    解答：题目考查对 +/- 运算符的认识。

    `+` 运算符可以用于加法运算或字符串连接。它究竟会如何执行取决于其参数的类型。如果其中一个运算数是一个空字符串，它会把另一个运算数转换成字符串并返回。如果两个运算数都是数字，它会返回两者之和。否则，它把两个运算数都转换成字符串并连接起来。

    `-` 运算符进行减法运算。

18. __下面代码的运行结果是？__

    ```javascript
    1 + - + + + - + 1 
    ```

    答案：`2`

    解答：不明觉厉

19. __下面代码的运行结果是？__

    ```javascript
    var ary = Array(3);
    ary[0]=2;
    ary.map(function(elem) { return '1'; }); 
    ```

    答案：`[1, undefined * 2]`

    解答：题目考查对数组和数组方法的认识。

    第一行 `var ary = Array(3);` 得出 ary 为 `[undefined * 3]`；
    第二行 `ary[0]=2` 得出 ary 为 `[2, undefined * 2]`；
    第三行 map 方法只会处理存在的值，最后得出 `[1, undefined * 2]`

20. __下面代码的运行结果是？__

    ```javascript
    function sidEffecting(ary) { 
      ary[0] = ary[2];
    }
    function bar(a,b,c) { 
      c = 10
      sidEffecting(arguments);
      return a + b + c;
    }
    bar(1,1,1)
    ```

    答案：`21`

    解答：题目考查对 arguments 对象的认识。

    > Arguments对象是活动对象的一个属性，它包括如下属性：
    > 
    > callee — 指向当前函数的引用
    > length — 真正传递的参数个数
    > properties-indexes (字符串类型的整数) 属性的值就是函数的参数值(按参数列表从左到右排列)。 properties-indexes内部元素的个数等于arguments.length. properties-indexes 的值和实际传递进来的参数之间是共享的。
    >
    > 这个共享其实不是真正的共享一个内存地址，而是2个不同的内存地址，使用JavaScript引擎来保证2个值是随时一样的，当然这也有一个前提，那就是这个索引值要小于你传入的参数个数，也就是说如果你只传入2个参数，而还继续使用arguments[2]赋值的话，就会不一致。

    通过上面的介绍可以了解到，c=10，则 arguments[2] 也被赋值为 10。而将 arguments 传递给 sidEffection 函数，`ary[0]=ary[2]` 相当于 a=c ；所以最后 a+b+c 是 10+1+10。

21. __下面代码的运行结果是？__

    ```javascript
    var a = 111111111111111110000,
        b = 1111;
    a + b;
    ```

    答案：`111111111111111110000`

    解答：Javascript的计算缺乏精度。这将影响较大的值和较小的值。

22. __下面代码的运行结果是？__

    ```javascript
    var x = [].reverse;
    x();
    ```

    答案：window对象

    解答：题目考查对 reverse 方法的认识和对 this 的理解。

    关于 reverse 方法参考：[标准](http://es5.github.io/#x15.4.4.8)

    reverse 方法返回调用者自身。`x()` 的调用者是 window 对象。

23. __`Number.MIN_VALUE > 0`__

    答案：`true`

    解答：Number.MIN_VALUE 是一个 Javascript 能够表示的最小数值，指的是能够表示的最大小数点后位数。0.00....5

24. __`[1 < 2 < 3, 3 < 2 < 1]`__

    答案：`[true, true]`

    解答：题目考查对 < 运算符的认识。< 会进行隐身类型转换；所以第二个表达式 3 < 2 结果为 false，false < 1 转换的结果为 true。

25. __`2 == [[[2]]]`__

    答案：`true`

    解答：== 运算符会进行类型转换。左右两边不断调用 toString 的结果就是 2。

26. __下面代码的运行结果是？__

    ```javascript
    3.toString()
    3..toString()
    3...toString()
    ```

    答案：`error, "3", error`

    解答：不明觉厉

27. __下面代码的运行结果是？__

    ```javascript
    (function(){
      var x = y = 1;
    })();
    console.log(y);
    console.log(x);
    ```

    答案：`1, error`

    解答：考查对变量声明和作用域的认识。注意 `var x = y =1;` 分解成实际是 `var x = y; y = 1;` 。函数内的变量没有用 var 声明，则产生了一个隐身的全局变量。

28. __下面代码的运行结果是？__

    ```javascript
    var a = /123/,
        b = /123/;
    a == b
    a === b
    ```

    答案：`false, false`

    解答：题目考查对正则对象的认识。a和b都是正则实例的字面量表示，永远都不会相等。类似：`var a = {a: 1},b = {a: 1}; a==b;a===b` 结果是 `false` 一样。

29. __下面代码的运行结果是？__

    ```javascript
    var a = [1, 2, 3],
        b = [1, 2, 3],
        c = [1, 2, 4]
    a ==  b
    a === b
    a >   c
    a <   c
    ```

    答案：`false, false, false, true`

    解答：题目考查对几个运算符的认识。数组是无法直接用来做是否相等的比较的。数组用作大小比较时，会比较每一项。

30. __下面代码的运行结果是？__

    ```javascript
    var a = {}, b = Object.prototype;
    [a.prototype === b, Object.getPrototypeOf(a) === b]
    ```

    答案：`[false, true]`

    解答：题目解答考查对 prototype 属性的认识。prototype 是函数的一个属性，所以 a.prototype 是 undefined。 a是通过字面量声明的对象，它的原型就是 Object.prototype。

    关于 getPrototypeOf 参考：[标准](http://es5.github.io/#x15.2.3.2)

31. __下面代码的运行结果是？__

    ```javascript
    function f() {}
    var a = f.prototype, b = Object.getPrototypeOf(f);
    a === b
    ```

    答案：`false`

    解答：f.prototype 是 f 实例化后的原型。f 的原型是函数。

32. __下面代码的运行结果是？__

    ```javascript
    function foo() { }
    var oldName = foo.name;
    foo.name = "bar";
    [oldName, foo.name]
    ```

    答案：`['foo', 'foot']`

    解答：考查对函数属性的认识。name 属性是只读的，所以无法修改（不报错是奇葩）。

33. __下面代码的运行结果是？__

    ```javascript
    "1 2 3".replace(/\d/g, parseInt)
    ```

    答案：`"1, NaN, 3"`

    解答：题目考查对 replace 方法和 parseInt 函数的认识。

    replace 方法的介绍参考：[标准](http://es5.github.io/#x15.5.4.11)

    replace 方法可以接受多种类型的参数，当第二个参数是函数时，将会传三个值给函数，分别是 一次匹配的字符串，字符串偏移量，整个匹配的字符串。

    在该问题中，分别传了 "1", 0, "1 2 3"; "2", 2, "1 2 3"; "3", 4, "1 2 3"给 parseInt。
    所以每个是分别运行了 parseInt("1", 0); parseInt("2", 2); parseInt("3", 4);然后替换里面的匹配值。

34. __下面代码的运行结果是？__

    ```javascript
    function f() {}
    var parent = Object.getPrototypeOf(f);
    f.name // ?
    parent.name // ?
    typeof eval(f.name) // ?
    typeof eval(parent.name) //  ?
    ``` 

    答案：`"f", "Empty", "function", error`

    解答：题目考查对 prototype 属性和 name 属性以及作用域链的了解。

35. __下面代码的运行结果是？__

    ```javascript
    var lowerCaseOnly =  /^[a-z]+$/;
    [lowerCaseOnly.test(null), lowerCaseOnly.test()]
    ```

    答案：`[true, true]`

    解答：题目考查对 test 方法的了解。

    关于 test 方法参考：[标准](http://es5.github.io/#x15.10.6.3)

    test 方法接收字符串参数，如果不是则强制转型。

36. __下面代码的运行结果是？__

    ```javascript
    [,,,].join(", ")
    ```

    答案：`", , "`

    解答：题目考查对数组的认识。

    Javascript 数组允许以 , 号结尾。所以题目中的数组实际上是一个 undefined * 3 的数组。
    相当于`[undefined, undefined, undefined,]` => `[undefined, undefined, undefined]`
    想一想这个表达式的结果是什么？`[1,1,1].join(", "")`
    结果是：`"1, 1, 1"`
    所以就不难理解为什么 `[undefined, undefined, undefined].join(", ")` 的结果是 `", , "`

37. __下面代码的运行结果是？__

    ```javascript
    var a = {class: "Animal", name: 'Fido'};
    a.class
    ```

    答案：最后运行的结果与浏览器相关。

    解答：题目考查对 Javascript 保留字的认识。