- 前端技术方案
    - angular
    - gulp
- 文件目录结构
    - mall/
        - res/ #资源文件目录
            - ...
        - diretive/ #自定义指令
                  - ...
        - fonts/ #系统字体文件
                   - ...
        - js/ #基础文件
            -/lib #应用库
            -/main.js #主程序
            -/app.js #应用程序
             - ...
        - less/ # 样式文件
             - ...
        - modules/ #业务模块
            - ...
        - ...
- 本地搭建流程
    1. 安装 **[node.js](http://nodejs.org/)**
    - 全局安装gulp:
        - **npm install -g gulp**
    - 全局安装bower
        - **npm install -g bower**
    - 项目根目录下安装依赖包
        - **npm install**
    - 构建命令：
        - **生产环境**: **gulp prod**
        - **开发环境**: **gulp dev**

