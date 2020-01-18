/**
 * 路由汇总输出
 */
import Router from 'koa-router'
import approval from './approval'
import response from './response'

const router = new Router();

router.use(approval.routes(), approval.allowedMethods()).use(response.routes(), response.allowedMethods());

export default router