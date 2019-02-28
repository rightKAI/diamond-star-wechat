// pages/star/feedBack/feedBack.js
const app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    minNum: 0,
    max: 200,
    value: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  // 字数自增
  numAdd: function (e) {
    var value = e.detail.value;
    var len = parseInt(value.length);
    if (len > this.data.max) return;
    this.setData({
      value: value,
      minNum: len
    })
  },
  // 提交反馈
  submitBack: function () {
    that = this;
    var value = this.data.value;
    if (value == '') {
      wx.showToast({
        title: '输入的内容不能为空',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      return false;
    }
    app.ajax({
        url: '/userFeedback/save?token=' + app.getUserInfo().token + '&content=' + that.data.value,
        method: 'POST'
      },
      (res) => {
        wx.showToast({
          title: '反馈成功',
          icon: 'success',
          duration: 1000,
          mask: false,
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      })
  }
})