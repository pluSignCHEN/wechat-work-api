/**
 * 审核集合的操作
 */

import mongoose from 'mongoose'
mongoose.Promise = global.Promise
import {
  approval_schema
} from './schema'

const Approvals = mongoose.model('approvals', approval_schema, 'approvals')


/**
 * 查询所有审批记录
 * @param {string} spno      审批单号
 * @param {number} maxResult  每次返回的文档数
 * @param {number} skipCount  跳过的文档数
 * @return {mongoose.Document[]}
 */
async function findAllApproval(maxResult: number, skipCount: number = 0, spno ? : string): Promise < {
  result: mongoose.Document[],
  totalCount: number
} > {
  let query: mongoose.DocumentQuery < mongoose.Document[], mongoose.Document, {} >
    let count: mongoose.Query < number >
      if (spno) {
        query = Approvals.find({
          SpNo: [spno]
        })
        count = Approvals.countDocuments({
          SpNo: [spno]
        })
      } else {
        query = Approvals.find()
        count = Approvals.countDocuments()
      }
  let result = await query.limit(maxResult).skip(skipCount).exec().then(res => res, err => {
    throw new Error(err)
  })
  let totalCount = await count.exec().then(res => res, err => {
    throw new Error(err)
  })
  return {
    result,
    totalCount
  }
}

/**
 * 添加审批记录
 * @param {any} data 审批记录
 */
async function addApproval(data: any) {
  const model = new Approvals(data)
  let result = await model.save().then(res => res, err => {
    throw new Error(err)
  })
  return result
}

export {
  findAllApproval,
  addApproval
}