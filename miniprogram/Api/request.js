
const ContentType = [{},// 不同的类型请求，选择不同的header
  {
    'content-type': 'application/json'
  },
  {
    'content-type': 'application/x-www-form-urlencoded'
  },
  {
    'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
  },

  {
    'content-type': 'multipart/form-data; boundary=XXX' // 上传文件时使用
  }
  ];

module.exports=function(url,method,data,contentchoice=1,cookie='',loading=false){
  if(loading==true){        // 加载较大的数据，有个提示Toast
    wx.showToast({
      title: '数据加载中',
      icon:'loading'
    })
  };
  return new Promise((resolve,reject)=>wx.request({
    url: url,           // 请求url
    data:data,          // data
    method:method,      // 方法
    header:{
      'content-type':ContentType[contentchoice],
      'Cookie':cookie
    },      // header表头
    success:res=>{
      const cookie=res.header["Set-Cookie"]||''      // 拿到返回的Cookie
      wx.setStorageSync('cookie', cookie);      // 设置cookie
      if(loading==true){
        wx.hideToast()
      }
      resolve(res)
    },
    fail:err=>{
      if(loading==true){
        wx.hideToast();
        wx.showToast({
          title: 'error request',
        })
      };
      reject(err)
    },
    complete:()=>{

    }
  }))
}