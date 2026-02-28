---
category : front-end
title: "什么是人工智能自动编程？它只是一个噱头吗？"
description: "什么是人工智能自动编程？它只是一个噱头吗？"
tags : [研发工具]
---

毫无疑问，人工智能将改变软件开发的方式 —— 我们已经看到了一些尝试将人工智能应用到软件开发所带来的好处，例如“程序代码自动生成”：根据图像生成代码、通过数据模型生成代码……今天我感兴趣的是，一个普通的开发者是否已经有了一些有用的工具，这些工具使用人工智能技术提高了他的生产力。

我将目光放到了常见的编程领域，搜索了一些称之为「智能编程」的工具，并尝试在它们的帮助下完成一个简单的实验：编写一个具有输入框和内容的界面，内容的会随着输入框的输入而发生变化。由此来观察这些工具提供了哪些能力，是否对我们的编程工作产生了实际性的帮助。

实验示例代码如下：

![示例](https://img.alicdn.com/tfs/TB1E4UefBFR4u4jSZFPXXanzFXa-1024-768.png)

> 笔者完全认同人工智能可以帮助软件开发的所有阶段，而不仅仅是在代码级别。

## VS Code 所带来的启发

VS Code 是目前最受前端开发者欢迎的编辑器，它默认提供了一些智能化的功能，普通开发者可以快速上手体验这些功能。我们从它入手来介绍编辑器领域的一些概念和专有名词。

### 智能提示(IntelliSense)

[IntelliSense](https://code.visualstudio.com/docs/editor/intellisense) 是 VS Code 内置的一系列功能，包含了代码补全(Code Completion)、概况信息显示(Quick Info)、函数签名显示(Parameter Info)等。

VS Code 默认为为 JavaScript/TypeScript、HTML、CSS/SCSS/Less 等语言提供了智能提示，也可以通过安装[语言插件](https://marketplace.visualstudio.com/search?target=VSCode&category=Programming%20Languages&sortBy=Installs)为更多的语言添加智能提示功能。

#### 代码补全(Code Completion)

VS Code 智能提示功能由 VS Code 的[语言服务](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide)提供支持。语言服务提供了基于语言语义和源代码分析的代码补全能力。具体来说，如果语言服务知道可能完成输入，则建议的补全列表将在你键入后弹出：

![](https://img.alicdn.com/tfs/TB1_aPbMXY7gK0jSZKzXXaikpXa-740-478.png)

如果继续键入字符，则补全列表（变量、方法等）将被筛选，仅包含包含键入字符的列表：

![](https://img.alicdn.com/tfs/TB1Fmu7bBFR4u4jSZFPXXanzFXa-740-463.png)

VS Code 智能提示提供了丰富类型的补全提示，包括**语言服务的建议**、**代码片段（Snippet）**和简单的**基于单词的文本补全**。

补全列表内，它们的排序优先级(Sorting of Suggestions)如下：

- 语言服务的建议
- 代码片段
- 全局标识符
- 简单的基于单词的文本

> 在单项内以字母顺序进行排序

几点特殊的说明：

**就近原则**（[参考](https://code.visualstudio.com/docs/editor/intellisense#_locality-bonus)）

![就近原则](https://img.alicdn.com/tfs/TB1FnZUbmR26e4jSZFEXXbwuXXa-1058-848.png)

在上面的图片中，你可以看到 `count`、`context` 和 `colocated` 是根据它们出现的范围（loop、function、file）进行排序的。

> 就近原则的上下文提示默认是不开启的，你可以通过 `editor.suggest.localityBonus` 设置来开启。

**代码片段的优先级**（[参考](https://code.visualstudio.com/docs/editor/intellisense#_snippets-in-suggestions)）

你可以使用 `editor.snippetSuggestions` 设置代码片段在代码补全列表中是否显示及优先级。要从代码补全列表中删除代码片段，请将值设置为“none”。如果你想查看代码片段，可以指定其在代码补全列表上的顺序：在顶部（“top”）、在底部（“bottom”）或按字母顺序内联（“inline”）。默认值为“inline”。

**代码补全列表的建议完成项**（[参考](https://code.visualstudio.com/docs/editor/intellisense#_suggestion-selection)）

默认情况下，VS Code 在代码补全列表中预先选择以前使用的项目。如果你想要不同的行为，例如，总是选择建议列表中的第一项，你可以使用 `editor.suggestSelection` 设置。

可用的值包括：

- `first`：始终选择顶部列表项。
- `recentlyUsed`：（默认）除非前缀（要选择的类型）选择其他项目，否则将选择以前使用的项目。
- `recentlyUsedByPrefix`：根据以前补全的建议的前缀来选择项目。

#### 列表项的概况显示(Quick Info)

在代码补全列表上，你可以通过单击列表项右侧的图标来查看每个补全项的概况信息，该补全项的附带文档将扩展到侧面。展开的文档将保持不变，并在你浏览列表时更新。你可以通过单击“关闭”图标来关闭此窗口：

![Quick Info](https://img.alicdn.com/tfs/TB1LtYdMoY1gK0jSZFMXXaWcVXa-932-305.gif)

#### 函数签名信息(Parameter Info)

当你在代码补全列表上选择了一个函数（方法）后，将显示有关函数签名的信息。当有多个参数时，突出显示（下划线高亮）当前正在补全的参数：

![](https://img.alicdn.com/tfs/TB1MY2hMeH2gK0jSZJnXXaT1FXa-740-210.png)

### 智能操作(Code Actions)

除提示外，VS Code 还内置提供了一些可由开发者主动操作的智能编码手段。

#### 代码重构(Refactoring)

代码重构提供了诸如提取函数和提取变量等功能。在 VS Code 代码编辑中，只需选择你要提取的源代码，然后单击槽中的灯泡或按（⌘）即可查看可用的重构方式：

![Refactoring](https://img.alicdn.com/tfs/TB16vxjNhD1gK0jSZFsXXbldVXa-783-190.png)

代码重构的能力是由语言服务提供的，因此，不同的语言所能做的代码重构不尽相同。VS Code 通过 TypeScript 语言服务内置了对 TypeScript 和 JavaScript 的代码重构支持。

> 更多关于代码重构的功能，可参考 [TypeScript 语言服务的重构章节](https://code.visualstudio.com/docs/languages/typescript#_refactoring)。

#### 快速修复(Quick Fixes)

快速修复是由语言服务提供的诊断程序，可以用来查找常见的编程问题。例如，它可以分析你的源代码并检测出永远都不会执行的代码，这些代码在编辑器中显示为灰色。如果你将鼠标悬停在这样源代码行上，你可以看到一个悬停说明，如果你将光标放在该行上，你将得到一个快速修复灯泡：

![Quick Fixes](https://code.visualstudio.com/assets/docs/typescript/tutorial/unreachable-code-detected.png)

不同语言所能做的快速修复不尽相同，VS Code 对 TypeScript 和 JavaScript 内置的快速修复有：

- 向成员访问添加缺少的 `this`
- 修复拼写错误的属性名称
- 删除无法访问的代码或未使用的导入

开发者可以通过安装语言插件添加更多快速修复功能。

### 实验演示

在没有安装任何外部插件的情况下，我尝试通过 VS Code 完成示例中的代码，效果如下：

![VS Code 示例](https://img.alicdn.com/tfs/TB1Z3.XQ7Y2gK0jSZFgXXc5OFXa-1024-770.gif)

- 介绍章节罗列的功能大部分都在演示中触发了
- 代码补全提示类型不多，有语言关键字、名称表达式和属性表达式的类型补全
- 代码补全的正确率不高，多为单词和全局变量提示
- 我尝试安装了 `@types/react`，有了语言语义的支持后，React API 的代码提示的效率明显变高了

## 业界有哪些产品？

### Visual Studio IntelliCode

 [Visual Studio IntelliCode](https://docs.microsoft.com/zh-cn/visualstudio/intellicode/)（以下简称 VS IntelliCode）是微软官方 2018 年 7 月 推出的智能代码插件，在 2019 年 8 月发布正式版本，最近一次更新是今年 6 月底。IntelliCode 支持多种编程语言（JavaScript/C++/Python），它在 VS Code 插件市场有高达六百万的下载量。
 
> [IntelliCode for VS Code](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.vscodeintellicode)
 
IntelliCode 号称能基于对代码上下文的理解和机器学习的结合提供智能辅助开发功能。具体来说，提供了以下几个功能。
 
第一个功能是**更智能的代码补全**。常见的代码补全是根据字母顺序来进行排序的，VS IntelliCode 则根据上下文和「理解你的使用习惯」的来对一些方法进行了排序提取，供开发者使用的最可能正确的 API。在下面显示的示例中，可以看到 IntelliCode 提升的预测 API 出现在列表顶部的一个新部分中，成员前缀为一个星形图标：
 
 ![](https://img.alicdn.com/tfs/TB1wE_udlFR4u4jSZFPXXanzFXa-1696-950.png)
 
 这样的功能还能运用在写 React 组件属性时：
 
 ![](https://visualstudio.microsoft.com/wp-content/uploads/2018/12/visual-studio-intellisense-xaml.png)
 
第二个功能是**参数的智能补全**。具体来说，即当你输入函数闭合后，将提示你以哪个变量来作为函数的参数。
 
例如下面的代码：
 
 ```javascript
try {
  // do something...
} catch (error) {
  // do something...
  console.error(); 
  // 当你输入了 console.error() 后，编辑器光标会在 error 方法内
  // 并出现补全列表，第一项便是 catch 里传入的 error 变量。
}
```

可惜该功能对 TypeScript 和 Javascript 不可用，官网列出了在 C+ 中的示例：

![](https://docs.microsoft.com/zh-cn/visualstudio/intellicode/media/argument-completion.png)

第三个功能是**代码重构建议**。官网给出的示例是当我们用同样的方法更新了多处代码：

![](https://visualstudio.microsoft.com/wp-content/uploads/2020/04/intellicode-suggestions-3-800x244-1.png)

插件会在代码插槽处显示更新灯泡图标，点击更新灯泡图标将告知我们还有哪些可以以同样方式更新的代码：

![](https://docs.microsoft.com/zh-cn/visualstudio/intellicode/media/intellicode-suggestions-discovery-and-toolwindow.png)

点击列表项即可定位到可执行建议更新的代码处，在代码旁的插槽处可以应用建议的更改：

![](https://docs.microsoft.com/zh-cn/visualstudio/intellicode/media/intellicode-suggestions-lightbulb.png)

这个功能似乎用处不大，毕竟在我们进行代码重构的时候可以通过使用正则表达式搜索替换的方式一次性更新所有代码。也许其强大之处在于你是在「不自觉中」更新了两处一样的代码（它会在本地跟踪你的编辑过程和内容并检测可重复应用的内容），然后插件给予你还可以更新更多类似代码的提示吧。

#### 实验演示

![](https://img.alicdn.com/tfs/TB1xWH_Q.Y1gK0jSZFMXXaWcVXa-1024-770.gif)

IntelliCode 主要是丰富了属性表达式的补全，在我们的实验中，其补全效率与原生 VS Code 并无明显差异。

### Kite

[Kite](https://www.kite.com/) 是由一家硅谷的创业公司于 2017 年 3 月推出的代码智能编辑辅助工具，支持在多个 IDE 中以插件的方式嵌入，其提供的 VS Code 插件最近一次更新是今年 7 月中。Kite 起初只适用于 Python，目前部分功能已支持 Javascript。它在 VS Code 插件市场有高达一百万的下载量，是 Python 社区最受欢迎的 VS Code 插件之一。

Kite 母公司在 2019 年初获得了 A 轮 1700 万美元的融资，目前提供了免费版本和付费方案。

> [Kite for VS Code](https://marketplace.visualstudio.com/items?itemName=kiteco.kite)

Kite 官网介绍了其 **智能代码补全** 功能，Kite 提供的代码补全与典型的代码补全方式不同的地方有： 

1. 为几乎所有 JavaScript 代码提供补全，比如语句、函数、对象等等，例如在空格后：
	![](https://d33v4339jhl8k0.cloudfront.net/docs/assets/589ced522c7d3a784630c348/images/5eb9d527042863474d1a84a9/file-rppmlu1Vhw.png)
2. 与只有单词补全相比，Kite 提供了整行或多行的代码补全：
	![](https://d33v4339jhl8k0.cloudfront.net/docs/assets/589ced522c7d3a784630c348/images/5eb9d4c02c7d3a5ea54ade5a/file-ZkQx4jVKeO.png)
3. Kite 可以猜测你当下最有可能进行的输入，提供智能的推荐：
	![](https://d33v4339jhl8k0.cloudfront.net/docs/assets/589ced522c7d3a784630c348/images/5eb9d4f3042863474d1a84a5/file-KZWbkv4JZh.png)
	
> [Using the VS Code plugin for JavaScript](https://help.kite.com/article/134-using-the-vs-code-plugin-for-javascript)

除了代码补全，Kite 还提供了智能代码片段、智能代码搜索、文档搜索等功能，但这些功能目前仅支持 Python 语言。

#### 实验演示

![](https://img.alicdn.com/tfs/TB16wCgcSslXu8jSZFuXXXg7FXa-1024-770.gif)

- Kite 的代码补全类型更加丰富，补全效率也明显比前两者要高
- Kite 的代码补全列表选项不多，我猜想是为了提高正确率。从实际效果来看，触发的补全项普遍是正确的
- Kite 的代码补全响应速度与 VS Code 原生功能相比，没有感受到明显的差异

### TabNine

[TabNine](https://tabnine.com/) 的第一个版本于 2018 年底推出，支持在多个 IDE 中以插件的方式嵌入，其提供的 VS Code 插件最近一次更新今年 7 月底。TabNine 的编程语言的覆盖度非常高，支持大多数常用的编程语言（JavaScript/Java/Python……），其在 VS Code 插件市场有高达三十万的下载量。

TabNine 最早是社区的开源软件，今年年初被 Codota 收购，Codata 今年四月份宣布获得了 1200 万美元的融资，目前提供了免费版本和付费方案。

> [TabNice for VS Code](https://marketplace.visualstudio.com/items?itemName=TabNine.tabnine-vscode)

比 VS IntelliCode 提供 API 自动补全更进一步， TabNine 提供了全方位的代码补全。只要你在编辑器中键入，TabNine 就会给予自动补全提醒。TabNine 官网用了三个示例来描述自己的能力。分别是：

1. 基于注释推导可能编写的代码，例如根据函数的注释推导能使用的函数名、参数和返回值类型

    ![](https://img.alicdn.com/tfs/TB1VjTkOXP7gK0jSZFjXXc5aXXa-1200-438.png)
2. 基于上下文推导出可能使用的 API 和传递的参数：

	![](https://img.alicdn.com/tfs/TB1_sLkOeL2gK0jSZFmXXc7iXXa-1200-300.png)
3. 了解常用库的使用模式（最佳实践），并根据上下文给出代码补全的建议：

	![](https://img.alicdn.com/tfs/TB1rnThOoT1gK0jSZFrXXcNCXXa-1002-494.png)
	
#### 实验演示

![](https://img.alicdn.com/tfs/TB130MUQoY1gK0jSZFMXXaWcVXa-1024-770.gif)

- TabNine 实现了全类型补全，可以看到在每一次输入 TabNine 都会出现代码补全列表提示我们可能进行的输入
- 由于提示频率高，因此正确率则不如 Kite，但 TabNine 比较讨喜地在在右侧面板用百分比显示可能的匹配度，对用户编程体验没有感受到有太大的干扰
- TabNine 的代码补全响应速度与 VS Code 原生功能相比，没有感受到明显的差异

### aiXcoder

 [aiXcoder](https://www.aixcoder.com/) 的第一个版本于 2018 年中旬推出，2019 年底推出了 VS Code 插件，该插件最近一次更新是今年 5 月初。aiXcode 支持多种主流 IDE （IntelliJ IDEA/Eclipse/VS Code）和主流编程语言（JavaScript/Java/Python），主打 IntelliJ IDE 和 Java 语言。可能是由于推出时间不久，而且个人版本仅支持 Java ，所以它在 VS Code 插件市场下载量不高，只有  3k+ 的下载量。由于是国产软件且功能文档较为全面，因此也在此次调研清单里。
 
aiXcoder 创始团队来自北京大学实验室，负责人是北大的副教授李戈老师，是一个是校企合作项目，其母公司硅心科技 18 年获得了百万人民币的天使投资。aiXcoder 提供了个人版本和企业版本。

> [aiXcoder for VS Code](https://marketplace.visualstudio.com/items?itemName=aixcoder-plugin.aixcoder)
 
 aiXCode 官网对自己提供的功能进行了较为完整体系的介绍，根据其分类，提供的功能有：
 
**代码智能补全**
 
 - 单 Token 补全：即变量名、对象属性、对象方法等输入的补全；
 - 多 Token 补全：记得链式调用吗？如果有必要，会出现多个链式 API 的推荐补全，例如：`document.getElementById('foo').style.top`
 - 整行补全：即输入 `f`，补全提示 `for (let i =0, j = foo.length; j >= i; i++)`
 - 多行补全：一次性补全多行代码
    ![](https://aixcoderbucket.oss-cn-beijing.aliyuncs.com/2019-03-05/0ef36c32c97041d1b06c13027d07ae5c.gif)
- 连续多次补全：当户确认了 aiXcoder 的推荐结果后，aiXcoder 随即给出接下来的推荐代码
- 函数参数自动补全：即当用户在调用某个函数（方法）时，提示可能输入的参数
	![](https://aixcoderbucket.oss-cn-beijing.aliyuncs.com/2019-03-05/729938e0f7f14ecba361e92a3eb95b61.gif)
	
**代码智能搜索**

- 文档搜索，输入关键字可以搜索出相应的文档和示例；
- 相似代码搜索，选中一部分代码，在 Github 中搜索出相似的代码，点击进行替换；在自己仓库中搜索出功能实现相似度高的代码；
- 推荐代码搜索，输入要实现的功能描述（中文），推荐出可供使用的代码。

![](https://file.aixcoder.com/img/2020/comp1.png)

**编程智能质效**

通过智能分析，得出项目的质量和效率情况，帮助开发者持续进行提高。

![](https://file.aixcoder.com/img/2020/comp3.png)

#### 实验演示

由于 aiXcode 的个人版本仅支持 Java 语言，因此无法就我们的示例来进行实验。

### 大公司

#### Facbook

[Facebook 人工智能实验室在 2019 年四月发布了 Aroma](https://ai.facebook.com/blog/aroma-ml-for-code-recommendation/)。Aroma是一个代码搜索和推荐工具，它使用机器学习技术使得从大型代码库中获得有效的代码进行编程辅助变得更容易和有效。通过展示与开发者正试图编写的代码类似的示例（并假设这些示例对应于作为公司代码库一部分的高质量代码），这个建议可以帮助开发者更快地完成功能，也可以帮助开发者尽早发现可能的错误或重构机会，如示例中缺少异常的处理：

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/195/1597070532640-fbea0662-8383-4dd0-9692-fd5ff7c72ac9.png) 

#### Google

我没有从公开的资料和新闻中找到 Google 关于人工智能自动编程或辅助编程的工具。但发现了 Google 对于这方面有一些研究成果。例如，Google Brain 的一个团队层发表了一篇名为[《用于建模源代码编辑的神经网络》](https://arxiv.org/pdf/1904.02818.pdf)的论文，他们在该论文中训练了一个网络，其中包含来自数千名 Python 开发人员的数百万次细粒度编辑，用来预测未来的编辑。在这篇论文中，Google 并不关注静态代码，而是更关注代码编辑作为一个随时间演变的动态对象。

### 其他

 除了上面这些提供整体性智能化解决方案的工具，我还发现了一些专注于对某一单项的能力进行智能化的工具，它们或不成规模，但探索的方向依然有趣：

- **[DeepCode](https://marketplace.visualstudio.com/items?itemName=DeepCode.deepcode#deepcodes-ai-engine-finds-bugs)**：帮助发现项目中的代码缺陷、安全漏洞、性能和 API 使用问题的插件。下图演示了 DeepCode 使用“问题”选项卡和语法突出显示检查所有问题时的表现：

    ![](https://raw.githubusercontent.com/DeepCodeAI/vscode-extension/master/images/problem.png)
- **[Intelli Refactor](https://marketplace.visualstudio.com/items?itemName=ypresto.vscode-intelli-refactor)**：该插件是对 VS Code 内置代码重构功能的增强。

## 能力和体验对比

最后，让我们用表格的形式横向对比这些工具的能力覆盖和体验，其中能力部分以工具官网介绍为依据，体验部分以我的实验的个人感受为依据。

> 由于实验使用的是前端代码，且受限于代码的设计、我个人的机器情况和编程习惯，因此不能作为科学的依据，仅供参考。

### 主要能力对比

|  | Visual Studio IntelliCode | Kite | TabNine | aiXcoder |
| --------| -------- | -------- | -------- | -------- |
| 支持的编程语言 | JavaScript/TypeScript, Java, Python and SQL | JavaScript and Python | JavaScript/TypeScript, Java, C++, C, PHP, Go, C#, Ruby, Objective-C, Rust, Swift, Haskell, OCaml, Scala, Kotlin, Perl, SQL, HTML, CSS, and Bash | Java, Python, C/C++, JavaScript/Typescript, Go and PHP |
| 支持的 IDE | Visual Studio and VS Code | VS Code, IntelliJ, Sublime, WebStorm, Vim, Atom and More | VS Code, IntelliJ, Sublime, Emacs, Vim, Atom and More | IntelliJ IDEA, Eclipse, WebStorm, Visual Studio Code and More |
| 智能提示 | O | O | O | O |
| 智能检测 | O | X | X | O |
| 智能搜索 | X | O | X | O |
| 智能重构 | X | X | X | X |
| 离线使用 | O | O | O | O |
| 领域定制 | O | O（收费） | O（收费） | O（收费） |

- 离线使用：不依赖于网络即可使用。部分软件使用深度学习技术，因此需要较大的计算资源，因此使用云端资源，依赖网络环境。
- 领域定制：使用企业或团队的私有代码训练「专用的智能化引擎」，提供更符合企业或团队编程习惯的建议。

### 智能提示对比

|  | Visual Studio IntelliCode | Kite | TabNine | aiXcoder |
| --------| -------- | -------- | -------- | -------- |
| 补全类型 | 属性表达式 | 所有（部分收费） | 所有 | 语言关键字、名称表达式或属性表达式 |
| 单 Token 补全 | O | O | O | O |
| 多 Token 补全 | X | O | O | O |
| 整行补全 | X | O（收费） | O | O |
| 多行补全 | X | O（收费） | O | O |
| 参数补全 | O | O（收费） | O | O |
| 连续自动补全 | X | O | O | O |
| 实时学习（基于上下文进行补全） | O | O | O | O |

- 补全类型：即能触发补全提示的情况
	- 属性表达式：`object.${api}`
		![](https://d33v4339jhl8k0.cloudfront.net/docs/assets/589ced522c7d3a784630c348/images/5e30ce122c7d3a7e9ae6e565/file-37qlcTmWIc.png)
	- 名称表达式：
		![](https://d33v4339jhl8k0.cloudfront.net/docs/assets/589ced522c7d3a784630c348/images/5e30cdd02c7d3a7e9ae6e561/file-pMX5b7kX0Q.png)
- 多 Token 补全：如下图所示，`encode`是单 Token 补全，`encode('utf8')` 即是多 Token 补全
	![多 Token 补全](https://www.tabnine.com/static/gallery13.png)
- 整行补全：如下图所示，`post` 是单 Token 补全，`post(my_url, data=my_data)` 是整行补全
	![整行补全](https://www.kite.com/wp-content/uploads/2019/09/VS-Code-with-Kite_requests.p.png)
- 多行补全：如下图所示，一次性补全了多行的代码
	![多行补全](https://img.alicdn.com/tfs/TB1GJwliz39YK4jSZPcXXXrUFXa-1664-936.gif)
	
### 使用体验对比

|  | Visual Studio IntelliCode | Kite | TabNine | aiXcoder |
| --------| -------- | -------- | -------- | -------- |
| 补全效率 | ★ | ★★ | ★★★ | - |
| 准确率 | ★ | ★★ | ★★★ | - |
| 响应速度 | ★★★ | ★★ | ★★★ | - |
| 硬盘资源 | >=10M | - | 800M | 280M |
| 内存资源 | - | - | - | - |
| CPU 资源 | - | - | - | - |

- 补全效率：即对于同一段代码，需要多少次键入才能完成输入，键入越少，补全效率越高；
- 准确率：即对于同一段代码，补全提醒首选项的正确的次数与补全提示出现的总次数的比例，比例越高说明准确率越高；
- 相应速度：即在用户输入后多久出现补全提示列表，可通过同一段代码来测试补全提示的出现平均值；
- 硬盘资源：离线使用需依赖机器学习模型，因此模型会占用硬盘资源；

## 只是噱头吗？

通过这个简单的实验，可以说，到目前为止，人工智能「自动编程」更多的是市场营销。我相信这些工具在未来几年会有很大的进步，并可能成为开发者真正的虚拟助手，但我们离这一步还有些距离。同时不可否认的是，当下使用这些工具让开发者在编程效率上得到了一定的提升。
 
- 对于初级开发者来说，智能编程工具对于编程效率和体验的提升是明显的，它能提供有效的建议，帮助初级开发者更快地写出更好的代码；
- 对于高级开发者来说，智能编程工具对于效率的提升则较小，但依然能带给我们一些愉悦的编程体验。高级开发者熟练其领域的技能和知识，编程的主观性较强，且有自己的代码品味，代码提示有时候会是一种干扰，所以智能编程工具应该需要具备个性化设置的能力；
- 与任何使用机器学习方法一样，智能编程工具的效果取决于训练数据的质量。如果不使用 GitHub 数据来训练系统，而是使用内部/私有存储库对其进行训练，则会获得更好的效果；

另外起初，我只关注到了自动编程对于提高生产效率的效益，但在调研的过程中我发现，人工智能自动编程对于生产质量和编程教育也会有广阔的前景。

在将来，我想我们还会看到一些编程机器人，我们可以与他们进行一些配对编程，并讨论特定方法的目标是什么，让机器人为我们找到最好的解决方案。

## 参考资料

- [TabNine: Free forever and Professional plans available](https://www.tabnine.com/pricing)
- [Kite: Level up your VS Code experience](https://www.kite.com/integrations/vs-code/)
- [Kite Pro: Maximum Productivity for Professionals](https://www.kite.com/pro/)
- [Kite: Using the VS Code plugin for Python](https://help.kite.com/article/69-using-the-vs-code-plugin)
- [aiXcoder 迎面 PK Kite！](https://www.aixcoder.com/#/new?id=3)
