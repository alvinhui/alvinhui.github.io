# 用原生 JS 实现一个事件模块


## 1. 要求

- JS event 的浏览器兼容

## 2. 解决方案

- fixEvent函数：Event对象跨浏览器兼容处理
- Event类：Event对象的模板，新增属性和方法，统一跨浏览器Event对象部分方法的差异


## 3. API 快速参考

### EventModel.bind

为指定元素的特定事件绑定事件处理函数

```javascript
    //普通的绑定
    EventModel.bind(document.getElementById('xxx'), 'click', function(evt){
        alert('Hello word!!');
    });

    //一次性为2个事件绑定同一个处理函数
    EventModel.bind(document.getElementById('xxx'), 'focus blur', function(evt){
        alert('Hello word!!');
    });

    //传入data: 此功能相当于可以给事件处理函数传参
    EventModel.bind(document.getElementById('xxx'), 'click', function(evt){
        alert(evt.data.num++);
    }, {'num': 1});

    //@important 为什么不：
    var num =1;
    EventModel.bind(document.getElementById('xxx'), 'click', function(evt){
        alert(num++);
    });

    //考虑这种情况：这时候第一次输出的num值是？
    var num =1;
    EventModel.bind(document.getElementById('xxx'), 'click', function(evt){
        alert(num++);
    });
    num = 4;
```

### EventModel.unbind

bind()的反向操作，从指定元素中删除绑定的事件。

```javascript
    //删除指定绑定处理函数
    var oXxx = document.getElementById('xxx');
    var handle1 = function(evt){
        alert('Hello word 1 !!');
    };
    var handle2 = function(evt){
        alert('Hello word 2 !!');
    };
    var handle3 = function(evt){
        alert('Hello word 3 !!');
    };
    EventModel.bind(oXxx, 'click', handle1);
    EventModel.bind(oXxx, 'click', handle2);
    EventModel.bind(oXxx, 'click', handle3);

    //取消handle1的绑定
    EventModel.unbind(oXxx, 'click', handle1);
    
    //取消所有Click绑定
    EventModel.unbind(oXxx, 'click');

    //取消所有事件绑定
    EventModel.unbind(oXxx);
```