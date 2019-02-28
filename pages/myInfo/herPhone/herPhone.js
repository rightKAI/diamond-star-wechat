// pages/myInfo/uPhone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: ''
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

  /*
  获取她的手机号
  */
  mobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  /* 
  点击确定校验手机正则
  */
  btnClick: function (e) {
    let mobile = this.data.mobile;
    console.log(mobile);
    if (mobile == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
      return false
    } else if (mobile.length != 11) {
      wx.showToast({
        title: '手机号长度有误',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
      return false;
    }
    let herPhone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!herPhone.test(mobile)) {
      wx.showToast({
        title: '您输入的手机号有误',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      return false;
    }
    return false;
  }
})