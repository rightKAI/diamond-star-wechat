// pages/myInfo/nickName.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    token: app.getUserInfo().token
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      nickName: options.nickName
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

  // 修改昵称值
  nameInput: function (e) {
    this.setData({
      nickName: e.detail.value
    })

  },
  /* 
  删除
  */
  setDel: function (e) {
    this.setData({
      nickName: ''
    })
  },
  // 确定
  sendName: function (e) {
    var that = this
    var nickName = this.data.nickName
    var newName = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
    console.log(nickName);
    if (nickName == '') {
      wx.showToast({
        title: '昵称不能为空',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      return false;
    } else if (!newName.test(nickName)) {
      wx.showToast({
        title: '输入的昵称有误',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      return false;
    }
    app.ajax({
      url: '/yxuser/updateUser?token=' + that.data.token + '&nickName=' + nickName,
      method: 'POST'
    }, (res) => {
      console.log(res);
      wx.navigateBack({
        delta: 1
      });
      // wx.navigateTo({
      //   //url: "/yxuser/getInfo?token=" + that.data.token,
      //   url: "/pages/myInfo/myInfo?token=" + that.data.token
      // });
    })
  }
})