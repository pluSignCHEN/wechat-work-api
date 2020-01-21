##  企业微信接口转发

####  项目的依赖与功能

- koa
- koa-router
- koa-bodyparse
- koa-xml-parser
- @koa/multer 处理文件上传
- @koa/cors 处理跨域
- request-promise 异步发起httpXmlRequest
- koa-json-error 错误信息处理
- @hapi/joi 参数校验

####  命令

- npm install -g nodemon ts-node webpack webpack-cli 全局安装启动和打包依赖
- npm install   安装项目依赖
- npm run dev   启动服务
- npm run build 打包

####  需要注意的点

- 项目由于使用了@hapi/joi进行参数校验，需要使用nodejs 版本号大于12
- 如果需要项目的打包功能，需要全局安装<code>webpack</code>和<code>webpack-cli</code>
- 项目可以使用webpack进行打包，打包时会将除了nodejs原生模块（如fs等）之外的依赖模块都打包进去，但此时可能会报如下错误：

报错信息：

    ERROR in ./node_modules/_@hapi_joi@17.0.2@@hapi/joi/lib/errors.js 253:10
    Module parse failed: Unexpected token (253:10)
    You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
    |     }
    |
    >     isJoi = true;
    |     name = 'ValidationError';
    |
    @ ./node_modules/_@hapi_joi@17.0.2@@hapi/joi/lib/index.js 9:15-34
    @ ./src/router/approval/index.ts
    @ ./src/router/index.ts
    @ ./src/server.ts

处理方法： 定位到 ./node_modules/_@hapi_joi@17.0.2@@hapi/joi/lib/errors.js 253:10，将

    constructor(message, details, original) {

        super(message);
        this._original = original;
        this.details = details;
    }

    isJoi = true;
    name = 'ValidationError'

改为：

    constructor(message, details, original) {

        super(message);
        this._original = original;
        this.details = details;
        this.isJoi = true;
        this.name = 'ValidationError';
    }
