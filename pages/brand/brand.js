
const ajax = require('../../utils/ajax.js');
const utils = require('../../utils/util.js');
var sectionData = [];
var ifLoadMore = null;
var activityId = null;
var page = 1;
Page({

  data: {
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: []
  },

  onLoad: function (options) {
    activityId = options.activityId;
    page = 1;
    ifLoadMore = null;
    console.log('activityId:' + activityId);
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;

        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });
        this.brandShow();
      }
    })
  },

  onImageLoad1: function (e) {
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width;        
    let oImgH = e.detail.height;        
    let imgWidth = this.data.imgWidth;  
    let scale = imgWidth / oImgW;       
    let imgHeight = oImgH * scale;      

    let images = this.data.brandGoods;
    let imageObj = null;

    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img.id + "" === imageId) {
        imageObj = img;
        break;
      }
    }

    imageObj.height = imgHeight;

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;

    if (col1.length <= col2.length) {
      col1.push(imageObj);
    } else {
      col2.push(imageObj);
    }

    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2
    };

    if (!loadingCount) {
      data.images = [];
    }

    this.setData(data);
  },

  brandShow: function (success) {
    var that = this;
    console.log(page)
    ajax.request({
      method: 'GET',
      url: 'goods/getActivityGoodsList?key=' + utils.key + '&activityId=' + activityId + '&page=' + page + '&size=10',
      success: data => {
        var newGoodsData = data.result.list;
        page += 1;
        if (ifLoadMore) {
          if (newGoodsData.length > 0) {
            console.log(newGoodsData)
            sectionData['brandGoods'] = newGoodsData;
          } else {
            ifLoadMore = false;
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
          if (ifLoadMore == null) {
            ifLoadMore = true;
            sectionData['brandGoods'] = newGoodsData;
          }
          else {
            sectionData['brandGoods'] = newGoodsData;
          }
        }
        that.setData({
          brandGoods: sectionData['brandGoods'],
          loadingCount: sectionData['brandGoods'].length,
        });
        console.log(that.data.brandGoods)
        wx.stopPullDownRefresh();
      }
    })
  },

  catchTapCategory: function (e) {
    var that = this;
    var goodsId = e.currentTarget.dataset.goodsid;
    console.log('goodsId:' + goodsId);
    that.goodsClickShow(goodsId);
    wx.navigateTo({ url: '../detail/detail?goodsId=' + goodsId })
  },
  goodsClickShow(goodsId) {
    console.log('增加商品用户点击数量');
    var that = this;
    ajax.request({
      method: 'GET',
      url: 'goods/addGoodsClickRate?key=' + utils.key + '&goodsId=' + goodsId,
      success: data => {
        console.log("用户点击统计返回结果：" + data.message)
      }
    })
  },
})
