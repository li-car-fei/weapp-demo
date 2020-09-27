// miniprogram/pages/record/record.js
//index.js
import Collection from '../../Api/database'
const TodosCollection=new Collection('todos');
Page({
	data: {
    history: []
  },
	onLoad: async function () {
    //var history = wx.getStorageSync('todos_history')||[];
    const result=await TodosCollection.get({})
    var history=result.data
    history.forEach(element => {
      let todos=element.todos;
      const completed=todos.reduce((count,todo)=>{
       if(todo.completed){
         count++
       };
       return count
      },0);
      element.rage=completed+'/'+todos.length;
    });
    // for (var i = 0; i < history.length; i++) {
    //   var todos = history[i].todos;
    //   var completed = 0;
    //   for (var j = 0; j < todos.length; j++) {
    //     if (todos[j].completed) {
    //       completed++;
    //     }
    //   }
    //   history[i].rage = completed + '/' + todos.length;
    // }

    this.setData({
      history
    })
  },
})