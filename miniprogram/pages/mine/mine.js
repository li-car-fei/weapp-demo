const bmap=require('../../Api/bmap-wx')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_img:'',
    real_year:'',           //当前年
    real_month:'',          //当前月（1~12）
    real_day:'',            //当前日（1~31）
    year: '',               //界面年
    month: '',              //界面月（1~12）
    day: '',                //界面日（1~31）
    weekArr: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],    
    firstDay: '',    //界面月份第一天为星期x（0~6，0为星期日）
    lastDay: '',     //界面月份最后一天的日（1~31）
    param: null,
    choose:31,       //选择的日子的index（0~30，0代表每个月第一日），初始设为31，onload时无法选中
    choose_date:'',    //选择的日子的日（1~31）
    choose_month:'',   //选择的日子的月（1~12）
    choose_year:'',    //选择的日子的年
    //clockNum: 3

    weatherData:''        // 天气信息
  },

  getDate: function () { //获取当月日期
    var mydate = new Date();          //获取当前时间
    var year = mydate.getFullYear();    //获取完整的年份
    var month = mydate.getMonth();      //获取当前月份（0~11，0代表1月）
    var months = month + 1;             //months:当前月份（1~12）
    this.data.year = year;
    this.data.month = months;
    this.data.day = mydate.getDate();    //获取当前日（1~31）
    var fist = new Date(year, month, 1);    //当前月份的第一天
    this.data.firstDay = fist.getDay();     //当前月份第一天为星期x（0~6，0为星期日）
    var last = new Date(year, months, 0);   //当前月份最后一天
    this.data.lastDay = last.getDate();     //当前月份最后一天的日（1~31）

    this.setData({
      real_year: this.data.year,
      real_month: this.data.month,
      real_day: this.data.day,
      year: this.data.year,
      month: this.data.month,
      day: this.data.day,
      firstDay: this.data.firstDay,
      lastDay: this.data.lastDay
    })
    //console.log("今天：" + this.data.day)
  },

  setDate: function () {  //设置当前月日期数组，对应为日（1~31）
    for (var i = 1; i < this.data.lastDay + 1; i++) {
      this.data.dateArr.push(i);
    }
    this.setData({
      dateArr: this.data.dateArr,
      //firstDay: this.data.firstDay
    })
  },
  real_check:function(){
    //判定是否为当前日期的年月份
    if ((this.data.year == this.data.real_year) && (this.data.month == this.data.real_month)) {
      this.setData({
        day: this.data.real_day,
      })
    } else {
      this.setData({
        day: 32,
      })
    }
  },

  choose_check:function(){
    //判定是否为选择日期的年月份
    if ((this.data.year == this.data.choose_year) && (this.data.month == this.data.choose_month)) {
      let chooses = this.data.choose_date - 1
      this.setData({
        choose: chooses,
      })
    } else {
      this.setData({
        choose: 31,
      })
    }
  },

  prevMonth: function () { //上一月
    var months = "";
    var years = "";
    //计算获取跳动后的年，月
    if (this.data.month == 1) {
      years = this.data.year - 1
      this.data.month = 12;
      months = this.data.month;
    } else {
      years = this.data.year;
      months = this.data.month - 1;
    }

    var first = new Date(years, months - 1, 1);
    this.data.firstDay = first.getDay();
    var last = new Date(years, months, 0);
    this.data.lastDay = last.getDate();

    this.setData({
      month: months,
      year: years,
      firstDay: this.data.firstDay,
      lastDay: this.data.lastDay
    })

    this.data.dateArr = [];
    for (var i = 1; i < this.data.lastDay + 1; i++) {
      this.data.dateArr.push(i);
    }
    this.setData({
      dateArr: this.data.dateArr
    })
    
    //判定
    this.real_check();
    this.choose_check();

  },
  nextMonth: function () { //下一月
    var months = "";
    var years = "";
    if (this.data.month == 12) {
      this.data.month = 0;
      months = this.data.month;
      years = this.data.year + 1;
    } else {
      months = this.data.month + 1;
      years = this.data.year;
    }
    var months = this.data.month + 1;
    var first = new Date(years, months - 1, 1);
    this.data.firstDay = first.getDay();
    var last = new Date(years, months, 0);
    this.data.lastDay = last.getDate();
    this.setData({
      month: months,
      year: years,
      firstDay: this.data.firstDay,
      lastDay: this.data.lastDay
    })

    this.data.dateArr = [];
    for (var i = 1; i < this.data.lastDay + 1; i++) {
      this.data.dateArr.push(i);
    }
    this.setData({
      dateArr: this.data.dateArr
    })
    //判定
    this.real_check();
    this.choose_check();

  },

  choose:function(event){
    let choose = event.target.dataset.index
    let choose_date=event.target.dataset.index+1
    let choose_year=this.data.year
    let choose_month=this.data.month
    this.setData({
      choose:choose,
      choose_year:choose_year,
      choose_month: choose_month,
      choose_date: choose_date
    })
  },

  set_clock:function(event){
    let that=this
    if(this.data.choose_date){
      wx.showModal({
        title: '已设置提醒日期',
        content: that.data.choose_year + '年' + that.data.choose_month + '月'+that.data.choose_date + '号',
      })
      //更改app.js中的数据
      let obj={
        year:this.data.choose_year,
        month:this.data.choose_month,
        day:this.data.choose_date
      };
    }else{
      wx.showToast({
        title: '请选择设置提醒的日期',
        icon: "none",
        duration: 1500,
      })
    }
  },

  fetchWeather:async function(){
    const BMap=new bmap.BMapWX({
      ak:'y1kTCQmkKNCyT4KOtz1tjexGtqF6iLij'               // 百度地图ak
    });
    var that =this;
    var fail = function(data) { 
      console.log(data) 
    };
    var success = function(data) { 
    var weatherData = data.currentWeather[0]; 
    weatherData =weatherData.date + '\n' + '城市：' + weatherData.currentCity+'\n' + '温度：' + weatherData.temperature + '\n' +'天气：' + weatherData.weatherDesc + '\n' +'风力：' + weatherData.wind + '\n'; 
    that.setData({ 
        weatherData: weatherData 
    }); 
    console.log(weatherData)
  };
  // 发起weather请求 
  BMap.weather({ 
    fail: fail, 
    success: success 
  });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.getDate();
    this.setDate();
    //this.getChoose();
    this.choose_check();
    var res = wx.getSystemInfoSync();
    this.setData({
      param: res.windowHeight / 12,
      user_img:'/static/img/avator.jpeg'
    })

    // fetch weather
    this.fetchWeather()

    //ajax 数据库设置的提醒日期
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