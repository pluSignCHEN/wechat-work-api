import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const approval_schema = new Schema({
  SpNo: [],
  SpName: [],
  SpStatus: [],
  TemplateId: [],
  ApplyTime: [],
  Applyer: [],
  SpRecord: [],
  StatuChangeEvent: []
});

export {
  approval_schema
}