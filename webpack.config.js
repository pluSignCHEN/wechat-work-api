const path = require('path')

module.exports = {
  mode: 'production',									                //	设置环境为生产环境
  entry: {
    app: path.resolve(__dirname, './src/server.ts'),	//	项目的入口文件
  },
  target: 'node',										                  //	重要！编译目标需要设置为node
  output: {
    path: path.resolve(__dirname, 'dist'),				    //	项目的打包输出地址
    filename: 'server.js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']					      //	设置此项后，可以省略这三种文件的后缀名
  },
  module: {
    rules: [{
      test: /\.ts$/,                                  //	重要！webpack需要ts-load解析ts文件
      loader: 'ts-loader'
    }]
  },
  plugins: []									                        //	这里可以配置插件
};