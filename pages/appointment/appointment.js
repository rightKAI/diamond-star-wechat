// pages/appointment/appointment.js
const app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendAddress: [],
    appointmentList: [],
    token: app.getUserInfo().token,
    sendFlagList: [],
    sendFlag: false
  },
  getAddress: function (event) {
    let data = event.currentTarget.dataset
    if (that.data.sendFlag) {
      wx.showToast({
        title: '你还有短信在发送中窝~',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if ((data.status === 1 || data.status === 2) && that.data.sendFlagList[data.index]) {
      app.ajax({
        url: '/yxstore/sendStoreLocationSms',
        data: {
          storeId: data.storeid,
          phone: data.phone,
          exchangeSn: data.exchangesn,
          token: that.data.token
        }
      }, (rsp) => {
        let sendFlagList = that.data.sendFlagList
        sendFlagList[data.index] = false
        that.setData({
          sendFlagList: sendFlagList
        })
        let sendAddress = that.data.sendAddress
        let time = 60
        wx.showToast({
          title: '短信发送成功',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          sendFlag: true
        })
        var timer = setInterval(() => {
          sendAddress[data.index] = time+'s后可重新发送'
          if (time < 0) {
            sendAddress[data.index] = '重新发送'
            sendFlagList[data.index] = true
            that.setData({
              sendAddress: sendAddress,
              sendFlagList: sendFlagList,
              sendFlag: false
            })
            clearInterval(timer)
          } else {
            that.setData({
              sendAddress: sendAddress
            })
          }
          time--
        }, 1000)
      },'短信发送中') 
    }
  },
  getAppiontment: () => {
    app.ajax({
      url: '/yxstore/listAppointment',
      data: {
        token: app.getUserInfo().token,
      }
    }, (rsp) => {
      rsp.data.data.map(item => {
        if ((item.status !== 1 && item.status !== 2)) {
          item.cardState = false
          item.appointmentState = '已完成'
        } else if (item.make_status === 0) {
          item.cardState = false
          item.appointmentState = '已取消'
        }else{
          item.cardState = true
        }
      })
      that.setData({
        appointmentList: rsp.data.data,
        sendAddress: Array(rsp.data.data.length).fill('发送地址到手机'),
        sendFlagList: Array(rsp.data.data.length).fill(true)
      })
    })
  },
  cancelAppointment: (event) => {
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
              id: data.id,
              token: app.getUserInfo().token
            }
          }, (res) => {
            wx.showToast({
              title: '取消成功',
            })
            that.getAppiontment()
          })
        } else {
        }
      }
    })
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
    that = this
    this.getAppiontment(this)
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