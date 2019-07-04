// pages/cart1/cart1.js
Page({

  data: {
    carts: [], 
    iscart: false,
    hidden: null,
    isAllSelect: false,
    totalMoney: 0,
  },
  onShow: function(){
    var arr = wx.getStorageSync('cart') || [];
    if (arr.length>0){
      this.setData({
        carts: arr,
        iscart: true,
        hidden: false
      })
    }else{
      this.setData({
        iscart: false,
        hidden: true,
      });
    }
  },
  switchSelect: function(e){
    var Allprice = 0
    var i=0;
    let id = e.target.dataset.id;
    let index = parseInt(e.target.dataset.index)
    this.data.carts[index].isSelect = !this.data.carts[index].isSelect;
    if (this.data.carts[index].isSelect){
      this.data.totalMoney = this.data.totalMoney + (this.data.carts[index].price * this.data.carts[index].count)
    }else{
      this.data.totalMoney = this.data.totalMoney - (this.data.carts[index].price * this.data.carts[index].count)
    }
    for (i = 0; i < this.data.carts.length; i++){
      Allprice = Allprice + (this.data.carts[index].price * this.data.carts[index].count)
    }
    if (Allprice == this.data.totalMoney) {
      this.data.isAllSelect = true;
    }else{
      this.data.isAllSelect = false;
    }
      this.setData({
      carts: this.data.carts,
      totalMoney: this.data.totalMoney,
      isAllSelect: this.data.isAllSelect,
    })
  },
  allSelect: function (e) {
    let i = 0;
    if (!this.data.isAllSelect) {
      this.data.totalMoney = 0;
      for ( i = 0; i < this.data.carts.length; i++) {
        this.data.carts[i].isSelect = true;
        this.data.totalMoney = this.data.totalMoney + (this.data.carts[i].price * this.data.carts[i].count);
      }
    }else {
      for (i = 0; i < this.data.carts.length; i++) {
        this.data.carts[i].isSelect = false;
      }
      this.data.totalMoney = 0;
    }
    this.setData({
      carts: this.data.carts,
      isAllSelect: !this.data.isAllSelect,
      totalMoney: this.data.totalMoney,
    })
  },
  toBuy() {
    wx.showToast({
      title: '去结算',
      icon: 'success',
      duration: 3000
    });
  },
addCount: function(e){
  var index = e.target.dataset.index;
  var count = this.data.carts[index].count;
  if (count<20){
    this.data.carts[index].count++;
  }
  this.setData({
    carts: this.data.carts
  });
  this.priceCount();
},
  delCount: function (e) {
    var index = e.target.dataset.index;
    var count = this.data.carts[index].count;
    if (count > 0) {
      this.data.carts[index].count--;
    }
    this.setData({
      carts: this.data.carts
    });
    this.priceCount();
  },
  priceCount: function(){
    this.data.totalMoney = 0;
    for (var i = 0; i < this.data.carts.length; i++){
      if (this.data.carts[i].isSelect == true) {
        this.data.totalMoney = this.data.totalMoney + (this.data.carts[i].price * this.data.carts[i].count);
      }
    }
    this.setData({
      totalMoney: this.data.totalMoney,
    })
  },
  delGoods: function (e) {
    this.data.carts.splice(e.target.id.substring(3), 1);
    if (this.data.carts.length > 0) {
      this.setData({
        carts: this.data.carts
      })
      wx.setStorageSync('cart', this.data.carts);
      this.priceCount();
    } else {
      this.setData({
        cart: this.data.carts,
        iscart: false,
        hidden: true,
      })
      wx.setStorageSync('cart', []);
    }
  }

  
})