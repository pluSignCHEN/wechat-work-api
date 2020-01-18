import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import xmlParser from 'koa-xml-body'
import error from 'koa-json-error'
import cors from '@koa/cors'
import mongoose from 'mongoose'

import router from './router/index'

/*连接数据库*/
mongoose.connect('mongodb://localhost:27017/qywechat', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('connect to mongodb:qywechet success')
  }, (err) => {
    throw new Error(err)
  })


/*服务*/
const app = new Koa();

//..CORS配置
app.use(cors({
  allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS']
}))

//..统一错误相应格式
app.use(error({
  postFormat: (e, {
    stack,
    ...rest
  }) => process.env.NODE_ENV === 'production' ? rest : {
    stack,
    ...rest
  }
}))

//..处理未经处理的错误
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.throw(err)
  }
})

app.use(xmlParser())
app.use(bodyParser())

app.use(router.routes()).use(router.allowedMethods())

app.listen(8081, () => {
  console.log('server is running on 8081')
});