---
category : front-end
title: "使用 JS 构建跨平台的原生应用（一）：React Native for Android 初探"
description: "reactnative, 无线开发"
tags : [无线开发]
---

![say hi](https://img.alicdn.com/tps/TB1tInYKpXXXXbtXFXXXXXXXXXX-900-500.jpg)

Facebook 于 2015 年 9 月 15 日推出 React Native for Android 版本。相比起 for iOS，for Android 跑 “Hello, World!” 折腾了不少。在这些复杂的环境、工具依赖里，我们可以看出 React Native for Android 的一些端倪。

本系列文章就以开发一个 “Hello, World!” 的 App 为线索，跟大家一起来了解 React Native for Andorid 的技术背景。

* 本文以在 OS X 开发为例
*  React Native 的更新非常活跃，本文以 0.14.0 版本为例
* 下文简称 React Native 为 RN
* 下文部分链接访问需要翻墙

## 基础环境

在开始 RN 开发之前，我们需要在自己的机器上准备基础的开发环境：

1. [Homebrew](http://brew.sh/index_zh-cn.html)

    OS X 不可或缺的套件管理器，待会我们会用到它来安装 nvm
2. [nvm](https://github.com/creationix/nvm#installation)：`$ brew install nvm`

    nvm 是 Node.js 的版本管理器，可以轻松安装各个版本的 Node.js
3. [Node.js](https://nodejs.org/)：`$ nvm install node && nvm alias default node`

    需要 4.0 或以上。RN CLI 使用到了 ES6 的语法特性
    ![engines](https://img.alicdn.com/tps/TB1FBm9KpXXXXXCXVXXXXXXXXXX-1224-668.png)

RN 官方还推荐我们安装 2 个工具包，这是可选的，它们分别是：

1. [watchman](https://facebook.github.io/watchman/docs/install.html)：`$ brew install watchman`

    Facebook 出品的文件监控工具，如果你安装了它，RN 会用它来检测文件变化，以便重新编译。如果你没有安装，会默认使用 [walker](https://github.com/daaku/nodejs-walker)。

    ![RN 使用 watchman 的具体代码](https://img.alicdn.com/tps/TB1Qr5jKpXXXXbXXpXXXXXXXXXX-1574-963.png)
2. [flow](http://www.flowtype.org/)：`$ brew install flow` 

    Facebook 出品的 JS 静态类型的检查器

如果你安装了 watchman 又版本太低，那么编译项目的时候可以能会报错 `Cannot read property 'root' of null` ，所以如果安装了 watchman 请运行 `$ brew update && brew upgrade` 确保使用最新版本。

## Android 开发环境

Android 应用程序开发中，通过在 Android SDK（Android 软件开发包）中使用 Java 作为编程语言来开发应用程序（开发者亦可以通过在 Android NDK（Android Native 开发包）中使用 C 语言或者 C++ 语言来作为编程语言开发应用程序）。
此外，Google 还推出了 [Android Studio](http://developer.android.com/tools/studio/index.html) ，是一个为 Android 平台开发程序的集成开发环境（对比 iOS 的 Xcode）。

现在就来开始准备 Android 的开发环境：

1. [Java Development Kit（JDK）](https://zh.wikipedia.org/wiki/JDK)：根据你的系统[选择合适的 JDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
2. [Android SDK](https://developer.android.com/sdk/)：`$ brew install android-sdk`

    SDK 指 Software Development Kit，[软件开发工具包](https://zh.wikipedia.org/wiki/%E8%BD%AF%E4%BB%B6%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7%E5%8C%85)。
    这里安装的是 [Stand-alone Android SDK Tools](http://developer.android.com/sdk/installing/index.html?pkg=tools)，基础的 SDK 工具。默认情况下，这个 SDK 并不包括着手开发所需的一切内容。Android SDK 将工具、平台和其他组件分成若干个软件包，可以通过 Android SDK 管理器根据需要下载这些软件包。因此需要先为 Android SDK 添加几个软件包，然后才能着手开发。
3. 选择以下包进行添加安装：命令行下运行 `$ android` 来打开 [SDK Manager](http://developer.android.com/intl/zh-cn/tools/help/sdk-manager.html)
    * Android SDK Tools

        * Android SDK 扩展工具包，它与具体 Android 平台无关，包括一套完整的开发和调试工具。
        * 包位置：`$ANDROID_HOME/tools`
        * 主要工具：ant scripts (to build your APKs) and ddms (for debugging)
        * 更新历史：http://developer.android.com/tools/sdk/tools-notes.html
    * Android SDK Platform-tools

        * 平台相关性工具，支持最新 Android 版本功能的同时向下兼容。
        * 包位置：`$ANDROID_HOME/platform-tools`
        * 主要工具：adb (to manage the state of an emulator or an Android device)
    * Android SDK Build-tools

        * 构建工具，需确保使用最新。
        * 包位置：`$ANDROID_HOME/build-tools/$VERSION/`
        * 主要工具：aapt (to generate R.java and unaligned, unsigned APKs), dx (to convert Java bytecode to Dalvik bytecode), and zipalign (to optimize your APKs)
        * 更新历史：http://developer.android.com/tools/revisions/build-tools.html
        * 补充资料：[What is Android SDK Build-tools and which version should be used?](http://stackoverflow.com/questions/19911762/what-is-android-sdk-build-tools-and-which-version-should-be-used)
    * Android 6.0(API 23) - SDK Platform

        * 编译你的应用程序对一个特定版本的 Android 系统。
        * 版本说明：http://developer.android.com/intl/zh-cn/tools/revisions/platforms.html
        * Android Suppor Repository

    * [Android 支持库](http://developer.android.com/tools/support-library/index.html)，RN 内有用到

    安装包图示：
    ![安装包图](https://img.alicdn.com/tps/TB15JOrKpXXXXaZXXXXXXXXXXXX-784-584.png)
4. 设置环境变量 ANDROID_HOME

    RN 内使用该变量进行 Android SDK 查找，代码如下：
    ![ANDROID_HOME](https://img.alicdn.com/tps/TB1pGG6KpXXXXayXVXXXXXXXXXX-1170-721.jpg)

    因此你需要设置此环境变量：

    1. 打开一个 Terminal 窗口，运行 `export ANDROID_HOME=/usr/local/opt/android-sdk`
    2. 把上面的命令粘贴到`~/.bashrc`，`~/.bash_profile` 这样每次 Terminal 启动都会自动赋值 ANDROID_HOME 了

## 运行环境

完成了开发环境的准备，接下来我们需要准备应用的运行环境（类似于我们进行前端开发时需要在本机安装一个浏览器来运行我们的代码），这里有 2 种方式：

### 模拟器

第一种方式是在本机安装 Android 模拟器，模拟一个 Android 系统。
这里推荐使用 Genymotion，个人用户免费的模拟器。

1. 下载 [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
2. 下载 [Genymotion](https://www.genymotion.com/)
3. 打开 Genymotion，点击 “Add” 创建一个模拟设备

    刚才我们安装了 Android 6.0(API 23) - SDK Platform ，所以请确保你创建的虚拟设备 Android 版本不会大于这个
4. 选择模拟设备，点击 “Start” 启动一个模拟设备

### 真机

除了模拟器，我们还可以在手机上使用 USB 调试模式把自己的应用运行在这个真机环境里。

1. 设置你的手机允许[ USB 调试](https://www.google.com.hk/search?q=android+Enable+USB+debugging)
2. 使用 USB 连接你的手机和电脑
3. 运行命令 `$ adb devices` 查看当前可用设备，确认调试连接是否成功。如果成功在列表下将会出现你的设备

## 开始你的第一个 RN for Android 应用

万事具备，开始用 RN 新建一个 Android 应用并且让它在你准备的运行环境里跑起来吧。

### 安装 RN 脚手架

`$ npm install -g react-native-cli`

react-native-cli(0.1.7) 只是一个外壳，实际执行的代码是在：[react-native/local-cli/cli.js](https://github.com/facebook/react-native/blob/0.14.0/local-cli/cli.js)

![react-native-cli](https://img.alicdn.com/tps/TB1BQnpKpXXXXbRXXXXXXXXXXXX-810-698.png)

### 初始化一个 RN 项目

* `$ react-native init AwesomeProject`
* 打开 `AwesomeProject/index.android.js` ，修改 Text 标签内的文案为 Hello, World! 

![Hello world](https://img.alicdn.com/tps/TB154ThKpXXXXXHXFXXXXXXXXXX-983-609.png)

### 启动调试

在 AwesomeProject 项目目录运行 `$ react-native run-android`，如果你使用的运行环境是模拟器，如无意外，你将会在你的模拟器上看到这个画面：

![Hello world](https://img.alicdn.com/tps/TB16SjrKpXXXXbpXXXXXXXXXXXX-477-624.png)

本篇文章跟大家一起“浅出”了 RN for Android ，下一篇将与大家一起“深入”：

`react-native run-android` 的背后到底发生了什么？

将涉及到 RN 的 JS 打包构建流程和 Android SDK 的 workflow。