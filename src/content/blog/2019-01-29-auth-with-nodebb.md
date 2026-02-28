---
category : Node.js
title: "社区类应用的权限设计以及管理 —— 以 NodeBB 为例"
description: "社区类应用的权限设计以及管理 —— 以 NodeBB 为例"
tags : [Node.js]
---

笔者近期在开发[淘宝开发者社区](https://club.developers.taobao.com/)时需要对 [NodeBB](https://github.com/NodeBB/NodeBB) 的安全架构进行评估，由于 NodeBB 使用了 NoSQL 且无论是官方还是社区对其数据库设计都没有相关的介绍说明，因此整理了 NodeBB 的权限设计及管理方式的说明文档，在此分享供有需要的同学进行参考。

- 假设你在使用 [NodeBB@1.x.x](https://github.com/NodeBB/NodeBB/tags)，本文的内容将帮助你了解其权限设计方案及管理方式；
- 假设你要使用某个开源软件开发一个社区类应用，则本文对 NodeBB 权限设计及管理的分析方法可帮助你按图索骥 —— 你最好尽可能详尽地对你所使用软件进行安全架构评估；
- 假设你在开发一个社区类软件，他山之石可以攻玉。

## 权限概念

首先需要搞清楚的第一个问题是，应用内有哪些用户角色？

### 用户角色

NodeBB 内有如下用户角色：

- 系统管理员：系统最高权限；
- 论坛管理员：论坛管理者，可以对所有版块的帖子进行管理；
- 版块版主：某个版块的管理员，可以对该版块的帖子进行管理；
- 注册用户；
- 游客。

### 用户群组

其次是，应用内的角色控制是通过怎样的方式实现的？

NodeBB 内的用户角色权限控制是由“群组”来实现的。其默认群组是在应用数据库初始化时（`./nodebb setup`）创建的，有如下群组：

- 用户群组
    - administrators: 系统管理员角色的对应群组；
    - Global Moderators: 论坛管理员的对应群组；
    - registered-users: 注册用户的对应群组；
    - guests(硬编码): 游客；
    - spiders(硬编码): 爬虫；
    - *custom: 自定义的群组，只有系统管理员角色才能增删改自定义群组。
- 权限群组
    - *PrivilegeGroup: 每一个权限点就是一个权限群组。

        权限群组的命名规则： 
        
        ![权限群组的命名规则](https://img.alicdn.com/tfs/TB1OgVEBHvpK1RjSZPiXXbmwXXa-778-60.png)

        其中 {groups:} 是可选的，有则代表这是一个群组维度的权限，无则代表这是一个用户维度的权限（参考：什么是权限维度？）。

相关 SQL：

- 获取所有群组：`db.getCollection('objects').find({_key: "groups:createtime"})`

    > NodeBB 的静态数据都在 objects 集合，因此后面缩写为 `{_key: "value"}` 的形式。
- 查找某个群组：`{_key: "group:{name}"}`
- 查找某个群组下的用户：`{_key: "group:{name}:members"}`

#### 群组的设置

然后我们需要了解，群组内包含了哪些设置？即群组“表”（NodeBB 使用 Mongodb，本身没有表的概念）包含了哪些字段。

![群组的设置](https://img.alicdn.com/tfs/TB12.UVBxTpK1RjSZR0XXbEwXXa-1194-796.png_450x10000.jpg)

主要关注以下几个字段：

- hidden：是否隐藏。启用此选项后，此群组将不在前台的群组列表中展现，并且用户只能被手动邀请加入群组；
- private：私有。启用此选项后，加入群组的请求将需要群组所有者审批；
- disableJoinRequests：禁止加入请求。

#### 群组的管理权限

群组的管理者有对群组的管理权限，即：

- 邀请成员；
- 添加成员；
- 批准/拒绝加入申请；
- 踢出成员。

## 用户角色权限控制

这些用户角色权限控制如何实现？

### 权限类型

- 全局权限：[枚举](https://github.com/NodeBB/NodeBB/blob/v1.11.1/src/privileges/global.js#L27)
    - chat: 聊天；
    - signature: 设置签名；
    - ...
- 版块权限：[枚举](https://github.com/NodeBB/NodeBB/blob/v1.11.1/src/privileges/index.js#L23)
    - groups:find: 版块是否可见；
    - groups:read: 版块是否可访问；
    - ...

### 权限授予的维度

- 某个用户：可针对某个用户授予全局/版块权限，例如用户 A 不允许全局聊天；
- 某个群组：可针对某个群组授予全局/版块权限，例如注册用户群组在版块 A 不允许删除主题。

权限维度的关系：用户权限继承群组权限。

例如，有权限 p_1、用户 u_1、和群组 g_1，用户 u_1 属于群组 g_1，则有：

- 群组 g_1 拥有权限 p_1，则用户 u_1 同时拥有了权限 p_1；
- 群组 g_1 没有权限 p_2，但针对用户 u_1 授予了权限 p_1，则 u_1 拥有了权限 p_2。

### 实现

一个示例：

* 用户 u_especial/u_global/u_ban_c1/u_other 属于群组 registered-users；
* 群组 registered-users（注册用户）无版块 c_1 的删除主题的权限；
* 用户 u_admin 属于群组 administrators（管理员群组）；
* 用户 u_especial 单独设置有该权限；
* 用户 u_ban_c1 设置为 c_1 的版主；
* 用户 u_global 设置为论坛总版主；

最终：

* 用户 u_especial 在 c_1 发布了一篇帖子，则：
    - 谁可以删除该帖子：
        - u_admin
        - u_global
        - u_ban_c1
        - u_especial
    - 谁无法删除该帖子：
        - u_other
* 用户 u_other 在 c_1 发布了一篇帖子，则：
    - 谁可以删除该帖子：
        - u_admin
        - u_global
        - u_ban_c1
    - 谁无法删除该帖子：
        - u_especial
        - u_other

#### 权限创建与授予

0. 用户 u_especial/u_global/u_ban_c1/u_other/u_admin 注册时自动加入到 registered-users 群组（[代码实现](https://github.com/NodeBB/NodeBB/blob/v1.11.1/src/user/create.js#L100)）；
0. 创建版块 c1：
    - 为版块的相关权限创建“权限群组”，其中为 版块 c_1 的 “删除主题权限” 创建两个权限群组：

        - `cid:1:privileges:groups:topics:delete`：群组维度；
        - `cid:1:privileges:topics:delete`：用户维度。
    - 授予指定群组该权限（[代码实现](https://github.com/NodeBB/NodeBB/blob/v1.11.1/src/categories/create.js#L81)），默认授予了 `administrators` 和 `registered-users` 群组该权限，即是将它们加入到了 `cid:1:privileges:groups:topics:delete` 的成员：

        `{_key: "group:cid:1:privileges:groups:topics:delete"}`
        ![权限群组](https://img.alicdn.com/tfs/TB1druYBSzqK1RjSZFLXXcn2XXa-1458-600.png_450x10000.jpg)
0. 设定 registered-users 群组无版块 c_1 的删除主题的权限，即是将 registered-users 群组从权限群组 `cid:1:privileges:groups:topics:delete` 的成员内移除：

    ![权限群组](https://img.alicdn.com/tfs/TB1njeOBPDpK1RjSZFrXXa78VXa-1472-406.png_450x10000.jpg)
0. 将 u_admin 加入到群组 administrators，可以看到 administrators 群组成员里已有 u_admin(value=12)：

    ![admin群组](https://img.alicdn.com/tfs/TB1gp92BSzqK1RjSZFpXXakSXXa-830-590.png_450x10000.jpg)
0. 设定 u_especial 用户有版块 c_1 的删除主题的权限，即是将 u_especial 加入到权限群组 `cid:1:privileges:topics:delete` 的成员：

    `{_key: "group:cid:1:privileges:topics:delete:members"}`
    ![权限群组](https://img.alicdn.com/tfs/TB1jAC1BMHqK1RjSZFgXXa7JXXa-902-388.png_450x10000.jpg)
0. 设定 u_ban_c1 设置为 c_1 的版主，即是将 u_ban_c1 加入到权限群组 `cid:1:privileges:moderate`：

    `{_key: "group:cid:1:privileges:moderate:members"}`
    ![权限群组](https://img.alicdn.com/tfs/TB1_Se6BSzqK1RjSZFpXXakSXXa-828-396.png_450x10000.jpg)
0. 设定 u_global 设置为论坛总版主，即是将 u_global 加入到群组 `Global Moderators`：

    `{_key: "group:Global Moderators:members"}`
    ![Global群组](https://img.alicdn.com/tfs/TB1l.O7BPTpK1RjSZKPXXa3UpXa-792-390.png_450x10000.jpg)

#### 权限验证

在前台用户发起删除帖子时，调用的是 `posts.delete` 接口，该接口调用栈如下：

- 接口响应层：[SocketPosts.delete](https://github.com/NodeBB/NodeBB/blob/v1.11.1/src/socket.io/posts/tools.js#L83)
- Post 模型层：[Posts.tools.delete](https://github.com/NodeBB/NodeBB/blob/v1.11.1/src/posts/tools.js#L10)
- 权限管理层：[privileges.posts.canDelete](https://github.com/NodeBB/NodeBB/blob/v1.11.1/src/privileges/posts.js#L158)
    - isAdminOrMod: 用户是否管理员或版主，是则可以删除；
    - 'posts:delete': 用户是否在权限群组内，不再则不允许删除；
    - isOwner: 用户是否是帖子的所有者，是则可以删除。

同样的，其他操作也会遵循这一个流程进行权限验证：

> 接口层 -> 模型层 -> 权限层

## 多重权限如何进行管理

### 增加角色

增加角色可以通过新建群组的方式来实现。

例如新建群组 g_test，然后授予其权限，比如：

- 全局(cid:0)允许该群组上传图片(upload:post:image)：

    `{_key: "group:cid:0:privileges:groups:upload:post:image:members"}`
    ![](https://img.alicdn.com/tfs/TB1r4TUBQPoK1RjSZKbXXX1IXXa-792-390.png_450x10000.jpg)
- 版块(cid:1)允许该群组查看已删除的帖子(posts:view_deleted)：

    `{_key: "group:cid:1:privileges:groups:posts:view_deleted:members"}`
    ![](https://img.alicdn.com/tfs/TB1j2fTBFzqK1RjSZFoXXbfcXXa-792-390.png_450x10000.jpg)

### 增加权限点

增加权限点通过编码的方式进行。以下是一个示例。

当前在应用内没有对“关注”进行权限控制。如果需要，得如何增加？

0. 在全局权限列表中添加 follow 字段：

    ![代码](https://img.alicdn.com/tfs/TB1hm4jB8LoK1RjSZFuXXXn0XXa-1452-696.png_620x10000.jpg)
    ![关注](https://img.alicdn.com/tfs/TB1eqBjBYvpK1RjSZFqXXcXUVXa-2386-1002.jpg_620x10000.jpg)
0. 在 user 模型的 follow 方法中添加权限控制流程

    ![代码](https://img.alicdn.com/tfs/TB11NRpBYrpK1RjSZTEXXcWAVXa-1456-878.png_620x10000.jpg)
0. 在权限管理层添加判断条件

    ![代码](https://img.alicdn.com/tfs/TB198poBYvpK1RjSZPiXXbmwXXa-1452-484.png_620x10000.jpg)

## 系统及用户设置

系统及用户级亦有限制和隐私的设置，例如：

- 系统级：发帖内容字数；
- 用户级：是否显示邮箱。

0. 系统设置：
    - 实现：[Config 类](https://github.com/NodeBB/NodeBB/blob/v1.11.1/src/meta/configs.js)
    - 获取系统设置：`{_key: "config"}`
0. 用户设置：
    - 实现：[User.settings](https://github.com/NodeBB/NodeBB/blob/v1.11.1/src/user/settings.js)
    - 获取某个用户的设置：`{_key: "user:{id}:settings"}`

## 参考

- [NodeBB Database Structure](https://github.com/NodeBB/NodeBB/wiki/Database-Structure)