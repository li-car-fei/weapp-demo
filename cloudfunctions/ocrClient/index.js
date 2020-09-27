// 云函数入口文件
const cloud = require('wx-server-sdk')
let AipOcrClient = require("baidu-aip-sdk").ocr;
const args  = require("./Ocrconfig");
cloud.init();
// 云函数入口函数
exports.main = async (event, context) => {
  // 设置APPID/AK/SK
  let APP_ID = args.APP_ID;
  let API_KEY = args.API_KEY;
  let SECRET_KEY = args.SECRET_KEY;
  // 新建一个对象，保存一个对象调用服务接口
  let client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);

  //let image=event.value.toString("base64");
  const result=await client.generalBasic(event.value);
  return result

}