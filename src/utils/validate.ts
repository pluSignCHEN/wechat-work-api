import {ParameterizedContext} from 'koa'
import {IRouterParamContext} from 'koa-router'
import {ObjectSchema} from '@hapi/joi'


/**
 * 基于@hapi/joi的参数校验中间件
 * @param schema Joi-schema, 详情查看hapi/joi
 * @param params 需要校验的参数
 * @param ctx context
 */
function verifyParams(schema: ObjectSchema, params: object,  ctx: ParameterizedContext<any, IRouterParamContext<any, {}>>){
  const {error} = schema.validate(params, {
    convert: false, //..尝试将值转换为期望类型，这里设置为false
    allowUnknown: true, //..是否接受期望外的字段，这里设置为true
    abortEarly: false //..检测到第一个错误时是否直接返回，这里设置为false
  })
  if (typeof error !== 'undefined') {
    ctx.throw(422, error.details)
  }
}

export default verifyParams