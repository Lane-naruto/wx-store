// pages/user/user.js
const date = new Date()
const years = []
const months = []
const days = []
var app = getApp()
for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}
Page({
  data: {
    userInfo: {},
    items: [
      { value: '未知' },
      { value: '男', checked: 'true' },
      { value: '女' },
    ],
    sex: 0,
    born: '',
    years: years,
    months: months,
    days: days,
    value: [9999, 1, 1],
    bornShow: false
  },
  onLoad: function (e) {
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
        })
      }
    })
  },
  radioChange:function(e){
    this.setData({
      sex: e.detail.value
    })
  },
  onBornShow: function(){
    this.setData({
      bornShow: true
    })
  },
  onBornHiden: function(){
    this.setData({
      bornShow: false
    })
  }
})