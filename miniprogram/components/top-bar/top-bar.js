// component/top-bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    classification: Array,
  },

  /**
   * 组件的初始数据
   */
  data: {
    topBarCurrent: 0, // 顶部栏默认指向第一项
  },

  /**
   * 组件的方法列表
   */
  methods: {
    topBarOnTap: function (e) { //顶部栏点击
      let _topBarCurrent = this.data.topBarCurrent
      if(_topBarCurrent == e.currentTarget.dataset.index){ // 防止重复加载页面
        return false
      }
      this.triggerEvent('topBarChange',{            // 触发父页面跳转
        topBarCurrent: e.currentTarget.dataset.index
      })

      // 不切换top-bar，子页面返回后依然是 Todo 第一项
      // this.setData({
      //   topBarCurrent: e.currentTarget.dataset.index
      // })
    },
  }
})
