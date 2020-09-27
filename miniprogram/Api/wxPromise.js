//wxPromise 以promise形式调用wx命令
// var wxPromise=api=>{
//   return (options={})=>{
//     return new Promise((resolve,reject)=>{
//       wx[api].call(wx,{
//         ...options,...{
//           success(res) {
//             resolve(res)
//           },
//           fail(err) {
//             wx.showToast({
//               title: options.errorTip || '系统异常',
//               icon: 'none',
//               mask: true,
//               duration: 1500
//             });
//             reject(err)
//           }
//         }
//       })
//     })
//   }
// };

// export default wxPromise