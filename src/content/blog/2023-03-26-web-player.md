---
category : front-end
title: "在 Web 平台规模化部署高效编码格式的实践和思考"
description: "在 Web 平台规模化部署高效编码格式的实践和思考"
tags : [多媒体, 播放器]
---

![h266-vs-h265-featured.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/195/1674445506690-e4c2692e-5b4a-487e-a2fa-2c0c999132a7.jpeg) 

随着 Chrome 在 107 版本支持 H.265 的硬解，以及 Web 平台上 H.265 软解技术的成熟，在 Web 平台上规模化部署 H.265 视频的时机已经成熟。关于 H.265 编码格式以及它的好处，网上已经有非常多的介绍了。它最重要的好处是更低的部署成本，因此对于视频服务供应商来说，是应用尽用的。

但是编码格式是逐渐演进的，现在主要是 AVC/HEVC，正在发展为 VVC/AV1。浏览器厂商对编码格式的支持，即有开发成本和商业因素的考量，也有其时效性。因此对于 Web 开发者来说，其背后真正的命题是：**如何在 Web 平台规模化部署更高效率的编码格式**。所谓「规模化」即：**在软硬件条件具备的情况下，用更高效的编码格式且体验不降级；条件不具备的情况下，能降级到低效的编码格式**。

近期我们在内容审核平台上完成了 H.265 的部署，结合这一过程的调研和实践，分享一些经验和思考。

## 浏览器兼容性

在 Web 平台部署一种编码格式，首先要看浏览器对其的支持度。例如 H.265 的浏览器兼容性：

![hevc](https://img.alicdn.com/imgextra/i4/O1CN01crNQif1KfWWNkXVTo_!!6000000001191-2-tps-2752-900.png)

> 参考 https://caniuse.com/hevc

图里面既有红色绿色，还有褐色。怎么解读呢？要看懂这张图，先要理解视频编码的两种解码方式：

1. **硬解**：字面上理解就是用硬件来进行解码，是使用 GPU 的专门模块来解码。
2. **软解**：字面上理解就是用软件来进行解码，是使用 CPU 来运行视频编解码代码。

软硬解各有优缺点：

- **软解**：在软解码过程中需要对大量的视频信息进行运算，所以对 CPU 性能的要求非常高，尤其是对高码率的视频来说巨大的运算量会造成转换效率低，发热量高等问题。不过软解码的过程中不需要复杂的硬件支持，兼容性高。即使是新出的视频编码格式，也可以为其编写新的解码程序；
- **硬解**：硬解码调用 GPU 的专门模块来解码，拥有独特的计算方法，解码效率高。这样不但能够减轻 CPU 的负担，还有着低功耗，发热少等特点。但是由于硬解码起步相对晚，软件和驱动对他的支持度低，基本上硬解码内置什么样的模块就解码什么样的视频，面对各色各样的视频编码样式，兼容性没那么好。

| 解码方式 | 效率 | 功耗 | 兼容性 |
| -------- | -------- | -------- | -------- |
| 软解     | 低 | 高 | 高 |
| 硬解     | 高 | 低 | 低 |

浏览器是否支持**软解**某种编码格式，主要有以下的考量：

- **开发成本**：需要为编码格式开发专门的解码程序，有一定的开发成本；
- **商业因素**：一些编码格式有昂贵的专利费用和复杂的专利授权问题。

软解也有它的时效性，也就是说不是立即马上就能完备地支持的。

而浏览器是否支持**硬解**某种编码格式，则依赖各种软硬件设施：

![undefined](https://img.alicdn.com/imgextra/i3/O1CN01MRquQn1a2cjrnxJcW_!!6000000003272-2-tps-2864-1364.png)

**结合软硬解的条件，就有了各浏览器对于 H.265 参差不齐的支持性表现**。

比方说 Safari 支持 H.265 的软硬解，因此是绿色的 Supported（完全支持）；Chrome 仅支持 H.265 的硬解，所以是褐色的 Partial support（部分支持）。caniuse 上也附上了 Chrome 部分支持的说明：

![undefined](https://img.alicdn.com/imgextra/i4/O1CN01DbJssq1liiut312PB_!!6000000004853-2-tps-720-440.png_360x10000.jpg)

下面重点说说硬解的条件有哪些。

### 硬件条件

**硬解的第一必要条件是需要 GPU 的支持**，社区上总结 H.265 对 GPU 的要求是：

- 独显：NVIDIA GTX950 及以上；AMD RX460 及以上；
- 集显：Intel HD4400, HD515 及以上；AMD Radeon R7, Vega M 及以上；Apple M1, M1 Pro, M1 Max, M1 Ultra 及以上；

各 GPU 对视频编码格式的支持可参见其官网上的说明：[Intel](https://bluesky-soft.com/en/dxvac/deviceInfo/decoder/intel.html)、[AMD](https://bluesky-soft.com/en/dxvac/deviceInfo/decoder/amd.html)、[NVIDIA](https://bluesky-soft.com/en/dxvac/deviceInfo/decoder/nvidia.html)

### 软件条件

硬解还需要配套的**解码框架**。下表来自 FFmpeg 项目对[不同解码框架硬解 H.265 支持情况的总结](https://trac.ffmpeg.org/wiki/HWAccelIntro)：

![](https://img.alicdn.com/imgextra/i2/O1CN01sCeh9A25medJtokm1_!!6000000007569-2-tps-1080-895.png)

硬解框架五花八门，不同的显卡厂商和设备有各自的专用解码框架，操作系统也有定义好的通用解码框架。由于显卡厂商众多，因此大部分播放器**一般均基于通用框架实现硬解**，少部分播放器在人力充裕的情况可能会为了更好的性能额外对专用框架二次实现。

其中 Windows 平台通用的解码框架有 Media Foundation、D3D11VA、DXVA2 以及 OpenCL。macOS 平台通用的解码框架只有一个，就是苹果自己的 VideoToolbox。Linux 平台的通用解码框架有 VAAPI 和 OpenCL。

对于浏览器而言，为了更好的兼容性和稳定性，通常基于通用硬解框架实现硬解，这样更符合最小成本最大收益的目标，并且有更好的可维护性。例如：

- Windows 下 Edge 使用 MediaFoundation（需要安装 HEVC 视频扩展插件）完成硬解，和系统自带的电影与电视用的解码器相同；Chromium 使用 D3D11VA（无需安装插件）完成硬解，和 VLC 等视频播放器用的解码器相同。
- macOS 下 Safari 和 Chromium 二者均使用 VideoToolbox 解码器完成硬解。
- Linux 下 Chromium 使用 VAAPI 解码器完成硬解。

**由于通用解码框架对 H.265 编解码能力的支持性是在不同的操作系统版本上实现的，以及浏览器在实现硬解逻辑的过程中依赖部分系统 API ，所以 Web 平台上硬解 H.265 对操作系统有要求**。例如 Chrome 上要求操作系统：macOS Big Sur (11.0) 及以上、Windows 8 及以上、Linux >= 108.0.5354.0（仅支持 VAAPI 接口支持的 GPU，比如：Intel 核显）。

通常显卡驱动对于编解码 H.265 没有直接关系，但也会存在显卡驱动有 Bug 导致浏览器使用解码框架调用失败的情况。遇到这种情况，浏览器通常会针对性地把此显卡驱动版本列入黑名单。例如 Chrome 上就对有 Bug 的 NVIDIA 驱动版本(< 451.48)禁用 D3D11VideoDecoder。

> 参考 [Chrome 的黑名单设定](https://source.chromium.org/chromium/chromium/src/+/main:gpu/config/gpu_driver_bug_list.json?q=disable_d3d11_video_decoder)。

不同浏览器对 H.265 的支持策略不同，已支持的浏览器也是在特定的版本加入该能力。在主流的浏览器中：Chrome >= 107 支持；Safari >= 13 支持；Firefox、Egde 均不支持。

最后，W3C 规范了多种 API 用于处理视频，例如 HTMLVideoElement、Media Source Extensions(以下简称 MSE)、WebCodecs 等。不同的 API 是在不同浏览器的版本下提供的支持，且对编码格式的支持度有所不同。例如 WebCodecs 编码相关的 API 对 H.265 的支持度就比解码 API 差一些。

## 视频播放方案

在 Web 平台上有多种方式可以播放视频。

### src 

最简单的做法就是直接只用 video 标签的 src 属性：

```jsx
<video src="//cdn.com/hevc.mp4">
	你的当前环境不支持播放该视频
</video>
```

但这种方式的可用性非常不友好，大多数浏览器在不支持视频编码格式的情况下将会只播放音频且没有任何报错。

### source 

浏览器还提供了 `<source>` 元素以声明多个视频源，然后浏览器将会使用它所支持的第一个源：

```html
<video controls width="375" height="375">
	<source src="//cdn.com/hevc.mp4" />
	<source src="//cdn.com/avc.mp4" />
</video>
```

从实际结果来看，在不支持 H.265 编码格式的浏览器里会在视频解码失败时播放音频，因此播放的始终是第一个 source:

![undefined](https://img.alicdn.com/imgextra/i2/O1CN01x9Gx2525i4fVidngl_!!6000000007559-2-tps-810-974.png_360x10000.jpg)

好在 source 标签还提供了 type 属性：

```html
<video controls width="375" height="375">
	<source src="//cdn.com/hevc.mp4" type="video/mp4;codecs=hvc1.1.6.L93.90" />
	<source src="//cdn.com/avc.mp4" type="video/mp4;codecs=avc1.64001f" />
</video>
```

如果未指定 type 属性，浏览器会请求媒体资源，并检查是否能够处理它，如果无法播放，则检查下一个源；如果指定了 type 属性，浏览器会将其与可以播放的类型进行比较，如果无法识别，则浏览器不会请求媒体资源，而是立即检查下一个源元素。

因此传入 codecs 后浏览器会在不支持 H.265 时播放第二个 H.264 的视频。由于 Codecs 在转码时非常容易获得，因此对于浏览器已支持的容器格式，结合服务端使用此部署方式成本低、兼容性好。

### MSE

从 source 标签来看，浏览器播放已支持的容器格式和编码格式的视频（例如 MP4 的 H.265）已经非常方便了。但是问题在于：`codecs` 参数需要从服务端返回。如果在视频播放体系中不具备这样的条件，那就只能使用 Javascript 自己实现一个跟 source 一样效果的前端播放器了。

类似于 flv.js ，我们可以对 MP4 进行解封装和复用最后通过 `Media Source Extensions` 进行播放：

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2023/svg/195/1676097842273-5dec3e80-894b-401b-a5be-84fd0c08aa4c.svg) 

通过 Demuxer 获取到 codecs 信息，然后在 Remuxer 前调用浏览器提供的 API 来判断当前是否支持硬解，支持则继续执行当前流程，否则进入下一个 source 的执行流程。

加上编码格式这一判断条件后，相对于成熟的 mse-player，这里面的差异和难点在于：如何检测是否支持硬解，如何在 remuxer 之前阻断流程，以及如何进行向下兼容。

### WebCodecs

[WebCodecs API](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API) 提供了 [VideoDecoder](https://developer.mozilla.org/en-US/docs/Web/API/VideoDecoder) 来直接调用硬解能力。基于该 API 我们可以使用以下思路来实现一个前端播放器：

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2023/svg/195/1676098324449-8e13444a-9b3e-45bc-82d1-b1bffeece433.svg) 

与上面的 MSE 相同，通过 Demuxer 获取到 codecs 信息，然后在 deocode 前调用浏览器提供的 API 来判断当前是否支持硬解，支持则继续执行当前流程，否则进入下一个 source 的执行流程。

VideoDecoder 甚至还可以配置首选的解码方案：

```ts
const decoder = new VideoDecoder(init);
decoder.configure({
  codec: 'vp8',
  hardwareAcceleration: 'prefer-hardware',
});

interface VideoDecoder {
  configure(config: VideoDecoderConfig): void;
}

interface VideoDecoderConfig {
  codec: string;
  hardwareAcceleration?: HardwarePreference | undefined;
}

type HardwarePreference = "no-preference" | "prefer-hardware" | "prefer-software";
```

### WASM

我们也可以基于 [WebAssembly](https://webassembly.org/) + [FFmpeg](https://ffmpeg.org/) 编译实现一个软解的 Decoder（姑且称为 WASMDecoder），然后与上面的 WebCodecs 的思路一样，将 VideoDecoder 替换为 WASMDecoder 即可。

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2023/svg/195/1676097851043-a38d37eb-6237-4f2e-bd25-ee35cadd1ccb.svg)

### 综合对比

使用浏览器的 API 首先要关注其兼容性：

- [video 标签 src 参数](https://caniuse.com/mdn-html_elements_video_src)：

	![](https://img.alicdn.com/imgextra/i3/O1CN01QljfLZ1erEy8zPP7n_!!6000000003924-2-tps-2742-714.png)
- [source 标签](https://caniuse.com/mdn-html_elements_source):

    ![](https://img.alicdn.com/imgextra/i2/O1CN012rqyQe1ZUH1uuAMdJ_!!6000000003197-2-tps-2746-718.png)
- [MSE](https://caniuse.com/mediasource):

    ![](https://img.alicdn.com/imgextra/i2/O1CN01KYqtZ91Pb0hGcTW0V_!!6000000001858-2-tps-2748-972.png)
- [WebCodecs](https://caniuse.com/webcodecs):

    ![](https://img.alicdn.com/imgextra/i2/O1CN01R8JZYz205XGGJSzfX_!!6000000006798-2-tps-2752-896.png)
- [WebAssembly](https://caniuse.com/wasm):
     
    ![](https://img.alicdn.com/imgextra/i3/O1CN0135Oi9y1Dal57Kznwz_!!6000000000233-2-tps-2748-946.png)
  
> 实际实现过程中，对于 WebCodecs 方案还需要关注 Web Audio API 的兼容性（用其播放音频），对于 WASM 方案还需要关注 Web Workers 的兼容性（多线程保障软解性能）。
  
在对比时，我们区分媒体是否具备多种视频编码格式（用作兜底）。

只有一个源时：

| 方式 | 兼容性 | 实现成本 | 体验 |
| -------- | -------- | -------- | -------- |
| src       | 非常高  | 非常低  | 非常高 |
| MSE       | 中     | 中     | 高     |
| WebCodecs | 低     | 高     | 中     |
| WASM      | 高     | 非常高  | 低     |

- 浏览器支持性覆盖度从高到低：video 标签 > WASM > MSE > WebCodecs
- 技术实现成本从低到高：video 标签 > MSE > WebCodecs > WASM
- 用户体验从高到低：video 标签 > MSE > WebCodecs > WASM

有多个源时：

| 方式 | 兼容性 | 实现成本 | 体验 |
| -------- | -------- | -------- | -------- |
| src       | 非常高  | 非常低  | 非常低 |
| source    | 高     | 低     | 非常高  |
| MSE       | 中     | 中     | 高     |
| WebCodecs | 低     | 高     | 中     |
| WASM      | 高     | 非常高  | 低     |

- 浏览器支持性覆盖度从高到低：video 标签 > source 标签 > WASM > MSE > WebCodecs
- 技术实现成本从低到高：video 标签 > source 标签 > MSE > WebCodecs > WASM
- 用户体验从高到低：source 标签 > MSE > WebCodecs > WASM > video 标签

因此，部署时尽量通过以下优先级来进行：

1. 有多个源时：source > MSE > WebCodecs > WASM > src
2. 只有一个源时：src > MSE > WebCodecs > WASM

## 硬解可用性

对于 MSE 和 WebCodecs 的播放方案来说，我们需要判断当前的终端环境能否支持硬解某一编码格式的视频。准确来说，是 MSE 和 WebCodecs API 是否能够处理某一编码格式的视频。其内部是用硬解还是软解，我们可以不用关心。

### 方案

检索 W3C 规范，有几种检测方式。

#### canPlayType

[`HTMLMediaElement.canPlayType()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canPlayType): 判断传递的媒体格式参数是否能够被播放

```js
document.createElement('video').canPlayType('video/mp4;codecs=hvc1.1.6.L93.90');
```

返回值及其含义：

- `'probably'`: 这种媒体文件似乎是可播放的。
- `'maybe`': 不能告诉你这种媒体文件是否能被播放，直到你尝试播放它。
- `''` (空字符串): 这种媒体文件不能被播放。

#### isTypeSupported

[`MediaSource.isTypeSupported()`](https://developer.mozilla.org/en-US/docs/Web/API/MediaSource/isTypeSupported): 判断是否可以成功地为该媒体类型创建一个 [SourceBuffer](https://developer.mozilla.org/en-US/docs/Web/API/SourceBuffer) 对象

```js
MediaSource.isTypeSupported('video/mp4;codecs=hvc1.1.6.L93.90');
```

如果给定的媒体类型将不能播放，则返回 `false`；如果浏览器或许可以播放给定的媒体类型，则返回 `true`。这不能得到保证，必须为代码做好可能无法正常播放媒体的准备。

#### decodingInfo

[`navigator.mediaCapabilities.decodingInfo()`](https://developer.mozilla.org/en-US/docs/Web/API/MediaCapabilities/decodingInfo): 返回指定媒体类型的解码信息

```ts
navigator.mediaCapabilities.decodingInfo({
    type : 'file',
    video : {
        contentType : "video/mp4;codecs=hvc1.1.6.L93.90", // valid content type
        width : 1280,     // width of the video
        height : 780,    // height of the video
        bitrate : 874496, // number of bits used to encode 1s of video
        framerate : 25   // number of frames making up that 1s.
     }
}).then(({ supported }) => console.log(supported));
```

如果给定的媒体类型可以解码，则 supported 为 `true` 否则为 `false`。

#### HTMLVideoElement

除此之外，还可以使用 `<video />` 直接播放视频来进行检测，如果能触发 loadeddata 事件且解析视频宽高成功，则代表给定的媒体资源可以解码。

```ts
const isSourceSupported = (url: string): Promise<boolean> => {
    const video = document.createElement('video');
    video.width = 1;
    video.height = 1;
    video.muted = true;
    video.controls = false;
    video.preload = 'auto';
    video.crossOrigin = '';
    video.autoplay = true;
    video.playsInline = true;
    const attrs = {
        renderer: 'standard',
        'webkit-playsinline': 'webkit-playsinline',
        'x5-video-player-type': 'h5-page',
    };
    Object.keys(attrs).forEach((v) => {
        video.setAttribute(v, attrs[v]);
    });
    let timer = -1;
    return new Promise((resolve) => {
        video.onloadeddata = () => {
            clearTimeout(timer);
            resolve(video.videoWidth > 0 && video.videoHeight > 0);
        }
        video.onerror = () => {
            clearTimeout(timer);
            resolve(false);
        }
        timer = setTimeout(() => {
            resolve(false);
        }, 1000);
        video.src = url;
    });
}

isSourceSupported('//cdn.com/hevc.mp4').then((supported) => console.log(supported));
```

### 分析

#### 兼容性

先来看一下几个浏览器检测 API 的兼容性：

[`canPlayType()`](https://caniuse.com/mdn-api_htmlmediaelement_canplaytype):

![](https://img.alicdn.com/imgextra/i1/O1CN01PeN14p1fYkayIH1vT_!!6000000004019-2-tps-2746-720.png)

[`isTypeSupported()`](https://caniuse.com/mdn-api_mediasource_istypesupported):

![](https://img.alicdn.com/imgextra/i1/O1CN01Lmfo0U1YVokWe3Ofj_!!6000000003065-2-tps-2742-720.png)

[`decodingInfo()`](https://caniuse.com/mdn-api_mediacapabilities_decodinginfo)

![](https://img.alicdn.com/imgextra/i1/O1CN01geSQwT1yLuBdOUCUw_!!6000000006563-2-tps-2752-718.png)
  
从兼容性来说 `canPlayType` > `isTypeSupported()` > `decodingInfo()`。

#### 对比

无论是使用浏览器 API 还是进行播放测试，都可以使用预设值或使用实际值两种方式传递参数（mimeType/URL）。例如使用 HTMLVideoElement 时我们可以播一段预设好的 MP4 的 H.265 视频或直接拿实际要播放视频流来进行检测。

这两种方式的优劣：

| 方案/指标 | 准确度 | 性能 |
| -------- | -------- | -------- |
| 预设值     | ⭕️     | ✅     |
| 实际值     | ✅     | ⭕️     |

性能主要指对首帧时长的影响：

1. 使用浏览器 API：「实际值」获取 mimeType 需要先请求视频再解封装得到，所以比「预设值」性能要差；
2. 进行播放测试：「预设值」可以使用一段较小的 `ArrayBuffer` 来测试，减少了网络请求，所以比「实际值」性能要好

但在我们的程序中，因为如果判断不准确走到硬解会造成播放不可用，因此**准确度是比性能更重要的考量指标**。因此后面只考虑「实际值」。下面是这几个方案的优劣：

| 方案/指标 | 准确度 | 性能 | 实现成本 | 
| -------- | -------- | -------- | -------- |
| `canPlayType()`     | 低     | 高     |中     |
| `isTypeSupported()` | 中     | 高     |中     |
| `decodingInfo()`    | 高     | 中     |高     |
| `HTMLVideoElement`  | 高     | 低     |低     |

准确度从低到高排序：

- `canPlayType()` ：根据规范描述 `probably` 只是表示有很大的可能而已，不是一个确切的值
- `isTypeSupported()`：根据规范描述，该 API 内部调用了 canPlayType 且一定 >= maybe 才会继续执行后续的检测逻辑
- `decodingInfo()`：根据规范描述，代表能够解码，但不代表一定能够播放
- `HTMLVideoElement`：通常来说能够加载视频并缓冲即代表能够播放

性能从低到高排序：

- `HTMLVideoElement`：得完整走到 video 的 loadeddata 事件
- `decodingInfo()`：是一个异步，而且需要提供的信息相对后者更多，所以理论上相对后者慢一些
- `isTypeSupported()`：内部调用了 `canPlayType`，所以比前者慢
- `canPlayType()`：最快的

实现成本从低到高排序：

- `HTMLVideoElement`：直接创建一个 video 标签来播放，成本最低
- `canPlayType()`：得获取 codec，成本比前者更高
- `isTypeSupported()`：同上
- `decodingInfo()`：得获取编码、分辨率，甚至码率、帧率等信息，成本最高
  
> 可以拿一些示例视频来实际测试一下得出准确度和耗时，结论更准确。

### 风险

通过 API 来检测是否支持始终是有风险的。例如 Windows 平台 Chrome 108 及之前版本存在一个 Bug，如果设备特定的 GPU 驱动程序版本因为一些原因导致 D3D11VideoDecoder 解码框架被禁用。尽管 H.265 的硬解已不可用，但此时硬件检测的 isTypeSupported 等 API 仍然会返回 “支持”（[issue](https://chromium-review.googlesource.com/c/chromium/src/+/4028257)）。

虽然该问题已在即将到来的 Chrome 109 修复，但表明在最终播放视频之前，API 的置信度是存疑的，因此程序需要进行错误兜底：

```js
video.addEventListener('error', () => {
  if (video.error?.code === MediaError.MEDIA_ERR_DECODE) {
    nextSrc();
  }
});

let once = false;
video.addEventListener('loadeddata', () => {
  if (!(video.videoWidth > 0 && video.videoHeight > 0) && !once) {
    nextSrc();
  }
  once = true;
});
```

### 结论

需要明白的是 canPlayType/isTypeSupported/decodingInfo 这三个 API 的作用是完全不一样的，所以哪怕使用完全相同的 mimeType，其返回结果也不尽相同：

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/195/1669197046880-038e66bf-a5d5-4c99-80d9-6a992bbbea8b.png)

**使用哪个 API 取决于如何播放视频**，例如使用 MSE 时应结合 `isTypeSupported()` 进行检测，使用 WebCodecs 时应结合 `isTypeSupported()` 进行检测。`canPlayType()` 置信度太低，`HTMLVideoElement` 性能太低，不应该作为判断程序。

**无论使用哪种方式，都应该要有兜底的逻辑**。如果是使用 HTMLElement 进行播放，则通过监听 error 和 loadeddata 事件来捕获错误；如果是使用 VideoDecoder 进行解码，则通过构造函数中的 error 回调函数捕获错误。

## 软解可用性

WASM 软解 H.265 的方案最早在淘系落地，目前在业界被广泛应用。其优点是浏览器兼容性好，通常使用 FFmpeg 解码器的话支持其内所有的分辨率和 Profile。软解的可用性取决于程序的性能和稳定性。

### 性能

先说说性能部分。

WASM 软解方案的性能瓶颈主要在解码和渲染的环节。解码算法复杂度高，因此非常占 CPU 资源；渲染需要用 WebGL shader 进行 YUV 到 RGB 的转换计算且需要把每帧图像作为纹理从 CPU 上传到 GPU，因此也较为耗时。

#### 解码

针对解码环节的测试，可以用不同的分辨率视频在不同的机型上进行测试，得出全速的 FPS 和 25 FPS 的 CPU 占用情况：

测试设备1：2.4GHz * 4 核

| 分辨率 | 全速的 FPS | 25 FPS 的 CPU 占用|
| -------- | -------- | -------- |
| 720p   | 128     | 8%      |
| 1080p  | 100     | 10%     |
| 2k     | 48      | 20%     |
| 4k     | 24      | 40%     |
| 8k     | 13      | 80%     |

2k 以上的帧率不能满足线上大多数视频流畅的观看体验。解码性能优化的常见手段有：

- **算法优化**：解码是编码的一个逆过程，编码限定了解码所使用的算法，解码器算法优化的发挥空间较小，但并不等于完全没有优化空间。例如淘内的 H.265 解码器通过 IDCT 的稀疏系数优化和边界扩展等方式进行优化；
- **多核并行**：现代计算机处理器芯片一般采用多核架构，常见有 4 核和 8 核处理器。可以设计主从线程架构来充分发挥多核性能。FFmpeg 的 [libavcodec](https://ffmpeg.org/ffmpeg-codecs.html) 模块支持多线程来提高解码性能，WebAssembly 也支持[多线程](https://github.com/WebAssembly/threads)。Chrome 在 v57 版本支持了 WebAssembly，在 v70 版本上支持了 [WebAssembly Threads](https://web.dev/wasm-threads/)。但 WebAssembly 多线程依赖 [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 特性，浏览器上启用该 API 需要满足相关的[安全要求](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer?#security_requirements)。
- **SIMD**：Single Instruction Multiple Data，即单指令多数据并行计算。程序通过编译成指令让 CPU 执行，通常情况下一条指令处理一条数据，而 SIMD 可以让一条指令处理多条数据。WebAssembly 支持 [SIMD](https://github.com/WebAssembly/spec/tree/main/proposals/simd)，Chrome 也在 v91 版本正式支持了这一特性。使用 Emscripten 将 C/C++ 内核代码转换为胶水代码及 .wasm 文件，[Emscripten](https://emscripten.org/) 支持自动将 SSE1, SSE2, SSE3, SSSE3, SSE4.1, SSE4.2 及 128-bit AVX 汇编代码转换为 WASM SIMD 且支持自动转换多线程代码，使得原先在 x64 和 Arm 平台上常用的多线程、内存、缓存和汇编优化都可继续使用，这为我们节省了大量的工作。 

针对一些特殊的操作，例如倍速播放、Seek（快进、快退、跳转），还可以进一步优化：

**过滤非参考帧**：播放过程中被参考帧是不能被过滤的。不然会导致其它帧解码错误。而丢弃非参考帧并不影响解码的流程。

- 倍数播放场景下，比如原视频为 30 帧/s，X 倍速时即 30*X 帧/s。当 X 大于 1 时，可以丢弃掉一部分帧，用户不会感觉到有明显区别；
- Seek 操作时，为了不出现解码错误通常做法是找到跳转时间所在位置之前的最近一个 IDR 帧。根据不同的业务诉求分两种情况进行处理：
	- 快速 Seek，找到 IDR 后立即开始播放。优点是画面响应速度快，但画面并不是在你想要的位置，而是在其前面；
    - 正常的 Seek，找到 IDR 后开始解码一直持续到你 Seek 的位置点才开始播放。优点是响应准确，但速度慢。由于 IDR 到 Seek 位置之间的帧不会进行播放，所以其中的非参考帧都可以不解码直接丢弃。

**解码帧缓冲区**：为了优化播放体验，播放器通常都会在内部添加缓冲区以平滑网络和解码的抖动。其中解码帧缓冲区存放解码后的帧数据。解码后的帧数据非常大，以 YUV420 原始图像（帧率 25， 宽高 720p）图像为例：一个像素，Y 占一个字节，U 占四分之一个字节， V 占四分之一个字节，一共占 1.5 字节。则一帧占 1280 * 720 * 1.5 = 1.38MB。一秒占 1.38 * 25 = 34.5MB。因此该缓冲区通常设置得非常小。为了实现快进快退更平滑，可以适当扩大该缓冲区。

因为 CPU 规格和性能损耗的缘故，软解性能有其天花板。在一些低端机上会因为 CPU 资源不足导致单帧平均解码时间太长而卡顿掉帧。

另外软解码还需要关注 CPU 占比是否会过大，功耗是否会过高的问题。

#### 渲染

Chrome 在 v69 版本推出了 [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) 特性，提供了在 web worker 绘制 canvas 的能力。我们可以在子线程完成渲染逻辑并将画面渲染到离屏画布，然后将离屏画布与主线程的画布进行交换在主线程显示离屏渲染的结果，实现异步渲染避免主线程阻塞。同时讲视频 YUV 数据的传输、渲染都直接在同一子线程中完成避免跨子线程的传输，在子线程中执行的渲染循环也不会受到主线程卡顿的影响。这样可以提升渲染帧数，更为重要的是离屏渲染带来的高稳定性。

Chrome 在 v64 版本开始支持 [AudioWorkletProcessor](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor) 来做音频渲染。可以解码音频数据完成后将 PCM 数据送入 AudioWorkletProcessor。由于 AudioWorkletProcessor 运行在专用的子线程，所以只要控制一定长度的音频 buffer，不仅可以实现较为平滑的音频渲染，还可以抵御一定时长的主线程阻塞导致的音频播放卡顿，同时减少因主线程阻塞导致的音画不同步的情况。AudioWorkletProcessor 也带来了更细粒度的的音频 sample 数控制，可以做到更低的控制延迟。 

> 备注：基于 WebCodecs 的方案也需要关注渲染性能。

### 稳定性

解码和渲染逻辑的实现复杂度高，视频格式本身也很复杂。兼容或处理不当会造成视频播放的异常（花屏/噪音）甚至是页面崩溃（内存溢出/泄漏）。

### 启用策略

基于用户播放体验的考量，软解的启用需设定一定的规则：

1. 配置检测和限制：只在 CPU 逻辑核心大于等于 4 且经过接口及配置验证的机器上启用，并根据分辨率划分不同的最低配置要求，例如：1080P 高码率视频最低的 CPU 逻辑核心数要求为 8，1080P 60 帧视频最低 CPU 逻辑核心数要求为 16；
2. 自动无缝降级：在视频播放卡顿、音画不同步、异常的场景下自动降级到 H.264 编码，保障可用性及用户体验；
3. 临时黑名单：在用户短时间内遇到持续的卡顿情况下将会自动禁用，直到后续的新版本发布才重新启用。

当然更多的的分辨率和编码格式意味着更高的业务成本（转码、存储、流量）。

## 播放处理流程

结合浏览器原生能力和前端软解，为满足「在软硬件条件具备的情况下，用更高效的编码格式且体验不降级；条件不具备的情况下，能降级到低效的编码格式」，在 Web 平台视频播放的处理流程如下：

![undefined](https://img.alicdn.com/imgextra/i1/O1CN01GXctl01VwtJwcoIKn_!!6000000002718-2-tps-2842-3026.png)

其中 MSE、WebCodecs、WebAssembly 的判断是指对执行这一流程的相关性浏览器特性支持度的判断。

## 参考资料

- [WebAssembly 软解 HEVC 在 B 站的实践](https://mp.weixin.qq.com/s/k66PZqbcxVZBtgZdkeLGMQ)
- [为 Chromium 实现 HEVC 硬解 - 原理/实测指南](https://mp.weixin.qq.com/s?__biz=MzI1MzYzMjE0MQ==&mid=2247495926&idx=1&sn=cfc8161d565b96c47b2211002c2e5c33)
- [为 Chrome / Edge 启用 HEVC 硬解码的教程](https://github.com/StaZhu/enable-chromium-hevc-hardware-decoding/blob/main/README.zh_CN.md)
- [Chrome 在 107 版本支持 H.265 的硬解](https://chromestatus.com/feature/5186511939567616)
- [Web 端 H.265 播放器研发解密](https://ata.alibaba-inc.com/articles/136015)
- [Web 端 H.265 播放器性能优化记录](https://ata.alibaba-inc.com/articles/259842)

> 题图来自：[What is H.266 and Why Is It Better than H.265?](https://www.maketecheasier.com/h265-vs-h264/)
