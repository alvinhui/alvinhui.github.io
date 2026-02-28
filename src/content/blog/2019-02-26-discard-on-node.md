---
category : front-end
title: "淘宝开发者社区上云记"
description: "如何在云端环境部署 Node 应用"
tags : [Node.js]
---

在 Serverless 理念如火如荼地被讨论的今天，如果你要上线一个全新的 Node.js 应用到公有云，将会是怎样的一种模式？笔者近期就上线了一个社区类应用，技术选型上采用了开源软件 [NodeBB](https://github.com/NodeBB/NodeBB)，由于是非标应用及安全性相关的原因，被迫上云。

在此过程中笔者经历了从零到一的上云之路，对云上的相关产品和开发链路有了一次较为完整的体验。其过程之繁琐，需自定义的环节之多，让笔者对 Serverless 相关的变革及云产品的整合有了更多的期待。

但是在当下，起码是最近半年，若是应用要上云恐怕绝大多数开发者还是得走笔者曾走过的这条路。本文即详尽地记录该过程，作为一种记录亦或者是操作教程，分享给有需要的同学。

## Aone 内 Node.js 应用的构建和部署

在上云之前，让我们简单地回顾一下在 Aone 环境 Node.js 应用是如何被构建和部署的。以 Midway 应用为例：

应用上线流程：

- 在上线流程单环节，将创建应用的研发流水线和申请机器资源；
- 基于 [Sigma](https://www.atatech.org/articles/90265) 进行资源调度。

构建环节：

- [@ali/midway](https://web.npm.alibaba-inc.com/package/@ali/midway) 
	- 依赖 => [@ali/midway-scripts](https://web.npm.alibaba-inc.com/package/@ali/midway-scripts)
	- 依赖 => [node-scripts](http://gitlab.alibaba-inc.com/node/node-scripts/tree/2.33.0)：[postinstall](http://gitlab.alibaba-inc.com/node/node-scripts/blob/2.33.1/postinstall.js)
		- 本地安装执行时，生成 [build.sh](http://gitlab.alibaba-inc.com/node/node-scripts/blob/2.33.1/tpl/build.sh)
		- Aone 构建时，生成 [Dockerfile](http://gitlab.alibaba-inc.com/node/node-scripts/blob/2.33.1/tpl/docker/Dockerfile_7u)
- alios7-nodejs 镜像：
	- [镜像仓库](http://docker.alibaba-inc.com/#/imageDesc/1999453/detail)
	- [代码代码](http://gitlab.alibaba-inc.com/node/base-image/blob/1.0.8/dist/Dockerfile-aliOS7-nodejs)
		- 安装 [nodejs-appctl](http://gitlab.alibaba-inc.com/node/nodejs-appctl)

部署环节：

通过 [nodejsctl pubstart](http://gitlab.alibaba-inc.com/node/nodejs-appctl/blob/nodejs-appctl_R_1_3_19_1702790_20181015/rpm/appname/bin/nodejsctl#L427) 启动应用。

## ECS：云服务器

开始上云，最先最容易想到的方式就是购买 ECS 主机然后部署应用。此时应用的架构是这样：

![](https://img.alicdn.com/tfs/TB13pUBICzqK1RjSZPcXXbTepXa-1672-1366.png)

* 首次部署上线：
	1. ECS 实例环境和 MongoDB 数据库创建；
	2. 发布代码到阿里云代码托管平台；
	3. 登录 ECS 实例，从阿里云代码托管平台拉取代码；
	4. 启动应用。
* 往后迭代：
	1. 发布代码到阿里云代码托管平台；
	2. 登录 ECS 实例，重启应用。

以下是通过 ECS 部署 NodeBB 的指引教程。

### 创建 ECS 实例

首先我们需要一个 ECS 实例。访问 [ECS 控制台](https://ecs.console.aliyun.com/) 点击“创建实例”。

> 如果没有开通过 ECS 服务，则需要先开通服务。
> 阿里云文档中已经有[关于 ECS 的详细介绍](https://help.aliyun.com/document_detail/25367.html)，这里不再解释。

以下是笔者的配置：

- 基础配置：
    - **计费方式**选择“[按量付费](https://help.aliyun.com/knowledge_detail/40653.html)”；
    - 地域和可用区（[如何选择](https://help.aliyun.com/knowledge_detail/40654.html)）：
        - 地域选择“华东1（杭州）”；
        - 可用区选择“随机分配”（请记录该可用区，后续创建 MongoDB 实例时选择同一可用区）。
    - 实例：
        - 架构选择“x86”；
        - 分类选择“入门级”；
        - 实例规格选择“ecs.t5-c1m4.large”（[突发性能实例](https://help.aliyun.com/document_detail/59977.html?spm=5176.ecsbuyv3.instance.5.315a3675YELqs5)）。
    - **镜像**选择“公共镜像” - “CenterOS/7.6/64位”；
    - 存储：（[如何选择](https://help.aliyun.com/document_detail/25382.html)）
        - 系统盘选择“高效云盘” - “20G”。
- 网络和安全组：
    - 网络
        - 选择“专有网络”（[什么是专有网络](https://help.aliyun.com/product/27706.html)）；
        - 创建一个专有网络。
    - 公网带宽：
        - 勾选“分配公网IPv4地址”；
        - 选择“按使用流量”付费。
    - 安全组：选择上一步专有网络创建的安全组。
- 系统配置：
    - 登录凭证：
        - 选择“自定义密码”（作为示例更方便管理，后续有需要可创建密钥对）；
        - 牢记密码。

创建实例完成后，默认会获得一个固定公网 IP ，可以使用该 IP 通过 SSH（22端口）或浏览器（80端口）访问该 ECS 实例：

![](https://img.alicdn.com/tfs/TB1S_XeIIbpK1RjSZFyXXX_qFXa-666-53.jpg)

### 创建 MongoDB 实例

其次，NodeBB 支持 Redis 和 MongoDB 作为数据存储，笔者这里选择了 MongoDB，因此需要创建一个 MongoDB 实例。

访问 [MongoDB 控制台](https://mongodb.console.aliyun.com/) 点击“创建实例”：

> 如果没有开通过 MongoDB 服务，则需要先开通服务。
> 阿里云文档中已经有[关于 MongoDB 的详细介绍](https://help.aliyun.com/product/26556.html)，这里不再解释。

- 选择“副本集（按量付费）”；
- 基本配置：
    - 地域和可用区的选择和上一步创建的 ECS 实例一致。
- 网络类型：
    - 专有网络和虚拟交换机的选择和上一步创建的 ECS 实例一致。
- 规格配置：规格：1核2G/存储空间：10G；
- 密码配置：立即设置并牢记密码。

#### 配置数据库

- 创建数据库和用户（也可以[通过 Mongo Shell](https://help.aliyun.com/document_detail/66127.html) 方式，笔者这里以[通过 DMS](https://help.aliyun.com/document_detail/93609.html) 为例）
    - 访问 MongoDB 控制台并进入实例；

        ![](https://img.alicdn.com/tfs/TB1KOPYEZbpK1RjSZFyXXX_qFXa-1260-457.jpg)
    - 点击登录数据库；

        ![](https://img.alicdn.com/tfs/TB1nafREYPpK1RjSZFFXXa5PpXa-1260-356.jpg)
    - 输入账号密码，数据库名称填入“admin”（MongoDB 默认数据库）；
    - 创建数据库，笔者命名为 club；

        ![](https://img.alicdn.com/tfs/TB1j6vZEZbpK1RjSZFyXXX_qFXa-829-493.jpg)
    - 创建用户（**阿里云数据库不允许使用 root 角色进行远程连接**，因此在此新建一个用户，赋予其 club 数据库的增删改查权限）：
        - 目标库：club；
        - 用户名：club；
        - 密码：xxx；
        - 当前库权限：read/readWrite/dbAdmin(选填)。
- 数据安全性 - 白名单设置（[参考](https://help.aliyun.com/document_detail/66111.html)）：
    
    将 ECS 实例 IP 设置为白名单，访问 [ECS 控制台](https://ecs.console.aliyun.com/)找到刚创建的实例的私有 IP：

    ![](https://img.alicdn.com/tfs/TB1trTYEYrpK1RjSZTEXXcWAVXa-914-80.jpg)

### 部署应用

安装必要的软件环境并启动 NodeBB。

#### 启用 Nginx

- 安装 Nginx（参考：[《How To Install Nginx on CentOS 7》](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-centos-7)）；
- 检查实例的安全组内配置规则，允许 80 端口访问：

	![](https://img.alicdn.com/tfs/TB1mXkmE4naK1RjSZFBXXcW7VXa-970-367.jpg)

	该规则默认已创建，如果没有则需创建（参考：[允许公网通过HTTP、HTTPS等服务访问实例](https://help.aliyun.com/document_detail/25475.html?#allowHttp)）：

	![](https://img.alicdn.com/tfs/TB1xdLtE9zqK1RjSZPcXXbTepXa-1228-505.jpg)
- 准备就绪，通过公网 IP 访问实例。看到如下的输出则代表 Nginx 已启用成功：

	![](https://img.alicdn.com/tfs/TB1Y6TtE9zqK1RjSZPcXXbTepXa-685-530.jpg_450x10000.jpg)
	
#### 初始化 NodeBB

- 安装 Node.js；
- 准备代码：
    - 将应用代码上传到[云效 - 代码托管](https://code.aliyun.com/)；
    - 安装 git（参考：[《Download for Linux and Unix》](https://git-scm.com/download/linux)）：`yum install git`；
    - 将代码下载到实例内：
    	- 在主机上[生成 SSH](https://code.aliyun.com/help/ssh/README)）；
    	- 在云仓库[增加 SSH 密钥](https://code.aliyun.com/profile/keys)。
- 初始化 NodeBB（初始化数据库、构建静态资源和生成 config.json 文件）：`./nodebb setup`
    - URL 填写实际的服务域名；
    - MongoDB connection URI 从实例的连接信息中获取，注意替换用户名、密码及数据库名为上一步中创建的信息；
    - 中间将需要设置论坛的管理员账号密码，需牢记。

    初始化过程：
    ![](https://img.alicdn.com/tfs/TB1anz_E7voK1RjSZFNXXcxMVXa-930-541.jpg)

    生成的 config.json（字段含义参考[《The NodeBB Config (config.json)》](https://docs.nodebb.org/configuring/config/)）：
    ![](https://img.alicdn.com/tfs/TB1Y0_.E9zqK1RjSZFpXXakSXXa-926-261.jpg)
- 使用 Cluster 模式启动应用：
    - 对 NodeBB 源码进行阅读，了解其启动过程：
        - [cli-start](https://github.com/NodeBB/NodeBB/blob/v1.11.2/src/cli/index.js#L116)
        - [runing-start](https://github.com/NodeBB/NodeBB/blob/v1.11.2/src/cli/running.js#L30)
        - [path-loader](https://github.com/NodeBB/NodeBB/blob/v1.11.2/src/cli/paths.js#L13)
        - [loader-start](https://github.com/NodeBB/NodeBB/blob/v1.11.2/loader.js#L111)
        - [app.js](https://github.com/NodeBB/NodeBB/blob/v1.11.2/app.js)
        - [start.js](https://github.com/NodeBB/NodeBB/blob/v1.11.2/src/start.js)

        很容易就能看出 NodeBB 的启动流程支持 Cluster 模式。
    - 配置 config.json 中 `port` 为数组即可：

        ![](https://img.alicdn.com/tfs/TB1jusCE4naK1RjSZFBXXcW7VXa-930-217.jpg)

        由于我们的实例规格是 2 核，因此配置了 2 个启动端口。
    - 启动 NodeBB：

        - `./nodebb start`；
        - `ps -ef | grep node`；

        ![](https://img.alicdn.com/tfs/TB1ZPUuEY2pK1RjSZFsXXaNlXXa-2050-664.jpg)

### Nginx 配置和重启

- 配置请参考：[《Configuring nginx as a proxy: Basic with multiple ports》](https://docs.nodebb.org/configuring/proxies/nginx/)，重点是：
	- Socket.IO 的配置；
	- 多节点的配置（参考：[《Socket.IO: Sticky load balancing》](https://socket.io/docs/using-multiple-nodes/#NginX-configuration)）。
- 重启 nginx：`service nginx restart`；
- 查看 nginx 运行状态：`service nginx status`。
- 通过公网访问检验：

	![](https://img.alicdn.com/tfs/TB1A7ICE9zqK1RjSZFLXXcn2XXa-972-1018.jpg_450x10000.jpg)

### 域名映射及 HTTPS 配置

- 域名映射：通过 [IDNS](http://idns.alibaba-inc.com) 将 club.developers.taobao.com A 记录 到 公网 IP（参考：[《IDNS 基本操作流程》](https://yuque.alibaba-inc.com/adms/te885n/ees8nl)）。

    ![](https://img.alicdn.com/tfs/TB1qdAGE4TpK1RjSZFMXXbG_VXa-972-1000.jpg_450x10000.jpg)
- HTTPS 配置：

    - 申请和下载证书：在 [cert 平台](https://cert.alibaba-inc.com/) 操作，申请和下载证书都需要走审批流程（参考：[《域名自行接入https证书》](https://yuque.antfin-inc.com/alccih/armc/net_conf_https#lwwgrq)）。

        ![](https://img.alicdn.com/tfs/TB1YxZDEY2pK1RjSZFsXXaNlXXa-904-546.jpg_450x10000.jpg)
    - 将证书和私钥上传到 ECS 实例（可通过 git）；
    - 修改 Nginx 配置（参考：[《Configuring nginx as a proxy: Basic with SSL》](https://docs.nodebb.org/configuring/proxies/nginx/)），重点关注：

        - 80 端口的 302 跳转；
        - ssl_certificate/ssl_certificate_key/ssl_ciphers 字段的填写。
    - 通过公网访问验证：https://club.developers.taobao.com 。

## EDAS：企业级分布式应用服务

部署在 ECS 实例后应用仅仅处于「可用」的状态，还面临着如下问题和隐患：

1. 迭代能力不足，无法优雅终止和快速启动应用 —— 每次重新部署都将会造成应用不可用；
2. 健壮性不足，物理或系统出现的问题将可能导致应用不可用；
3. 并发性不足，虽然在网站前期不会是瓶颈，但单机的模式扩容有其上限。

很容易就能想到使用容器化技术和集群模式。

这就可以应用 Docker 和 Kubernetes（以下简称 k8s），阿里云提供了容器服务 Kubernetes 版。此时应用的架构是这样：

![](https://img.alicdn.com/tfs/TB1J6dXIQvoK1RjSZFNXXcxMVXa-1774-1364.png)

* 首次部署：
	* 创建 k8s 集群，将集群控制权授予 EDAS；
	* 创建镜像仓库，通过发布 git 标签触发构建镜像；
	* 创建 EDAS 应用，关联镜像，部署应用：；
	* 添加负载均衡，允许公网访问 EDAS 应用。
* 往后迭代：
	* 通过发布 git 标签触发构建镜像；
	* 访问 EDAS 应用，访问新版本镜像进行重新部署。

参考：

- [什么是 Docker？](https://www.redhat.com/zh/topics/containers/what-is-docker)
- [什么是 Kubernetes？](https://www.redhat.com/zh/topics/containers/what-is-kubernetes)
- [什么是阿里云容器服务 Kubernetes 版？](https://help.aliyun.com/document_detail/86737.html)

以下是通过 EDAS 部署 NodeBB 的指引教程。

### 创建 Kubernetes 集群

首先我们需要一个 k8s 集群用于部署我们的应用。访问[创建 Kubernetes 集群](https://cs.console.aliyun.com/#/k8s/cluster/create/dedicated)：

- 地域选择“华东 1”；
- 可用区选择“可用区 G”；
- 专有网络选择和上一步“ECS 部署”的一致（因为接下来将需要连接 MongoDB）。

参考：

- [如何创建 Kubernetes 集群？](https://help.aliyun.com/document_detail/86488.html)：
- [如何创建 Kubernetes 托管版集群？](https://help.aliyun.com/document_detail/95108.html)
	> 相比于默认的 Kubernetes 集群，托管版本会主动替您运维一套高可用的 Master 组件，免去了默认版本集群中三个 Master ECS 节点，从而节约所需的资金成本及维护时的人力成本。-- [《使用 Terraform 创建托管版 Kubernetes》](https://yq.aliyun.com/articles/681954)
- [如何创建多可用区 Kubernetes 集群？](https://help.aliyun.com/document_detail/86493.html)
	> 为了保证业务应用的高可用，有些客户会要求关键应用部署到多个机房，一个机房一旦出问题，其他机房正常工作，从而让应用保持不间断连续运行。阿里云支持多 Region（地域），每个 Region 下又有不同的可用区。可用区是指在同一地域内，电力和网络互相独立的物理区域。多可用区能够实现跨区域的容灾能力。同时也会带来额外的网络延时。

### 创建 Docker 镜像

紧接着，我们需要构建出应用的 Docker 镜像。访问[容器镜像服务控制台](https://cr.console.aliyun.com/)：

- 创建镜像仓库
	- 代码仓库选择上一步“ECS 部署”中的仓库；
	- 勾选“代码变更时自动构建镜像”。
- 构建镜像
    - 在代码仓库的根目录下创建配置文件 `config.json`：
    
		```
		{
			"url": "http://club.developers.taobao.com",
			"secret": "xxx",
			"database": "mongo",
			"mongo": {
				"uri": "mongodb://xxxx"
			},
			"port": "4567"
		}
		```
	- Dockerfile 中使用配置文件启动 NodeBB：
		
		```
		FROM node:8.15.0@sha256:cb66110c9c7d84bae9a6db8675f49d5c9e34d528023ef185b186e29ae5461051

		RUN mkdir -p /usr/src/app
		WORKDIR /usr/src/app

		ARG NODE_ENV
		ENV NODE_ENV $NODE_ENV
		COPY install/package.json /usr/src/app/package.json
		RUN npm install && npm cache clean --force
		COPY . /usr/src/app

		ENV NODE_ENV=production \
			daemon=false \
			silent=false

		RUN ./nobebb build
		CMD ./nodebb start

		EXPOSE 4567
		```
	- 通过发布标签触发镜像构建：`release-v$version`：

		![](https://img.alicdn.com/tfs/TB1Oq4lHCzqK1RjSZPxXXc4tVXa-895-510.jpg)
	
### 创建 EDAS 应用

然后我们创建一个 EDAS 应用，并使用刚创建的镜像部署该应用。访问 [EDAS 控制台](https://edas.console.aliyun.com/)：

- 访问“EDAS - 资源管理 - 集群”：导入刚创建的 K8S 集群；
- 访问“EDAS - 应用管理 - 应用列表”：创建新应用：
	- 集群类型：选择“容器服务K8S集群” - 选择刚导入的 K8S 集群；
	- 镜像：选择上一步构建的镜像和版本。
- 配置应用：
	- 添加负载均衡（公网）：

		![](https://img.alicdn.com/tfs/TB1EUlZHwHqK1RjSZFEXXcGMXXa-1037-461.jpg)
	- 通过负载均衡 IP 验证应用部署是否成功。

### 配置负载均衡

最后，我们在负载均衡层强制启用 HTTPS，并将域名解析到负载均衡的公网 IP。

访问[负载均衡控制台](https://slb.console.aliyun.com/)操作：

- 创建证书：
	- 访问“负载均衡 - 实例 - 证书管理”；
	- 点击创建证书；
	- 选择“上传第三方签发证书“；
	- 上传“ECS 部署”章节中下载的证书。
- 负载均衡配置：
	- 通过 IP 找到对应的负载均衡实例；
	- 添加 HTTPS 监听（参考[《如何添加 HTTPS 监听》](https://help.aliyun.com/document_detail/86438.html)）：
		- 协议选择“HTTS”；
		- 监听端口输入“443”；
		- 高级配置中，开启会话保持；
		- SSL 证书选择上一步创建的证书；
		- 后端服务器选择“虚拟服务器组”。
	- 删除原 TCP 80 的监听；
	- 添加 HTTP 监听：
		- 协议选择“HTTP”；
		- 监听端口输入“80”；
		- 高级配置开启“监听转发”；
		- 目的监听选择“HTTPS 443”。
	- 通过 HTTPS 访问 IP 验证负载均衡配置成功：

		![](https://img.alicdn.com/tfs/TB1qyRZHCzqK1RjSZFHXXb3CpXa-420-548.jpg)
- 域名映射：通过 [IDNS](http://idns.alibaba-inc.com) 将 club.developers.taobao.com A 到负载均衡公网 IP。

## 云效：一站式企业协同研发

使用 EDAS 已经在一定程度上加强了我们应用的迭代能力、健壮性和并发性，但是在多人协作、持续集成、持续交付上依然空缺。阿里云上有没有类似 Aone 的研发协同平台？答案是[云效](https://www.aliyun.com/product/yunxiao)。不过云效并不会在创建应用时自动为我们分配机器资源，也没有像 Aone 那样有沉淀的 Node.js 标准镜像和构建、部署脚本。

### 创建 Kubernetes 集群

与 Aone 创建应用自动分配机器资源不同，在云效内需要自己创建集群资源，并授予云效进行管理。例如，笔者参考Aone 的设置，搭建了日常、预发、线上集群：

![](https://img.alicdn.com/tfs/TB1NjaRHwHqK1RjSZFPXXcwapXa-893-250.jpg)

操作步骤如下：

- 创建日常、线上专有网络；
- 线上专有网络配置线上和预发交换机；
- 创建日常集群，创建预发集群（选择线上专有网络预发交换机），创建线上集群（选择线上专有网络线上交换机）。

这样便做到了日常与线上环境的隔离，预发和线上环境的隔离：

![](https://img.alicdn.com/tfs/TB1e79eIQvoK1RjSZFNXXcxMVXa-298-272.jpg)
![](https://img.alicdn.com/tfs/TB1jg1UHpYqK1RjSZLeXXbXppXa-492-223.jpg)

> 这里还有一个命题是，如何实现日常和预发环境只允许特定的客户端进行访问？目前通过负载均衡连接 VPC 的方式，只要知道了负载均衡 IP ，任何客户端都可以访问我们日常和预发环境的应用，这是我们不希望的。

### 创建 MongoDB 实例

为了和日常、线上环境配合，我们可以创建两个 MongoDB 数据库，并将两个数据库设置在日常和线上专有网络。如何创建请参考上文中“ECS - 创建 MongoDB 实例”章节。

### 创建镜像仓库

应用构建依赖容器镜像服务，在创建应用时就需要指定镜像仓库，因此我们提前创建。

- 访问 [Aliyun Code 新项目](https://code.aliyun.com/projects/new)来创建镜像的代码仓库（创建镜像仓库时需关联一个代码仓库）：

	![](https://img.alicdn.com/tfs/TB15Z1sHrrpK1RjSZTEXXcWAVXa-1281-596.jpg)
- 访问容器镜像服务控制台，创建镜像仓库：

	![](https://img.alicdn.com/tfs/TB1YDiiHCrqK1RjSZK9XXXyypXa-754-445.jpg)
	
### 创建云效应用

在云效创建应用的过程与 Aone 类似，遵循项目 - 应用的结构，此前的过程不再赘述。这里简单罗列创建 Node.js 应用的配置：

- 基本信息：
	- 开发模式：选择“分支模式”（参考：[《什么是分支模式》](https://help.aliyun.com/document_detail/59315.html)），该模式与 Aone 一致；
- 配置代码库：
	- 代码源：选择“Aliyun”；
	- 仓库：选择“关联已有”；
	- 地址：输入前面“ECS 部署”章节的代码仓库地址；
- 应用模板：**该步骤将会向代码仓库内写入 `应用名.release` 文件，该文件将会在构建阶段被读取用于决定构建过程。**
	- 编程语言：选择“NodeJS”；
	- 部署选项：选择“Kubernetes 部署”；
	- 选择 Node 模板。
- 构建配置：
	- 勾选“Docker构建”；
	- 选择上一步创建的镜像仓库。

### 配置流水线

与 Aone 已有“日常 - 预发 - 线上”默认的流水线及各环节的构建和部署配置不同，在云效内我们需要手动配置这些信息。

我们参照 Aone 配置了三条**流水线**：

![流水线](https://img.alicdn.com/tfs/TB1Yt5qIQvoK1RjSZFNXXcxMVXa-457-104.png)

以日常流水线为例，需要配置最基本的两个**阶段**：构建和部署。

- 构建配置：![构建配置](https://img.alicdn.com/tfs/TB1PUGwIIfpK1RjSZFOXXa6nFXa-1025-814.png)
	- 构建配置文件（即在创建应用阶段写入仓库根目录的 "应用名.release"）：参考：[《Web 应用构建配置
》](https://help.aliyun.com/document_detail/59293.html)

		```
		# 指定构建时的语言类型
		code.language=node8.x
		# Docker 镜像构建之后 push 的仓库地址
		docker.repo=registry.cn-hangzhou.aliyuncs.com/taobao_developers/club-image
		# 构建时执行的命令
		build.command=sh bin/build.sh
		# 构建 Docker 镜像时传入的变量名称和值，在 Dockerfile 可以试用这些变量
		build.tools.docker.args=--build-arg APP_NAME=${APP_NAME} --build-arg PACKAGE_LABEL=${PACKAGE_LABEL}
		```
	- 包标签：根据不同的标签实现不同的 Dockerfile 构建不同的包，这里主要目的是为了针对不同的环境构建不同包。（参考：[《使用传入参数改变构建行为》](https://help.aliyun.com/document_detail/59297.html)）
- 部署配置（云效将根据这些配置将构建好的包进行下发并部署）：![部署配置](https://img.alicdn.com/tfs/TB1Ca5LINjaK1RjSZKzXXXVwXXa-631-690.png)
	1. 将 k8s 集群导入到云效，选择需要部署的集群；
	2. 如果是首次配置，则需要新建服务，保存时云效将创建 k8s 的 service 资源，并在首次部署时创建 k8s 的 deployment 资源：![新建服务](https://img.alicdn.com/tfs/TB1jNKtIMHqK1RjSZFkXXX.WFXa-962-360.png)	
		- 类型选择“LoadBalancer”即负载均衡；
		- 服务端口，即负载均衡监听的端口；
		- 容器端口即启动的 Docker 容器监听的端口

### 构建和启动脚本

在 Aone 内 begg 和 midway 已经为我们封装好了镜像、构建和部署脚本的细节，在云效的上线流程中其过程相似，但相关的环节则需要自定义。

在仓库根目录创建如下文件，定义构建和启动脚本

- 构建脚本（`/bin/build.sh`）：在 club.release 中指定，在构建环境将被执行。主要是安装依赖和构建 Nodebb 资源（参考：[《NodeBB Development》](https://docs.nodebb.org/development/)）；
	
    ```sh
	echo "Target environment is ${PACKAGE_LABEL}"
	npm config set registry https://registry.npm.taobao.org
	npm install --production || exit 1
	./nodebb build -c config.${PACKAGE_LABEL}.json || exit 1
	echo "All building process done."
	```
- `/Dockerfile`：主要是安装 Nginx 和 Node.js ，复制启动脚本之类工作。
	- `/bin/start.sh`：启动脚本，启动 NodeBB 和 Nigix。

然后在云效新建特效分支，提交到集成，进行一次流水线的部署，云效便会构建并下发创建 k8s 应用：

- ![](https://img.alicdn.com/tfs/TB1VzqKIFzqK1RjSZSgXXcpAVXa-833-328.jpg)
- ![](https://img.alicdn.com/tfs/TB10oSFISzqK1RjSZFLXXcn2XXa-1154-250.jpg)
- ![](https://img.alicdn.com/tfs/TB1L4GUINjaK1RjSZFAXXbdLFXa-1178-313.jpg)

### 监控和日志

在应用上线后，为确保应用在持续健康地运行，还需要有相应的监控及日志（在出现问题时进行现场回溯）。在集团内部，[Sandbox](https://sandbox.alibaba-inc.com/) 为我们提供了全链路的监控能力。

在云上，有云监控、业务实时监控服务、日志服务。以下简单介绍一下如何接入和查看指标。

#### 日志服务

在 k8s 集群已开通日志服务的前提下，可以针对集群内的应用进行日志配置。点击应用编辑即可进行配置，首次点击保存 k8s 服务将会自动创建[日志服务](https://sls.console.aliyun.com)。

例如笔者就针对应用级别、标准输出进行了存储：

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/195/1551160064573-deb878a7-3a83-464b-8a25-8ec2d25daacb.png) 

保存后访问阿里云日志服务控制台即看到相关的日志服务已创建：

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/195/1551160568687-3b0b80f0-d49c-4264-aeda-39a8abccdd86.png) 

点击查询即可看到相应的日志，例如笔者配置的 NodeBB 应用日志：

![](https://img.alicdn.com/tfs/TB1DRACIMHqK1RjSZJnXXbNLpXa-1052-623.jpg)

更多内容可参考：[《使用日志服务进行Kubernetes日志采集》](https://help.aliyun.com/document_detail/87540.html)

#### 云监控

对于每个应用，可以通过 k8s 容器服务与[云监控](https://help.aliyun.com/product/28572.html)的集成，提供监控功能查看应用的资源使用情况。还可以通过可用性监控快速发现本地或依赖的远程服务无响应的情况。

![](https://img.alicdn.com/tfs/TB1vFcBIFzqK1RjSZFCXXbbxVXa-1296-791.jpg)

#### 前端监控

使用[业务实时监控服务](https://arms.console.aliyun.com/)可从页面打开速度（测速）、页面稳定性（JS Error）和外部服务调用成功率（API）这三个方面监测 Web 页面的健康度。接入后在应用控制台审视相关数据：

![](https://img.alicdn.com/tfs/TB11h3sIPDpK1RjSZFrXXa78VXa-1668-598.jpg)

更多内容可参考：[《前端监控接入概述》](https://help.aliyun.com/document_detail/106086.html)

## NodeBB 相关

除此之外，笔者还踩了一些 NodeBB 的定制的坑，在此分享给有需要的同学。

### Scoket.io 长连接保持

主要是两个配置：

- SLB 配置会话保持（参考：[《会话保持常见问题》](https://help.aliyun.com/knowledge_detail/55202.html)）；
- k8s 服务配置（参考：[《Kubernetes 下实现 socket.io 的集群模式》](https://www.qikqiak.com/post/socketio-multiple-nodes-in-kubernetes/)）：
    - sessionAffinity: ClientIP
    - externaltrafficpolicy: Local

### Taobao OAuth 2.0 登录

笔者已封装 [nodebb-plugin-sso-taobao](https://web.npm.alibaba-inc.com/package/nodebb-plugin-sso-taobao) 插件，只需要申请并填写 Appkey 信息即可使用。

- 访问 https://open.taobao.com/ 申请应用，得到 Appkey；
    也可走流程[申请内部应用](https://bpms.alibaba-inc.com/workdesk/instStart?processCode=top_internal_app_new)；
- 申请 API：
    - 访问 http://api.alibaba-inc.com/ ；
    - 在“权限包管理”内搜索 [taobao.user.identity.get](http://api.alibaba-inc.com/api/rest/preview?apiId=163503) API；
    - 授权 Appkey。
- 如果你还需要允许小二账号通过 OAuth 2.0 授权登录，还需要联系慈来团队说明业务场景，手动授予你的应用该权限。
	
### 皮肤加载 Google 资源问题

NodeBB 的前端基于 [Bootstrap](https://github.com/twbs/bootstrap) 实现，皮肤方案则使用了 [bootswatch](https://github.com/thomaspark/bootswatch)。bootswatch 中的一些皮肤（例如 [simplex](https://github.com/thomaspark/bootswatch/blob/v3.3.7/simplex/bootswatch.less#L5)）使用了 Google 的字体资源。这些资源由于网络原因在国内无法加载，将会造成网页的渲染阻塞。

在 NodeBB@1.11.x 版本中，目前笔者还没有比较好的办法解决这一问题。唯一的方法就是不使用皮肤，如果确实希望复用某个皮肤的样式，可以通过创建 NodeBB 主题（参考：[《如何创建主题》](https://docs.nodebb.org/development/themes/)）的方式，将这些资源放入主题包中。

## 相关链接

- 阿里云相关产品
    - [云效](https://rdc.aliyun.com/my)
    - [云数据库 MongoDB 版（ApsaraDB for MongoDB）](https://mongodb.console.aliyun.com/)
    - [弹性伸缩（Auto Scaling）](https://ess.console.aliyun.com/)
    - [NAT 网关（NAT Gateway）](https://www.aliyun.com/product/nat)
    - [容器镜像服务（Container Registry）](https://cr.console.aliyun.com/)
    - [容器服务 Kubernetes 版（Container Service for Kubernetes）](https://cs.console.aliyun.com/)
    - [负载均衡（Server Load Balancer）](https://slb.console.aliyun.com/)
    - [企业级分布式应用服务（Enterprise Distributed Application Service, 简称 EDAS）](https://edas.console.aliyun.com/)
    - [专有网络（Virtual Private Cloud，简称 VPC）](https://vpc.console.aliyun.com/)
    - [日志服务（Log Service，简称 LOG）](https://sls.console.aliyun.com)
    - [云服务器（Elastic Compute Service，简称 ECS）](https://ecs.console.aliyun.com/)
    - [资源编排服务（Resource Orchestration Service，简称 ROS）](https://ros.console.aliyun.com/)
    - [弹性公网IP（Elastic IP Address，简称 EIP）](https://ip.console.aliyun.com/)
    - [业务实时监控服务（Application Real-Time Monitoring Service，简称 ARMS）](https://arms.console.aliyun.com/)
    - [云监控（CloudMonitor）](https://cloudmonitor.console.aliyun.com/)
- [阿里云企业控制台](https://enterprise.console.aliyun.com/)
- [Taobao YUM](http://yum.corp.taobao.com/)

## 致谢

[钉钉社区](https://club.dingding.xin/)是笔者已知的集团内应用于外部用户的 NodeBB 应用。在笔者开发过程中，钉钉社区的开发同学 @消珥 提供了非常多有益的建议和帮助，在此表示感谢。