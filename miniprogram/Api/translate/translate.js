//const md5=require('./md5');
const zhmd5=require('./zhmd5');           // 支持中文的md5加密
const config=require('./config');
const request=require('../request');

// word:翻译的词      from：各种语言      to：翻译成何种语言
module.exports=async function translate(word,from='auto',to='en'){
  //const sign=md5.hexMD5(config.appid+word+config.salt+config.secret_key);         // 百度翻译加密
  const sign=zhmd5.md5(config.appKey+word+config.salt+config.secretKey);
  if(from=='zh'){
    word=encodeURI(word);
    //console.log(word);
  }
  const data={
    q:word,
    from,
    to,
    //appid:config.appid,               // 百度翻译
    appKey:config.appKey,
    salt:config.salt,
    sign
  };

  //const result=await request(config.url,'GET',data,2,'',true);                // 百度翻译请求
  const result=await request(config.youHost,'GET',data,2,'',true);
  console.log(result);
  return result.data? result.data:'error'

  // return new Promise((resolve,reject)=>{
  //   wx.request({
  //     url: config.url, 
  //     data: {
  //       q:word,
  //       from,
  //       to,
  //       appid:config.appid,
  //       salt:config.salt,
  //       sign
  //     },
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'       // 使用post需要更改
  //     },
  //     success (res) {
  //       resolve(res.data)
  //     },
  //     fail(err){
  //       reject(err)
  //     }
  // })})
}