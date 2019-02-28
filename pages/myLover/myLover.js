// pages/myLover/myLover.js
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appointmentDate: '',
    checkLove: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    this.setData({
      options: options
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
    this.setData({
      checkLove: app.getUserInfo().checkLove
    })
    if (app.getUserInfo().checkLove) {
      wx.switchTab({
        url: '/pages/star/star'
      })
    }
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
   *  1情侣
   */
  bindLover: (event) => {
    // 保存
    if (event.detail.value.nickName) {
        if (event.detail.value.phoneNumber) {
          var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
          if (!myreg.test(event.detail.value.phoneNumber)) {
            wx.showToast({
              title: '请输入正确的手机号码',
              icon: 'none',
              duration: 1000
            })
            return false
          } else if (!that.data.appointmentDate) {
            wx.showToast({
              title: '请选择他的生日',
              icon: 'none',
              duration: 1000
            })
            return false
          }
          app.ajax({
            url: '/myFamily/add',
            method: 'POST',
            data: {
              token: app.getUserInfo().token,
              name: event.detail.value.nickName,
              mobile: event.detail.value.phoneNumber,
              birthday: that.data.appointmentDate
            },
            fail: () => {
              wx.showToast({
                title: '情侣不能绑定自己噢',
                icon: 'none',
                duration: 1000
              })
              return false
            }
          }, (res) => {
            var userInfo = wx.getStorageSync('USER_INFO')
            userInfo.checkLove = true
            wx.showToast({
              title: '绑定成功'
            })
            wx.setStorage({
              key: "USER_INFO",
              data: userInfo,
              success: () => {
                setTimeout(() => {
                  if (that.data.options.page) {
                    wx.navigateBack({
                      delta: 1
                    })
                  } else {
                    wx.navigateTo({
                      url: '/pages/myLover/love/love',
                    })
                  }
                },500)
              }
            })
          })
        } else {
          wx.showToast({
            title: '请输入手机号码',
            icon: 'none',
            duration: 1000
          })
          return false
        }
      } else {
        wx.showToast({
          title: 'TA的名字不能为空噢',
          icon: 'none',
          duration: 1000
        });
        return
      }
  },
  /**
   * 选择生日
   */
  appointmentDate: (event) => {
    console.log(event)
    that.setData({
      appointmentDate: event.detail.value
    })
    console.log(that.data.appointmentDate)
  },
  
})