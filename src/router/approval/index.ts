/**
 * 与审批应用相关的功能实现
 * GET  /template 根据模板ID获取模板
 * POST /apply  提交审批单
 * GET  /departments 获取部门列表
 * GET  /department-users 根据部门ID获取部门用户
 * GET  /detail  根据审批单号获取审批详情
 * GET /allApproval 获取所有审批记录
 * GET /media 获取附件
 * POST /media 上传附件
 */

import Router from 'koa-router'
import Access_Key from '../../utils/access_key'
import ajax from 'request-promise'
import multer from '@koa/multer'
import Joi from '@hapi/joi'
import {
  findAllApproval
} from '../../db/approval'
import {
  handleRep
} from '../../utils/tool'
import verifyParams from '../../utils/validate'

const upload = multer({ //..定义上传功能的配置
  limits: {
    fileSize: 20*1024*1024,  //..上传的文件最大值为20M，
    files: 5  //..单次上传的文件最大数为 5
  }
})

const Access_key = new Access_Key('approval')
let token: string | undefined;

const router = new Router({
  prefix: '/approval'
});

router.use(async (ctx, next) => { //..请求统一获取 access_key
  try {
    token = await Access_key.getAccessKey();
    // console.log(token)
    await next();
  } catch (e) {
    ctx.throw(403, e);
  }
})

router.get('/template', async ctx => { //..根据模板ID获取模板
  const schema = Joi.object({
    id: Joi.string().required()
  })
  verifyParams(schema, ctx.query, ctx)
  const {
    id
  } = ctx.request.query;
  let rep = await ajax({
    method: 'POST',
    uri: `https://qyapi.weixin.qq.com/cgi-bin/oa/gettemplatedetail?access_token=${token}`,
    body: {
      template_id: id
    },
    json: true
  })
  handleRep(rep, ctx, 404)
});

router.post('/apply', async ctx => { //..提交审批
  const schema = Joi.object({
    creator_userid: Joi.string().required(),
    template_id: Joi.string().required(),
    approver: Joi.array().items(
      Joi.object().keys({
        userid: Joi.array().items(Joi.string().required()).required(),
        attr: Joi.number().required()
      }).required()
    ).required(),
    notifyer: Joi.array().items(
      Joi.string().required()
    ),
    notify_type: Joi.number(),
    apply_data: Joi.object().keys({
      contents: Joi.array().items(
        Joi.object().keys({
          control: Joi.string().required(),
          id: Joi.string().required(),
          value: Joi.object().required()
        }).required()
      ).required()
    }).required(),
    summary_list: Joi.array()
  })
  verifyParams(schema, ctx.request.body, ctx)
  let rep = await ajax({
    method: 'POST',
    uri: `https://qyapi.weixin.qq.com/cgi-bin/oa/applyevent?access_token=${token}`,
    body: ctx.request.body,
    json: true
  })
  handleRep(rep, ctx, 404)
})

router.get('/departments', async ctx => { //..获取部门列表
  let rep = await ajax({
    method: 'GET',
    uri: `https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=${token}`,
    json: true
  })
  handleRep(rep, ctx, 404)
})


router.get('/department-users', async ctx => { //..根据部门ID获取部门成员
  const schema = Joi.object({
    departmentId: Joi.string().required()
  })
  verifyParams(schema, ctx.query, ctx)
  const {
    departmentId
  } = ctx.request.query
  let rep = await ajax({
    method: 'GET',
    uri: `https://qyapi.weixin.qq.com/cgi-bin/user/simplelist?access_token=${token}&department_id=${departmentId}&fetch_child=0`,
    json: true
  })
  handleRep(rep, ctx, 404)
})

router.get('/detail', async ctx => { //..根据审批单号获取审批单详情
  const schema = Joi.object({
    approvalNo: Joi.string().required()
  })
  verifyParams(schema, ctx.query, ctx)
  const {
    approvalNo
  } = ctx.request.query
  let rep = await ajax({
    method: 'POST',
    uri: `https://qyapi.weixin.qq.com/cgi-bin/oa/getapprovaldetail?access_token=${token}`,
    body: {
      sp_no: approvalNo
    },
    json: true
  })
  handleRep(rep, ctx, 404)
})

router.get('/allApproval', async ctx => { //..获取审批单记录详情
  const schema = Joi.object({
    maxResult: Joi.string().required(),
    skipCount: Joi.string().required(),
    spno: Joi.string()
  })
  verifyParams(schema, ctx.query, ctx)
  const {
    maxResult,
    skipCount,
    spno
  } = ctx.request.query
  let {
    result,
    totalCount
  } = await findAllApproval(parseInt(maxResult), parseInt(skipCount), spno)
  ctx.body = JSON.stringify({
    errcode: 0,
    errmsg: null,
    result,
    totalCount
  })
})

router.get('/media', async ctx => { //..转发下载文件请求
  const schema = Joi.object({
    mediaId: Joi.string().required()
  })
  verifyParams(schema, ctx.query, ctx)
  let {
    mediaId
  } = ctx.request.query

  let rep = ajax.get(`https://qyapi.weixin.qq.com/cgi-bin/media/get?access_token=${token}&media_id=${mediaId}`)
  ctx.body = rep
})


router.post('/media', upload.array('files'), async (ctx: any) => { //..转发上传接口，formData的键值需要注意设置为 files
  const files = ctx.request.files
  let promises: ajax.RequestPromise < any > [] = []
  for (let i in files) {
    let options = {
      json: true,
      method: 'POST',
      uri: `https://qyapi.weixin.qq.com/cgi-bin/media/upload?access_token=${token}&type=file`,
      formData: {
        media: {
          value: files[i].buffer,
          options: {
            filename: files[i].originalname,
            filelength: files[i].size,
            contentType: files[i].mimetype
          }
        }
      }
    }
    let rep = ajax(options)
    promises.push(rep)
  }
  let rep = await Promise.all(promises)
  if (Array.isArray(rep)) { //..如果上传图片成功，则rep应该是一个数组，进行处理
    let newrep = {
      errcode: 0,
      errmsg: 'ok',
      type: 'file',
      media_id: rep.map(item => item.media_id)
    }
    ctx.body = JSON.stringify(newrep)
  } else {  //..如果上传图片失败，则rep应该是失败图片的rep
    handleRep(rep, ctx, 422)
  }
})

export default router