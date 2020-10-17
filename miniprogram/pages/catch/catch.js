// miniprogram/pages/catch/catch.js
import Collection from '../../Api/database'
const CatchCollection=new Collection('catch');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleValue: '',               // title
    textareaValue: '',        // text
    weather_index:0,      // 选择天气的索引
    weather:['Warm','Hot','Cold','Cool','Sunny','Rainy','Cloudy','Lightning','Foggy'],           // 天气列表
    weatherFlag:true,           // 是否选择了天气
    remarksValue: '',                   // 备注内容
    privateflag:false,            // 是否私密
    imageCloudId:[],           // 图片cloudId
    loadImageFlag:false       // 加载图片标志
  },

  gettitleValue: function (e) {           // title
    this.setData({ titleValue: e.detail.value });
  },
  getTextareaValue: function (e) {            // text information
    this.setData({ textareaValue: e.detail.value });
  },
  getRemarksValue: function (e) {             // remark 备注内容
    this.setData({ remarksValue: e.detail.value });
  },
  WeatherChange: function (e) {           // 天气选择
    this.setData({ weather_index: e.detail.value,weatherFlag:false});
  },
  privateChange:function(e){            // 私人可见选择
    if (e.detail.value){
      this.setData({ privateflag: true });
    }else{
      this.setData({ privateflag: false });    
    }
  },

  getImage:function(e){
    const that=this;
    wx.Promise('chooseImage')({
      sizeType:['compressed'],
      count:9
    }).then(res=>{
      //console.log(res.tempFiles)
      const length=res.tempFiles.length;
      that.setData({loadImageFlag:false});
      wx.showLoading({
        title: '加载图片中',
      })
      res.tempFiles.forEach((image,index)=>{
        wx.cloud.uploadFile({
          cloudPath: `catch/${image.path.slice(-12)}`, // 上传至云端的路径
          filePath: image.path, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            let imageCloudId=that.data.imageCloudId;
            imageCloudId.push(res.fileID);
            that.setData({imageCloudId:imageCloudId})
            if(index==length-1){
              that.setData({loadImageFlag:true});
              wx.hideLoading({});
            }
          },
          fail: err=>{
            console.log(err);
            wx.hideLoading({});
            wx.Promise('showToast')({
              title:'加载图片失败',
              icon:'loading',
              duration:1500
            })
          }
        })
      })
    })
  },

  saveCatch:function(){         // 保存记录上传
    const that=this;
    if(this.data.loadImageFlag){
      wx.showLoading({
        title: '上传信息中',
      })
      CatchCollection.add({
        title:that.data.titleValue,
        info:that.data.textareaValue,
        weather:that.data.weather[that.data.weather_index],
        remark:that.data.remarksValue,
        imageCloudId:that.data.imageCloudId,
        privateflag:that.data.privateflag
      }).then(res=>{
        console.log(res);
        // 输入置空
      that.setData({
        titleValue: '',               // title
      textareaValue: '',        // text
      remarksValue: '',                   // 备注内容
      imageCloudId:[],           // 图片cloudId
      privateflag:false,
      loadImageFlag:false
      });
      wx.hideLoading({})
      },err=>{
        console.log(err)
        wx.hideLoading({})
      })
    }else{
      wx.Promise('showToast')({
        title:'请先加载图片',
        icon:'loading',
        duration:1000
      })
    }
  },

  viewImage(e){
    const that=this
    wx.Promise('previewImage')({
      current: that.data.imageCloudId[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: that.data.imageCloudId // 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})