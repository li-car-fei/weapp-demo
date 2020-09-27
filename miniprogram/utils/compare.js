// 数组对象去重及相关

// 比较两个对象是否完全一样
function compareObj(obj1, obj2) {
  let keys1 = Object.keys(obj1);                //自身可枚举属性键
  let keys2 = Object.keys(obj2);
  const keys_set = new Set([...keys1, ...keys2]);
  const keys = Array.from(keys_set);
  for (let i of keys) {
      if (obj1[i] !== obj2[i]) {
          return false
      }
  };
  return true
};

// 单独去重操作，返回最终结果
function uniqueArr(history) {
  // 一个一个pop，set.foreach 遍历进行深度比较    已经存在则delete
  let set = new Set();
  for (let i = 0; i < history.length; i++) {
      let current = history[i];
      set.forEach(function (item) {
          if (compareObj(item, current)) {
              // 严格相等，删除掉
              set.delete(item)
          }
      });
      // add current
      set.add(current)
  };
  console.log(set)
  // Set 里的数据拿出来，push 回数组返回
  return [...set]
};


// 找到与item深度相等，delete     返回delete后的，可以直接 unshift
function RemoveUnique(history, item) {
  let set = new Set(history);
  for (let i of set) {
      if (compareObj(i, item)) {
          set.delete(i)
      }
  };
  return [...set]
}


module.exports={
  uniqueArr,
  RemoveUnique
}


