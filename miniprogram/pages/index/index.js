const translate=require('../../Api/translate/translate')
//const utf8=require('../../utils/utf8-trans')
const {RemoveUnique}=require('../../utils/compare')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText:'',
    searchResult:[],
    from:'English',
    to:'Chinese',
    languages:['English','Chinese','yue','japanese','korean','france'],
    choose:[0,1],                           // 语种选择 对应languages_param的index
    languages_param:[ 'en','zh-CHS','yue','ja','ko','fr'],
    historyList:[]              // 历史记录
  },

  languageChange:function(e){                 // 选择 from to 的变化
    const value=e.detail.value;
    this.setData({
      from:this.data.languages[value[0]],
      to:this.data.languages[value[1]],
      choose:value
    })
  },

  ChangeWord:function(e){                     // 监听input输入
    this.setData({
      searchText:e.detail.value
    })
  },

  ClearWord:function(e){                     // 清空input输入
    this.setData({
      searchText:''
    })
  },

  Search:async function(text,from,to){                 // 搜索并且进行结果操作与返回，封装出来
    const result=await translate(text,from,to);
    const item={
      text:text,
      //result:result.trans_result[0].dst             // 百度翻译结果
      result:result.translation[0],
      webValue:result.web||'',                        // 网络释义
      basic:result.basic||''                    // 词义
    };
    let Result=this.data.searchResult;
    Result.push(item);
    this.setData({
      searchResult:Result
    });
  },

  doSearch:async function(e){                           // 搜索
    await this.Search(this.data.searchText,this.data.languages_param[this.data.choose[0]],this.data.languages_param[this.data.choose[1]]);
    let historyList=this.data.historyList;
    const new_history_item={
      text:this.data.searchText,
      from:this.data.languages_param[this.data.choose[0]],
      to:this.data.languages_param[this.data.choose[1]]
    };
    let new_historyList=RemoveUnique(historyList,new_history_item);         // 去除与新增重合的
    new_historyList.unshift(new_history_item);        // 插入搜索值
    this.setData({
      historyList:new_historyList
    });
    wx.setStorage({
      data: [...new_historyList],
      key: 'serachHistoryList',
    })
  },

  handleDelete(e){                                        // 删除某个搜索结果
    const index=e.target.dataset.index;
    let Result=this.data.searchResult;
    Result.splice(index,1);
    this.setData({
      searchResult:Result
    })
  },

  clearHistory(e){        // 清除搜索记录
    let that=this;
    wx.showModal({
      title:'tips',
      content:'are you sure remove search history?',
      success(res){
        if(res.confirm){
          wx.removeStorage({
            key: 'serachHistoryList',
          })
          that.setData({
            historyList:[]
          })
        }
      }
    })
  },

  hitoryItemSearch:async function(e){        // 搜索某条历史记录
    const index=e.target.dataset.index;
    const searchItem=this.data.historyList[index];      // 搜索的记录数据
    await this.Search(searchItem.text,searchItem.from,searchItem.to);
    let historyList=this.data.historyList;
    historyList.splice(index,1);              // 先删掉原先的那个一样的
    historyList.unshift(searchItem);                  // 头部插入
    wx.setStorage({
      data: historyList,
      key: 'serachHistoryList',
    })
    this.setData({
      historyList:historyList
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    const historyList=wx.getStorageSync('serachHistoryList')||[];
    this.setData({
      historyList:historyList
    });
    if(!historyList.length){
      wx.setStorage({
        data: [],
        key: 'serachHistoryList',
      })
    }
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