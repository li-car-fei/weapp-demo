//index.js
import {
  formatTime,
  formatDate
} from '../../utils/utils';
const TODAY=formatDate(new Date())

import Collection from '../../Api/database'
const TodosCollection=new Collection('todos');

Page({
  data: {
    todos: [],
    allCompleted: true,
    input: '',
    avatar:'../../static/img/avator.jpeg',
    classification:['Todo','Record']
  },

  topBarChange:function(e){
    if(e.detail.topBarCurrent){
      // 查看记录
      wx.navigateTo({
        url: '../../pages/record/record',
      })
    }
  },

  // 保存数据
  save: async function() {
    const result=await TodosCollection.get({date:TODAY});
    if(result.data.length){
      // 有今天的数据
      TodosCollection.update({
        date:TODAY
      },{
        todos:this.data.todos
      });
      return
    }
    // 无今天的数据
    TodosCollection.add({
      todos:this.data.todos,
      date:TODAY
    })

    // var todos_history=wx.getStorageSync('todos_history')||[]
    // const index=todos_history.findIndex(item=>{
    //   return item.date==TODAY
    // });
    // if(index==-1){      // 无今日记录
    //   todos_history.push({
    //     date:TODAY,
    //     todos:this.data.todos
    //   })
    // }else{
    //   todos_history[index].todos=this.data.todos;
    // };
    // wx.setStorageSync('todos_history', todos_history)
  },

  // 授权通过后获取用户头像
  onGetAvator(){
    var that=this;
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
          })
        })
      } else {
       console.log('do not get avator')
      }
    })
  },

  onLoad: async function () {
    // const demo=wx.getStorageSync('todos_history')[0];
    // TodosCollection.add({
    //   ...demo
    // }).then(res=>{
    //   console.log(res)
    // })

    // TodosCollection.get({
    //   date:TODAY
    // }).then(res=>{
    //   console.log(res)
    // })

    // TodosCollection.get({}).then(res=>{
    //   console.log(res)}
    // )

    // TodosCollection.update({
    //   date:TODAY
    // },{
    //   //todos:[]
    //   date:'2020-09-26'
    // }).then(res=>{
    //   console.log(res)
    // })

    // TodosCollection.remove({
    //   date:TODAY
    // }).then(res=>{
    //   console.log(res)
    // })

    var todos=[]
    //const todos_history = wx.getStorageSync('todos_history')||[]
    const result=await TodosCollection.get({})
    const todos_history=result.data
    const index=todos_history.findIndex(item=>{
      return item.date==TODAY
    })
    if(index!==-1){         // 有今天的记录
      todos=todos_history[index].todos
    }
    this.setData({
      todos
    });
  },

  onShow:function(){
    this.onGetAvator()
  },

  handleInput: function(e) {
    this.setData({
      input: e.detail.value
    })
  },

  todoAdd: function () {
    var {
      todos,
      input
    } = this.data;
    var length = todos.length;
    if (!input || !input.trim()) {
      return 
    }
    var date = new Date();
    var time = formatTime(date);
    console.log(todos);
    todos.push({
      index: length + 1,
      value: input,
      time: time,
      completed: false
    })
    this.setData({
      todos,
      input: ''
    })
    this.save();
  },

  todoChange: function(e) {
    var todos = this.data.todos, values = e.detail.value;
    for (var i = 0; i < todos.length; i++) {
        todos[i].completed = false;
        for (var j = 0; j < values.length; j++) {
            if (todos[i].index == values[j]) {
                todos[i].completed = true;
                break;
            }
        }
    }
    var allCompleted = this.data.allCompleted;
    if (todos.length === values.length) {
      allCompleted = false;
    } else if (values.length === 0) {
      allCompleted = true;
    } else {
      //do nothing
    }
    
    this.setData({
      todos,
      allCompleted
    })
    this.save();
  },

  handleAll: function() {
    var {
      todos,
      allCompleted
    } = this.data;
    for (var i = 0; i < todos.length; i++) {
        todos[i].completed = allCompleted
    }
    this.setData({
      todos,
      allCompleted: !allCompleted
    })
    this.save();
  },

  clearCompleted: function() {
    var that = this;
    var {
      todos,
    } = that.data;
    var remain = todos.filter(function(todo) {
      return todo.completed === false;
    });
    if (remain.length < todos.length) {
      wx.showModal({
        title: '提示',
        content: '清空已完成的Todos？',
        success: function(res) {
          if (res.confirm) {
            that.setData({
              todos: remain
            })
            that.save();
          }
        }
      });
    }
  }
})
