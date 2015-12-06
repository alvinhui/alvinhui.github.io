---
layout: post
category : front-end
title: "前端组件化探索"
description: "react, component, 组件化"
tags : [前端开发]
---
{% include JB/setup %}

![component](https://img.alicdn.com/tps/TB1FYNoKpXXXXc_XpXXXXXXXXXX-900-500.jpg)

很多同学对 PC 业务如何进行组件化感兴趣，在此就把我在淘宝交易“已买到的宝贝”组件化重构项目中的思考过程，积累的经验写出来与大家分享。

先来介绍一下已买到的宝贝这个业务：

__已买到的宝贝是全网（淘宝／天猫）买家进行订单相关操作的平台（订单相关的操作如：取消订单，确认收货，订单搜索等），承载了全网业务的订单模型__ 。

* 线上网址： https://trade.taobao.com/trade/itemlist/list_bought_items.htm
* 主要入口：淘宝／天猫吊顶

## 我们为什么要做组件化？

### 技术建模的需要

在订单管理中，不同的业务订单在其生命周期中会有不同的状态和对应的操作，我们把这些订单生命周期进行抽象，得出订单模型。例如，基础的订单模型是这样的：

![基础订单模型](http://gtms02.alicdn.com/tps/i2/TB1toR2JXXXXXX2XXXXH3beFXXX-1024-768.jpg)

普通的集市商品下单后其订单生命周期如上所示。但订单模型是可定制的，不同的业务会针对自己商品的特点对订单模型进行定制。例如大额商品的一种定制：预售二阶段订单模型是这样的：

![预售二阶段订单模型](http://gtms03.alicdn.com/tps/i3/TB1eRdCJXXXXXXIapXXH3beFXXX-1024-768.jpg)

可以看到，它实际上是对基础订单模型的一种扩充。两种订单模型在实际产品（已买到的宝贝）的展示如下：

![订单模型展示对比](http://gtms01.alicdn.com/tps/i1/TB1sWFVJXXXXXaYXpXXH3beFXXX-1024-768.jpg)

从 UI 层面来看，预售二阶段订单模型虽然看起来比基础订单模型复杂了不少，但两者是有共性的。预售的第二行和第三行的展示结构和内容形式与基础订单模型的第一行是一模一样的。实际上，哪怕再有新的业务接入，设计师也会遵循着这套设计规则：复用，扩充。

订单模型会随着业务的多样化而不断变更、增加。而我们原有的系统抽象能力是非常弱的，基本上把不同的业务订单模型都写一份，这样的开发效率十分低下，维护成本也非常高。

所以这时候产品的技术抽象建模就很有必要了。

我们发现，尽管业务千变万化，但是其 UI 是可抽象的，在前端上我们可以基于 UI 的抽象进行技术抽象。

在技术抽象上，一种思路就是，把具有相同布局结构和展示的业务逻辑抽象成前端组件，比方说上面的 SubOrder，SubOrder 既可以用于实现基础订单模型，也可以用于一些复杂的订单模型：例如预售二阶段订单模型，例如拍卖订单模型，例如婚纱摄影分阶段订单模型。

__利用组件化的抽象方式，有助于我们提高代码复用率，从而提高开发效率。__

### 协作模式的变革

然后是协作层面。协作分为2个方面：一个是我们系统内各个角色人员间的协作，另外一个方面是我们的开发人员和其他业务方开发人员间的协作。

先来看看前者，我们的现状是这样的：

![协作模式](http://gtms02.alicdn.com/tps/i2/TB1wUREJXXXXXbBaXXXH3beFXXX-1024-768.jpg)

View 层是设计及前后端集体工作的结果，可以说是设计及前后端沟通的桥梁。它一方面是对设计的还原，另一方面赋予数据生命力。传统的 Java 应用把 View 层放在了应用项目里，例如 Webx 的 velocity。随着 Web 工业化的发展，前端工程师的出现，View 层的管理都交给了前端。但目前一些糟糕的问题是：

1. 职责界限模糊：在多人协作项目中，前后端对 VM 都有操作权限，并且 Webx 赋予 VM 的能力强大（例如可以直接调用 Java 类的方法），导致这个原本属于前端管理的范畴却失去了控制力。
2. Velocity 的学习成本高昂：这种模板语法并不在主流的前端知识体系内。可以在 View 层调用 Java 工具类，这也很难让前端开发人员产生好感。
3. View 层职能界限模糊：由于可以在 View 层调用 Java Model 层，不少后端开发人员对这种能力的滥用，导致业务逻辑和展现逻辑混淆在一起，越来越难以进行新业务的介入和系统的维护。

无论如何，前端对 View 层管理权的回收是无可争议的了。但回收后怎样设计才能使得设计及前后端的协作更高效呢？

不卖关子，直接说结果。基于组件化的协作模式，它可以是这样的：

![基于组件化的协作模式](https://img.alicdn.com/tps/TB108X8JXXXXXa1XpXXXXXXXXXX-1024-768.jpg)

因为组件化是基于 UI 的建模，由数据进行驱动。所以设计、前后端的沟通纬度都限定在了组件层面。这种更小的粒度的沟通纬度，集中化管理的方式，可以让协作成本更低。

除了应用人员的协作，因为订单业务是平台产品，所以我们的系统实际上还面临着和其他业务方进行协作问题。现有的协作模式是这样：

![业务协作模式](https://img.alicdn.com/tps/TB1YPqcJXXXXXaaXXXXXXXXXXXX-1024-768.jpg)

可以看到，这种协作模式导致订单管理的前端开发人员频繁地成为了业务的最终实现者，这显然和我们产品对开发的定位是不一致的：

__订单管理平台化的产品特性要求我们技术需要提供一种平台化的方案，让外部业务方能够对自己的业务有定制权，同时我们还需要有能力去去管控这些权力。__

当组件化应用到我们系统中后，我们与业务方的协作模式将会是这样的：

![基于组件化的协作模式](https://img.alicdn.com/tps/TB1KbdZJXXXXXcMXFXXXXXXXXXX-1024-768.jpg)

## 我们的组件化是怎么做的？

### 组件的封装方式

首先是为组件选择一种封装方式。也许你不知道，其实我们走了不少弯路。@紫英 @修名 @锂锌 @自寒 和 我曾经基于 KISSY实现了一套组件化方案，但最终我还是决定拥抱社区。我们知道目前流行的组件库有：Angular，Polymer，React。网上关于这三者的对比文章有很多，感兴趣的话可以看一下这几篇：

* [2014 年末有哪些比较火的 Web 开发技术？](http://www.zhihu.com/question/26644904/answer/33634518)
* [2015前端组件化框架之路--当下最时髦的前端组件化框架/库](https://github.com/xufei/blog/issues/19)
* [2015前端框架何去何从](http://www.cnblogs.com/sskyy/p/4264371.html)

促使我们选择 React 的原因主要是下面四点：

* __兼容 IE8：__在我们的业务中有20%左右的用户数，它非常重要，不可忽视
* __专注于 View：__很容易和公司内部已有的技术栈结合，而且的其配套技术方案比较成熟
* __多 Targets__： “React 让我们做到 Web 以外的 target。Virtual DOM 更像是 UI Virual Machine，自动帮你映射到真正的实现上。可以是 浏览器 DOM 、iOS UI、Android UI等”－－by [Dafeng](https://github.com/dfguo/blog/issues/1)
* __有服务器端渲染方案来加速首屏__

### 规划、开发组件

#### 规划

所谓组件化，核心意义莫过于提取真正有复用价值的东西。那怎样的东西有复用价值呢？

* 公共样式
* 控件
* 稳定的业务逻辑

因此，我们会把组件进行分层，有三层：

第一层是公共样式部分，例如像以前的 [reset.css](http://baike.baidu.com/view/5186496.htm)。现在也会有这样的部分。我也将所有的标签进行了一些重置和默认赋值，把它们封装成 @ali/rc-trade-tag，调用方式如下：

    ```
    var A = require('@ali/rc-trade-tag/lib/A');

    //...

    render(){
        return <div>
            <A href="">Link</A>
        </div>;
    }

    //...
    ```

再之上是通用组件，它们不带有任何的业务逻辑，只负责展示或者交互的抽象。这一层就类似于 [Bootstrap](http://react-bootstrap.github.io) 了。调用方式如下：

    ```
    var Dialog = require('@ali/rc-trade-common/lib/Dialog');

    //...

    render(){
        return <div>
            <Dialog
                ref='dialog'
                visible={this.state.visible}
                onClose={this.handleClose}
                style={{width: 360}}
            >
                test
            </Dialog>
        </div>;
    }

    //...
    ```

最上层就是是业务组件，它是稳定的业务逻辑的抽象。它的意义在于，有些业务逻辑是在页面中或者我们整个应用中是通用的，复用性很高；另一方面，业务组件的抽象可以让不同的业务方自己去管理这些组件。

整个组件层的架构如下：

![组件架构](http://gtms04.alicdn.com/tps/i4/TB1IPVYJXXXXXcYXXXXH3beFXXX-1024-768.jpg)

#### 样式

在组件的封装上，有一个问题是比较头疼的，就是样式的封装。

按照我们的设想，各组件应该是自我管理，自我约束，互相相不受影响的。但是如果用 CSS 来管理样式的话，就会有命名空间等问题（[React: CSS in JS](https://speakerdeck.com/vjeux/react-css-in-js)）。

一种做法是使用 [Inline Styles](https://facebook.github.io/react/tips/inline-styles.html)。但它不是万能的，它面临着另外一些问题，例如无法使用伪类选择器：

    ```
    a{
        color: blue;
    }
    a:hover{
        //....
    }

    <a style={{color: 'blue'}}>
        ...
    </a>
    ```

为了能够使用伪类选择器，我在社区中狩猎到了 [Radium](https://github.com/FormidableLabs/radium) ，它可以让 Inline Style 的写法支持伪类选择器：

    ```
    var Radium = require('radium');
    var React = require('react');

    @Radium
    class Button extends React.Component {
        render() {
            return <button style={styles.base}>
                {this.props.children}
            </button>;
        }
    }

    var styles = {
        base: {
            color: '#fff',
                ':hover': {
                backgroundColor: '#0074d9'
            }
        }
    };
    ```

我们曾经在周会上讨论过这个库，认为它有三个问题：

* 它是嵌入式的，对于我们而言是个黑盒
* 不支持 React Native：无法满足我们跨终端的需求
* 完全不兼容 IE8：实践证明浏览器兼容性不足，无法满足我们的产品需求

最终我们还是回到了 Inline Style 的方式，那或许你会问 Browser state styles to support? Media queries? --  请看 [Not supported CSS features](https://github.com/js-next/react-style#not-supported-css-features) 中的观点。

### 整体架构

解决了组件这个层面的问题后，还有几个问题需要我们思考：

* 组件需要的数据从哪里来？
* 组件间如何进行通讯？
* 前后端如何进行通讯？

#### 组件需要的数据从哪里来？

业务组件是有业务逻辑的，我们应该如何处理呢？

比如说，性别选择的下拉框，它是一个非常通用化的功能，照理说是很适合被当做组件来提供的。但是究竟如何封装它，我们就有些犯难了。这个组件里除了界面，还有数据，这些数据应当内置在组件里吗？理论上从组件的封装性来说，是都应当在里面的，于是就这么造了一个组件：

    ```
    <GenderSelect></GenderSelect>
    ```

这个组件非常美好，只需直接放在任意的界面中，就能显示带有性别数据的下拉框了。性别的数据很自然地是放在组件的实现内部，一个写死的数组中。这个例子太简单了，我们改一下，改成交易状态的下拉框。

![交易状态的下拉框](http://gtms02.alicdn.com/tps/i2/TB1gkFFJXXXXXXraXXXwQWjIXXX-247-312.png)

表面上看，这个没什么区别。但是，交易状态是统一配置的，也就是说，这个数据来源于服务端。这时候，你是不是想把一个 HTTP 请求封装到这组件里？

这样做也不是不可以，但存在至少两个问题：

* 如果这类组件在同一个界面中出现多次，就可能存在请求的浪费，因为有一个组件实例就会产生一个请求。
* 如果交易状态的配置界面与这个组件同时存在，当我们在配置界面中新增一个状态了，下拉框组件中的数据并不会实时刷新。

第一个问题只是资源的浪费，第二个就是数据的不一致了。曾经在很多系统中，大家都是手动刷新当前页面来解决这问题的，但到了这个时代，人们都是追求体验的，在一个组件化的解决方案中，不应再出现此类问题。

如何解决这样的问题呢？那就是引入一层 Store 的概念，每个组件不直接去到服务端请求数据，而是到对应的前端数据缓存中去获取数据，让这个缓存自己去跟服务端保持同步。

#### 组件间如何进行通讯？

前面的组件数据章节中，也有介绍到组件通讯的部分：交易状态配置和交易状态列表的显示，并谈到了我们的架构需要引入 Store 一层。

现在，我们已经决定通过 Store 来维持并统一管理状态，但是 Component 如何触发状态的变更并且最后更新视图呢？

也许你就可以下结论说，组件间的通讯就通过操作 Store 来同步就行了。但是在实际项目中，如果在 Component 层操作 Store ，会引起一些问题。比方说 Store 的读写权限无法控制。

在思考过程中，我有去看看社区中是否有相关的经验沉淀，于是注意到了 [Flux](https://facebook.github.io/flux/docs/overview.html) 。为什么选择它，我觉得这篇文章讲得会比我好：[Facebook：MVC不适合大规模应用，改用Flux](http://www.infoq.com/cn/news/2014/05/facebook-mvc-flux)

我们来看看实际中的应用：

![组件间通讯](http://gtms03.alicdn.com/tps/i3/TB1hPRxJXXXXXayapXX6Oa5PXXX-929-401.png)

“全选”是业务组件 `OrdersOperate` 里面的一个操作，“单选”则在 `OrderHead` 业务组件内。如何在点击全选的时候把所有单选都勾上？

* 首先，为 `OrderStore` 设置一个是否选中的状态：`_selected`（为什么是下划线开头？因为在 Store 中的数据都是从服务端获取的，字段名都是服务端给出，所有前端自定义的状态字段都会以下划线开头用以区分）：

    ![_selected](http://gtms04.alicdn.com/tps/i4/TB1Rw4NJXXXXXcdXFXXIWcvKVXX-264-51.png)
* 然后 `OrderHead` 中的 input 通过读取 OrderStore 中的 `_selected` 来决定是否选中：

    ![](http://gtms02.alicdn.com/tps/i2/TB1VTFNJXXXXXaYXFXXTG0wVpXX-495-81.png)
    ![](http://gtms01.alicdn.com/tps/i1/TB1I_0RJXXXXXc3XpXXx.gV9XXX-832-29.png)
* `OrdersOperate` 中“全选”动作触发一个 action （canSelectOrderIds 中存储的是当前列表所有可进行选择的 OrderID）：

    ![](http://gtms02.alicdn.com/tps/i2/TB1dcdLJXXXXXahXVXXWeLo8FXX-789-65.png)
    ![](http://gtms02.alicdn.com/tps/i2/TB19wFUJXXXXXa0XpXXyr0w_pXX-847-67.png)
* `OrderStore` 中监听了这个 action ，根据传过来的 orderIds 和需要设置的值找出相关 Order 进行设置：

    ![](http://gtms01.alicdn.com/tps/i1/TB1fFN3JXXXXXXgXXXXSxHCUXXX-506-70.png)

由于 `OrderHead` 这个 Component 是通过读取 `OrderStore` 的数据来决定是否选中 input 的，所以 Store 的变化会触发 Component 的刷新。

__Flux 只是 Facebook 提出的一套模式思路，它并没有具体的实现。我们自己实现了一套 Flux 的 API ，命名为 Relax(@ali/relax)。__


    ```
    ╔═════════╗       ╔════════╗       ╔═════════════════╗
    ║ Actions ║──────>║ Stores ║──────>║ View Components ║
    ╚═════════╝       ╚════════╝       ╚═════════════════╝
        ^                                      │
        └──────────────────────────────────────┘

    ```

#### 前后端如何进行通讯？

接下来需要处理的则是前后端间的通讯问题。在没有进行组件化之前，页面上的所有操作都是同步的，组件化后为了提高用户体验，页面上的操作都改成异步的方式实现了，例如翻页、搜索、删除订单。

具体到删除订单这个异步操作，我们需要怎么做呢？

![删除订单](http://gtms04.alicdn.com/tps/i4/TB1_JVFJXXXXXXhaXXXwxPi7VXX-1014-501.png)

我的做法是：继续沿用 Flux 模式，引入 IO 层。

Component 会发出一个删除的 action ，IO 中监听该 action 并请求 Server ，Server 如果成功则返回最新的列表数据给 IO，IO 再触发一个删除成功的 action 传入最新列表数据，OrderStore 监听删除成功 action ，拿到最新的列表数据，刷新 Component 。

![flux2](http://gtms01.alicdn.com/tps/i1/TB13QJFJXXXXXaKaXXXH3beFXXX-1024-768.jpg)

再来看看我们整个应用的架构，它就是这样：

![架构](http://gtms01.alicdn.com/tps/i1/TB1Fg80JXXXXXXJXFXXH3beFXXX-1024-768.jpg)

### 和老系统和平相处

一切看起来是一个闭环了，最后要解决的问题是如何和老系统和平相处？为什么会有这样的问题呢，因为我们的页面某些功能还是要依赖吊顶插件，还有一些功能需要使用一些第三方插件。比方说：旺旺点灯，比方说 TBC。

在已买到的宝贝中，和老系统打交道的内容有：

#### 吊顶插件

旺旺点灯：对于一个异步渲染的页面来说，点灯工作需要自己完成。

![旺旺点灯](http://img2.tbcdn.cn/L1/461/1/288c1d70489f1fb633be3cc7329863041e3ced9a)

吊顶本身提供了 `TB.Global.use` 方法来调用插件，所以还是比较省心的。我们只需要找到合适的时机去调用它就行了。

对于我们的页面需要使用的旺旺点灯功能，只需要在列表渲染完成后以及列表刷新时调用一下吊顶插件即可。

正当我踌躇满志地：

    ```
    TB.Global.use('fn-webww', function(G, webww) {
        webww.init();
    });
    ```

发现并不 work 。后才知道这个模块并没有 exports 出来。再查看就知道自己需要曲线救国了：

* 新建一个 plugin：

    ```
    var _ = require('lodash');

    var time = 0;
    var webww = {
        init: function(){
            if(_.isObject(window.Light) && _.isFunction(window.Light.light)){
                window.Light.light();
                time = 0;
            }else{
                if(5>time){
                    setTimeout(function(){
                        webww.init();

                        time++;
                    }, 500);
                }
            }
        }
    };

    module.exports = webww;
    ```
* 列表渲染完成后及刷新时调用该 plugin:

    ```
    var webww = require('../plugins/webww');

    React.createClass({

        componentDidMount(){
            webww.init();
        },

        componentDidUpdate(){
            webww.init();
        },

        //...
    });
    ```

#### TBC 插件

TBC分享：

![TBC分享](http://gtms02.alicdn.com/tps/i2/TB1aThVJXXXXXXoXFXXURNdFFXX-877-438.png)

TBC 和原有的系统并不冲突，只需要直接使用 `@ali/kissy-loader`  的 `use` 方法调用即可。但是出于以下原因，我建议做一层封装：

* 对系统屏蔽掉 KISSY loader 的细节
* 统一调用方式
* Gallery 插件集中版本化管理
* 缓存

实现的代码非常简单：

    ```
    var _ = require('lodash');
    var RSVP = require('rsvp');
    var loader = require('@ali/kissy-loader');

    var ROOT = 'tbc';
    var INDEX = 'index';

    var config = {
        share: '2.0.3'
    };

    var TBC = {};

    var getUrl = function(name, index){
        return [ROOT, name, config[name], index || INDEX].join('/');
    };

    var getPlugin = function(name, index){
        return new RSVP.Promise(function(resolve){
            if( ! TBC[name]){
                loader.use(getUrl(name, index), function(S, O){
                    TBC[name] = O;
                    resolve(O);
                });
            }else{
                resolve(TBC[name]);
            }
        });
    };

    module.exports = {
        getPlugin: function(name, index){
            if(_.indexOf(_.keys(config), name)>-1){
                return getPlugin(name, index);
            }else{
                //@TODO:log 记录该错误
            }
        }
    };
    ```

在调用端，使用方式如下：

    ```
    var share = require('@ali/trade-util/lib/TBC').getPlugin('share');

    share.then(function(share){
        share.init(self.props.param);
    });
    ```

#### 第三方插件

问答机器人：

![screenshot](http://img4.tbcdn.cn/L1/461/1/37ba07f36a5d5bb53e49673852d2900ba7e4da80)

问答机器人是客满团队维护的一个 KISSY 插件，对于这类功能，业务方短时间内是无法将它切换到我们的组件化方案的，所以我们这一版我们需要自己处理它。

好在并不复杂，只需要在我们的页面渲染完成后调用一下该脚本即可：

* 新建一个 plugin：

    ```
    var loader = require('@ali/kissy-loader');

    module.exports = {
        init(){
            loader.use('tb/support/1.8.0/robot/js/kissy_robot_recommend',function(S, robot) {
                robot.init();
            });
        }
    };
    ```
* 页面渲染完成后调用：

    ```
    var robot = require('../plugins/robot');

    var App = React.createClass({

        componentDidMount(){
            robot.init();
        },

        //...
    });
    ```

### 多语言

![screenshot](http://img3.tbcdn.cn/L1/461/1/f96d8ee3c5aeeb8a92492bb478e11c90142bd977)

还有一个问题就是多语言，已买到的宝贝本身就是支持多语言的（多的是，你不知道的事～）。

关于多语言，我们的处理方式是这样的：

* 服务端：通过用户地域 IP 的判断，决定显示哪种语言
* 数据：后端通过插件进行输出的翻译，最终输出给前端的数据就是特定的语言
* 前端：后端会在初始化数据中指定当前需要前端显示的语言类型，前端根据该字段设置前端应用语言

具体到前端这边怎么实现：

* 语言管理库：`@ali/trade-util/lib/i18n` （该工具由@锂锌 提供）
* 组件创建时，配置语言包：

    ```
        var I18N = require('@ali/trade-util/lib/i18n');

        I18N.register({
            'zh-CN': {
            'combinDo.note': '淘宝提醒您：'
        },
            'zh-TW': {
            'combinDo.note': '淘寶提醒您：'
        }
        });

        module.exports = React.createClass({
            render: function(){
                return <div>
                    {I18N.t('combinDo.note')}

                    .......
                </div>;
            }
        });
    ```
* 应用启动时，指定语言：

    ```
        var langs = ['zh-CN', 'zh-TW'];
        var I18N = require('@ali/trade-util/lib/i18n');
        var i18n = _.isString(window.i18n) && _.indexOf(langs, window.i18n)>-1 ? window.i18n : langs[0];
        I18N.lang(i18n);
    ```

### 工程化

完成了架构的部分，再上一层便是工程。感谢 DEF（淘宝前端集成开发环境） ，使用它可以轻松地搭建起任何一种架构模式的工程套件。基于 DEF 我产出了对应的插件：def-relax，它包含的功能有：

* 脚手架：generator
* 本地开发：dev
* 代码校验：lint
* 构建打包：build
* 线上发布：publish

该套件在这里就不继续展开。

__要说明的是，def-relax 是一个历史阶段性产物，它的出现是由于团队在 React 方向上工程套件的短缺。目前 @妙净 正在做一整套基于 CMD 的工程套件，未来我们项目也将转向使用团队规范化的工程套件。__

除了工程套件，在工程管理方面，我觉得还有一些事情是需要做的：

* __组件测试__

未来所有接入交易平台的组件库都需要进行测试
* __组件化数据协议__

规范化，版本化管理
* __组件化管理平台__

所有组件库可视化管理，设计、前后端的协作平台

### 性能瓶颈

然后再来谈谈项目中遇到的性能问题和解决办法。

第一个问题是，由于我们的组件的粒度非常细，组件嵌套非常深，vdom 的重渲计算量会非常的大。这一方面，可以通过 [PureRenderMixin](http://facebook.github.io/react/docs/pure-render-mixin.html) 来避免不必要的 vdom diff 。

第二个问题是，随着 Store 的数据变大，操作的复杂度在提高，安全性变低，每一次数据操作的成本变得异常昂贵。[Immutable.js](http://facebook.github.io/immutable-js/) 可以在一定程度上解决这个问题。

## 了不起的一步

最后，我觉得这个项目很 awesome 的二点：

* 可能是第一个在淘宝核心产品上使用 React ，探索前端组件化的
* 是的，我们拉响了不再支持 IE6、IE7 的号角

回想起我刚到阿里时的躇踌满志，整理过过《淘宝订单管理前端的困境与未来》。这一念之间的想法，把它真正做出来竟然用了大半。