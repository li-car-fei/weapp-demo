const mul = 4
const canvasId = 'myCanvas'
const iconList=[
  '/static/img/danqi.png',
  '/static/img/guoqi.png',
  '/static/img/guoqin.png'
];
const moonList=[
  '/static/img/moontab1.png',
  '/static/img/moontab3.png',
  '/static/img/moontab4.jpg'
]
const request=require('../../Api/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断用户是否授权
    authorized: false,
    avatar: "/static/img/clickkk.png",
    backImg:'/static/img/moonback.jpg',     // 背景图
    shareImg:'/static/img/moonshare.jpg',                // 分享时的背景图
    // 当前的icon图标
    currentIcon: '',
    // 当前的位置
    currentPositon: 3,
    iconList: [],
    photo: true,
    customModal: false,
    patternIndex:true,               // true 则当前为中秋主题
    access_token:''           // 小程序凭证
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {

    this.getIconList()
    this.userAuthorized()
  },

  // 获取图标src列表
  getIconList() {
    this.setData({
      iconList:moonList
    })
  },

  /**
   * 用户是否已经授权
   */
  userAuthorized() {
    let that = this
    wx.Promise('getSetting')().then(setRes => {
      if (setRes.authSetting['scope.userInfo']) {
        wx.Promise('getUserInfo')().then(infoRes => {
          // 处理头像
          let avatar = infoRes.userInfo.avatarUrl
          let stringArray = avatar.split('/')
          stringArray.pop()
          stringArray.push('0')
          avatar = stringArray.join('/');
          that.setData({
            avatar: avatar,
            authorized: true
          })
        })
      } else {
        that.setData({
          authorized: false
        })

      }
    })
  },

  xiangce(e){//相册响应函数
    let tempFiles;
    let tempFilePaths;
    var that=this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success:res=>{
        // tempFilePath可以作为img标签的src属性显示图片
        tempFiles  = res.tempFiles[0].size;
        tempFilePaths = res.tempFilePaths[0];   
        if (tempFiles > 1024*1024) {//大于1m
          wx.showToast({
            title: '图片大小大于1M',
            icon: 'none',
            duration: 2000
          });
          return;
        };
        console.log(tempFilePaths)
        wx.getFileSystemManager().readFile({
          filePath:tempFilePaths,
          success:buffer=>{
            console.log(buffer.data);
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
                that.setData({
                  avatar:tempFilePaths
                })
              }
            })
          }
        })
      }
    });
  },

  // 切换主题
  changePattern(){
    if(this.data.patternIndex){
      // 切换国庆主题
      this.setData({
        iconList:iconList,
        backImg:'/static/img/back.png',
        shareImg:'/static/img/happy.png',
        patternIndex:!this.data.patternIndex
      });
      return
    };
    // 切换中秋主题
    this.setData({
      iconList:moonList,
      backImg:'/static/img/moonback.jpg',
      shareImg:'/static/img/moonshare.jpg',
      patternIndex:!this.data.patternIndex
    });
  },


  onSuccessOpenSetting() {
    this.setData({
      photo: true
    })
  },

  customModalCancel() {
    this.setData({ customModal: false })
  },

  // 获取用户信息
  onGetUserInfo() {
    this.userAuthorized()
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
   * 点击右上角分享
   */
  onShareAppMessage: function () {
    console.log('share')
    this.setData({
      customModal: false
    })
  },

  chooseIcon(event) {
    let icon = event.currentTarget.dataset.image
    console.log({ icon })
    this.setData({
      currentIcon: icon,
      currentPositon: 3
    })
  },

  choosePosition(event) {
    let that = this
    if (!that.data.currentIcon) {
      wx.showToast({ title: '请先选择图标', icon: 'none' })
      return false
    }
    let position = event.currentTarget.dataset.position
    that.setData({ currentPositon: position })
  },

  // 点击保存图片进行制作
  saveImage() {
    let that = this
    let currentIcon = that.data.currentIcon
    if (!currentIcon) {
      wx.showToast({ title: '请先选择图标', icon: 'none' })
      return false
    }
    wx.showLoading({ title: '正在制作...' })
    that.canvasDrawImage((image) => {
      wx.Promise('getSetting')().then(setRes => {
        if (setRes.authSetting['scope.writePhotosAlbum'] !== false) {
          wx.Promise('saveImageToPhotosAlbum')({
            filePath: image
          }).then(() => {
            wx.showToast({ title: '保存成功' })
            that.setData({
              customModal: true
            })
          }).catch(e => {
            that.setData({
              photo: false
            })
          })
        }
      })

    })

    setTimeout(() => {
      wx.hideLoading()
    }, 2000)
    console.log('开始画图')
  },

  // 制作图片
  canvasDrawImage(callback) {
    let that = this
    // 获取两个数据
    let icon = that.data.currentIcon, avatar = that.data.avatar, position = that.data.currentPositon
    console.log('icon:'+icon);
    console.log('avatar:'+avatar);


    // 下载头像，本地图标
    wx.Promise('getImageInfo')({
      src:avatar
    }).then(avatarRes=>{
      let tempAvatar = avatarRes.path
      let tempIcon = icon
      that.__picture(tempIcon, tempAvatar, position, (image) => {
      return callback(image)
    })
  })
  },

  // 调用canvas制作图片
  __picture(tempIcon, tempAvatar, position, callback) {
    const screenWidth = wx.getSystemInfoSync().screenWidth
    // 其中 * 4 是我们canvas画大图
    const multiple = parseFloat(screenWidth / 750) * mul
    const ctx = wx.createCanvasContext(canvasId, this)
    ctx.setFillStyle('#ffffff')
    ctx.fillRect(0, 0, 300 * multiple, 300 * multiple)
    ctx.save() //保存之前状态，便于画完圆继续使用
    roundedRect(ctx, 0 * multiple, 0 * multiple, 300 * multiple, 300 * multiple, 30 * multiple)
    ctx.clip()
    ctx.drawImage(tempAvatar, 0 * multiple, 0 * multiple, 300 * multiple, 300 * multiple)
    ctx.restore()
    // 一下300就是300rpx
    let iconSize = 110
    let dx = 0, dy = 0, dw = iconSize, dh = iconSize
    switch (parseInt(position)) {
      case 0:
        dx = 0, dy = 0
        break;
      case 1:
        dx = 190, dy = 0
        break;
      case 2:
        dx = 0, dy = 190
        break;
      case 3:
        dx = 190, dy = 190
        break;
    }
    ctx.drawImage(tempIcon, dx * multiple, dy * multiple, dw * multiple, dh * multiple)

    ctx.draw(false, () => {
      // 保存图片
      wx.Promise('canvasToTempFilePath')({
        canvasId: canvasId,
        x: 0, y: 0, width: 300 * multiple, height: 300 * multiple,
        destWidth: 600 * multiple, destHeight: 600 * multiple
      }).then(info => {
        console.log({ info })
        return callback(info.tempFilePath)
      })
    })
  },


})

/**
 * 画四边圆角
 */
const roundedRect = (ctx, x, y, width, height, radius) => {
  ctx.strokeStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
  ctx.lineTo(x + width - radius, y + height);
  ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  ctx.lineTo(x + width, y + radius);
  ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
  ctx.lineTo(x + radius, y);
  ctx.quadraticCurveTo(x, y, x, y + radius);
  ctx.stroke();
}