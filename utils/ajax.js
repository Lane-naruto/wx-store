const api = 'https://100boot.cn/wxShop/';
function request(opt){
  wx.request({
    url: api + opt.url,
    data: opt.data,
    header: {
      'content-type': 'application/json' 
    },
    success(res) {
      if (res.data.code == 100) {
        if (opt.success) {
          opt.success(res.data);
        }
      } else {
        console.error(res);
        wx.showToast({
          title: res.data.message,
        })
      }
    }
  })
}
module.exports.request = request