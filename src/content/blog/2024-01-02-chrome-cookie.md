---
category : front-end
title: "Chrome 禁用三方 Cookie 的应对方案"
description: "Chrome 禁用三方 Cookie 的应对方案"
tags : [浏览器, Chrome]
---

## 1. 三方 Cookie 是什么

所谓第三方 Cookie 是指由用户当前访问的网站域名之外的其它域名下存储和操作的 Cookie，当前访问网站和用户是第一、第二方，网站中嵌入的其它域名服务就属于第三方。

举例如下：
1.  用户访问网站  `aliexpress.com`
2.  网站 `aliexpress.com` 在浏览器中访问了远程图片 `alicdn.com/xxx.jgp`
3.  `alicdn.com`的服务端在 HTTP 请求中设置了 Cookie（通过 Set-Cookie）：`UID=xxx`
4.  `UID=xxx`被保存到用户浏览器中
    
这里：
*   `aliexpress.com` 第一方
*   用户是第二方
*   `alicdn.com` 是第三方
 
而 `UID=xxx` 就是第三方的 Cookie。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/195/1703733273545-84e69147-3fe9-4ca9-9f55-6188d0a4fa6e.png)

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/195/1703733874863-74a70468-ce61-43da-920a-4873927c3c55.png)

## 2. 三方 Cookie 的作用

### 2.1. 正面作用

第三方 Cookie 有一个非常重要的作用就是**用来跨站点标识用户**。

用户访问了网站 A，再访问网站 B 时，第三方 Cookie 服务可以识别出这是同一个用户。原理如下：

1.  用户访问网站 `a.com`
2.  网站 `a.com`在浏览器端访问第三方服务 `c.com`
3.  `c.com`通过 HTTP 请求向用户浏览器写入 Cookie `userId=xxx`，即第三方 Cookie
4.  用户关闭网站 `a.com`，访问网站 `b.com`
5.  网站 `b.com`在浏览器端向第三方服务 `c.com`发送请求，这时 `userId=xxx`会被放入 HTTP 请求中，一起发给 `c.com`的服务端
6.  第三方服务 `c.com`通过 `userId=xxx`判断这个 `b.com`的用户和之前网站 `a.com`的用户是同一个人
  
### 2.2. 负面作用

允许使用第三方 Cookie 带来了 [CSRF](https://developer.mozilla.org/en-US/docs/Glossary/CSRF)、[XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting) 等安全隐患。

用户行为被跨站追踪，用户在各个站点的行为被记录，隐私泄露的风险大。

## 3. 三方 Cookie 的应用场景

### 3.1. 跨域状态同步

当两个域名都属于同一个业务时，Web 站点会使用第三方 cookie 来标识用户身份。

例如用户在天猫 `tmall.com`登录过，然后再打开淘宝 `taobao.com`，不需要重新登录。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/195/1703660560213-f754b675-eaa4-43dd-b32b-2b6baa5913c1.png)

### 3.2. 日志打点标识

大多数 Web 站点都会引用一些第三方 SDK 来进行前端异常或性能监控，这些 SDK 会通过一些接口将监控到的信息上传到他们的服务器。一般它们都需要标识每个用户来方便排查问题或者统计 UV 数据，所以当你的站点请求这个服务的时候，它们会 set 一个 Cookie，后续所有的日志上报请求都会带上这个 Cookie 。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/195/1703660810723-62602a02-e573-4a7e-81ed-ff74b9577442.png)

### 3.3. 广告营销标识

平时在搜索引擎或视频网站上搜索到一些东西，然后打开购物网站就可以收到各种感兴趣的相关推荐。各大购物网站、广告商，就是通过第三方 Cookie 收集用户的年龄、性别、浏览历史等从而判断他的兴趣喜好，然后给予精准的信息推荐。 比如，在浏览百度、优酷、天猫等网站时，都能看到几个 `.mmstat.com` 这个域下的 Cookie。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/195/1703660966500-475ae0b8-77ce-406d-bed1-fc4ca09c5338.png)

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/195/1703660971626-7cc70425-1eb9-4e30-bf0c-16aa40ae68ef.png)

`.mmstat.com` 是阿里妈妈旗下的域名。

## 4. 浏览器的策略

在 Safari 13.1、Firefox 79 版本中，三方 Cookie 已经被默认禁用。

### 4.1 禁用的原因

**那为什么 Chrome 没有禁用呢**？因为谷歌的相当一部分收入来自于基于第三方 Cookie 的广告服务。

**那为什么 Chrome 现在又来禁用呢**？因为 2018 年欧盟通过并实施了《一般数据保护条例》(GDPR) ，该法案不允许谷歌在没有提前告知并取得用户同意的情况下，在网页自动放置 Cookie 并用于个性化广告的推荐。欧盟陆续出台并修订了《电子隐私指令》（ePrivacy Directive）及《电子隐私条例》（E-Privacy Regulation）等文件，对于 Cookie 的收集使用作出了更为明确的要求。为此谷歌没少交罚款。

因此谷歌必须要想出一套替代方案，用于平稳地过渡。

*   2019 年 8 月，谷歌提出了 [Privacy Sandbox](https://privacysandbox.com/intl/zh_cn/) 计划，目标在创建一个更加隐私保护的 Web 环境，同时允许广告商和网站进行个性化广告和效果衡量
*   2020 年 1 月，谷歌宣布将在两年内弃用第三方 Cookie
*   2022 年 7 月，谷歌宣布将弃用第三方 Cookie 的时间推迟至 2024 年
*   2023 年 9 月，谷歌在 Chrome 上正式推出了 Privacy Sandbox
*   2023 年 11 月，谷歌正式明确了弃用三方 Cookie 的详细计划，并开始针对弃用第三方 Cookie 提供 Chrome 协助测试模式
    
### 4.2 禁用的节奏

Chrome 计划从 2024 年 1 月 4 日起为 1% 的用户停用第三方 Cookie 以方便测试，然后从 2024 年第 3 季度开始逐步向 100% 的用户停用第三方 Cookie。

Chrome 是目前市场份额最高的浏览器，而 Google 同时也是最大的网络广告商，它淘汰第三方 Cookie 的计划以及替代 Cookie 方案引发了它可能会获得相对于竞争对手（广告商）有优势的担忧。所以 Chrome 选择跟监管机构（[英国竞争和市场管理局所](https://www.gov.uk/cma-cases/investigation-into-googles-privacy-sandbox-browser-changes)，CMA）[合作](https://blog.google/around-the-globe/google-europe/path-forward-privacy-sandbox/)，在向 100% 的用户提升容量时，其进度会受到一些关于市场竞争问题处理情况的影响。

在 [privacysandbox.com 时间表](https://privacysandbox.com/open-web/#the-privacy-sandbox-timeline)上，可以看到 2023 年第 4 季度和 2024 年第 1 季度将要达到的两个里程碑：

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/195/1703664041043-a63e670b-a2f9-4f2e-b14d-79dbbd557010.png)

这意味着自 2024 年初起，即使你的网站没有参与 Chrome 协助测试，也可能会有更多 Chrome 用户在你的网站上测试停用第三方 Cookie 的情况。该测试期持续到 2024 年第 3 季度。

[Chrome 协助测试计划](https://developers.google.com/privacy-sandbox/setup/web/chrome-facilitated-testing?hl=zh-cn)中详细描述了放量的方法和节奏，如何判断用户是否命中放量逻辑，如何判断三方 Cookie 是否可用等信息。

### 4.3. 禁用的影响

禁用三方 Cookie 会使得三方进行 Cookie 的读写失败。因此任何三方依赖 Cookie 来实现的功能都会无效。

值得注意的是，Chrome 禁用三方 Cookie 是在稳定版本上实施的。也就说其影响覆盖度依赖 Chrome 的版本升级。Chrome 的自动升级策略在不同国家和地区有所差异。在海外大多数国家 Chrome 是自动升级的，因此影响覆盖度较快。在国内 Chrome 是不能自动更新的，所以影响覆盖度会滞后一些。

## 5. Aliexpress 已知问题

### 5.1. Shipto 失败

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/195/1703675929693-6ccd91ec-ec03-4fd3-88aa-63b7fc233f27.png)

Aliexpress 目前的实现有顶级域名的区分：

*   美国：aliexpress.us
*   其他：aliexpress.com
*   俄罗斯：aliexpress.ru

其中 `.us` 和 `.com` 域名下是共用一份代码。而代码中是依赖 `region` 这个 cookie 来判断使用哪个国家的数据。

在切换国家时，例如从韩国(`.com`)切换到美国(`.us`)。其实现步骤是：

1.  `.com`站点向 `aliexpress.us` 发送设置国家的请求，HTTP 返回的 response 中通过 set-cookie 的方式并重设其域下的`region`值
2.  跳转到 `.us` 站点，`.us`站点读取该 cookie 中的`region`决定使用哪个国家数据
    
由于三方 cookie 被禁用，所以第一步会失败。跳到 `.us`后判断 `region`还是韩国，于是再次 302 到 `.com`。

### 5.2. 登录态无法同步

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/195/1703676025407-76857bca-8f35-45e5-a40f-c904b43bca16.png)

针对**使用登录组件的场景**，登录态在 `.us`和`.com`下无法共享。

登录组件实现多域名下登录态同步的实现原理为：

1.  在 `.com`下向 `login.aliexpress.com`发送 HTTP 请求到登录服务，登录服务返回 token 并重设 `.com`的 cookie
2.  `.com`向 `.us`和`.ru`发送 HTTP 请求携带 token，返回后重设这些域名下的 cookie

由此，用户在 `.com`登录后，再去访问 `.us`则自动有了登录态。禁用三方 cookie 后第二步会失败，因此同步登录态失败。

正常来说，用户切换国家，是非常低频的。但问题就在于，我们并非在各个业务下都实现了 `.us`到 `.com`的对应。例如在 `.us`的场景下，用户访问频道，跳到的还是 `.com`域名。因此如果登录态同步失败，则会造成用户在站点间跳转时丢失登录信息。

## 6. 应对方案

### 6.1. 检查目前的使用情况

检查网站是否有设置了 `SameSite=None` 的 Cookie。关于该属性的介绍，可[参考 MDN 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value)。

SameSite [不是一个正式的标准](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-cookie-same-site-00)，它由 Chrome 从 51 版本开始正式添加，一开始它的默认值是 None ，从 Chrome 84 (2019年)开始默认值改为 Lax。

`SameSite=None` 的意思是对跨站请求携带这个 Cookie 没有限制。如果网站中的 Cookie 有这样的设置，那很有可能对这个 Cookie 有跨站的需求，这类 Cookie 很可能会作为第三方 Cookie。

因此对于一方来说，我们需要：

1.  找出`SameSite=None`的 Cookie
2.  明确它们是否有跨站需求
3.  明确它们在禁用三方 Cookie 的情况下，三方的功能是否依然可用

检查方式有如下几种。

#### 6.1.1. 开发者工具 Application 面板

开发者工具会将所有 Cookie 列在 Application > Storage > Cookie 中。点击下面的按钮即可筛选出所有三方 Cookie：

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/195/1703736812245-9ef8f9f5-10c7-4fd3-8ee1-96cc58f5449a.png)

#### 6.1.2. 开发者工具问题选项卡

从 Chrome 118 开始，新增了一个问题选项卡。勾选「包括第三方 Cookie 问题复选框」，可以看到所有的三方 Cookie 问题。从 120 版本开始该复选框是默认启用的。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/195/1703737293118-a6b2cbd5-2ea6-41a9-8f17-2e709aaf654b.png)

#### 6.1.3. 开发者工具 Network 面板

如果找到了三方 Cookie，还想知道是哪个请求设置的，还可以在 Nework > click request > Cookies 中排查到：

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/195/1703737133492-369b79de-0aed-4d20-90c4-233637c37ccf.png)

### 6.2. 测试禁用的表现

有几种方法可以直接让 Chrome 禁用第三方Cookie：

1.  地址栏输入：`chrome://settings/cookies`，选择阻止第三方Cookie。
2.  如果 Chrome 是 118 版本或者以上，可以进入 flag 设置：`chrome://flags/#test-third-party-cookie-phaseout`，然后直接将 **Test Third Party Cookie Phaseout** 功能开启。开启后，Chrome 会在最下方提示你重启浏览器。
3.  设置[命令行启动](https://developer.chrome.com/docs/web-platform/chrome-flags/?hl=zh-cn)参数 `--test-third-party-cookie-phaseout`：用命令行启动 Chrome 时，带上该参数。用 Mac 电脑举例：`/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --test-third-party-cookie-phaseout`

### 6.3. 使用代替方案

如何替换三方 Cookie ？

自己作为一方利用到了三方 Cookie 来**实现某些功能**，则可以：

*   [将 Partitioned Cookie 与 CHIPS 搭配使用](https://developers.google.com/privacy-sandbox/3pcd?hl=zh-cn#partitioned)    
*   [使用 Storage Access API 和 Related Website Sets](https://developers.google.com/privacy-sandbox/3pcd?hl=zh-cn#rws)

自己作为三方，使用到了三方 Cookie 来**提供某个功能**，则需要[迁移到新的 Web API](https://developers.google.com/privacy-sandbox/3pcd?hl=zh-cn#migrate)。

怎么理解一方和三方呢，即作为业务，我自己即有可能是一方，也有可能是三方。以会员业务为例，

*   作为一方，我提供了会员的页面给用户使用，有 `.us` 的，也有 `.com` 的，此时他们的登录态是我自身维持的；
*   作为三方，我提供了登录的组件给业务使用，登录的动作是由我来实现的。

## 7. CheckList

关于三方 Cookie 被禁用，有两个维度需要进行检查：

*   自己作为一方：
    *   网站依赖到了三方 Cookie 来实现某些功能：功能是否正常，不正常是否已修复
    *   网站依赖到了三方能力中依赖到了三方 Cookie：联系供应方，明确是否有相应策略，是否已完成升级
*   自己作为三方：给一方提供的能力，依赖到了三方 Cookie，禁用的时候功能是否运行正常。

可以新建两个表格对各个域进行情况汇总，持续跟进。

作为一方需要明确以下事宜：
![](https://oss-ata.alibaba.com/article/2024/01/f8eae22f-3819-4ea7-bc71-20f8a89e8065.png)

作为三方需要明确以下事宜：
![](https://oss-ata.alibaba.com/article/2024/01/99d0ff2d-5a70-4d99-a48d-9b54e2eb3ed7.png)

## 8. 参考资料

*   [为停用第三方 Cookie 做好准备](https://developers.google.com/privacy-sandbox/blog/cookie-countdown-2023oct?hl=zh-cn)
*   [识别和检查第三方 Cookie](https://developer.chrome.com/docs/devtools/application/cookies?hl=zh-cn#3pc)
*   [深入了解 Privacy Sandbox](https://web.dev/articles/digging-into-the-privacy-sandbox?hl=zh-cn)
*   [隐私保护与反垄断压力缠身的谷歌 再次暂缓停用 Cookie 技术将带来哪些影响](https://finance.sina.com.cn/tech/internet/2022-08-13/doc-imizmscv6052665.shtml)