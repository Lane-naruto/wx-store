// pages/index/index.js
const ajax = require('../../utils/ajax.js')
const utils = require('../../utils/util.js')
var sectionData = [];
var loadMore = null
var page = 1
Page({
  data: {
    navbars: null,
    showTab:0,
    banner:null,
    menu:null,
    brands:null,
    newGoods:[],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    hidden: false
  },
  navTap: function(e){
    this.setData ({
      showTab: e.currentTarget.dataset.idx
    })
  },
  onLoad: function (options) {
    var that = this;
    that.navbarShow();
    that.bannerShow();
    that.menusShow();
    that.brandShow();
    that.goodsShow()
  },
  navbarShow: function(success){
    var that = this;
    ajax.request({
      data:'',
      url: 'home/navBar?key=' + utils.key,
      success: data =>   {
        that.setData({
          navbars: data.result
        })
        console.log(data)
      }
    }) 
  },
  bannerShow: function (success) {
    var that = this;
    ajax.request({
      data: '',
      url: 'home/banners?key=' + utils.key,
      success: data => {
        that.setData({
          banner: data.result
        })
        console.log(data)
      }
    })
  },
  menusShow: function (success) {
    var that = this;
    ajax.request({
      data: '',
      url: 'home/menus?key=' + utils.key,
      success: data => {
        that.setData({
          menu: data.result
        })
        console.log(data)
      }
    })
  },
  brandShow: function (success) {
    var that = this;
    ajax.request({
      method: 'GET',
      url: 'activity/brands?key=' + utils.key + '&type=temai&page=1&size=5',
      success: data => {
        that.setData({
          brands: data.result.list
        })
        console.log("brands：" + data)
      }
    })
  },
  goodsShow: function (success) {
    var that = this;
    ajax.request({
      method: 'GET',
      url: 'goods/getHotGoodsList?key=' + utils.key + '&page=' + page + '&size=10',
      success: data => {
        var goodsData = data.result.list
        console.log(data)
        page += 1
        if(loadMore){
          if (goodsData.length>0){
            for(var i in goodsData){
              var goodsName = goodsData[i].name
              if (goodsName.length>0){
                goodsData[i].name = goodsName.substring(0,23) + '...'
              }
            }
            sectionData['newGoods'] = sectionData['newGoods'].concat(goodsData);
          } else {
            loadMore = false;
            this.setData({
              hidden: true
            })
            wx.showToast({
              title: '暂无更多内容！',
              icon: 'loading',
              duration: 2000
            })
          }
        } else {
          if (loadMore == null) {
            loadMore = true;
            for (var i in goodsData) {
              var name = goodsData[i].name;
              if (name.length > 26) {
                goodsData[i].name = name.substring(0, 23) + '...';
              }
            }
            sectionData['newGoods'] = goodsData;
          }
        }
        that.setData({
          goods: sectionData['newGoods']
        });
        wx.stopPullDownRefresh();
      } 
    })
  },
  onReachBottom: function () {
    var that = this;
    if (loadMore != null) {
      that.goodsShow();
    }
  },
  goodsClickShow(goodsId) {
    var that = this;
    ajax.request({
      url: 'goods/addGoodsClickRate?key=' + utils.key + '&goodsId=' + goodsId,
    })
  },
  show:function(e){
    var that = this;
    var goodsId = e.currentTarget.dataset.goodsid;
    that.goodsClickShow(goodsId);
    wx.navigateTo({
      url: '../detail/detail?goodsId=' + goodsId,
    })
  },
  catchTapCategory: function (e) {
    var that = this;
    var goodsId = e.currentTarget.dataset.goodsid;
    that.goodsClickShow(goodsId);
    wx.navigateTo({ url: '../detail/detail?goodsId=' + goodsId })
  },
  onShareAppMessage:(() => {
    return {
      title: '转发标题',
      imageUrl: 'https://m.360buyimg.com/mobilecms/s750x366_jfs/t1/34869/14/3703/113972/5cb953c1E4294d8ea/b73c538710f5c462.jpg!cr_1125x549_0_72!q70.jpg.dpg' // 图片 URL
    }
  })

})