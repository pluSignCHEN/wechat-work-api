/**
 * 获取Access_token
 */
import ajax from 'request-promise'
import {
  corpid as id,
  corpsecrets
} from './secret'

/**
 * 操作Access_Key
 * @class Access_Key
 * @constructor
 * @param {string} corpsecret 企业微信应用名称
 */
class Access_Key {
  private corpsecret: string;
  private corpid: string = id;
  private access_key ? : string;
  private date ? : number;
  private expires ? : number;
  constructor(app: string) {
    this.corpsecret = corpsecrets[app]
  }
  async getAccessKey() {
    if (this.access_key && this.date && this.expires && new Date().valueOf() - this.date < this.expires) {
      return this.access_key
    } else {
      const rep = await ajax({
        method: 'GET',
        uri: `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${this.corpid}&corpsecret=${this.corpsecret}`,
        json: true
      })
      if (rep.errcode === 0) {
        this.date = new Date().valueOf()
        this.access_key = rep.access_token
        this.expires = rep.expires_in
        return this.access_key
      } else {
        throw new Error(`${rep.errcode} : ${rep.errmsg}`)
      }
    }
  }
}

export default Access_Key