const request=require('request')
const cheerio=require('cheerio')

function getOneData() {
  return new Promise((resolve, reject) => {
    request("http://wufazhuce.com/",
    (err, res) => {
        if(err) {
            reject('net error');
        }
        if(!err) {
            const body = res.body;
            const $ = cheerio.load(body, {
            decodeEntities: false
            })
          // 抓取 one 的图片
          const img = $(".carousel-inner>.item>img, .carousel-inner>.item>a>img").eq(0).attr("src");
          // 抓取 one 的文本
          const text = $(".fp-one .fp-one-cita-wrapper .fp-one-cita a").eq(0).text();
          // one 数据
          const oneData = {
              img,
              text
          };
          // console.log(oneData);
          resolve(oneData);
        }
    })
})
}

module.exports=getOneData