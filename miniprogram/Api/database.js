// 单例的模式引用数据库collection
// class DataBase{
//   static getInstance(){
//     // 单例，只存有一个 wx.cloud.database()
//     if(!DataBase.instance){
//       DataBase.instance=new DataBase()
//     }
//     return DataBase.instance
//   }
//   constructor(){
//     this.creatDB()
//   }
//   creatDB(){
//     return wx.cloud.database()
//   }
// }
const DB=wx.cloud.database()

// 连接collection并封装增删改查操作
class Collection{
  constructor(name){   
    this.collection=DB.collection(name);
  }

  add(data){      // 增加一条数据
    return this.collection.add({
      data
    })            // 返回promise
  }

  get(where){     // 获取满足条件的数据
    return this.collection.where({
      ...where
    }).get()
  }

  update(where,data){
    return this.collection.where({
      ...where
    }).update({
      data
    })
  }

  remove(where){
    return this.collection.where({
      ...where
    }).remove()
  }
}

export default Collection

