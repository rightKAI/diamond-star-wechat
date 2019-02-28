// pages/giftCard/giftCardDetail/giftCardDetail.js
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAppointment: true,
    sendText: '发送地址到手机',
    sendFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    wx.setNavigationBarTitle({
      title: options.cardName
    })
    this.setData({
      optionsUrl: options
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
    if (that.data.optionsUrl.isAppointment == 0 && !that.data.isAppointment_preve) {
      this.setData({
        isAppointment: true
      })
      this.getGiftInfo()
    } else {
      this.setData({
        isAppointment: false
      })
      this.getAppointmentInfo()
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
   * 礼券领取页面
   */
  getGiftInfo: () => {
    app.ajax({
      url: '/yxcoupon/couponShow',
      data: {
        activitySn: that.data.optionsUrl.activitySn,
        activityGoodsTypeId: that.data.optionsUrl.activityId,
        interactId: that.data.optionsUrl.interactId,
        activityContentId: that.data.optionsUrl.activityContentId,
        token: app.getUserInfo().token
      }
    },(res) => {
      console.log(res)
      that.setData({
        detailList: res.data.data[0].wx_describe,
        activityContent: res.data.data[0].ActivityContent,
        num: res.data.data[0].num
      })
    })
  },
  /**
   * 礼券已领取页面
   */
  getAppointmentInfo: () => {
    app.ajax({
      url: '/yxcoupon/seeDetails',
      data: {
        activitySn: that.data.optionsUrl.activitySn,
        activityGoodsTypeId: that.data.optionsUrl.activityId,
        id: that.data.id_preve || +that.data.optionsUrl.id,
        activityContentId: that.data.optionsUrl.activityContentId,  
        token: app.getUserInfo().token
      }
    },(res) => {
      var item = res.data.data[0].store[0]
      that.setData({
        detailList: res.data.data[0].wx_describe,
        activityContent: res.data.data[0].activityContent
      })
      if (item.status === 0) {
        that.setData({
          cardState: false,
          appointmentState: '已完成'
        })
      } else if (item.status === 1) {
      that.setData({
        cardState: true,
        appointmentState: '已领取'
      })} else if (item.make_status === 0) {
        that.setData({
          cardState: false,
          appointmentState: '已取消'
        })
      } else {
        that.setData({
          cardState: true,
        })
      }
      that.setData({
        storeData: res.data.data[0].store[0]
      })
    })
  },
  /**
   * 发送地址
   */
  sendAddress: () => {
    if (that.data.sendFlag) {
      return false
    }
    app.ajax({
      url: '/yxstore/sendStoreLocationSms',
      data: {
        storeId: that.data.storeData.storeId,
        phone: that.data.storeData.phone,
        token: app.getUserInfo().token
      }}, (res) => {
        wx.showToast({
          title: '短信发送成功',
          duration: 1000,
          icon: 'success'
        })
        that.setData({
          sendFlag: true
        })
        var time = 60
        var sendText
        var timer = setInterval(() => {
          sendText = time + 's后可重新发送'
          if (time < 0) {
            sendText = '重新发送'
            that.setData({
              sendText: sendText,
              sendFlag: false
            })
            clearInterval(timer)
          } else {
            that.setData({
              sendText: sendText
            })
          }
          time--
        }, 1000)
    },'短信发送中')
  },
  /**
   * 取消预约
   */
  cancelAppointment: (event) => {
    console.log(event.currentTarget)
    wx.showModal({
      content: '取消后可重新预约',
      confirmText: "确认取消",
      cancelText: "不取消",
      success: function (res) {
        if (res.confirm) {
          let data = event.currentTarget.dataset
          app.ajax({
            url: '/yxstore/cancelMake',
            method: 'POST',
            data: {
              id: event.currentTarget.dataset.id,
              token: app.getUserInfo().token
            }
          }, (res) => {
            wx.showToast({
              title: '取消成功',
            })
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            },500)
          })
        } else {
        }
      }
    })
  }
})