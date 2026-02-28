---
category : front-end
title: "10 个你可能还不知道 VS Code 使用技巧"
description: "10 个你可能还不知道 VS Code 使用技巧"
tags : [研发工具]
---

![image.png](https://ata2-img.oss-cn-zhangjiakou.aliyuncs.com/55ff6b25cbcfb856f5095b9d75cf454c.png)

经常帮一些同学 One-on-One 地解决问题，在看部分同学使用 VS Code 的时候，有些蹩脚，实际上一些有用的技巧能够提高我们的日常工作效率。

> 文章中所有图片都是动图 .gif ，如果浏览时发现不会图片不会动，请点击观看。知乎可以上传视频，因此文章在知乎上有更好的阅读体验：https://zhuanlan.zhihu.com/p/213868356

## 一、重构代码

VS Code 提供了一些快速重构代码的操作，例如：

**将一整段代码提取为函数**：选择要提取的源代码片段，然后单击做成槽中的灯泡查看可用的重构操作。代码片段可以被提取到一个新方法中，或者在不同的范围内（当前闭包、当前函数内、当前类中、当前文件内）提取到一个新函数中。在提取重构期间，VS Code 会引导为该函数进行命名。

![提取方法](https://img.alicdn.com/tfs/TB181L_hggP7K4jSZFqXXamhVXa-1024-770.gif)

**将表达式提取到常量**：为当前选定的表达式创建新的常量。

![提取变量](https://img.alicdn.com/tfs/TB1Ii9ZTET1gK0jSZFrXXcNCXXa-1024-770.gif)

**移动到新的文件**：将指定的函数移动到新的文件，VS Code 将自动命名并创建文件，且在当前文件内引入新的文件。

![移动到新的文件](https://img.alicdn.com/tfs/TB1za7vd4vbeK8jSZPfXXariXXa-1446-906.gif)

**转换导出方式**：`export const name` 或者 `export default`。

![转换导出方式](https://img.alicdn.com/tfs/TB1JvFbkk9l0K4jSZFKXXXFjpXa-1024-770.gif)

**合并参数**：将函数的多个参数合并为单个对象参数：

![合并参数](https://img.alicdn.com/tfs/TB1pxKEhzMZ7e4jSZFOXXX7epXa-1024-770.gif)

> 参考： [重构操作](https://code.visualstudio.com/docs/editor/refactoring)、[JS/TS 重构操作](https://code.visualstudio.com/Docs/languages/typescript#_refactoring)

## 二、自定义视图布局

VS Code 的布局系统非常灵活，可以在工作台上的活动栏、面板中移动视图。

![自定义视图布局](https://img.alicdn.com/tfs/TB1ujyHTuL2gK0jSZPhXXahvXXa-1024-770.gif)

> 参考：[重新排列视图](https://code.visualstudio.com/updates/v1_45?ref=codebldr#_dynamic-view-icons-and-titles)

## 三、快速调试代码

在 VS Code 内调试 JS/TS 代码非常简单，只需要使用 `Debug: Open Link` 命令即可。这在调试前端或 Node 项目时非常有用，这类型的项目通常会启动一个本地服务，这时候只需要将本地服务地址填写到 `Debug: Open Link` 输入框中即可。

![Debug: Open Link command](https://img.alicdn.com/tfs/TB1pOlSj8Bh1e4jSZFhXXcC9VXa-1807-1251.gif)

> 参考：[Debug](https://code.visualstudio.com/docs/editor/debugging)

## 四、查看和更新符号的引用

**查看符号的引用、快速修改引用的上下文**：例如，快速预览某个函数在哪些地方被调用了及其调用时上下文，还可以在预览视图中更新调用上下文的代码。

![查看符号的引用](https://img.alicdn.com/tfs/TB1RMrOjTM11u4jSZPxXXahcXXa-1024-770.gif)

**重命名符号及其引用**：接着上面的例子，如果想更新函数名以及所有调用，怎么实现？按 `F2` 键，然后键入所需的新名称，再按 `Enter` 键进行提交。符号的所有引用都将被重命名，该操作还是跨文件的。

![重命名符号](https://img.alicdn.com/tfs/TB1PZBFf5DsXe8jSZR0XXXK6FXa-1024-770.gif)

> 参考：[Peek](https://code.visualstudio.com/docs/editor/editingevolved#_peek)、[Rename Symbol](https://code.visualstudio.com/docs/editor/editingevolved#_rename-symbol)

## 五、符号导航

在查看一个长文件的时候，代码定位会是非常痛苦的事情。一些开发者会使用 VS Code 的小地图，但其实还有更便捷的方法：可以使用 `⇧⌘O` 快捷键唤起符号导航面板，在当前编辑的文件中通过符号快速定位代码。在输入框中键入字符可以进行筛选，在列表中通过箭头来进行上下导航。这种方式对于 Markdown 文件也非常友好，可以通过标题来快速导航。

![符号导航](https://img.alicdn.com/tfs/TB104a3TpP7gK0jSZFjXXc5aXXa-1024-770.gif)

> 参考：[Go to Symbol](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-symbol)

## 六、拆分编辑器

当对内容特别多的文件进行编辑的时候，经常需要在上下文中进行切换，这时候可以通过拆分编辑器来使用两个编辑器更新同一个文件：按下快捷键 `⌘\` 将活动编辑器拆分为两个。

![拆分编辑器](https://img.alicdn.com/tfs/TB1IS1DTxz1gK0jSZSgXXavwpXa-1024-770.gif)

可以继续无尽地拆分编辑器，通过拖拽编辑器组的方式排列编辑器视图。

![排序编辑器视图](https://img.alicdn.com/tfs/TB1RfaVTxv1gK0jSZFFXXb0sXXa-1024-770.gif)

> 参考：[Side by side editing](https://code.visualstudio.com/docs/getstarted/userinterface#_side-by-side-editing)

## 七、重命名终端

VS Code 提供了集成终端，可以很方便地快速执行命令行任务。用得多了经常会打开多个终端，这时候给终端命名可以提高终端定位的效率。

![重命名终端](https://img.alicdn.com/tfs/TB1p3aJTvb2gK0jSZK9XXaEgFXa-1024-770.gif)

> 参考：[Rename terminal sessions](https://code.visualstudio.com/docs/editor/integrated-terminal#_rename-terminal-sessions )

## 八、Git 操作

VS Code 内置了 Git 源代码管理功能，提供了一些便捷的 Git 操作方式。例如：

**解决冲突**：VS Code 会识别合并冲突，冲突的差异会被突出显示，并且提供了内联的操作来解决冲突。

![解决冲突](https://img.alicdn.com/tfs/TB1Z45EhzMZ7e4jSZFOXXX7epXa-1024-770.gif)

**暂存或撤销选择的代码行**：在编辑器内可以针对**选择的行**来撤销修改、暂存修改、撤销暂存。

![行暂存](https://img.alicdn.com/tfs/TB1UHyUTAY2gK0jSZFgXXc5OFXa-1024-770.gif)

> 参考：[Using Version Control in VS Code](https://code.visualstudio.com/docs/editor/versioncontrol)

## 九、搜索结果快照

VS Code 提供了跨文件搜索功能，搜索结果快照可以提供更多的搜索结果的信息，例如代码所在行码、搜索关键字的上下文，并且可以对搜索结果进行编辑和保存。

![搜索结果快照](https://img.alicdn.com/tfs/TB1oCiZTET1gK0jSZFrXXcNCXXa-1024-770.gif)

> 参考：[Search Editors](https://code.visualstudio.com/updates/v1_43#_search-editors)

## 十、可视化搭建页面

在 VS Code 中可以通过可视化搭建的方式生成 Web 页面，这是通过安装 VS Code 的 [Iceworks](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) 插件实现的。安装插件后，通过 `⇧⌘P` 唤起命名面板，在命令面板中输入『可视化搭建』即可唤起可视化搭建界面，在界面内通过选择网页元素、进行拖拽布局、设置元素样式和属性来搭建页面，最后点击『生成代码』就可以生成 React 代码。

![可视化搭建页面](https://img.alicdn.com/tfs/TB1Z_UbfSslXu8jSZFuXXXg7FXa-1446-906.gif)

> 参考：[Iceworks 可视化搭建](https://ice.work/docs/iceworks/guide/visual-construction)

最后这个显然是广告植入了，我给了一些 Tips(提示) 大家，大家也要付一下我的 Tips(小费)哦；）