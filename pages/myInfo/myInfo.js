// pages/myInfo/myInfo.js
// 获取App实例
const app = getApp()
var that
Page({
  /**
   * 页面的初始数据
   */
  data: {
    token: app.getUserInfo().token,
    sex: "",
    sexList: ['男', '女'],
    herBirthday: '',
    iconUrl: '', //用户icon
    nickName: '', //用户名
    sex: '', //性别
    mobile: '', //电话
    baby_birthday: '', //宝宝纪念日
    marry_day: '', //结婚纪念日
    userInfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.getUserInfo()
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
    that = this
    app.ajax({
      url: "/yxuser/getInfo?token=" + app.getUserInfo().token,
      method: 'POST'
    }, (res) => {
      that.setData({
        nickName: res.data.data.nick_name,
        sex: res.data.data.sex == 'M' ? '男' : '女',
        loveMobile: res.data.data.loveMobile,
        loveName: res.data.data.loveName,
        iconUrl: res.data.data.icon_url,
        mobile: res.data.data.phone,
        marry_day: res.data.data.marry_day,
        baby_birthday: res.data.data.baby_birthday,
        birthday: res.data.data.birthday.split(' ')[0],
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
  onUnload: function (e) {},

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
   * 点击性别弹出模态框
   */
  open: function () {
    var that = this;
    wx.showActionSheet({
      itemList: that.data.sexList,
      success: function (res) {
        if (!res.cancel) {
          // console.log(that);
          that.setData({
            sex: that.data.sexList[res.tapIndex]
          })
          app.ajax({
            url: "/yxuser/updateUser?token=" + app.getUserInfo().token + '&sex=' + that.data.sex,
            method: 'POST',
            success: function (res) {
              console.log(res)
            }
          })
        }
      }
    });
  },

  /* 
  生日改变事件
  */
  bindDateChange: function (e) {
    app.ajax({
      url: "/yxuser/updateUser?token=" + app.getUserInfo().token + '&birthday=' + e.detail.value,
      method: 'POST'
    }, (res) => {
      this.setData({
        birthday: e.detail.value
      })
      wx.showToast({
        title: '设置爱人生日成功~',
        icon: 'none'
      })
    })
  },

  /* 
  结婚纪念日改变事件
  */
  marryDayChange: function (e) {
    app.ajax({
      url: "/yxuser/updateUser?token=" + app.getUserInfo().token + '&marryDay=' + e.detail.value,
      method: 'POST'
    }, (res) => {
      this.setData({
        marry_day: e.detail.value
      })
      wx.showToast({
        title: '设置结婚纪念日成功~',
        icon: 'none'
      })
    })
  },

  /* 
  宝宝生日babyBirthDayChange
  */
  babyBirthDayChange: function (e) {
    app.ajax({
      url: "/yxuser/updateUser",
      method: 'POST',
      data: {
        token: app.getUserInfo().token,
        babyBirthday: e.detail.value
      }
    },(res) => {
      this.setData({
        baby_birthday: e.detail.value
      })
      wx.showToast({
        title: '设置宝宝生日成功~',
        icon: 'none'
      })
    })
  }
})