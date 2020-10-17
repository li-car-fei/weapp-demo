// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')

cloud.init()

const getOneData=require('./fetch')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const oneData=await getOneData()
  return oneData
}