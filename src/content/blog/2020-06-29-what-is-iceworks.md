---
category : front-end
title: "Iceworks: 多端研发套件"
description: "Iceworks: 多端研发套件"
tags : [研发工具]
---

![Iceworks](https://img.alicdn.com/tfs/TB1DMWoKFT7gK0jSZFpXXaTkpXa-2763-1449.png)

## 什么是 Iceworks？

- Iceworks 诞生于 2018 年，定位是「基于物料的 GUI 工具」。Iceworks 的初心是通过桌面客户端，屏蔽前端工程环境的差异和降低工程技术的复杂度，通过物料提效中后台前端开发。关于 Iceworks 的历史，可以从[《Iceworks: 从 GUI 开发工具到集成研发工作台》](https://zhuanlan.zhihu.com/p/94102675)这篇文章中进行了解。
- **何为「研发套件」？** 近些年开发者的工具链和业务的研发模式有了很多的变化，Iceworks 作为开发工具也一直紧跟时代的潮流，贴近淘系实际的业务场景在演进。在云+端一体化的新时期，Iceworks 升级为 IDE([VS Code](https://code.visualstudio.com/)/[DEF IDE](https://ide.def.alibaba-inc.com/)) 配套的插件集合，以[套件（Pack）](https://code.visualstudio.com/api/references/extension-manifest#extension-packs)的形态成为 IDE 的一部分，为开发者提供更多易用好用的功能。
- **何为「多端」？** 多端包含了两个层面的含义，一是云端+客户端，即既可运行在 Web 端也可以运行在桌面客户端；二是支持多端应用的开发，即大家熟系的 [Rax](https://rax.js.org/)（无线跨端）和 [ICE](http://ice.work/)（PC Web）应用均提供了支持。
- 关于 Iceworks 的更多介绍，可访问 https://ice.work/iceworks 进行了解。

> 提示：这是一篇介绍性的文章，没有实现原理和思考推导的内容，如果你想直接使用功能，请访问 [Iceworks Pack](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) 进行安装体验。

## Iceworks 包含哪些功能？

### 使用可视化手段降低前端开发门槛

这些年来前端技术体系日益完善，深度不断下钻，但高速发展的互联网产业对端应用的诉求也在与日俱增。

根据我们进行的[开发者问卷调查](https://zhuanlan.zhihu.com/p/96827091)统计，编写用户界面这一传统的前端开发工作依然包含较大的工作量和一定的技术门槛，让非专业前端开发者头疼不已。

面向 B 端中后台业务场景，ICE 抽象了[物料](https://ice.work/docs/materials/about)这一概念，结合研发框架和 Serverless 前后端一体化方案，为业务的端应用开发提供了方方面面的能力，规范了端应用的生产流程：

![端应用的生产流程](https://img.alicdn.com/tfs/TB1Ha11L8r0gK0jSZFnXXbRRXXa-944-110.svg)

Iceworks 结合框架，通过可视化手段进一步降低前端技术的使用门槛：

![Iceworks结合](https://img.alicdn.com/tfs/TB1veuPLYH1gK0jSZFwXXc7aXXa-502-284.svg)

#### 生成物料

传统的物料开发以编码实现为主，将物料的生产下移到了专业前端。Iceworks 通过可视化搭建和流程配置化方式，让非专业前端也可以轻松地生产出高质量的物料。

例如，Iceworks 提供模板创建插件，开发者可通过配置化方式生成模板，再由模板一键创建端应用（备注 1）：

![模板创建插件](https://img.alicdn.com/tfs/TB1QySnL8r0gK0jSZFnXXbRRXXa-960-600.gif)

以及[组件创建插件](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-component-builder)，开发者可通过可视化搭建的方式生成业务组件或区块，这种所见即所得的拖拽交互操作大大地降低了用户界面的开发工作（备注 1）：

![组件创建插件](https://img.alicdn.com/tfs/TB1Z3qsLYj1gK0jSZFuXXcrHpXa-960-600.gif)

#### 使用物料

物料生产完成，即可投入到应用开发流程中。Iceworks 将物料的使用也通过可视化交互的方式进行。

例如，Iceworks 提供了[应用创建插件](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-project-creator)，使用**模板快速流程式地创建多端应用**：

![创建应用](https://img.alicdn.com/tfs/TB1tyMVLFP7gK0jSZFjXXc5aXXa-960-600.gif)

以及物料添加插件，提供物料的预览、文档和示例，并且可通过**一键点击将组件或区块添加到代码中**（备注 1）：

![物料添加插件](https://img.alicdn.com/tfs/TB1IvumL8r0gK0jSZFnXXbRRXXa-960-600.gif)

还有[页面生成插件](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-page-builder)，**通过区块组装生成页面**：

![页面创建插件](https://img.alicdn.com/tfs/TB1mdpDJKT2gK0jSZFvXXXnFXXa-960-600.gif)

### 利用智能感知技术提升前端开发的体验和效率

智能感知([IntelliSense](https://code.visualstudio.com/docs/editor/intellisense))的定义来自于 VS Code，包含了输入自动补全、函数参数信息提示、变量的信息概览等功能。

Iceworks 结合框架，能够做到更好更全面的智能感知。

例如，Iceworks 提供了[物料使用辅助插件](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper)，在使用组件时，对**组件的参数输入进行自动补全和以及参数值的合法性进行校验提示**：

![属性输入进行自动补全](https://img.alicdn.com/tfs/TB1pNj5x7Y2gK0jSZFgXXc5OFXa-1688-780.gif)

以及[样式开发辅助插件](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-style-helper)，在**编写行内样式**、**输入 `className` 或 `style` 的值**时都提供了**输入自动补全功能**：

![行内样式输入自动补全](https://img.alicdn.com/tfs/TB1oyRBF1H2gK0jSZFEXXcqMpXa-1000-586.gif)

![style值输入自动补全](https://img.alicdn.com/tfs/TB1WFCEXZVl614jSZKPXXaGjpXa-1468-906.gif)

样式开发辅助插件还提供了诸如 **`className` 或 `style` 参数值的信息概览和代码导航**等功能，辅助开发者更快地进行样式开发：

![样式参数的信息概览和代码导航](https://img.alicdn.com/tfs/TB1GkT9dj39YK4jSZPcXXXrUFXa-1468-906.gif)

## 如何快速开始使用？

### 安装

- 点击 VS Code 活动栏上的「插件商店图标」；
- 在输入框中输入「iceworks」进行搜索；
- 点击第一个「iceworks」选项；
- 在打开的 Iceworks Pack 页面上点击「安装」。

操作演示：

![install demo](https://img.alicdn.com/tfs/TB1Bm.kaCR26e4jSZFEXXbwuXXa-1024-766.gif)

### 使用

**第一步**：点击活动栏上的 Iceworks 图标，打开侧边栏：

![undefined](https://img.alicdn.com/tfs/TB1EAcnX6MZ7e4jSZFOXXX7epXa-2048-1536.png_790x10000.jpg) 

**第二步**：点击 Iceworks 侧边栏上的「创建应用」按钮，唤起多端应用的创建流程：

![undefined](https://img.alicdn.com/tfs/TB1hQA6LYr1gK0jSZFDXXb9yVXa-1024-768.png_790x10000.jpg)

**第三步**：应用创建完成，在 Iceworks 侧边栏上进行 npm 脚本执行、创建页面、创建组件等操作：

![undefined](https://img.alicdn.com/tfs/TB1M4oPLYj1gK0jSZFuXXcrHpXa-2048-1536.png_790x10000.jpg)

**第四步**：更多能力，可以在命名面板中搜索「Iceworks」关键字获取：

![undefined](https://img.alicdn.com/tfs/TB1kD7FLVT7gK0jSZFpXXaTkpXa-2048-1536.png_790x10000.jpg)

## 下一步

- 源码可视化：类似 [OutSystems](https://www.outsystems.com/) 和 [Mendix](https://www.mendix.com/) 在商业上的成功推动了[企业低代码应用平台](https://www.gartner.com/reviews/market/enterprise-low-code-application-platform)这一领域的繁荣。这似乎让人有些梦回千禧年代，当时 [Microsoft Expression Web](https://en.wikipedia.org/wiki/Microsoft_Expression_Web) 和 [Dreamweaver](https://www.adobe.com/products/dreamweaver.html) 非常流行，人们无需任何编程技能，只需要投放一些方框并在其中键入文本就可以轻松构建一个网站。今天我们对 Web 的理解和端技术的抽象已经深刻很多（备注 2），我们将借助可视化编排的技术让前端开发更加简单和轻松。
- 智能代码(IntelliCode)：智能感知让开发者的编码便捷性和幸福感有了很大的提升，它的进阶版本——[AI 辅助编码（智能代码）](https://visualstudio.microsoft.com/zh-hans/services/intellicode/)则更让人着迷。我们将和算法团队配合，让这一技术得到实际的应用并真正地提升编码的体验和效率。
- 质量提升：工程师最重要的工作产物就是代码，而代码作为公司重要的资产，其质量的评估、改进始终缺乏工具和流程的保障。我们正在制定前端代码质量评估模型，并将联合前端工程团队，落地到淘系外包前端的项目中，并将外包项目的质量提升一个水平。

如果你对👆上面的任一方向感兴趣，欢迎加入我们，淘系数百名前端开发人员、数千万计的前端应用将会是这些技术最好的落地场景和试金石。

## 备注

1. 部分功能仍在开发中，演示仅是开发测试状态下的示例，最终效果以线上产品为准。
2. Iceworks 团队是阿里集团内[最早](https://www.atatech.org/articles/77392)的低代码应用开发领域的探索者，在低代码引擎方向深耕多年，同时也是阿里集团低代码引擎项目的主导团队之一。