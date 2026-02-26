---
category : front-end
title: "使用 JS 构建跨平台的原生应用（二）：React Native for Android 调试技术剖析"
description: "reactnative, 无线开发"
tags : [无线开发]
---

![](https://img.alicdn.com/tps/TB1oapLKFXXXXX0XXXXXXXXXXXX-900-500.jpg)

通过[上篇文章](http://taobaofed.org/blog/2015/11/18/react-native-for-android-hello-world/)开发环境的准备，调试命令的启动，我们的第一个 React Native for Android 应用已经成功运行在了虚拟机环境里了。

`react-native run-android` 这个调试命令的背后涉及到 RN 的整个执行流程，值得进行剖析。

* React Native 的更新非常活跃，本文以 0.14.0 版本为例
* 下文简称 React Native 为 RN
* 下文部分链接访问可能需要翻墙

## run-android

`react-native run-android` 命令启动后你能看到：

* 当前窗口编译打包了一个 Android apk 并且把它安装、运行在了虚拟机环境里
* 新开一个命令行窗口起了一个 HTTP 服务在监听 8081 端口

前者好理解，后者是为什么呢？

还记得我们上文修改的 index.android.js 文件吗？它是应用的 JS 入口文件。为方便调试，RN 将编译打包一个 debug 版本的 APK 把它安装到虚拟机环境，App 内是靠发送 HTTP 请求到开发机上获取这个 JS
文件来进行 UI 渲染的：

![react-native-run-android](https://img.alicdn.com/tps/TB1Lp3NKpXXXXXbXFXXXXXXXXXX-844-559.png)

那么这两步在 RN 内是如何实现的呢？

`react-native` 命令执行的是上文安装的 [react-native-cli](https://www.npmjs.com/package/react-native-cli)，但这个包没有做实际的事情，真正执行的代码是在 [react-native](https://github.com/facebook/react-native/tree/0.14.0) 这个库的 [local-cli](https://github.com/facebook/react-native/tree/0.14.0/local-cli) 文件夹里。

就拿 `react-native run-android` 来说，它实际执行的代码是 [react-native/private-cli/src/runAndroid/runAndroid.js](https://github.com/facebook/react-native/blob/0.14.0/private-cli/src/runAndroid/runAndroid.js)

执行后，命令行窗口的输出如下：

![react-native run-android](https://img.alicdn.com/tps/TB1YfjwKpXXXXckXFXXXXXXXXXX-819-246.png)

这两个输出寓意着 RN 要执行的两个函数：

* startServerInNewWindow
* buildAndRun

![run-android](https://img.alicdn.com/tps/TB1L0ZkKpXXXXbOXXXXXXXXXXXX-1009-206.png)

## 启动 HTTP 服务在新窗口

startServerInNewWindow 的执行效果跟在项目根目录下运行 `node start` 是一样的，都会去调用 [react-native/private-cli/src/server/server.js](https://github.com/facebook/react-native/blob/0.14.0/private-cli/src/server/server.js)，其调用过程如下：

![server.js](https://img.alicdn.com/tps/TB19rglKpXXXXbyXXXXXXXXXXXX-1019-450.png)

我们真正需要关心的是 [react-native/private-clil/src/server/runServer.js](https://github.com/facebook/react-native/blob/0.14.0/private-cli/src/server/runServer.js) 这个文件里的内容：它将创建一个 HTTP 服务并默认监听 8081 端口：

```javascript
//react-native/private-cli/src/server/runServer.js

const connect = require('connect');
const http = require('http');
function runServer(args, config, readyCallback) {

    const app = connect()
        //code...

      return http.createServer(app).listen(args.port, '::', readyCallback);
}
module.exports = runServer;
```

接下来，我们以 startServerInNewWindow 唤起的命令行窗口内的输出为线索，了解启动这个 HTTP 服务背后做了些什么：

![startServerInNewWindow](https://img.alicdn.com/tps/TB11MfxKpXXXXbRXFXXXXXXXXXX-1000-890.png)

窗口内有 8 个输出，它们分别是（见括号数字）：

1. createServer
    * Building Dependency Graph（1）
        1. Crawling File System（2）
        2. Building in-memory fs for JavaScript（4）
        3. Building Haste Map（5）
    * Loading bundles layout（3）
2. processRequest
3. request:/index.android.bundle?platform=android&dev=true（6）
    1. find dependencies（7）
    2. transform（8）

（1）－（5）是服务启动阶段中主动的 console ，（6）－（8）是 App 访问服务时触发的 console 。

### 创建一个响应对象

![ReactPackagerMiddleware](https://img.alicdn.com/tps/TB1IA3eKpXXXXXDXFXXXXXXXXXX-1007-239.png)

（提示：通过上图我们可以得知，程序执行流程掉入了 [/packager](https://github.com/facebook/react-native/tree/0.14.0/packager) 这个文件夹里。这是一个重要的文件夹，它的职责是打包 JS 。它是独立于平台的，无论是 Android 还是 iOS ，都会调用它去进行打包 JS 的工作）

HTTP 服务启动过程中，将会[创建多个响应中间件](https://github.com/facebook/react-native/blob/0.14.0/private-cli/src/server/runServer.js#L25)，其中有一个最重要的中间件就是 [ReactPackagerMiddleware](https://github.com/facebook/react-native/blob/0.14
.0/packager/react-packager/index.js#L19)。这个中间件就是响应后面我们 buildAndRun 流程里创建并运行在虚拟环境内的 App 发送的 request:/index.android.bundle 请求的。

ReactPackagerMiddleware [将创建一个 Server 对象](https://github.com/facebook/react-native/blob/0.14.0/packager/react-packager/index.js#L20)，Server 则会[创建 Bundler 对象](https://github.com/facebook/react-native/blob/0.14.0/packager/react-packager/src/Server/index.js#L157)，它的作用如名字一样，负责具体的 JS 打包工作。

但在启动服务的这一步，Bundler 主要做的是准备工作：它会在内存[建立 DependencyResolver](https://github.com/facebook/react-native/blob/0.14.0/packager/react-packager/src/Bundler/index.js#L97)，方便将来打包时可以快速地操作文件。

#### 构建依赖树

DependencyResolver 的调用栈如下：

1. [Crawling File System](https://github.com/facebook/react-native/blob/0.14.0/packager/react-packager/src/DependencyResolver/crawlers/index.js)
    * 递归项目目录找出所有文件
2. [Building in-memory fs for JavaScript](https://github.com/facebook/react-native/blob/0.14.0/packager/react-packager/src/DependencyResolver/fastfs/index.js)
    * 在内存内文件系统，将项目目录下的 .js .json 文件以依赖树状结构存储到上面
3. [Building Haste Map](https://github.com/facebook/react-native/blob/0.14.0/packager/react-packager/src/DependencyResolver/DependencyGraph/HasteMap.js)
    * 快速索引文件系统，里面会排除掉 node_modules/

### 挂载响应

Server 对象创建完毕，程序将 Server 的 processRequest 方法作为一个响应中间件挂载到刚启动的 HTTP 服务上用于响应请求：

```
exports.middleware = function(options) {
  var server = createServer(options);
  return server.processRequest.bind(server);
};
```

自此，前期工作已经准备完毕。后面（6）－（8）输出，则是来自于 App 请求 /index.android.bundle?platform=android&dev=true 的响应。

### 响应请求

安装和运行到虚拟机环境里的 App 在启动完成后会发送一个 HTTP 请求到 `http://yourDevIP:port/index.android.bundle?platform=android&dev=true` 以获取 bundle 资源。

Server.processRequest 捕获到这个请求，并且响应一个打包好的 JS 文件：

![processRequest](https://img.alicdn.com/tps/TB1ydg1KpXXXXXQXXXXXXXXXXXX-678-822.png)

前面介绍过，Server 在初始化时会创建一个 Bundler 对象，而在收到请求后 Server 就是用这个 Bundler 进行打包 JS 文件的。

最后的控制台输出告诉了我们 Bundler 的打包过程：

1. find dependencies（7）：在 Bundler 创建时生成的 DependencyResolver 查找依赖关系树
2. transform（8）：将查找到的 JS 模块进行编译

有关于 build 的全过程，我将在未来的文章中更深入地进行讲解，现在你只需要知道：

![createServer](https://img.alicdn.com/tps/TB1jpcVKpXXXXXXXpXXXXXXXXXX-1018-609.png)

### 热部署技术

#### Reload JS

![Reload JS](https://img.alicdn.com/tps/TB1dAb1KpXXXXbGXXXXXXXXXXXX-550-743.png)

在虚拟机环境内，打开 App 的菜单，点击 Reload JS ，如果开发机脚本有被修改，则 App 内 UI 会重新渲染。这是怎么做到的呢？

原来，点击 Reload JS 后，App 会重新发送 HTTP 请求到开发机，开发机上的服务器收到请求后根据参数决定是否重新 build 返回 bundle 文件。

#### Auto reload on JS change

![Auto reload on JS change](https://img.alicdn.com/tps/TB1ElvuKpXXXXXaapXXXXXXXXXX-550-743.png)

Reload JS 通过重新发送请求就能做到了，那在 Dev Settings 中设置 Auto reload on JS change 选项后，每次开发机 JS 代码有改动，App 内 UI 就会重新渲染，这又是怎么做到的呢？

1. Dev Settings 更新后将会触发 App 内的 reload 方法，reload 时将会去检查当前的 mDevSettings 内有无开启 Auto reload on JS change ，如果有，则开启轮询 `startPollingOnChangeEndpoint`：

    ![startPollingOnChangeEndpoint](https://img.alicdn.com/tps/TB1OXoGKpXXXXboXFXXXXXXXXXX-932-688.png)
2. startPollingOnChangeEndpoint 将启动一个 HTTP 客户端然后发送请求到 `http://yourDevIP:port/onchange`

    ![enqueueOnChangeEndpointLongPolling](https://img.alicdn.com/tps/TB1iN7qKpXXXXaQaXXXXXXXXXXX-946-801.png)
3. 无论请求成功还是失败，App 都会继续通过这个 HTTP 客户端发送同样的请求（轮询）：

    ![handleOnChangePollingResponse](https://img.alicdn.com/tps/TB1QpwTKpXXXXcAXXXXXXXXXXXX-946-819.png)
4. 而如果请求返回的状态码是 205，则调用 [mOnServerContentChangeListener.onServerContentChanged](https://github.com/facebook/react-native/blob/0.14.0/ReactAndroid/src/main/java/com/facebook/react/devsupport/DevServerHelper.java#L234) 做出响应，[onServerContentChanged 会做的动作则是 handleReloadJS](https://github.com/facebook/react-native/blob/0.14.0/ReactAndroid/src/main/java/com/facebook/react/devsupport/DevSupportManager.java#L602), [handleReloadJS 这一步](https://github.com/facebook/react-native/blob/0.14.0/ReactAndroid/src/main/java/com/facebook/react/devsupport/DevSupportManager.java#L469)则会如 App
  初始化时的一样，发送一个 HTTP 请求到 `http://yourDevIP:port/index.android
 .bundle?platform=android&dev=true` 获取最新的 bundle 并且进行编译渲染。

![Auto reload on JS change](https://img.alicdn.com/tps/TB1xx.LKpXXXXa7XpXXXXXXXXXX-958-486.png)

接下来看看开发机上的 HTTP 服务接收到 `/onchange` 请求将会做出怎样的响应：

1. 服务器接受到 `/onchange` 的请求后没有做成任何响应，而是默默地把请求通过 `_processOnChangeRequest` 方法存储在了 Server._changeWatchers 中。当请求太久没有响应而超时关闭时，就把 Server._changeWatchers 清空：

    ![processOnChangeRequest](https://img.alicdn.com/tps/TB1V6QGKpXXXXcXXFXXXXXXXXXX-671-487.png)
    ![processOnChangeRequest](https://img.alicdn.com/tps/TB1bi.PKpXXXXbAXpXXXXXXXXXX-670-346.png)
2. 在服务器收到 `/onchange` 请求时，直到关闭这个请求的过程前，如果服务器内的 JS 文件发生任何变更，服务器将会重新 build 并且响应这个 `/onchange` 。这里就涉及到 FileWatcher 模块的引入：在 Server 初始化时，引入了 FileWatcher 模块并把它传递给了 Bundler 。还记得上一节中我们讲过的吗？Bundler 会初始化 DependencyResolver ，在这一步里，Bundler 会使用 FileWatcher 监听依赖树里的每一个文件，当它们发生变化时，FileWatcher 会抛出相应的事件。

    ![FileWatcher](https://img.alicdn.com/tps/TB10fILKpXXXXcGXpXXXXXXXXXX-666-417.png)
3. Server 内，监听了 FileWatcher 的事件，接受到事件后，进行 rebuild ，响应 `/onchange` 请求：

    ![x](https://img.alicdn.com/tps/TB1SGEsKpXXXXXYaXXXXXXXXXXX-747-832.png)

至此，用一张图来总结 startServerInNewWindow 的执行流程：

![startServerInNewWindow](https://img.alicdn.com/tps/TB1nNQTKpXXXXXNXpXXXXXXXXXX-1018-596.png)

## 编译和运行应用

另外一边，RN CLI 编译打包了一个 APK 并且把它安装运行在了虚拟机内。观察 Shell 的输出：

![x](https://img.alicdn.com/tps/TB15SEgKpXXXXXqaXXXXXXXXXXX-655-110.png)
![x](https://img.alicdn.com/tps/TB1OuofKpXXXXXAaXXXXXXXXXXX-658-92.png)

定位到 buildAndRun 的[源码](https://github.com/facebook/react-native/blob/0.14.0/private-cli/src/runAndroid/runAndroid.js#L60)：

![x](https://img.alicdn.com/tps/TB1Gh.PKpXXXXbJXpXXXXXXXXXX-660-979.png)

由此可得知，编译打包安装、运行 App 是分 2 步来执行的，最终执行的命令是：

*  `cd android && ./gradlew installDebug`
* `<ANDROID_HOME>/platform-tools/adb shell am start -n com.awesomeproject/.MainActivity`

### Gradle：编译、打包、安装

`cd android && ./gradlew installDebug`

最终执行的命令是：

```
java -Xdock:name=Gradle -Xdock:icon=Project_Dir/android/media/gradle.icns -Dorg.gradle.appname=gradlew -classpath Project_Dir/android/gradle/wrapper/gradle-wrapper.jar org.gradle.wrapper.GradleWrapperMain installDebug
```

原来，RN 中打包编译是由 [Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html) 来实现的。Gradle Wrapper 是一种方便的使用 [Gradle](https://github.com/gradle/gradle) 的方法，他包括了为支持 Windows 的批处理脚本和支持类 Unix 的 shell 脚本。这些脚本在不安装 Gradle 时候，也可以用 Gradle。

通过 [Project_Dir/android/gradle/wrapper/gradle-wrapper.properties](https://github.com/facebook/react-native/blob/0.14.0/local-cli/generator-android/templates/bin/gradle/wrapper/gradle-wrapper.properties) 我们还可以知道 RN 使用的是 2.4 版本的 Gradle 。

接下来针对 Gradle 做一个简单的介绍。

#### Gradle 是什么？

参考它官网的介绍：

    Gradle is a build tool with a focus on build automation and support for multi-language development.

Gradle 遵循约定优于配置的原则，它的主要配置文件是 build.gradle 。打开 `Project_Dir/android/` 文件夹，就可以看到这个配置文件：

```
├── app
├── build
├── build.gradle
├── gradle
├── gradle.properties
├── gradlew
├── gradlew.bat
└── settings.gradle
```

#### Projects 和 tasks

Gradle 里的任何东西都是基于这两个基础概念：

* projects（项目）
* tasks（任务）

每一个构建都是由一个或多个 projects 构成的。一个 project 到底代表什么依赖于你想用 Gradle 做什么。举个例子，一个 project 可以代表一个 JAR 或者一个网页应用。它也可能代表一个发布的 ZIP 压缩包， 这个 ZIP 可能是由许多其他项目的 JARs 构成的。但是一个 project 不一定非要代表被构建的某个东西。它可以代表一件要做的事，比如部署你的应用.

每一个 project 是由一个或多个 tasks 构成的。一个 task 代表一些更加细化的构建。可能是编译一些 classes，创建一个 JAR， 生成 javadoc，或者生成某个目录的压缩文件。

我们来看一下 RN Andorid 下有多少个 project，运行 `gralde projects` （使用 `brew install gralde` 安装 gralde CLI）

![gralde projects](https://img.alicdn.com/tps/TB1DQ3JKpXXXXX8XFXXXXXXXXXX-651-295.png)

可见我们有 2 个 project ，一个是根项目 `AwesomeProject`，另一个是其子项目 `app` 。 这是在 [Project_Dir/android/settings.gradle](https://github.com/facebook/react-native/blob/0.14.0/local-cli/generator-android/templates/src/settings.gradle)配置的。 Gradle 将会根据 project 文件夹内的 build.gradle 依次执行构建。

接下来看看我们有哪些 tasks，运行 `gralde tasks`：

![gralde tasks](https://img.alicdn.com/tps/TB1b2gzKpXXXXXtXVXXXXXXXXXX-654-820.png)

tasks 比较多，不一一展开，重点是，找到了我们此次运行的 task：installDebug

这个 tasks 来自于哪里？它是在哪里定义的？你会发现，你搜遍你的项目文件夹，也没有找到这个 task 定义的地方。

原来，Gradle 有一个[插件机制](https://docs.gradle.org/current/userguide/plugins.html)，[Project_Dir/android/app/build.gradle](https://github.com/facebook/react-native/blob/0.14.0/local-cli/generator-android/templates/src/app/build.gradle#L1) 中有这一行代码：

```
apply plugin: "com.android.application"
```

它加载了 [Android Plugin for Gradle](http://developer.android.com/tools/building/plugin-for-gradle.html) ，installDebug 正是它提供的一个 task。

#### build.gradle

gradle 命令会在当前目录中查找一个叫 build.gradle 的文件。我们称这个 build.gradle 文件为一个构建脚本 (build script)， 但是严格来说它是一个构建配置脚本 (build configuration script)。这个脚本定义了一个 project 和它的 tasks。

我们的 android 项目有两个 build.gradle 对应着两个 project，分别是：

* [Project_Dir/android/build.gradle](https://github.com/facebook/react-native/blob/0.14.0/local-cli/generator-android/templates/src/build.gradle)
* [Project_Dir/android/app/build.gradle](https://github.com/facebook/react-native/blob/0.14.0/local-cli/generator-android/templates/src/app/build.gradle)

关于这 build.gradle 内配置项的介绍，请阅读：[《Configuring Gradle Builds》](http://developer.android.com/intl/zh-cn/tools/building/configuring-gradle.html) 。这里我们需要了解的是，我们的 JS 资源打包时如何进行配置的。

Project_Dir/android/app/build.gradle 中[加载了](https://github.com/facebook/react-native/blob/0.14.0/local-cli/generator-android/templates/src/app/build.gradle#L50) [Project_Dir/android/app/react.gradle](https://github.com/facebook/react-native/blob/0.14.0/local-cli/generator-android/templates/src/app/react.gradle#L65)，正是这个文件内的配置把 bundleDebugJsAndAssets 的逻辑添加进了 android build process ：

```
gradle.projectsEvaluated {
    // hook bundleDebugJsAndAssets into the android build process
    bundleDebugJsAndAssets.dependsOn mergeDebugResources
    bundleDebugJsAndAssets.dependsOn mergeDebugAssets
    processDebugResources.dependsOn bundleDebugJsAndAssets

    // hook bundleReleaseJsAndAssets into the android build process
    bundleReleaseJsAndAssets.dependsOn mergeReleaseResources
    bundleReleaseJsAndAssets.dependsOn mergeReleaseAssets
    processReleaseResources.dependsOn bundleReleaseJsAndAssets
}
```

由于我们执行的是 `./gradlew installDebug` ，这是 debug 模式，所以 bundleDebugJsAndAssets [默认是不执行的](https://github.com/facebook/react-native/blob/0.14.0/local-cli/generator-android/templates/src/app/react.gradle#L42)：

```
enabled config.bundleInDebug ?: false
```

所以说在 `./gradlew installDebug` 时，默认不会打包 JS 。

RN android 的编译打包和普通 android 应用没有区别，android 的开发体系[非常庞大](http://developer.android.com/sdk/index.html)，在这篇文章中不再展开，编译打包的具体流程可通过下图概括：

![Build System Overview](https://img.alicdn.com/tps/TB1FqqHJVXXXXbnaXXXXXXXXXXX-536-882.png)

（ 图片来源：http://developer.android.com/sdk/installing/studio-build.html ）

打包成功后的 APK 文件在 Project_Dir/android/app/build/outputs/ ，然后 Gradle 会查找当前的虚拟设备，把该 APK 安装到上面。

### Native 入口

`./gradlew installDebug` 没有打包 JS 资源，那我们的应用是怎样加载 JS 呢？

正像我们一开始说的那样，debug 版的 App 是通过去访问开发机上的服务器去获取 JS 资源的。RN Andorid 分为几步来实现：

1. App 程序主入口 [MainActivity](https://github.com/facebook/react-native/blob/0.14.0/local-cli/generator-android/templates/package/MainActivity.java#L29) 在 debug 模式时开启 DeveloperSupport：

    ````
    ReactInstanceManager.builder().setUseDeveloperSupport(BuildConfig.DEBUG)
    ```
2. [ReactInstanceManager](https://github.com/facebook/react-native/blob/0.14.0/ReactAndroid/src/main/java/com/facebook/react/ReactInstanceManager.java#L196)（构建 React 的运行环境，发送事件到 JS， 驱动整个 React 的运转。 通过 builder 可以创建不同的 React 环境：例如内置 JS 文件路径， 开发环境 dev 的 JS 名字，是否支持调试等）：创建 DevSupportManager：

    ```
    mDevSupportManager = new DevSupportManager(...);
    ```
3. [ReactRootView](https://github.com/facebook/react-native/blob/0.14.0/ReactAndroid/src/main/java/com/facebook/react/ReactRootView.java#L294)（Android 标准的 FrameLayout 对象，另外一个功能是提供 React 入口）：初始化 React 世界：

    ```
    mReactInstanceManager.attachMeasuredRootView(this)
    ```
4. ReactInstanceManager 根据当前 DeveloperSupport 是否开启来决定从哪里加载 JS（[createReactContextInBackground](https://github.com/facebook/react-native/blob/0.14.0/ReactAndroid/src/main/java/com/facebook/react/ReactInstanceManager.java#L232)）：

```
public void createReactContextInBackground() {
    if (mUseDeveloperSupport) {
      if (mDevSupportManager.hasUpToDateJSBundleInCache()) {
        // If there is a up-to-date bundle downloaded from server, always use that
        onJSBundleLoadedFromServer();
        return;
      } else if (mBundleAssetName == null ||
          !mDevSupportManager.hasBundleInAssets(mBundleAssetName)) {
        // Bundle not available in assets, fetch from the server
        mDevSupportManager.handleReloadJS();
        return;
      }
    }
    // Use JS file from assets
    recreateReactContextInBackground(
        new JSCJavaScriptExecutor(),
        JSBundleLoader.createAssetLoader(
            mApplicationContext.getAssets(),
            mBundleAssetName));
}
```

### 参考资料

* [Gradle User Guide](https://docs.gradle.org/current/userguide/userguide.html)
* [Gradle Plugin User Guide](http://tools.android.com/tech-docs/new-build-system/user-guide)
* [Android Plugin for Gradle](http://developer.android.com/tools/building/plugin-for-gradle.html)

## 总结

本篇文章跟大家一起深入了解了 `react-native run-android` 背后的执行逻辑，通过对此的学习，我们基本了解了：

* RN JS 层面的打包流程
* RN android 应用的打包流程和技术背景

题图：不可阻挡的阳光。