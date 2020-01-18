/**
 * 工具类
 */
import {
  ParameterizedContext
} from 'koa'

import  {
  IRouterParamContext
} from 'koa-router'

/**
 * 处理 ajax 返回信息的方法
 * @method  handleRep
 * @param {any} rep request-promise的结果
 * @param {ParameterizedContext} ctx  context
 * @param {number} code 消息响应码
 */
function handleRep(rep: any, ctx: ParameterizedContext<any, IRouterParamContext<any, {}>>, code: number): void {
  if (rep.errcode === 0) {
    ctx.body = rep
  } else {
    ctx.throw(code, `${rep.errcode} : ${rep.errmsg}`)
  }
}

export {
  handleRep
}