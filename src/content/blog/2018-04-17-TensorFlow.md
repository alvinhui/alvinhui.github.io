---
category : 计算机科学
title: "TensorFlow 从模型训练到在线预测"
description: "TensorFlow 从模型训练到在线预测"
tags : [机器学习]
---

<p align="center">
  <img alt="ICE" src="https://img.alicdn.com/tfs/TB1h9S0j_tYBeNjy1XdXXXXyVXa-1080-592.jpg" width="500" />
</p>

> 工欲善其事，必先利其器

在谈及机器学习、深度学习之前，我们首先要懂得如何利用工具开展我们的工作。本文将训练一个 TensorFlow 模型并部署到线上，读者由此可以学习到如何利用分布式计算平台进行机器学习算法的开发，并了解一般算法工程师的工具链路。

本文由笔者通过阅读文档和实践得来，如有错误之处或更好的实践，欢迎指出。

- 本文以上手实践为主，不会对文中的相关算法、产品、专有名词做过多解释；
- 本文争取在一篇文章内讲解完整个过程，在正文中除相关下载链接外已尽可能减少外链；
- 如有读者对上面两点的细节之处感兴趣，可参考文末附录。

## 涉及到的服务

- ODPS：大数据计算服务（现名 MaxCompute ，由于现有工具和中间件都仍以 ODPS 来命名，因此在本文中仍沿用该名）是阿里巴巴自主研发的海量数据处理平台。主要服务于批量结构化数据的存储和计算，可以提供海量数据仓库的解决方案以及针对大数据的分析建模服务。**在本文中使用它来做计算，相当于一台远程的超级计算机**；
- OSS：阿里云对象存储服务（Object Storage Service，简称 OSS），是阿里云提供的海量、安全、低成本、高可靠的云存储服务。**在本文中使用它来做模型文件的存储，相当于一个远程的超级硬盘**；
- PAI：PAI（Platform of Artificial Intelligence）平台，是 ODPS 推出的大数据机器学习计算引擎。**在本文中使用它来做 TensorFlow 的运行框架**；
- EAS：EAS 是基于阿里云相关云产品(ECS,EGS,SLB,RDS)构建，使用 Docker 进行资源管理和隔离，使用谷歌开源的 Kubernetes 进行任务的调度，支持云上的多种 CPU 和 GPU 型号，同时也支持用户本地调试和单机版本的预测服务。**在本文中使用它来搭建预测服务**。

阿里云提供的这些服务即有内部版本又有外部版本，内外版本的能力和文档均有差别。**本文所述以阿里内部版本为准**。

## 工具准备

本文设定工作目录为 `~/tools/`。

- 创建工作目录：

    ```cmd
    $ mkdir ~/tools
    ```
- 下载 [ODPS Console](http://odps.alibaba-inc.com/official_downloads/odpscmd/0.29.2/) 到工作目录，设 OPDS Console 的根目录是 `~/tools/odps_clt`；
- 下载 [OSS Browser](https://help.aliyun.com/document_detail/61872.html) 到工作目录；
- 安装 EAS：

   ```cmd
   $ sudo pip install -U http://easdata.oss-cn-hangzhou-zmf.aliyuncs.com/eascmd-1.4-py2-none-any.whl --index-url http://mirrors.aliyun.com/pypi/simple --trusted-host mirrors.aliyun.com --disable-pip-version-check
   ```
   > 注： 部分 Mac 用户需要安装 XCode 的 CommandLineTool，这是aliyun 的 SDK 所要求的。最简单的安装方法为执行 `xcode-select --install` 命令，更详细说明很容易百度到。

## 环境配置

- 获取你的 Accesss ID 及 Access Key：

    - 访问 https://pai.alibaba-inc.com/
    - ![拷贝指引](https://img.alicdn.com/tfs/TB188gQjGmWBuNjy1XaXXXCbXXa-2874-952.jpg)
- 确定你的 ODPS 项目：

    一般前端同学可能都没有 ODPS 项目：

    - FED 的同学如果想试用，可以尝试申请 [jstracker_dev](https://dw.alibaba-inc.com/#/home/result?chartSource=true&keyword=jstracker_dev&tableType=all) 项目的开发权限；
    - 也可以为你的前端团队[申请一个 ODPS 应用](https://tesla.alibaba-inc.com/odps/#/workflow/create-project/start)
- ODPS 配置：

    ```cmd
    $ vim ~/tools/odps_clt/conf/odps_config.ini
    ```

    复制粘贴以下代码，注意替换变量：

    ```
    # 指定进入的 ODPS 项目空间
    project_name=${your_odps_project_name} 

    # 用户的云账号信息
    access_id=${your_access_id}
    access_key=${your_access_key}

    # ODPS 服务的访问链接
    end_point=http://service-corp.odps.aliyun-inc.com/api
    ```
- 创建 OSS 文件夹用于存储模型文件：
    - 登陆 OSS Browser

        ![OSS Browser 登陆界面](https://img.alicdn.com/tfs/TB1lraJj_tYBeNjy1XdXXXXyVXa-1618-884.jpg)

        - Endpoint 选择自定义，填入弹内 endpoint（不知道什么是弹内？请直接填入 http://cn-hangzhou.oss.aliyun-inc.com）；
        - 复制黏贴你的阿里云 Access 信息。
    - 创建 Bucket：这里我创建了 wuji-xwt

        ![创建 Bucket](https://img.alicdn.com/tfs/TB1dIYJjMmTBuNjy1XbXXaMrVXa-2446-760.jpg)

        - 牢记你的 Bucket 名；
        - 区域选择：华东1杭州。
    - 创建目录：这里我创建了 models 

        ![创建目录](https://img.alicdn.com/tfs/TB1gi1Kj_tYBeNjy1XdXXXXyVXa-2456-456.png)
- OSS 授权 ODPS Project ：生成 RoleArn

    - 访问 https://pai.alibaba-inc.com/
    - ![生成 RoleArn](https://img.alicdn.com/tfs/TB1ICQIjKuSBuNjy1XcXXcYjFXa-2866-1134.jpg)
- EAS 配置：
    - 创建 EAS 配置文件：

        ```cmd
        $ vim ~/tools/eas_config.ini
        ```
        
        复制粘贴以下代码，注意替换变量：

        ```
        # 用户的云账号信息
        access_id=${your_access_id}
        access_key=${your_access_key}
        ```
    - 创建 OSS 相关的配置文件：部署预测服务时，EAS 将需要读取该文件来获取 OSS 权限信息，用于在服务运行时获取模型文件。

        ```cmd
        vim ~/tools/.osscredentials
        ```
        
        复制粘贴以下代码，注意替换变量：

        ```
        [OSSCredentials]
        host=cn-hangzhou.oss.aliyun-inc.com

        # 用户的云账号信息
        accessid=${your_access_id}
        accesskey=${your_access_key}
        ```

## 代码准备

- 测试代码 - [training_test.py](http://gitlab.alibaba-inc.com/wuji.xwt/tensorflow-test/raw/master/training_test.py)：

    使用了简单的 Softmax regression 模型针对 MINIST 数据集进行训练，主要用于测试训练服务的连通性。
- 示例代码 - [mnist_softmax.py](http://gitlab.alibaba-inc.com/wuji.xwt/tensorflow-test/raw/master/mnist_softmax.py)：

    使用了 Softmax 模型用于对 MNIST 图片进行分类，训练并导出模型。是本文全流程中的算法示例代码。

将代码拷贝到 `~/tools/`。

## 训练和部署

### 测试

先使用测试代码测试训练服务的连通性。

- 启动 ODPS Console：

    ```cmd
    $ ~/tools/odps_clt/bin/odpscmd
    ```
- 添加 `training_test.py` 到 ODPS 资源：

    ```cmd
    odps@ project_name> add file ~/tools/training_test.py
    ```
- 使用 PAI 进行训练：

    ```cmd
    odps@ project_name> pai -name tensorflow 
        -Dscript="odps://${project_name}/resources/training_test.py" 
        -Dvolumes="odps://algo_platform/volumes/mnist/train,odps://algo_platform/volumes/mnist/test"; 
    ```
- 在命令行中见到如下输出，代表此次训练执行成功：

    ![训练的 Console 输出](https://img.alicdn.com/tfs/TB1NFGFjMmTBuNjy1XbXXaMrVXa-1080-120.png)

### 训练模型

- 添加 `mnist_softmax.py` 到 ODPS 资源：

    ```cmd
    odps@ project_name> add file ~/tools/mnist_softmax.py
    ```
- 使用 PAI 进行训练：

    ```cmd
    odps@ project_name> pai -name tensorflow121
        -Dscript="odps://${project_name}/resources/mnist_softmax.py" 
        -Dvolumes="odps://algo_platform/volumes/mnist/train,odps://algo_platform/volumes/mnist/test" 
        -Dbuckets="oss://wuji-xwt/models/?role_arn=acs:ram::xxxxxx:role/xxx&host=cn-hangzhou.oss.aliyun-inc.com";
    ```

    - Dscript 填入 OPDS 上的 python 文件夹路径，请将 `${project_name}` 替换成你的项目名；
    - Dbuckets 字段填入训练后模型的 OSS 存储文件夹，注意 `role_arn` 参数填入上一步 OSS 授权 ODPS Project 生成的 RoleArn 。
- 在命令行中见到如下输出，代表此次训练执行成功：

    ![训练的 Console 输出](https://img.alicdn.com/tfs/TB1dcJMj_tYBeNjy1XdXXXXyVXa-1072-120.png)
- 检查 OSS 空间，会发现设定的目录下已经添加了模型文件：

    ![oss训练结果](https://img.alicdn.com/tfs/TB1_JJfj3mTBuNjy1XbXXaMrVXa-2444-514.png)

### 部署预测服务

- 配置创建的服务：

    ```cmd
    $ vim ~/tools/eas_mnist.json
    ```

    ```json
    {
        "name": "${your_model_name}",
        "generate_token": "false",
        "model_path": "oss://${your_bucket}/models/",
        "processor": "tensorflow_cpu",
        "osscredentials": "/Users/${your_name}/tools/.osscredentials",
        "metadata": {
            "region": "shanghai",
            "instance": 1,
            "cpu": 1,
            "memory": 2000
        }
    }
    ```
- 开始部署：

    ```cmd
    $ eascmd -c ~/tools/eas_config.ini create ~/tools/eas_mnist.json 
    ```
- 部署成功你将会在命令行中看到类似这样的输出：

    ![EAS部署记录](https://img.alicdn.com/tfs/TB1lQUSjKuSBuNjy1XcXXcYjFXa-2300-842.png)

### 测试预测服务

EAS 提供了 [Java SDK](https://lark.alipay.com/pai/eas/tf-service-call) 用于实现预测服务的 RESTful API 访问。

> Node.js 开发者，时代在召唤呀...

为方便起见，[这里](http://gitlab.alibaba-inc.com/wuji.xwt/tensorflow-test/tree/master/predict_python_client)实现了一个访问 Tensorflow 服务的 Python 客户端。请下载代码到 `~/tool/predict_python_client`，然后执行：

```cmd
$ python ~/tools/predict_python_client/client.py
```

如果命令执行成功，你将会看到类似如下的输出：

![python 客户端调用结果](https://img.alicdn.com/tfs/TB17f9Yj_tYBeNjy1XdXXXXyVXa-2052-836.png)

你成功了！

## 参考资料

- [ODPS](http://odps.alibaba-inc.com/doc.htm)
- [OSS](http://baike.corp.taobao.com/index.php/Oss_application)
- [PAI](https://lark.alipay.com/pai/tensorflow)
- [EAS](https://lark.alipay.com/pai/eas)
- [文中所有配置和源代码](http://gitlab.alibaba-inc.com/wuji.xwt/tensorflow-test/)

题图出处：不详，本文转自机器之心知乎专栏文章[《TensorFlow 发布面向 JavaScript 开发者的机器学习框架 TensorFlow.js》](https://zhuanlan.zhihu.com/p/35151153)（背景：当地时间 3 月 30 日，谷歌 TenosrFlow 开发者峰会 2018 在美国加州石景山开幕，TensorFlow 发布了面向 JavaScript 开发者的全新机器学习框架 TensorFlow.js）。