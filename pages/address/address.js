// pages/address/address.js
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    token: app.getUserInfo().token
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
  },
  updateAddress: () => {
    wx.navigateTo({
      url: '/pages/address/addAddress/add?update=1',
    })
  },

  // 修改地址
  updateAddress: (e) => {
    wx.navigateTo({
      url: '/pages/address/addAddress/add?addressInfo=' + e.currentTarget.dataset.addressinfo,
    })
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
      url: '/YXaddress/list',
      data: {
        token: app.getUserInfo().token
      }
    }, (res) => {
      that.setData({
        addressList: res.data.data
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
  
  }
})