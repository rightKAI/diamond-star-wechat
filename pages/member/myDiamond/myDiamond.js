// pages/member/myDiamond/myDiamond.js
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: true,
    diamond: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.ajax({
      url: '/yxuser/getUserDiamondList',
      data: {
        token: app.getUserInfo().token,
        type: 0
      }
    }, (res) => {
      var list = res.data.data.list
      list.map(item => {
        item.createTime = item.createTime.split(" ")[0]
      })
      that.setData({
        diamondInfo: res.data.data,
        list: list
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 弹出层函数
   */
  showPop: function () {
    this.setData({
      flag: false
    })

  },
  //消失
  hide: function () {
    this.setData({
      flag: true
    })
  },
})