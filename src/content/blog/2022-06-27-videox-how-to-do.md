---
category : front-end
title: "大前端播放器 VideoX 如何回应业务诉求"
description: "大前端播放器 VideoX 如何回应业务诉求"
tags : [多媒体, 播放器]
---

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1653320386193-660947ac-747d-4c51-9fee-600a4805bc19.png) 

VideoX 是内容前端团队基于电商业务（以下简称大淘宝）背景打造的面向大终端场景的前端播放器。这篇文章谈谈我对播放器领域问题的认识，以及当下解决这些问题的思路。

## 大淘宝视频播放的场景有哪些？

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1654659370414-700081a8-c187-4422-8112-1e23216220a5.png) 

大淘宝视频播放的第一业务场景，是在消费侧。回想起来我最早在淘宝上看到视频内容，应该是在商品的详情页。几十秒的视频内容更形象地传递了商品的信息。商品有了视频内容，自然地在一些前置入口上也就可以透出它们了。比方说首页上的「猜你喜欢」，搜索的结果页等这些淘宝的**基础交易链路**；16 年淘宝开始提出内容化与社区的方向，引入了创作者的角色以及图文类型的内容，并推出了爱逛街、有好货、淘宝头条等内容电商产品，短视频在其中扮演着至关重要的角色。淘宝直播也在这期间横空出世，实时类视频登上淘宝历史的舞台。21 年淘宝持续推进内容化，提出“生活在淘宝”的愿景，逐渐形成了以逛逛、点淘和淘宝直播的**社交内容产品**矩阵；商家上传的商品视频和创作者发布的图文视频，又可以在前台的**导购场景**中透出，不断丰富淘内的商品导购形式和信息消费形态。

应该说，在内容和交易日渐融合的趋势下，在淘宝从交易走向消费的进程中，视频已经无处不在了。

视频内容的流转涉及从生产到消费的完整链路，在生产侧和平台端的业务场景同样存在视频播放的诉求。在生产侧，创作时在亲拍中需要播放模板视频，发布时在逛逛需要预览视频上传后的效果；在平台端，在纵横的体验中心演示中台能力时需要对多种分辨率和编码格式的视频进行播放，在黄雀每天有上千名审核人员完成百万级的审核任务时需要播放视频。

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1653810504062-2e8290b9-ffd6-497f-95d2-ae7328cbab63.png) 

## 业务对于视频播放的诉求有哪些？

由上可见，大淘宝视频播放的业务场景是非常复杂的。尽管场景是复杂的，但业务对于视频播放的诉求是可抽象的。我把它们抽象为以下几点。

### 多端的播放能力

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1653875488863-98f4cdba-3956-41e7-962a-d49607160d85.png) 

业务上对于视频播放的首要诉求，还是视频能不能播的问题。在大淘宝上，主要播放短视频、视频动画、直播和回放、全景视频等。依据实时性和交互方式的不同，通常将这几类视频分为点播(Vod)、直播(Live)和全景视频(Panorama)。

为使得这些类型的视频能够在网络上更好地进行传输和播放，则需要用到不同的视频格式：

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1653569178922-158303cb-6515-487d-97ec-b17955f25fea.png) 

不同的视频类型使用哪种视频格式是由跨平台兼容性、延时、可拓展性、使用成本等因素综合决定的。

由于不同业务场景面向的客户群体的差异，以及业务根据其性质对用户体验和研发效率的权衡，业务上的终端场景也是千差万别：

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1653570504968-378337ee-0758-4fb0-8986-a373690df11f.png) 

比方说行业小二给商家进行直播开课，商家是在千牛 PC 客户端上进行观看；店铺为了做三方的开放技术，很长的一段时间用的是小程序的方案；基础链路要优先保障稳定性，用的是 Native 的方案，外投又需要适配 WebView……

播放器需要对这些的视频类型、视频格式和终端场景提供完备的视频播放支持。

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1653836919232-013c27bb-1c40-4f8d-a3b2-172d200b2410.png) 

### 视频交互能力

除了播放画面和声音，在观看视频时，业务还需要为用户提供视频交互能力。这些实现交互功能的控件是盖在视频之上的：

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1653744734687-539620c8-75c2-48d9-ab91-00764c39f0ae.png) 

交互的目的通常是为了控制视频的播放进度和效果，以及设置视频的可见性。这些交互能力我归类总结了一下，有以下几种：

- **播放状态和进度控制**：播放状态控制，例如通过点击按钮播放、暂停或重播该视频；播放进度控制，例如通过点击前进/后退按钮跳过一段内容，或通过点击或拖拽进度条切换播放时刻；
- **播放效果控制**：例如切换静音/有声，调节音量，设置播放倍数，切换视频清晰度等；在一些长视频网站上，还有当存在多语言时可切换音轨和字幕的能力。不过目前在淘内没有这类诉求；
- **可见性控制**：即控制视频在屏幕上的可见范围。通常的业务诉求是全屏和小窗的能力；移动上在宽高比合适的情况下自动横屏的诉求；PC 上部分业务有宽屏和满屏的诉求；
- 更多能力：例如淘宝直播上的弹幕能力、逛逛短视频的商品卡片及互动弹层等。

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1653836961185-2149aaf3-b9b1-4a18-9d15-ba74ed79f2c3.png) 

### 交互定制能力

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1653873885104-d8891729-c55a-45e6-aea8-40a8489644e6.png) 

上面列举了全量的交互能力。但不同的业务场景需要的交互能力是各不相同的。这就需要播放器提供交互的定制能力。对相关的定制能力进行归纳总结，有以下几种：

- **控件的定制**：最常见的是不同的业务场景下要显示的控件均有细微差别；其次是菜单类型的控件（例如倍数）选项列表需要可以被业务所指定；最后是不同的业务对控件的交互行为也有不同的偏好，例如点击视频是否切换播放/暂停状态，双击视频是否全屏，播放开始后是否隐藏所有控件等等；
- **样式的定制**：控件的排布顺序和位置经常在不同的产品下有所不同；控件的大小、颜色会在一些大的业务线下所有不同；控件使用的图标在一些独立 App 下有所不同；

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1653918949777-4506e612-497e-4460-86b5-ef7d2846f35e.png) 

> 还有一种是控件语言的定制，允许业务设置控件内使用的文本语言。例如业务可根据用户所在地区设置播放器使用的语言。目前在淘内没有这类诉求。

### 多视频管理能力

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/gif/195/1654567614158-b77be8d3-bb8d-4680-a994-4a63d1d88a25.gif) 

在移动端，当页面上有多个视频时，为了避免一次性加载所有视频资源浪费用户流量或多个视频一起播放出现「双音轨」的情况影响用户体验，业务普遍有多视频管理能力的诉求。

管理能力可以概况为以下几种：

1. **控制每个视频的加载时机**：例如在幻灯片(Slider)场景下，只有当前显示的那个幻灯片才需要加载视频资源。切换幻灯片后播放当前幻灯片下的视频，暂停或销毁之前的视频；
2. **选择最佳位置的视频进行播放**：例如在滚动(Scroll)场景下，要选择离屏幕视觉中心点最近的视频进行播放，该视频播放时，暂停或销毁上一个正在播放的视频。

淘内的交互场景还有很多。比方说：

- 选项卡(Tab)场景下，切换 Tab 后选择当前 Tab 下面最佳位置的视频进行播放，暂停或销毁上一个 Tab 下的视频；
- 或者版头是 Slider 且整个页面可 Scroll 的场景下，需要优先播放版头的视频，版头滚出可视区域后暂停或销毁版头内的视频，选择滚动区域内最佳位置的视频进行播放；再次回到版头后，接着上一次被播放的视频继续播放。

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1653918987712-1a93380b-c0f0-484d-a441-8d0602b500da.png) 

### 播控服务能力

通常来说，业务播放视频，只需要传递一个视频资源 URL 就足够了。但部分业务为了权衡视频投入的支出和前台用户的体验，就需要使用到播控服务能力。播放器会请求一个播控的服务，来实现：

- **视频资源下发**：服务端下发不同档位分辨率的视频资源 URL，业务决定优先播放哪个档位的视频；服务端下发不同编码格式的视频资源 URL ，业务决定优先播放哪种视频编码；服务端下发不同投影方式的视频资源 URL，业务决定优先播放哪种投影的视频；
- **播放策略下发**：包括首次加载视频时的预加载大小、播放时的缓冲区大小、是否开启资源本地化缓存等策略。这些策略通常使用的是中台的默认值，但业务也会基于自身的视频资源类型和终端用户环境来进行调整；
- 更多：例如视频版权管理(DRM)、视频广告投放(Ads)等能力，都需要借助播控服务来实现，不过目前在淘内没有这类诉求。

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1653837034330-9861bf0c-9bf9-4562-b52b-88b484825d2d.png) 

### 数据化能力

![undefined](https://img.alicdn.com/imgextra/i2/O1CN01GYewtf1Gyyq3djpZv_!!6000000000692-2-tps-3078-560.png) 
![undefined](https://img.alicdn.com/imgextra/i2/O1CN01TEqT461LH4xPjZsdY_!!6000000001273-2-tps-3078-570.png) 

业务需要了解视频的投放效果和用户的观看体验，就需要中台提供数据化能力。视频播放评估指标可以分为两类：

1. 一个是**视频体验质量(QoE: Quality of Experience)** ，该指标用来衡量最终的业务效果，反映在业务中用户使用视频产品的情况（例如对视频是否喜爱）。具体的指标值包括播放次数、播放时长、有效播放率等等；
2. 一个是**视频服务质量(QoS: Quality of Service)** ，该指标用来衡量技术提供视频服务的效果，反映线上视频播放技术的运作情况（例如性能和稳定性）。具体的指标值包括视频秒开率、视频卡顿率、视频播放成功率等等。

业务需要中台定义这些指标及其计算口径，并提供其业务域内的实时和离线数据。

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1653919013147-8ba95f3b-aef8-4a85-b0b0-96b673e98356.png) 

### 播放管控能力

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1654225458129-e930c6f3-4e7f-4a47-be1b-0560f90f7e13.png) 

> 2021 年双 11，用户反馈手淘在后台偷跑 17G 流量

视频的引入给业务在终端带去了全新的用户体验，但是如果使用不当，轻则造成突然播放声音影响用户体验，重则在移动端浪费流量造成用户经济上的损失。因此，一方面业务既期望中台能够提供便捷的定制能力，另一方面也期望中台能有「兜底」的能力，在发生问题时能够及时止损。这就是播放器的播放管控能力。

例如：

1. **权限类的**：是否允许自动播放、是否允许后台播放、是否允许流量播放。这些配置还与用户的手淘配置相关，最终影响到用户的流量使用；
3. **优化类的**：是否启用硬解、是否启用缓存、是否启用数据埋点。这些配置设定目的是对用户终端硬件的消耗及播放性能之间进行权衡。

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1653919055593-5faaea7b-7016-4577-998a-42d6701741aa.png) 

## 技术如何满足这些诉求？

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1654095666662-1c9c715f-6e0d-4e4c-b20f-a37cdc3be6c0.png) 

中台为满足业务视频接入的诉求，提供了一套完整的视频接入方案，覆盖业务从视频发布到视频播放的完整链路。从端视角来看，方案中包含了视频上传SDK，视频中台服务，视频播放器三大模块。链路中通过业务标识和视频标识来保障业务域内视频流转的可追溯。

业务发布页使用视频上传SDK：

```js 
const uploader = await createUploader({ bizCode: 'foo' });
const fileInfo = await uploader.startUpload(file);
```

业务主页使用中台服务接口获取 videoId：

```js
const videoIds = await mtop.request({
  api: 'mtop.taobao.cloudvideo.video.query',
  data: { playScenes, from },
});
```

业务详情页使用视频播放器：

```jsx
<Videox 
  sourceProvider={{
    playScenes: 'foo',  // 业务标识
    from: 'common',  // 播放场景
    src: '260544347323',  // 视频标识(videoId)
  }}
/>
```

> 备注：
> 1. 业务主页也可能直接使用视频播放组件；
> 2. 业务通常使用短视频全屏页而非建详情页来实现视频播放和互动。

### 播放器架构

基于业务的诉求和当下的生产关系，播放器的整体架构遵循两个大的原则：一是**要薄**，让业务有选择权，基于能力组合进行定制；二是**要白盒**，让业务有发现和定位问题的能力而不是强依赖中台。

因此播放器架构遵循**关注点分离**的原则，分为以下几层，每一层解决一个领域内的问题（业务诉求点），使用特定的技术栈（技术发力点）：

- **播放能力层**：这一层解决视频能不能播的问题。解决这个问题需要音视频技术能力。架构上把这一层封装为独立的模块，称之为播放器内核；
- **业务接入层**：这一层解决如何能够在业务系统内基于中台能力快速定制专属播放器的问题。解决这个问题需要大前端技术能力。架构上把这一层封装为独立的模块，称之为播放器组件；
- **体验保障层**：这一层解决如何保证开发者体验和用户体验的问题。解决这个问题需要软件工程能力。架构上把这一层作为一个纵向建设，称之为播放器配套设施。

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1654352502942-57f4ca87-d75e-48fc-a4c6-410715a116c4.png) 

基于这个分层产出播放器整体架构图：

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1654496021977-f166b885-cba1-4fc0-83c7-760bc9569134.png) 

- **播放器规范**：包括了统一术语定义、视频播放评估指标定义、播放器 API 和事件定义等。通过一个类型包来 `videox-types` 进行承载，使得在播放器体系内名词得到统一；
- **播放器内核**：包括了面向 Web 场景使用前端技术栈的播放内核 `videox-core` ，以及面向移动端场景使用原生技术栈的播放内核 `native-core`。前者可以在前端领域被直接使用，后者可以在原生领域直接使用，也可以通过 SDK 集成的方式在 Weex/MiniApp/PHA 等容器下被使用；
- **播放器组件**：包括了面向 React 技术栈的播放器组件 `react-videox`，适用于 Web 场景。以及面向 Rax 技术栈的播放器组件 `rax-videox`，使用于多端场景（适配了 PHA/Weex/MiniApp 容器）。两者一些共用的能力则通过插件形式承载，在业务接入时通过组合的方式进行选配；
- **播放器配套设施**：包括了保障视频播放体验的测试方案、日志方案、数据埋点方案等，通过工具库 `videox-utils` 承载；以及保障业务接入效率的教程文档及代码示例，通过官网 `videox-site` 承载。

### 播放器内核

播放内核解决视频能不能播的问题，并提供一组可控的 API。根据大淘宝业务对多端视频播放的诉求，结合多端场景下稳定性和性能最优解的权衡，中台播放内核有面向 Web 场景使用前端技术栈的播放内核 `videox-core` ，以及面向移动端场景使用原生技术栈的播放内核 `native-core`。
 
#### 面向 Web 场景

浏览器已经提供了 `<video />` 标签用于播放视频，为什么还需要自研播放内核呢？主要原因是**浏览器对于流媒体格式以及视频编码的支持度有限**。针对大淘宝的视频播放诉求来说，FLV 及 HLS 协议、 H.265 编码格式及全景视频类型在主流浏览器普遍不支持。

Web 播放内核 `videox-core` 的实现原则是 API 与原生 `<video />` 标签对齐，遵循 W3C 规范。因此，实现自研内核需要熟悉 W3C 规范的内容，理解浏览器视频播放的工作过程，充分了解流媒体协议(FLV/HLS)和媒体格式(MP4/HEVC)的知识以及媒体处理工具(FFmpeg)的使用，并运用最新的浏览器相关性技术(MSE/WebGL/WebAssembly...)来完成。

下面概述一下内部的实现原理。

通常前端播放视频，使用 `<video />` 就完事了：

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1654441728783-861b0977-a511-400a-ade9-393fe7b02a47.png) 

但在大淘宝的业务场景中，**最常遇到的是浏览器不支持的容器格式的情况**。对于非标容器格式通常的处理流程如下（以 TS 为例）：

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1651982494339-72eed722-6e1a-41c5-827c-aa7d32498c54.png)

基本思路都是使用 JS 请求视频资源数据并进行解封装，再将其转换成 MP4 格式传递给 `<video />` 播放，这种字节拼装的方案需要借助 MSE API 的能力。相应的处理模块及其输入输出：

- **Loader(加载器)**: 负责根据请求方案(XHR/Fetch/WebSocket)从网络获取视频资源数据。在这个示例中，输入的是视频资源地址(URL)，输出的是 TS 视频字节流(ArrayBuffer)；
- **Demuxer(解封装器)**: 负责解析视频的容器格式并进行解封装操作获得码流。在这个示例中，输入的是视频字节流(ArrayBuffer)，输出的是 Annex 格式的码流(Packet)；
- **Remuxer(复用器)**: 负责将码流重新包装为另一种容器格式。在这个示例中，输入的是 Annex 格式的码流，输出的是转换为 AVCC 码流格式的 fMP4（流式 MP4）视频字节流；
- **Renderer(渲染器)**: 负责将视频最终渲染播放，渲染过程通过校准 DTS/CTS 保证音画同步。在这个示例中，输入的是 AVCC 码流格式的 fMP4 视频字节流，内部交给 [MediaSource](https://developer.mozilla.org/en-US/docs/Web/API/MediaSource) 进行处理，最后通过 [createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL) 交由 video 标签进行播放，输出画面和声音。

**另一种是不支持的编码格式的情况**。对于非标编码格式处理流程如下（以 MP4 为例）：

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1651982517152-73f52851-5029-4dcd-9ad9-2a9b141042ac.png)

与上面的流程相比，后置的处理模块有所不同。这两个模块的作用及其输入输出：

- **Decoder(解码器)**: 负责解析码流并输出视频像素数据。Decoder 中使用 [WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly) 能力封装 [FFmpeg](https://ffmpeg.org/) 解码器来进行解码，支持了多线程模式及切换解码器(H.265/H.264)的能力。Decoder 输入的是码流数据(Packet)，输出的是 YUI 格式的视频像素数据 和 PCM 格式的音频采样数据。
- **Renderer(渲染器)**: 负责将视频最终渲染播放。由于 YUV 占用较少的带宽，所以视频采用 YUV 传输。而显示器又是使用 RGB 发光，所以在渲染器内需要将 YUV 格式转换成 RGB 格式再通过 [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) 绘制渲染到显示器上。PCM 音频则使用 [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) 进行播放。渲染过程中手动同步音视频的 PTS，以音频事件为准，视频靠拢音频实现音画同步。

结合标准支持情况和非标的容器及编码格式支持情况，`videox-core` 内部视频播放的整体处理流程如下：

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1651982529345-80bf64a6-059c-4a40-a951-fbf7e232f3bb.png) 

上面还只是一种容器格式和一种编码格式的场景。在大淘宝的业务场景中，需要支持多种容器格式和多种编码格式。所以 Demuxer 内部有多个容器解析器(Parser)，Docoder是由渲染控制器(Controller)调度的。整体内部程序设计类图如下：

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1654657381577-c472166b-8b77-4c47-b804-9aa25158300c.png) 

播放内核作为单独 npm 包对外提供使用：

```html
<div id="container" />
<script module>
import Videox from '@ali/videox-core';

const containerEl = document.getElementById('container');
const videox = new Videox({
  container: containerEl,
  src: '//example.com/video.mp4',
});
videox.play();
</script>
```

`videox-core` 程序设计的思考：

1. 为什么不全部根据「不支持」来实现整体流程？是基于运行性能上的考虑：
	1. 当格式不支持+编码支持时，使用 MSE 硬解性能更优；
	2. 当格式支持+编码支持时 `<video />` 原生性能更优。
2. 为什么 Demuxer 不用 FFmpeg+WASM 来实现？
	1. 包大小、代码可维护性和移动端兼容性方面的考虑。
		1. Demuxer 使用 FFmpeg 打包后的体积特别大（少则几M，多则十几M）；
		2. 万一出现 Bug，调试 FFmpeg 的源码效率特别低，也不可能去更新 FFmpeg 的源码；
		3. 同时 WASM 在移动端兼容性是比较差的，播放器应尽最大可能提升整体方案的兼容性。
	2. 架构灵活性的考虑。Demuxer 下不同封装格式使用不同的 Parser 实现，未来可以单独基于组合的方式实现面向单个封装格式的播放器。
3. 不支持的容器格式处理为什么不基于或集成 [flv.js](https://github.com/bilibili/flv.js) / [hls.js](https://github.com/video-dev/hls.js) 等库来实现？
	  1. Decoder 需要接收的是码流，flv/hls 输出的是视频流，因此无法直接复用；
	  2. 两者都是功能完备的播放器实现，无法在多种容器格式和编码格式诉求的处理流程中单独被引用。
	  社区实现 FLV 和 HLS 支持 H.265 普遍做法也是基于这两个库来复写部分逻辑。

#### 面向 Native 场景

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1654509769692-0d41fc5c-9f0f-446b-b187-1f9230517a11.png)

面向 Native 场景，中台提供了两个 SDK 供业务进行接入：

- **TBMediaPlayer**: 类比 `videox-core`，提供通用播放能力；
- **DWInteractiveSDK**: 包含了播控、播管和视频交互能力。

在移动端下，这些 SDK 即可以被使用原生技术栈的业务进行接入，也可以被集成到 MiniApp、PHA/WindVane、Weex 等渲染容器内。

> Native SDK 详细介绍可参考[客户端的文档说明](https://tbplayer.pre-fc.alibaba-inc.com/)。

### 播放器组件

播放内核满足了业务多端视频播放的诉求，但业务还有视频交互、交互定制、多视频管理等诉求的需要，同时播放内核在业务前端系统进行集成接入的效率也不高。VideoX 提供了播放器组件来解决这两个问题。

在大淘宝，业务前端面向 Web 场景以 React 框架进行项目开发，面对多端场景以 Rax 框架进行项目开发。因此，VideoX 提供了 `react-videox` 和 `rax-videox` 两个组件以满足业务接入的需要，并将上诉业务诉求以插件的形式供业务进行选配集成。

#### 面向 React 项目

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1654639570153-173ffbc1-9c91-44df-bc63-c919da95833c.png) 

`react-videox` 用于在 React 项目中集成。主要包括以下能力：

- 通过播放内核 API 实现播放器控件及提供控件定制化能力；
- 通过 HOC 提供拓展能力，包括：多视频管理、播控服务、播放管控等。

`react-videox` 内部的主要模块包括：

- **Context**: 同步播放内核 API  的 `PlayerProvider` 和存放图标信息的 `IconProvider`；
- **控件层**: 控件管理器组件 `ControlWrap` 以及一系列实现视频交互能力的默认控件；
- **样式层**: 参考了 [infima](https://infima.dev/)，使用 CSS 变量和预设的样式类来进行构建。

##### Context

`PlayerProvider` 是播放内核 API 的封装，可以同步或更新播放内核状态 ，供内部控件进行消费，同时对外导出 Ref：

1. 播放器内部的控件组件使用 `PlayerProvider` 导出的 Hooks 。以播放/暂停切换控件为例：
  
```tsx
import React, { memo, useCallback } from 'react';
import { usePlayerActions, usePlayerState } from 'src/context/player';
import { Icon } from 'src/components/common/Icon';
import { Button } from 'src/components/common/Button';

export const PlayToggle = memo(() => {
  const { paused } = usePlayerState();
  const actions = usePlayerActions();

  const handleClick = useCallback(() => {
    actions.togglePlay();
  }, []);

  return (
    <Button
      onClick={handleClick}
      title={paused ? '播放' : '暂停'}
    >
      <Icon type={paused ? 'play' : 'pause'} />
    </Button>
  );
});
```

2. 业务使用播放器组件时可以通过 Ref 的方式获取到播放内核的 API:
  
```tsx
import React, { useRef, useCallback } from 'react';
import { Videox } from '@ali/react-videox';

function App() {
  const videoxRef = useRef();
  const handlePlay = useCallback(() => videoxRef.current.play(), []);
  const handlePause = useCallback(() => videoxRef.current.pause(), []);

  return (
    <>
      <Videox 
        ref={videoxRef}
        src="//example.com/video.mp4"
      />
      <div>
        <button onClick={handlePlay}>播放</button>
        <button onClick={handlePause}>暂停</button>
      </div>
    </>
  );
}
```

图标信息存储为 `IconProvider`，联合 Icon 组件，提供播放器内图标的展示和定制能力：

1. `IconProvider` 的实现: 

```tsx
import React, { ReactNode, createContext, useContext, memo } from 'react';

const IconContext = createContext(null);
const iconConfig = {
  scriptUrl: '//at.alicdn.com/t/font_3356617_kjuxu8f44vm.js',
  prefix: 'videox-'
};

export function useIcon() {
  return useContext(IconContext);
}

export interface IconProviderProps {
  /**
  * Symbol 代码地址
  */
  iconScriptUrl?: string;
  /**
  * Symbol 前缀
  */
  iconPrefix?: string;
  children: ReactNode;
}

export const IconProvider = memo((props: IconProviderProps) => {
  const { children, iconScriptUrl = iconConfig.scriptUrl, iconPrefix = iconConfig.prefix } = props;
  return (
    <IconContext.Provider value={{ iconScriptUrl, iconPrefix }}>
      {children}
    </IconContext.Provider>
  );
});
```

2. `Icon` 组件消费 Provider 数据：

```tsx
import React, { memo, useMemo } from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { useIcon } from 'src/context/icon';

export const Icon = memo((props: { type: string; }) => {
  const { type } = props;
  const { iconScriptUrl, iconPrefix } = useIcon();
  const IconFont = useMemo(() => createFromIconfontCN({ scriptUrl: iconScriptUrl }), [iconScriptUrl]);
  const iconPath = `${iconPrefix}${type}`;
  return (
    <IconFont type={iconPath} />
  );
});
```

3. 业务使用播放器组件时可通过传参的方式定制图标

```tsx
import React from 'react';
import { Videox } from '@ali/react-videox';

export default function App() {
  return (
    <Videox 
      src="//example.com/video.mp4"
      iconScriptUrl="//at.alicdn.com/t/font_3357872_s63l0u876n.js" // Symbol 代码地址
      iconPrefix="icon-" // Symbol 前缀
    />
  );
}
```

##### 控件层

控件层控件层解决视频交互和交互定制的问题，包括了：

1. 一系列实现视频交互能力的[默认控件](https://videox.alibaba-inc.com/docs/tutorial/react-videox/ui/controls#%E5%AE%98%E6%96%B9%E6%8E%A7%E4%BB%B6)，例如进度条、倍数菜单、全屏切换等。这些控件各自是独立的，通过 `PlayerProvider` 同步整体状态。以静音/有声切换控件为例，控件的内部实现如下：
  
```tsx
import React, { memo, useCallback } from 'react';
import classNames from 'classnames';
import { Icon } from 'src/components/common/Icon';
import { Button } from 'src/components/common/Button';
import { usePlayerActions, usePlayerState } from 'src/context/player';
import { ControlProps } from 'src/components/interfaces';

export const VolumeToggle = memo((props: ControlProps) => {
  const { className } = props;
  const { muted, volume } = usePlayerState();
  const actions = usePlayerActions();

  const handleClick = useCallback(() => {
    actions.toggleMuted();
  }, []);

  const isMuted = muted || volume === 0;

  return (
    <Button
      className={classNames(
        className,
        { muted: isMuted, },
      )}
      onClick={handleClick}
      title={isMuted ? '有声' : '静音'}
    >
      <Icon type={isMuted ? 'sound-off' : 'sound-on'} />
    </Button>
  );
});
```

2. 控件管理器组件 `ControlWrap` 负责控件层交互(onClick/onDoubleClick/onMouseEnter...)定制，并加载内部默认的控件且允许禁用和排序、插入子组件等：

```tsx
import React, { Children, ReactNode, useCallback } from 'react';
import { usePlayerActions, usePlayerState } from 'src/context/player';
import { BigPlay } from 'src/components/BigPlay';
import { ControlBar } from 'src/components/ControlBar';
import { ErrorControl } from 'src/components/ErrorControl';
import { LoadingControl } from 'src/components/LoadingControl';
import { Poster } from 'src/components/Poster';

function getDefaultControls(options) {
  const { controls } = options;
  return controls ?
    [
      <Poster key="Poster" order={0} />,
      <BigPlay key="BigPlay" order={1} />,
      <ControlBar key="ControlBar" order={2} />,
      <LoadingControl key="LoadingControl" order={3} />,
      <ErrorControl key="ErrorControl" order={4} />,
    ] :
    [];
}

function getControls(originalChildren: ReactNode, options) {
  const children = Children.toArray(originalChildren);
  const defaultChildren = getDefaultControls(options);
  return mergeAndSortChildren(children, options, defaultChildren);
}

interface ControlsWrapProps {
  children?: ReactNode;
  /**
   * 单击视频容器切换播放/暂停
   */
  clickToPlay?: boolean;
  /**
   * 双击视频容器切换全屏/非全屏
   */
  doubleClickToRequestFullscreen?: boolean;
  /**
   * 是否显示控件
   */
  controls?: boolean;
}

export function ControlWrap(props: ControlsWrapProps) {
  const { children, clickToPlay, doubleClickToRequestFullscreen, ...options } = props;
  const { isFullscreen } = usePlayerState();
  const actions = usePlayerActions();

  const handleClick = useCallback(() => {
    clickToPlay && actions.togglePlay();
  }, [clickToPlay]);
  const handDoubleClick =useCallback(() => {
    if (doubleClickToRequestFullscreen) {
      isFullscreen ? actions.exitFullscreen() : actions.requestFullscreen();
    }
  }, [isFullscreen, doubleClickToRequestFullscreen]);

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handDoubleClick}
    >
      {getControls(children, options)}
    </div>
  );
}
```

> `mergeAndSortChildren` 函数负责加载子组件，履约禁用(disable)、排序(order)等控件参数，执行参数合并等操作。[实现源码](http://gitlab.alibaba-inc.com/amedia/videox-react/blob/publish/0.3.2/src/components/controls/ControlBar.tsx#L19)

基于此实现，在业务使用 `react-videox` 时，可以：

1. [配置控件层交互](https://videox.alibaba-inc.com/docs/tutorial/react-videox/ui/controls#%E9%85%8D%E7%BD%AE)：

```tsx
function App() {
  return (
    <Videox 
      src="//example.com/video.mp4"
      clickToPlay={true} // 点击切换视频播放状态
      doubleClickToRequestFullscreen={true} // 双击切换视频全屏状态
    />
  );
}
```

2. [配置默认控件](https://videox.alibaba-inc.com/docs/tutorial/react-videox/ui/basic)：

```tsx
function App() {
  return (
    <Videox src="//example.com/video.mp4">
      {/* 禁用控件层的控件 */}
      <BigPlay disabled />
      <ControlBar>
        {/* 禁用控制栏的控件 */}
        <VolumeControl disabled />
        {/* 将全屏切换按钮放到最左边 */}
        <FullscreenToggle order={0} />
      </ControlBar>
    </Videox>
  );
}
```

3. [新增定制控件](https://videox.alibaba-inc.com/docs/tutorial/react-videox/ui/add)

```tsx
import React from 'react';
import { Videox, ControlBar, usePlayer } from '@ali/react-videox';

function CustomControl() {
  const { state, actions } = usePlayer(); // 返回播放器的 API
  // const state = usePlayerState(); // 返回播放器的最新属性
  // const actions = usePlayerActions(); // 返回播放器的方法
  return (
    <div style={style}>
      是否正在播放：{`${!state.paused}`}
      <button onClick={() => actions.togglePlay()}>
        {state.paused ? '播放' : '暂停'}
      </button>
    </div>
  );
}

export default () => {
  return (
    <Videox src="//example.com/video.mp4">
      {/* 添加定制控件到控件层 */}
      <CustomControl />
      <ControlBar>
        {/* 添加定制控件到控制栏 */}
        <div style={{ backgroundColor: 'blue' }}>
          Tag
        </div>
      </ControlBar>
    </Videox>
  );
}
```

#### 面向 Rax 项目

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1654529917924-f17b16b7-db50-4ac3-95da-d9be382b87a2.png) 

`rax-videox` 用于在 Rax 项目中集成。主要包括以下能力：

- 多容器渲染下播放内核 的适配，对外 API 向 WebView 对齐，降低业务接入成本；
- PHA/WindVane 下利用同层渲染能力对接 `native-core` ，WebView 下使用 `videox-core`，增强播放能力；

> 在大淘宝下的多端场景下，交互定制能力的诉求并不强烈，因此视频交互能力当前渲染容器下的 `<video />` 标签提供。

`react-videox` 内部的主要模块包括：

- **API 适配层**：包含了 WindVane/PHA、WebView、Weex、MiniApp 渲染容器的 API 适配；
- **同层渲染对接层**：将 Rax 组件语法翻译成同层渲染组件语法，实现高性能的 API 转换。
- **通过 HOC 提供拓展能力**，包括：多视频管理、播控服务、播放管控等。

##### API 适配层

API 适配的实现思路大致如下：

1. 由不同的组件实现各自渲染容器下的参数和 API 适配：

```bash
.
├── index.tsx                 // 入口文件
├── empty                     // 空组件实现
├── miniapp-native            // 小程序语法的组件实现
├── miniapp-runtime           // Rax 小程序运行时语法的组件实现
├── webview                   // WebView 下的组件实现
├── weex                      // Weex 下的组件实现
└── windvane                  // PHA/WindVane 下的组件实现
```

以 Weex 下组件适配为例，实现的示例代码大意如下：

```tsx
import { useRef, forwardRef, useImperativeHandle, memo, useMemo, useCallback } from 'rax';
import setNativeProps from 'rax-set-native-props';
import create from 'lodash.create';
import { ScreenModeMap, contentModeMap } from 'src/common/constant';

export const Videox = memo(forwardRef((props, ref) => {
  /**
   * 参数适配
   */
  const { 
    live,
    src,
    controls,
    style = {},
    objectFit = 'contain',
    orientation = 'vertical',
    onPlay,
    onPlaying,
    onPrepared,
    onLoadedMetadata,
    // 更多参数...
    ...otherProps
  } = props;
  const videoRef = useRef(null);
  const VideoPlusComponent = useMemo(() => createVideoPlusComponent(live), [live, src]);

  /**
   * API 适配
   */
  useImperativeHandle(ref, () => {
    return create(videoRef.current, {
      requestFullscreen: (direction?: number) => {
        let landscape = false; 
        if (direction === 90 || direction === -90) {
          landscape = true;
        }
        setNativeProps(videoRef.current, { screenMode: ScreenModeMap.fullScreen, landscape, });
      },
      exitFullscreen: () => setNativeProps(videoRef.current, { screenMode: ScreenModeMap.inlineScreen, landscape: false, }),
      // 更多 API...
    });
  }, [VideoPlusComponent]);

  /**
   * 事件适配
   */
  const handlePrepared = useCallback(() => {
    onPrepared?.();
    onLoadedMetadata?.();
  }, [onPrepared, onLoadedMetadata]);
  const handlePlaying = useCallback(() => {
    onPlay?.();
    onPlaying?.();
  }, []);
  // 更多事件...

  return ( 
    <VideoPlusComponent 
      src={src}
      hideControl={!controls}
      controlsViewHidden={!controls}
      contentMode={contentModeMap[objectFit]}
      size={objectFit}
      landscape={!(orientation === 'vertical')}
      type={ live ? 'live' : 'video' }
      {...otherProps}
      onPlaying={handlePlaying}
      onPrepared={handlePrepared}
      ref={videoRef}
      className="videox-video"
      style={style}
    />
  );
}));

function callbackToPromise(fn) {
  return new Promise((resolve) => fn((e) => resolve(e.result)));
}

function createVideoPlusComponent(live: boolean) {
  return forwardRef(function(props, ref) {
    return live ? <video {...props} ref={ref} /> : <videoplus {...props} ref={ref} />
  });
}
```

2. 在入口文件处根据环境在运行时判断使用的组件：

```ts
import { isWeb, isMiniApp, isWeex, isWindVane } from 'universal-env';
import { supportNativeView } from '@ali/rax-composite-view-factory';

let exports;
if (isWindVane && ( supportNativeView('wvvideo') || supportNativeView('wvlivevideo') )) {
  exports = require('./windvane');
} else if (isMiniApp) {
  exports = require('./miniapp-runtime');
} else if (isWeb) {
  exports = require('./webview');
} else if (isWeex) {
  exports = require('./weex');
} else {
  exports = require('./empty');
}

const Videox = exports?.default || exports;
export default Videox;
```

3. 声明组件的包导出配置

```json
{
  "name": "@ali/rax-videox",
  "version": "0.3.0",
  "main": "lib/index.js",
  "module": "es/index.js",
  "miniappConfig": {
    "main": "lib/miniapp-native/index"
  },
  "exports": {
    ".": {
      "weex": "./es/weex/index.js",
      "web": "./es/index.js",
      "miniapp": "./es/miniapp-runtime/index.js",
      "default": "./es/index.js"
    },
    "./*": "./*"
  },
  "files": [ "es", "lib", "dist"  ]
}
```

> [`exports`](https://webpack.js.org/guides/package-exports/) 字段使得 Rax 项目引用在打包特定容器下 bundle 时只加载组件的特定容器下实现代码。

##### 同层渲染对接层

[同层渲染](https://h5.alibaba-inc.com/windmix/)是允许将 Native 组件和 WebView DOM 元素混合在一起进行渲染的技术，能够保证 Native 组件和 DOM 元素体感一致，渲染层级、滚动感受、触摸事件等方面几乎没有区别。

在 PHA/WindVane 下已完成同层渲染的接入，同时 `native-core` 通过与容器对接，在 PHA/WindVane 下注册了 `wvvideo` 和 `wvlivevideo` 两个同层渲染组件供前端进行使用，前端可通过 `<object>` 引入：

```html
<object id="my_map" type="application/view" width="200" height="100">
    <param name="viewType" value="wvvideo"/>
    <param name="bridgeId" value="my_wvvideo_0"/>
    <param name="data" value="origin value"/>
</object>
```
 
其中：

- `<object>` 的 type 必须为 `application/view`；
- 使用 `name="viewType"` 的 param 来标识同层渲染组件的类型；
- 使用 `name="bridgeId"` 的 param 作为同层渲染组件的标识（仅限 Android）；
- 使用其它 param 来传递组件需要使用的参数。

除了传递参数，同层渲染组件还可以监听事件、调用方法，但方式与普遍的 DOM 元素有所不同，在不同的端上(iOS/Android)还有所差异。当页面上有多个同层渲染组件时，还需要保证 `bridgeId` 的唯一性。

如此之下，同层渲染组件的使用成本还是比较高的，且普通的 Rax 组件相比有明显的不同，不符合 Rax 体系内开发者的使用习惯。因此 Rax 团队提供了 [`@ali/rax-composite-view-factory`](https://web.npm.alibaba-inc.com/package/@ali/rax-composite-view-factory) 来更好地管理和桥接同层渲染组件。使用方式如文档所诉，这里就不再展开：

```jsx
import { useRef, useCallback, useEffect } from 'rax';
import { createCompositeComponent } from '@ali/rax-composite-view-factory';

const videoConfig = {
  properties: {
    src: {
      type: String,
      default: '',
    },
  },
  events: [
    'playing',
  ],
  methods: [
    'play',
    'pause',
  ],
};
const Video = createCompositeComponent('wvvideo', videoConfig, 'video');

function App() {
  const videoRef = useRef(null);
  const handlePlaying = useCallback(() => {
    // dosomthing...
  }, []);
  useEffect(() => {
    videoRef.current.play();
  }, []);

  return (
    <Video
      src="//example.com/video.mp4"
      onPlaying={handlePlaying}
      ref={videoRef}
    />
  );
};
```

#### 插件化能力

类似多视频管理、播控服务、数据埋点等能力，一方面是选配的，两一方面在 `rax-videox` 和 `react-videox` 上有诉求，因此在播放器组件中，是通过 HOC 的形式来实现的。这样业务就可以各取所需，同时中台的维护成本也得以控制。

以播控服务为例，使用方式是：

```tsx
import Videox, { withSourceProvider } from '@ali/rax-videox';
const VideoxWithSourceProvider = withSourceProvider(Videox);

function App() {
  return (
    <VideoxWithSourceProvider 
      sourceProvider={{
        vendor: 'taobao', // 播控服务商标识
        playScenes: 'guangguang', // 业务标识
        from: 'list', // 播放场景标识
        src: '319050647677', // 视频标识(videoId)
      }}
    />
  );
}
```

在播放器组件中的 HOC 是基于公共的 npm 生成属于 Rax 或 React 的 HOC: 

```ts
import Rax from 'rax';
import { createHOC } from '@ali/videox-source-provider';

export const withSourceProvider = createHOC(Rax);
```

亦或是单独作为工具库进行调用：

```ts
import { query } from '@ali/videox-source-provider';

const data = await query( {
  vendor: 'taobao', // 播控服务商标识
  playScenes: 'guangguang', // 业务标识
  from: 'list', // 播放场景标识
  src: '319050647677', // 视频 ID
});
const { sources } = data;
const source = sources[0];

// 播放策略
playerSettings.autoplay; // 自动播放
playerSettings.muted; // 静音

// 资源信息
source.src; // 播放地址
source.bitrate; // 比特率
source.quality; // 清晰度
```

其他 HOC 的实现也基本类似。

### 播放器配套设施

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1655085592953-03c9cf20-4973-4651-94a5-2783c11d5d0b.png) 

播放器配套设施有：

1. 保障视频播放体验的：测试方案、日志方案、数据埋点方案等，在播放器整体架构中称之为 `videox-utils`；
2. 保障开发者体验提升业务接入效率的的：教程文档及代码示例，通过官网 `videox-site` 承载。

#### Utils

VideoX 在这一方面仍处于早期的建设阶段。下面主要是调研的内容和阶段性工作：

**测试方案**：

- 测试类型： 针对播放器 API 的 E2E 测试（黑盒），作用于播放内核（`videox-core`）；针对播放器内部实现的单元测试（白盒），作用于内部模块（`demuxer`/`decoder`/`remuxer`等）；
- 测试工具链： [Karma](https://github.com/karma-runner/karma)(构建工具) 、 ([Mocha](https://mochajs.org/))测试框架、[Chai](https://www.chaijs.com/)(断言库)、[Sinon](https://sinonjs.org/)(Mock库)；
- 测试资源集：[`videox-assets`](https://web.npm.alibaba-inc.com/package/@ali/video-assets)，是一组用于 E2E 测试的输入集合，包含各种情况的视频资源 URL。比如不同的容器格式、编码格式的视频。不仅包括正常的资源，也包含异常的音视频资源，比如无音频，PTS 有问题等致命和非致命的异常情况。测试资源单独在局部网域内部署成媒体服务，可对于网络访问做一定的控制用于模拟各种情况。测试资源越丰富，播放器的健壮性和兼容性就越容易得到保障。

**日志方案**：能够记录播放器在运行时的日志，并在播放器发生错误时主动进行上报，并提供日志下载的途径供用户反馈问题时提交。

**数据埋点方案**：基于播放器事件的进行数据采集，并产出 QoS 和 QoE 数据。

- 自动化采集装置：[`videox-tracker`](https://web.npm.alibaba-inc.com/package/@ali/video-tracker)

```js
import VideoxTracker from '@ali/videox-tracker';

const video = document.getElementById('my-video');
const videoxTracker = new VideoxTracker();
videoxTracker.start(video);
```

- 数据处理的相关性 SQL：通过 ODPS 离线任务对播放器事件日志进行分析，产出数据统计表。业务根据自身需要通过 [FBI](https://fbi.alibaba-inc.com/) 对数据进行筛选并制作前台数据报表。

#### Site

官网包括以下部分的内容：

- 教程文档：从 0 到 1 指导开发者如何使用播放器，并提供播放器各个功能的使用说明。
- API 文档：使用代码注释借助 [TypeDoc](https://typedoc.org/) 工具生成，并跟随播放器发布而更新，能够保证实时性。（示例：[`react-videox`](https://g.alipay.com/@ali/react-videox@0.3.2/docs/index.html)）
- 代码示例：包括可以实时编辑的 [Sandbox 类示例](https://videox.alibaba-inc.com/demo/react-videox)，以及使用 ice.js /  rax-app 开发的[线上示例应用](https://videox.alibaba-inc.com/demo/rax-videox)。

## 关于未来的一点思考

VideoX 不是一个全新的技术，实际上它已经发展了很多年。但最近一年我们才真正把它当做一个技术产品在运作和对外提供服务。未来 VideoX 需要持续修好内功，为大淘宝业务提升全链路的画质等视频播放体验。落在的具体技术指标上，就是提升播放内核的稳定性、性能和架构开放性，重点是直播的稳定性、 H.265 Seek 的性能和 ARTC 协议的支持。相应的需要对播放器配套设施需要升级，包括测试方案及其覆盖度的完善、日志能力的完备、体验评价体系及全链路画质及质量监控的建设。