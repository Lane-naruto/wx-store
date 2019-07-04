// pages/detail/detail.js
const ajax = require('../../utils/ajax.js');
const utils = require('../../utils/util.js');
var imgUrls = [];
var detailImg = [];
var goodsId = null;
var goods = null;
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000, 
    duration: 1000,
    isLike: false,
    showDialog: false,
    goods: null,  
  },
  addLike() {
    this.setData({
      isLike: !this.data.isLike
    });
    ajax.request({
      method: 'GET',
      url: 'collection/addShopCollection?key=' + utils.key + '&goodsId=' + goodsId,
      success: data => {
        console.log("收藏返回结果：" + data.message)
        wx.showToast({
          title: data.message,
          icon: 'success',
          duration: 2000
        });
      }
    })
  },
  toCar() {
    wx.switchTab({ url: '../cart1/cart1' })
  },
  immeBuy() {
    wx.showToast({
      title: '购买成功',
      icon: 'success',
      duration: 2000
    });
  },
  onLoad: function (options) {
    var that = this;
    goodsId = options.goodsId;
    that.goodsInfoShow();
  },
  goodsInfoShow: function(){
    var that = this;
    ajax.request({
      url: 'goods/getGoodsInfo?key=' + utils.key + '&goodsId=' + goodsId,
      success:data => {
        var goodsItem = data.result;
        console.log('dd' + JSON.stringify(data))
        for (var i = 0; i < goodsItem.shopGoodsImageList.length; i++) {
          imgUrls[i] = goodsItem.shopGoodsImageList[i].imgUrl;
        }
        var details = goodsItem.details.split(";");
        for (var j = 0; j < details.length; j++) {
          detailImg[j] = details[j];
        }
        goods = {
          imgUrls: imgUrls,
          title: goodsItem.name,
          price: goodsItem.price,
          privilegePrice: goodsItem.privilegePrice,
          detailImg: detailImg,
          imgUrl: goodsItem.imgUrl,
          buyRate: goodsItem.buyRate,
          goodsId: goodsId,
          count: 1,
          totalMoney: goodsItem.price,
        }
        that.setData({
          goods: goods
        })
      }
      
    })
  },
  toggleDialog: function () {
    this.setData({
      showDialog: !this.data.showDialog
    })
  },
  closeDialog: function(){
    this.setData({
      showDialog: false
    })
  },
  addCount: function(){
    var count = this.data.goods.count;
    if(count<20){
      this.data.goods.count++;
    }
    this.setData({
      goods: this.data.goods
    })
    this.totalPrice()
  },
  delCount: function () {
    var count = this.data.goods.count;
    if (count > 1) {
      this.data.goods.count--;
    }
    this.setData({
      goods: this.data.goods
    })
    this.totalPrice()
  },
  totalPrice: function(){
    this.data.goods.totalMoney = this.data.goods.price * this.data.goods.count;
    this.setData({
      goods: this.data.goods
    })
  },
  addCar: function(){
    var goods = this.data.goods;
    var count = this.data.goods.count;
    var title = this.data.goods.title;
    goods.isSelect = false;
    if (title.length>13){
      goods.title = title.substring(0, 13) + '...';
    }
    var arr = wx.getStorageSync('cart') || [];
    if(arr.length>0){
      for(var j in arr){
        if(arr[j].goodsId == goodsId){
          arr[j].count = arr[j].count+1;
          try {
            wx.setStorageSync('cart', arr)
          } catch (e) {
            console.log(e)
          }
          wx.showToast({
            title: '加入购物车成功！',
            icon: 'success',
            duration: 2000
          });
          this.closeDialog(); 
          return;
        }
      }
      arr.push(goods);
    }else{
      arr.push(goods);
    }
    try {
      wx.setStorageSync('cart', arr)
      wx.showToast({
        title: '加入购物车成功！',
        icon: 'success',
        duration: 2000
      });
      this.closeDialog();
      return;
    } catch (e) {
      console.log(e)
    }
  }
})