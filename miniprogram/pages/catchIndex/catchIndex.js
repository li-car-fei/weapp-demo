// miniprogram/pages/catchIndex/catchIndex.js
import Collection from '../../Api/database'
const CatchCollection=new Collection('catch')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classification:['History','Add'],
    catchResults:[]
  },

  topBarChange:function(e){
    if(e.detail.topBarCurrent==1){
      // 查看记录
      wx.navigateTo({
        url: '../../pages/catch/catch',
      })
    };
  },

  viewImage(e){
    //console.log(e.currentTarget.dataset);
    const {index,images}=e.currentTarget.dataset;
    wx.Promise('previewImage')({
      current:images[index],
      urls:images
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
    const that=this;
    CatchCollection.get({}).then(res=>{
      console.log(res.data);
      that.setData({
        catchResults:res.data
      })
    })
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