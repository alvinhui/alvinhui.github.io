---
category : front-end
title: "如何快速打造一款技术产品"
description: "技术产品的建设心得"
tags : [方法论, 总结]
---

![](https://img.alicdn.com/imgextra/i2/O1CN01czwCt51RXSkOjdyTB_!!6000000002121-0-tps-1920-1080.jpg)

回顾自己近几年的工作经历，从最早 17 年在团队内部创建 [Iceland](https://topic.atatech.org/articles/86275) ，到 19 年在开源社区参与 [ICE](https://ice.works/) 的由 1 到 10，再到 20 年由 0 到 1 创建了 [AppWorks](http://appworks.site/)。其间也曾在前端委员会参与了[低代码引擎](https://low-code.alibaba-inc.com/#/)早期的共建。这些经历都属于技术产品建设的范畴。

我见过一些有趣的想法和优秀的技术实现，但由于产品的定位问题，最终没有获得世俗意义上的成功；也经历过有非常系统性规划的项目，但由于分工和执行问题，最终错过了发展的时间窗口。服务好开发者确非易事，他们极其挑剔。把优秀的工程师们聚集在一起工作也并不容易，他们特立独行。

在如何服务好开发者群体、如何管理大型的多人协作项目问题上，自己不敢说有多少成功的经验，但也算是踩过不少的坑。当我再次面对技术产品化需求时，期望能系统性地梳理技术产品的建设方法，总结自己的经验为日后所用，也许对于其他同学来说也有些参考价值，因此写下了这篇文章。

在这篇文章当中，笔者将介绍「如何做」的方法论，不会讨论「为什么要做」的动机。由于笔者的工作经历主要以打造开源技术产品为主，因此在文章中又会主要以「开源技术产品」为例，但相信这些经验对于内部技术产品也是适用的。

一个技术产品的打造，涉及到设计产品、设计架构、管理项目、编写文档、开发官网、运营产品、管理需求和缺陷等多个环节。要把这几个环节都做好，才有可能成功。技术产品项目在不同的阶段又有不同的关注点，比方说前期更侧重设计，发布后更侧重运营，稳定期则更侧重需求管理和答疑，开源后则更侧重项目管理。

下面笔者将按照这几个环节来展开介绍相关的方法论和工具，并且会提供一些示例。

![技术产品的建设过程](https://img.alicdn.com/imgextra/i3/O1CN01ckYphO1RwC8T3c1HZ_!!6000000002175-55-tps-761-55.svg)

## 设计产品

打造技术产品的第一步是明确使用怎样的手段来解决目标用户的问题，即要 **「做什么」**，其本质是完成用户产品的设计。

在此阶段可以进行一些输入，例如可以通过用户调研和市场调研的方式来得出：用户关注的问题当中，哪些是重要且紧急的？市面上有没有相关的产品来解决这些问题，当前解决得怎么样？由此可以明确，我们要打造的技术产品，定位是什么，提供哪些特性。

关于产品的特性，不妨思考：哪些功能是别人有我们也有的(We too)？哪些功能是别人有但我们可以做得更好的(We better)？哪些功能又是我们独有的(We only)？

如果是图形界面类产品（例如开发者工具），则可以产出产品的交互稿：包含哪些功能模块，用户的使用流程是怎样的？如果是代码类产品（例如框架），则可以产出官网交互稿和文档大纲：设计产品官网的过程就是明确产品组织结构、核心能力及产品价值的过程，编写文档大纲的过程就是以客户视角审视产品用户体验的过程。对于基础库，还可以先明确对外 API 的设计：提供哪些属性、方法和事件？

![产品设计过程](https://img.alicdn.com/imgextra/i4/O1CN01xtEtAz1wEunbv4Bdy_!!6000000006277-55-tps-401-55.svg)

总结一下，在产品设计环节主要交付的产物是：

- **市场调研报告**，示例：[《人工智能自动编程调研报告》](https://topic.atatech.org/articles/178275)
- **用户调研报告**，示例：[《淘系技术部前端外包现状调研报告》](https://yuque.antfin.com/docs/share/a8444c66-b6b1-440a-b864-a352f26a98e6》)
- **产品交互稿**，示例：[《Iceworks 研发工作台产品交互稿》](https://modao.cc/app/lhcsuwyycyjzc26byq8zp9wp29iui#screen=sCFFB7D198E1566371988814)
- **官网交互稿**，示例：[ICE 官网](https://ice.work/)
- **文档大纲**，示例：[ICE 教程](https://ice.work/docs/guide/about)

![Iceworks 研发工作台产品交互稿](https://img.alicdn.com/imgextra/i2/O1CN01KdzOP221WNz9Uglrr_!!6000000006992-2-tps-2560-1338.png)

## 设计架构

产品设计回答了「做什么」的问题，接下来要去考虑 **「怎么做」**，其本质是完成软件架构的设计。

软件架构的重要性不言而喻，它是系统实现的蓝图、沟通协作的基础，决定了产品的质量。

关于如何设计一个好的架构以及怎么描述你的架构设计，有非常多成熟的方法论，这里就不再赘述了，笔者也在学习实践当中。在架构设计环节笔者的一个思路是：先做竞品调研，再做架构制图。

![架构设计过程](https://img.alicdn.com/imgextra/i3/O1CN01BXczVn1reUqIXHQK3_!!6000000005656-55-tps-353-90.svg)

做竞品调研，产出的是调研报告。通过调研去了解相关竞品的架构模式，甚至是程序实现。当前技术资讯发达、开源社区活跃，太阳底下没有新事物。我们要做的事情，可能已经被人用好几种方式实现了好几个版本。在有限的时间内，找到问题域中最好的几个实现进行调研，站在巨人的肩膀上思考，事半功倍。示例：[《蚂蚁 Could IDE 调研报告》](https://yuque.antfin.com/docs/share/06675409-d3bd-4638-8780-948abdc2bd9c)

做架构制图，产出的是架构图。架构制图方法与工具有很多，UML 应该是大部分人最熟悉的制图方法，UML 由以下两大类图组成：

- 结构图（Structural Diagrams）：通过对象、属性、操作和关系等方式，强调系统的静态结构，其中最常见的类型包括类图（Class Diagram）、组件图（Component Diagram）和部署图（Deployment Diagram）。
- 行为图（Behavioral Diagrams）：通过展示对象之间的协作关系以及对象内部的状态改变，强调系统的动态行为，其中最常见的类型包括用例图（Use Case Diagram）、活动图（Activity Diagram）、时序图（Sequence Diagram）和状态机图（State Machine Diagram）。

例如，可以把这两类图应用到我们的程序设计当中：

- 结构图：程序中包含哪些类、对象和函数，它们之间的关系如何？=>类图（Class Diagram）
- 行为图：程序的运行流程是怎样的？ => 时序图（Sequence Diagram）

示例：[VS Code 插件 Time Master](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-time-master) 的程序设计（来源：[#PR 620](https://github.com/appworks-lab/pack/pull/620)）

![Time Master 插件的程序设计](https://img.alicdn.com/tfs/TB1qP7VkxvbeK8jSZPfXXariXXa-931-819.svg)

最后关于架构制图，推荐一些方法论和小工具：

1. 方法论：@楚衡(pengqun.pq) 老师的[《架构制图：工具与方法论》](https://topic.atatech.org/articles/180425) 一文，系统性地梳理了架构制图的方法和工具，值得一再阅读。
2. 语雀富文本的[文本绘图功能](https://www.yuque.com/yuque/gpvawt/qm77xq)，支持 [PlantUML](https://plantuml.com/)。PlantUML 是一种绘图语言，可以让作者以类编写 Markdown 的方式自然地画图，可进行多人协作和版本跟踪，受到各知识系统的广泛支持：

	![语雀富文本内的文本绘图](https://img.alicdn.com/imgextra/i1/O1CN014cnd3m1Mnss0s7OIU_!!6000000001480-2-tps-1135-802.png_620x10000.jpg)

## 管理项目

完成了产品和架构的设计后，开始进入项目开发的环节。这个环节主要关注的是：如何组织开发和怎样进行协作。前者无论是个人还是团队项目都是通用的，后者取决于项目的规模。

### 组织项目开发

![组织项目开发的过程](https://img.alicdn.com/imgextra/i3/O1CN01J2W9cI1JL57C0rtbe_!!6000000001011-55-tps-540-55.svg)

#### 仓库划分

仓库的划分是软件架构设计在代码组织层面的落地，需要有预见性，避免未来进行大规模的仓库迁移。

仓库的组织形式有两种：多仓库和单仓库。单仓库又多包([monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md))和单包的区别。比方说 React ，就是多仓库的组织形式：有主仓库 [facebook/react](https://github.com/facebook/react) 是多包存储库，还有存放周边仓库的组织  [reactjs/*](https://github.com/reactjs)。

这里面没有一成之规和好坏之分，主要取决于项目的规模和协作上的便利，或者说有时候纯粹是个人喜好问题。比方说有些技术产品将自己的插件、示例、官网都放到单独的仓库进行管理，有些则倾向于放到一起。

示例：[AppWorks 的仓库划分](https://github.com/appworks-lab)

![AppWorks 的仓库划分](https://img.alicdn.com/imgextra/i3/O1CN01pCRgwX23ekRrJ9tOp_!!6000000007281-2-tps-687-699.png_450x10000.jpg)

#### 分支管理

为了更好地利用 Git 这样的源码[版本管理系统](https://betterexplained.com/articles/a-visual-guide-to-version-control/)来进行多人协作，我们需要制定分支管理策略。分支管理策略的目的是规范化工作流程，让大家高效地进行合作，使得项目井井有条地发展下去。

分支管理策略包含了以下内容：

- 有哪些分支类型？
- 分支类型间的合并关系如何？
- 基于分支的迭代路径是怎样的？

常见的 Git 工作流有 Centralized Workflow 、 Feature Branch Workflow、Gitflow Workflow、Forking Workflow 等等。Atlassian 的 [Comparing Workflows](https://www.atlassian.com/git/tutorials/comparing-workflows) 这篇文章对以上几种工作流进行了比较。

目前社区上广泛采用的是最早由 [Vincent Driessen](https://nvie.com/about/) 提出的 [Gitflow Workflow](https://nvie.com/posts/a-successful-git-branching-model/)：

![Gitflow Workflow](https://img.alicdn.com/imgextra/i4/O1CN01q6cPN61oMgajczgGa_!!6000000005211-2-tps-1150-1524.png_620x10000.jpg)

#### Git  规约

项目基于 Git 进行源码版本管理，还需要关注分支和标签的命名、提交日志格式等问题。它们的规范性可以使得项目运作井井有条，项目成员对 Git 信息的理解保持一致。社区有很多 Git  规约，它们之间没有好坏之分，主要关注规约的覆盖度即可。

Git 提交日志格式规约包含的内容有：日志的格式、字数的限制、语言的选择等。

在社区中应用得比较广泛的日志格式是：

```
<type>[optional scope]: <subject>

[optional body]

[optional footer(s)]
```

其中 type 是用来描述本次提交的改动类型，一般可选值及对应含义如下：

* feat: 新增功能
* fix: 修复 bug
* docs: 文档相关的改动
* style: 对代码的格式化改动，代码逻辑并未产生任何变化(例如代码缩进，分号的移除和添加)
* test: 新增或修改测试用例
* refactor: 重构代码或其他优化举措
* chore: 项目工程方面的改动，代码逻辑并未产生任何变化
* revert: 恢复之前的提交

Git 提交日志格式规约的完整版本，可参考 [AngularJS Git Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y)。

在项目工程上可以使用命令行工具 [commitlint](https://github.com/conventional-changelog/commitlint) ，结合 Git 提交日志格式规约包 [commitlint-config-ali](https://www.npmjs.com/package/commitlint-config-ali)，以及 [Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) 来进行提交卡口：

1. 安装命令行工具：

	```bash
	$ npm i --save-dev @iceworks/spec @commitlint/cli husky
	```
2. 创建提交日志格式规约文件 .commitlintrc.js:

	```js
	const { getCommitlintConfig } = require('@iceworks/spec');

	// getCommitlintConfig(rule: 'common'|'rax'|'react'|'vue', customConfig?);
	module.exports = getCommitlintConfig('react');
	```
3. 添加 Git Hooks 配置到 package.json: 

	```json
	{
	  "husky": {
		"hooks": {
		  "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
		}
	  }
	}
	```

> 1.[@iceworks/spec](https://npmjs.org/package/@iceworks/spec) 是淘系前端规约包，内部引用了 commitlint-config-ali
> 2. [Husky](https://github.com/typicode/husky) 是一个简易配置 Git Hooks的工具

#### 工程方案

项目工程方案主要包括了代码规约、本地工程和 CI&CD 的内容。

##### 代码规约

在多人协作项目中保持代码风格的一致性是必要的。前端领域关于代码规约的讨论和沉淀都已经比较成熟，阿里前端委员会标准化小组制定了前端的[编码规约](https://yuque.antfin-inc.com/f2e-guide/general/readme.md) ，包括了语言（HTML/CSS|Sass|Less/JavaScript）和框架（React/Rax）的部分。淘系前端基于此规约进行拓展，产出了 [@iceworks/spec](https://npmjs.org/package/@iceworks/spec) 这个 npm 包，结合 ESLint、StyleLint、Prettier 等命令行工具来提供本地工程方面的配套保障。当我们进行项目开发时，只需要引用该包和相应的命令行工具，做一些简单的配置即可：

1. 安装命令行工具：

    ```bash
    $ npm i --save-dev @iceworks/spec eslint stylelint prettier husky
    ```
2. 配置 package.json：

    ```json
    {
      "scripts": {
        "lint": "npm run eslint && npm run stylelint",
        "eslint": "eslint --cache --ext .js,.jsx,.ts,.tsx ./",
        "stylelint": "stylelint ./**/*.scss",
        "prettier": "prettier **/* --write"
      },
      "husky": {
        "hooks": {
          "pre-push": "npm run lint"
        }
      }
    }
    ```

##### 本地工程

本地开发工程任务的设定是为了提升开发效率并将团队规约落实到开发中，通常包括以下部分：

- setup: 初始化工程环境
- dev: 启动调试并预览示例
- lint: 执行静态代码分析
- test: 执行单元测试
- build: 执行源码构建
- publish: 发布代码

前端开发在本地工程配套设施上已经非常成熟，面向不同的项目类型都有相应的工程方案。常见的项目类型和相应的工程示例：

- 前端应用：
  - [React 应用](https://github.com/alibaba-fusion/materials/tree/master/scaffolds/fusion-design-pro-js)：使用 [ice.js](https://ice.work/) 方案
  - [Rax 应用](https://github.com/raxjs/rax-materials/tree/master/scaffolds/app-ts)：使用 [rax-app](https://github.com/raxjs/rax-app) 方案
- 前端业务组件：使用 [build-scripts + build-plugin-component](https://appworks.site/materials/guide/component.html) 方案
  - [Rax 业务组件模板](https://github.com/ice-lab/material-templates/tree/master/packages/template-rax/template/component)
  - [React 业务组件模板](https://github.com/ice-lab/material-templates/tree/master/packages/template-react-ts/template/component)
- 全栈应用：使用 [Midway Hooks](https://www.yuque.com/midwayjs/midway_v2/hooks_intro) 方案
  - [移动端全栈应用](https://github.com/midwayjs/midway-serverless-examples/tree/master/integration/rax/boilerplate)
  - [PC 端全栈应用](https://github.com/ice-lab/react-materials/tree/master/scaffolds/midway-faas)
- npm 模块：使用 [tsc](https://www.npmjs.com/package/typescript) + [webpack](https://www.npmjs.com/package/webpack) 方案
  - Node: https://github.com/sindresorhus/got
  - Browser: https://github.com/axios/axios

##### CI&CD

持续集成 (CI) 和持续部署 (CD) 是自动化工作流程的重要组成部分。

在 Github 中，持续集成主要是通过 [Actions](https://github.com/features/actions) 来实现的。当然还有另外一些选择或结合，例如 [Travis](https://travis-ci.org/)、[Appveyor](https://www.appveyor.com/)、[Circleci](https://circleci.com/) 等等。Github Actions 非常强大，可以在任意的 [Github Event](https://docs.github.com/en/developers/webhooks-and-events/events) 下运行。例如可以在提交代码到仓库时、分支合并时、PR 创建时等等。基于 Github Actions 的任务通常包括：

- 功能测试及代码覆盖率
- 代码构建
- 代码检查（语法检查、安全性检查）
- 资源部署（CDN 发布、npm 发布）

例如 [VS Code](https://code.visualstudio.com/) 套件 [AppWorks Pack](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) 的 [Actions](https://github.com/appworks-lab/pack/actions)：

- PR 创建时：执行代码检查和功能测试任务
- 提交代码到 beta 分支时：执行代码构建（构建插件安装包）和资源部署（将安装包上传到 CDN）任务
- 提交代码到 main 分支时：执行代码构建（构建插件安装包）和资源部署（将安装包发布到 VS Code 插件市场）任务

在阿里内部，CI&CD 主要由 [DEF 工程研发平台](https://work.def.alibaba-inc.com/)统一管理，根据不同的项目类型（Assets/WebApp/Serverless）有统一的自动化工作流程。

### 建立协作机制

![Activity Overview](https://img.alicdn.com/imgextra/i2/O1CN01qOQeXm1nxxCiXZDX6_!!6000000005157-2-tps-375-250.png)

上图是笔者 2019 年在 Github 上的 Activity Overview，可以看到有比较多的精力是分配在了与沟通协作的部分（Issues/PR/CR）。对于多人协作开发的项目，前期建立协作机制是提升团队整体工作效率的必然要求。项目开源后，创建贡献指南则可以让外部开发者参与到项目的开发当中。这两者是前后关联的，在有些开源项目中是统一的。

一些社区的贡献指南参考：

- [Contributing Guide for React](https://reactjs.org/docs/how-to-contribute.html) 
- [Contributing Guide for VS Code](https://github.com/microsoft/vscode/wiki/How-to-Contribute) 

在协作机制里面，笔者认为几个重点的内容有：RFC 机制、PR 规约和 CR 指南。

#### RFC 机制

部分技术产品采取 RFC(Request For Comments) 的形式进行项目的技术方案设计、讨论与迭代，例如 [React RFCs](https://github.com/reactjs/rfcs)、[Yarn RFCs](https://github.com/yarnpkg/rfcs)、[Rust RFCs](https://github.com/rust-lang/rfcs) 等等。RFC 是一种文档优先的工作方式，并且让方案在项目早期得到充分的讨论和论证。

RFC 机制主要包括了几个方面的内容：

1. 明确范畴：什么时候需要 RFC
2. 设定流程：有哪些环节（提交、审查、实施或延期）及要求，在各环节中各个角色的职责是什么
3. 提供模板：RFC 的大纲

#### PR 规约

PR 规约的设定目的是为了提升 PR 的质量和提高 CR 的效率。规范化的 PR 还可以基于内容产出产品的更新日志。PR 规约通常包含以下内容：

- 内容格式的规约：标题和描述应该遵循怎样的格式
- 提交代码的规约，例如新添加功能需提供测试用例、更新代码需更新包版本号、每次 PR 的文件数和代码行数限制等
- 合并的规约，例如需要哪些人 approved 才能合并

一些开源项目将 PR 的规约通过 [Github App](https://docs.github.com/en/developers/apps) 来进行保障，例如观察测试代码覆盖率的变化。

#### CR 指南

高度规范化的 CR 会扼杀生产力，但毫无要求的 CR 又往往是无效的。创建 CR 指南的目的是为了提高 CR 的效率和有效性，在两者之间寻找某种平衡。CR 指南可以包含以下内容：

1. 代码审查标准是什么？
2. 如何确定审稿人？
3. 在代码审查中应该看什么内容？
4. 在代码审查中有哪些文件导航的方法？
5. 代码审查的响应速度应该怎么样限定？
6. 如何编写代码审查评论？
7. 如何处理代码审查中的回执？

示例：[《Google 的 CR 指南》](https://google.github.io/eng-practices/review/)。

CR 的有效性则可以通过完整阅读率、评论率、平均行评审时长等指标来衡量，为项目建立一定的数据指标来约束 CR 行为。

> CR 的效率与具体的代码托管平台有关，可以在指南中提供平台功能文档和相应的小技巧。例如 Github 有完善的 [CR 功能介绍文档](https://github.com/features/code-review/)。

### 异步与实时

大多数开源项目采用异步的方式来进行协作，而不是集中办公。这当然有所利弊，且取决于项目的性质和阶段。如果采用了异步协作的方式，由于开发者个人素质和工作习惯的不同，需要有一定的机制来保障项目开发的质量和效率。

不妨参照成熟开源项目的运作模式，比方说 VS Code 制定了[年度的 Roadmap](https://github.com/microsoft/vscode/wiki/Roadmap)，并且将工作计划细化到了[月或周的维度](https://github.com/microsoft/vscode/wiki/Iteration-Plans)；有明确的分工，无论是功能模块还是流程处理(Iusse/PR)；对需求和问题的反馈都有一定的管理手段。

还可以通过一些的方式来实时同步项目的状态，例如将项目的进度等信息通过机器人同步到在线聊天室（如钉钉群）：

![钉钉群](https://img.alicdn.com/imgextra/i2/O1CN01IO2rjE1t90qSnmrU8_!!6000000005858-2-tps-1026-1070.png_450x10000.jpg)

## 编写文档

技术产品面向用户最重要的东西就是文档。打造技术产品在文档上需要考虑的问题是：如何给用户提供好的阅读体验以及如何提高开发者文档编写和审阅的效率。

目前国内主流的技术文档阅读（消费）途径是：语雀、自建网站和 Git 仓库；编写（生产）途径是：在语雀上编写或在 Git 仓库上编写。从生产到消费的链路有：

1. 在语雀上编写
	* 在语雀上阅读
	* 自建站点，请求语雀的接口获取文档内容后渲染成网页
2. 在仓库上编写
	- 在仓库内阅读
	- 自建站点，将 Markdown 渲染成网页

对比这几个链路的优缺点是：

![编写文档](https://img.alicdn.com/imgextra/i2/O1CN01r5ukJY1Jnw4FgBFOv_!!6000000001074-2-tps-751-467.png)

大型项目或有开源的计划，通常会选择第四种方案。

## 开发官网

技术产品大多都需要一个官网来承载产品信息，又或者在「编写文档」上选择了第四种方案，则需要考虑如何基于 Markdwon 来生成网站用于展示。目前社区上有很多文档网站的方案，例如 [Docusaurus](https://docusaurus.io/)、[VuePress](https://vuepress.vuejs.org/)、[Docsify](https://docsify.js.org/#/) 等等。在进行选型的时候可以考量的点是：

* 是否支持多主题？
* 是否支持自定义页面？
* 是否支持生成静态站点？
* 是否支持写多语言和多版本的文档？
* 是否支持在文档中渲染示例？
* 上手门槛如何？
* 定制能力如何，使用何种技术栈进行定制？
* 部署成本如何？

> 参考：[《Docusaurus 与其他工具的对比》](https://docusaurus.io/zh-CN/docs#comparison-with-other-tools)

开源项目普遍的选择是部署到 [GitHub Pages](https://pages.github.com/) 上，资源托管和访问域名的问题都搞定了。但是国内访问 Github 实在太慢了，有一种解决方式是利用国内的代码托管平台（例如 [gitee](https://gitee.com) 或 [coding](https://coding.net)）的  [Pages 服务](https://gitee.com/help/articles/4136) 来进行部署。可以将 Github 的仓库代码[同步](https://gitee.com/help/articles/4284)到这些平台上去。

在阿里内网，主要是通过 DEF 进行部署，针对文档站点，有以下几个方案：

![内网部署](https://img.alicdn.com/imgextra/i3/O1CN01Ob6d0w232jZc7fb3i_!!6000000007198-2-tps-757-414.png)

对于内部技术产品来说，没有必要将 CDN 资源发布到外网，因此当下在 DEF 链路下选择第三种方案是比较合适的。

## 运营产品

### 应持何种心态

完成了技术产品后，需要我们主动去运营它。可能很多程序员不擅长这个环节，觉得有些哗众取宠，黄婆卖瓜自卖自夸。笔者的观点是：

1. 技术运营是一种技术自信和担当。
2. 酒香也怕巷子深，尤其是在信息爆炸的今天。

当然技术运营应该是真实的、适度的：

- 真实是指不夸大自己产品的功能，找到目标用户并解决他们的问题；
- 适度是指运营的目的是为了争取曝光获得潜在的用户，而不是骚扰他人或诋毁对手。

一些值得商榷的行为：

1. 做的产品跟 A 开发者群体八根子都打不着，但挨个私聊发广告；
2. 在运营文章中自我摽榜，把竞对贬的一文不值；
3. 到各种竞对的运营文章下疯狂贴牛皮癣。

### 输出什么样的内容

技术运营的内容上，软文和干货自然能够获得技术媒体更多的转发，这类文章通常都是从开发者切身关注的问题和技术热点入手，通过方案的输出吸引读者，例如笔者写过的[《影响编码心流的问题及其对策》](https://topic.atatech.org/articles/207750)、[《10 个你可能还不知道 VS Code 使用技巧》](https://www.atatech.org/articles/179926)、[《从生产到消费，基于物料的前端开发链路》](https://topic.atatech.org/articles/180565)等等。硬广也必不可少，这类文章主要讲述产品的功能，通过讲事实摆道理的方式直抒胸臆，例如[《淘系前端研发工具 AppWorks 正式发布》](https://topic.atatech.org/articles/207457)、[《Iceworks: 从 GUI 开发工具到集成研发工作台》](https://topic.atatech.org/articles/156472)等等。

毫无疑问，一个好的标题能为文章获得更多的阅读量。比方说笔者的两篇文章：[《淘系自研前端研发工具 AppWorks 正式发布》](https://topic.atatech.org/articles/207457)就比[《Iceworks: 多端研发套件》](https://topic.atatech.org/articles/175191)阅读量和互动率高出一个档次。同样的，「如何快速打造爆款技术产品」的文章标题可能又比「如何打造技术产品」更具吸引力。甚至有些时候，我会在不同的投放渠道使用不同的文章标题或内容组织形式：严肃官媒、大众传媒和灌水社区的受众对标题的敏感度和内容的喜好倾向是不同的。

### 有哪些途径

作为技术产品的作者，应该主动寻找更多更广更合适的渠道来进行技术宣发。遵循由小范围到大范围，逐渐铺开的宣发思路。@法海(fahai) 老师著有一篇[《技术写作如何宣发》](https://topic.atatech.org/articles/170986)，值得参考。

最后，一个技术产品的运营既需要有爆点，也需要有持续性。例如进入产品成熟期的 ICE 和 Rax 就通过月报、工作群发布产品更新日志等形式持续同步产品的动态。
 
## 管理需求和缺陷

技术产品上线后，用户可能会提交新的需求或反馈遇到的问题。怎样以更高效的方式使得用户获得更好的服务体验是一个必须面对的问题。这方面笔者也没有一个好的答案，这里主要讲讲笔者看到的一些实践。

开源项目通常通过 [Issue](https://guides.github.com/features/issues/) 来收集用户的需求和问题。Github 有 [Issue Template](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository) 的功能可以让开发者通过模板定义不同类型 Issue 的内容格式，由此来引导用户创建更高质量的 Issue：

![VS Code 的 Issue Template](https://img.alicdn.com/imgextra/i2/O1CN01tsRZZ11tWpRH3UNPN_!!6000000005910-2-tps-990-952.png_450x10000.jpg)

此外，通过标签的方式来对 Issue 进行归类整理也是比较普遍的管理形式。

![React Labels](https://img.alicdn.com/imgextra/i1/O1CN01TMsWAH24KQUP58mK2_!!6000000007372-2-tps-1472-1158.png_450x10000.jpg)

Issue 的定位有点类似于商业产品的「工单模式」。开源项目的维护者没有办法回应所有用户的需求和问题，更期望社区用户能够相互帮助解决问题，因此会创建线上沟通途径让使用者们彼此交流。例如国外开源项目常使用 [Stack Overflow](https://stackoverflow.com/questions/tagged/docusaurus) 或 [Github Discussions](https://github.com/facebook/docusaurus/discussions) 创建线上讨论区，使用 [Discord](https://discord.gg/) 创建实时在线聊天室。国内社区的「互助模式」主要是使用各类办公沟通软件（如钉钉）创建用户群。

阿里内部技术产品普遍做法是通过 [Aone](https://aone.alibaba-inc.com/) 来跟踪需求和缺陷，接入[研发小蜜](https://yuque.antfin-inc.com/ant_tech_support/links)来提供答疑服务。得益于这些工具，技术产品的需求和缺陷的管理已经可以在线化了，未来完全可以数字化地评估技术团队在这方面的投入和产出，例如中台团队可以将答疑解决率、Aone 需求/缺陷处理率等指标纳入到绩效考核中。公司内部的技术产品也理应以商业产品的标准来要求自己。

## 写在最后

题图是笔者在参加某次手工活动时制作的木制品。我清楚地记得，车子的成型非常容易，只需要使用大型切割工具进行作业，几步即可完成。但要让它真正地成为一个工艺品，则需要耐心和大量的时间去磨平它的菱角。我想做技术产品也是如此吧。正文所言的条条框框仅仅是让技术产品有一个大体的轮廓，要让它真正能为开发者所用所喜爱，还需点点滴滴、持续迭代的精雕细琢。
