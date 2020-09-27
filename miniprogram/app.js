//app.js
App({
  onLaunch: function () {

    // 全局绑定promise形式调用命令
    wx.Promise=api=>{
      return (options={})=>{
        return new Promise((resolve,reject)=>{
          wx[api].call(wx,{
            ...options,...{
              success(res) {
                resolve(res)
              },
              fail(err) {
                wx.showToast({
                  title: options.errorTip || '系统异常',
                  icon: 'none',
                  mask: true,
                  duration: 1500
                });
                reject(err)
              }
            }
          })
        })
      }
    };

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'tset-demo-amhvm',
        traceUser: true,
      })
    }

    this.globalData = {}
  }
})
