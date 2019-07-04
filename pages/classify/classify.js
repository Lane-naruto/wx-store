// pages/classify/classify.js
const ajax = require('../../utils/ajax.js');
const utils = require('../../utils/util.js');
Page({
  data: {
    classifyItems: [],
    curNav: 1,
    curIndex: 0
  },
  onLoad: function (options) {
    var that = this;
    that.classifyShow();
  },
  classifyShow: function (success) {
    var that = this;
    ajax.request({
      url: 'classify/getShopClassifyList?key=' + utils.key,
      success: data => {
        that.setData({
          classifyItems: data.result
        })
        console.log(data.result)
      }
    })
  },
  switchRightTab: function(e){
    let id = e.target.dataset.id,
    index = parseInt(e.target.dataset.index);  
    this.setData({
      curNav: id,
      curIndex: index
    })
  }
  
})