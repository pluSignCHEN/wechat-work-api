/**
 * 与企业微信消息回调有关的功能实现
 */

import Router from 'koa-router'
import xml2js from 'xml2js'
import wxcrypto from '../../utils/crypt'
import {addApproval} from '../../db/approval'

const xmlParser = xml2js.parseString;

const router = new Router({
  prefix: '/response'
})


router.get('/approval', async ctx => {  //..供企业微信后台验证审批回调
  const {msg_signature, timestamp, nonce, echostr} = ctx.request.query
  const MsgSig = wxcrypto.getSignature(timestamp, nonce, echostr);
  if (msg_signature == MsgSig) {
    const sEchoStr = wxcrypto.decrypte(echostr).message;
    ctx.body = sEchoStr
  } else {
    ctx.body = "-40001_invaild MsgSig"
  }
})

router.post('/approval', async ctx => {  //..处理审批消息回调
  const encrypt = ctx.request.body.xml.Encrypt[0]
  const xml = wxcrypto.decrypte(encrypt).message
  xmlParser(xml, async (err, result) => {
    if (err) ctx.throw(422)
    else {
      let res = await addApproval(JSON.stringify(result.xml.ApprovalInfo[0]))
      ctx.body = res
    }
  })
})

export default router