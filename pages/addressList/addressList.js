// pages/addressList/addressList.js
Page({

  data: {
    addressList: []
  },
 
  onLoad: function (options) {
    var arr = wx.getStorageSync('addressList') || [];
    console.info("缓存数据：" + arr);  
    this.setData({
      addressList: arr
    });
  },

  onShow: function () {
    this.onLoad();
  },
  addAddress: function () {
    wx.navigateTo({ url: '../address/address' });
  },
  delAddress: function (e) {
    this.data.addressList.splice(e.target.id.substring(3), 1);
    if (this.data.addressList.length > 0) {
      this.setData({
        addressList: this.data.addressList
      })
      wx.setStorageSync('addressList', this.data.addressList);
    } else {
      this.setData({
        addressList: this.data.addressList
      })
      wx.setStorageSync('addressList', []);
    }
  }

})