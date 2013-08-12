# 认识target-densitydpi

## 理解 viewport

什么是viewport ? viewport就是视口，视觉窗口，显示区域。

对于PC浏览器,viewport就是除了地址栏，工具栏，状态栏，以及滚动条之后用来浏览显示网页的一片区域。如图：

![viewport非权威指南](http://jsdashi.com/wp-content/uploads/2012/08/viewport_pc1.png)

那么对于移动设备iPhone的viewport，如图显示：

![viewport非权威指南](http://jsdashi.com/wp-content/uploads/2012/08/viewport_iphone1.png)

> 在iOS或Android的手机浏览器的屏幕不同于传统的手机的web浏览器,过去以及现在大多说网站都是为PC桌面浏览器而设计的，当我们使用固定的宽度时（例如：width=960px）就会出现横向滑动条，当然这并不影响阅读。> 但若使用流动布局的网页（例如：width=30%）那么对于分辨率为320*640的手机屏幕而言width就是96px，只能容纳8个12px的汉字，可阅读性非常差。

为解决手机分辨率不同的问题，Apple引用了一个概念：创建一个虚拟的窗口——布局窗口(layout viewport)，在移动版(iOS)的Safari Browser application中定义了viewport meta标签，它的作用就是允许开发者自定义布局窗口的大小或缩放功能。而且这个布局窗口的分辨率接近于桌面显示器，移动版Safari的布局窗口默认大小为980像素。其他浏览器也支持布局窗口(layout viewport)。

但是，不同的浏览器对布局窗口的默认大小支持都不一致。默认值分别如下：

* Safari iPhone: 980px
* Opera: 850px
* Android WebKit: 800px
* IE: 974px
* Windows Phone 7: 1024px

例如：我们以iPhone4的Safari浏览器来说，
iPhone4屏幕分辨率为640*960，是指物理屏幕视觉窗口（visual viewport）的分辨率为640*960。在使用Safari浏览器的时候会创建一个宽为980像素的虚拟的窗口——布局窗口(layout viewport)用来配合CSS渲染布局，例如当我们设置一个容器的宽度为100%时，这个容器的实际值为980px而不是640px。

> __注意__： viewport特性只被Android 2.0 以及更高版本上的Android Browser application（由默认Android平台提供的）和WebView（用以展现web页面的框架工具集）支持。
> 在Android上运行的第三方浏览器可能并不支持这些用来控制viewport和分辨率的特性。viewport特性在iOS均得到支持。

## 设置 viewport
　　
viewport布局窗口是在meta元素中定义的，其主要作用是设置Web页面适应移动设备的屏幕大小。

viewport有6个属性：

```html
width            //指定布局屏幕宽度大小
height           //指定布局屏幕高度大小 默认我们一般不设置
initial-scale    //初始缩放比例 （范围>0 to 10.0）  默认我们一般写为1.0
minimum-scale    //允许用户缩放到的最小比例 （ 范围>0 to 10.0 默认是0.25）
maximum-scale    //允许用户缩放到的最大比例（范围>0 to 10.0  默认是5.0）
user-scalable    //用户是否可以手动缩 （no，yes）
```

通过修改meta来设置Safari，如以下代码

```html
<meta name="viewport" content="width=device-width"/>
```

在上面的代码中，我们使用了一个很有意思的属性：device-width。字面意是viewport宽度等于设备宽度，但在实际中不同的浏览器都给出了个定值：320px(iPad为768px);这个值还是源于Apple，那是因为自iPhone面世以来，其屏幕的分辨率一致维持在320*480。大量为iphone量身定制的网站基本上使用width= device-width的表达方式来表示iPhone屏幕的实际分辨率大小的宽度，并且按照宽度320px来设计制作，所以其他浏览器加入viewport支持时为了兼容性也将device-width定义为320px(但一些android手机的并非为320px而有为369px)。

如果我们不希望是设置的device-width为固定的320px，而是等同它的物理屏幕像素（而不是通过缩放web页面来和物理屏幕的像素匹配），那么我们需要加入一个新的属性target-densitydpi，(iOS不支持此属性，android支持)并把他赋值为device-dpi。这时device-width的值就是物理屏幕的像素。

target-densitydpi 可以设定的值

```html
device-dpi      – 使用设备本身物理屏幕的像素,不会发生默认缩放。
Super high-dpi  – 使用超级高密度像素，高中等像素密度和低像素密度设备相应缩小,多为android iPad，分辨率640*960
high-dpi        – 使用高密度像素，中等像素密度和低像素密度设备相应缩小。分辨率480*800
medium-dpi      – 使用中等密度像素，高像素密度设备相应放大，像素密度设备相应缩小。分辨率320*480
low-dpi         – 使用低密度像素，中等像素密度和高像素密度设备相应放大。分辨率240*320（基本淘汰）
[value]         – 指定一个具体的dpi值，这个值的范围必须在70–400之间。
```

（target-densitydpi属性比较复杂，而且在android上兼容问题较多，需要再深入查找资料了解。）

```html
<meta name="viewport" content="width=device-width;target-densitydpi=device-dpi"/>
```

## 参考资料

* [指尖的触动-viewport非权威指南](http://jsdashi.com/development/218.html)



