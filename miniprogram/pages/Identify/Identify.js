
Page({
  /**
   * 页面的初始数据
   */
  data: {
    image: '/static/img/photoback.jpeg',
    result: null,             // 人脸分析结果
    ocrResult:null,           // ocr 分析结果
    showTips: true,
    model:true               // 图片识别模式， true：人脸     false：OCR
  },

  /**
   * 分析照片   人脸模式
   */
  detectImage (src) {
    const that = this
    that.setData({ result: null })
    wx.showLoading({ title: '识别中...' })
    wx.Promise('uploadFile')({
      url: 'https://ai.qq.com/cgi-bin/appdemo_detectface',
      name: 'image_file',
      filePath: src
    }).then(res=>{
      // 解析 JSON
      const result = JSON.parse(res.data)
      console.log(result)
      if (result.ret === 0) {
        // 成功获取分析结果
        that.setData({ 
          result: result.data.face[0],
          showTips:false
        })
      } else {
        // 检测失败
        wx.showToast({ icon: 'none', title: '找不到你的小脸蛋喽～' })
      }
      wx.hideLoading()
    })
  },

   /**
   * 分析照片   OCR模式
   */
  OcrImagedetect(data){
    const that = this
    that.setData({ ocrResult: null })
    wx.showLoading({ title: '识别中...' })
    wx.getFileSystemManager().readFile({
      filePath:this.data.image,
      encoding:"base64",
      success:buffer=>{
        wx.cloud.callFunction({
          name:'ocrClient',
          data:{
            value:buffer.data
          }
        }).then(res=>{
          console.log(res.result.words_result);
          if(res.result.words_result){
            const text=that.wordsHandler(res.result.words_result);
            that.setData({
            ocrResult:text
            });
          }else{
            wx.showToast({ icon: 'none', title: '无法识别图片中的内容喽～' })
          };
          wx.hideLoading()
        })
      }
    })
  },

  /**
   * 获取照片
   */
  getImage (type = 'camera') {
    const that = this
    wx.Promise('chooseImage')({
      sourceType: [type], // camera | album
      sizeType: ['compressed'], // original | compressed
      count: 1,
    }).then(res=>{
      // 图片对象
      const image=res.tempFiles[0]
      // 图片过大
      if (image.size > 1024 * 1000) {
        return wx.showToast({ icon: 'none', title: '图片过大, 请重新拍张小的！' })
      };
      console.log(image)
      wx.getFileSystemManager().readFile({
        filePath:image.path,
        success:buffer=>{
          console.log(buffer);
          wx.cloud.callFunction({
            name:'checkImg',
            data:{
              value:buffer.data
            }
          }).then(imgRes=>{
            if(imgRes.result.errCode=='87014'){
              wx.showToast({
                title: '图片含有违法违规内容',
                icon:'none'
              });
              return
            }else{
              // 图片正常
              // 加载的图片显示到界面上
              that.setData({ image: image.path })
              const model=that.data.model;
              if(model){
                // 分析检测人脸
                that.detectImage(image.path)
              }else{
                // OCR检测
                that.OcrImagedetect(buffer.data)
              }
            }
          })
        },
        fail:err=>{
          console.log(err)
        }
      })
    })
  },

  /**
   * 拍拍按钮
   */
  handleClick (e) {
    if (e.type === 'tap') {
      // 短按拍照为拍摄照片
      this.getImage()
    } else if (e.type === 'longpress') {
      // 长按拍照为选择照片
      this.getImage('album')
    }
  },

  // 图片识别模式切换按钮
  changeModel(){
    const current=this.data.model;
    this.setData({
      model:!current
    })
  },

  // 处理ocr识别的数组结果
  wordsHandler(words) {
    let text = '';
    for (let i = 0; i < words.length; i++) {
        text += words[i].words + '\n';
    }
    return text;
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage () {
    if (!this.data.result) return
    // 如果有分析结果，则分享
    return { title: `刚刚测了我的颜值「${this.data.result.beauty}」你也赶紧来试试吧！` }
  }
})
