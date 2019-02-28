// pages/giftCard/giftCard.js
var that
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    that = this
    that.getGiftCardList()
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
   * 获取礼券列表
   */
  getGiftCardList: () => {
    app.ajax({
      url: '/yxcoupon/list',
      data: {
        token: app.getUserInfo().token
      }
    }, (res) => {
      let data = res.data.data
      data.map((item,index) => {
        if (item.status == 0) { 
          item.cardState = 0
        } else if (item.status == 1) {
          item.cardState = 1 // 已领取 未兑换
        }else if (item.status == 2) {
          item.cardState = 2 // 已完成
        } else {
          item.cardState = 1 // 已领取
        }
      })
      that.setData({
        giftCardList: res.data.data
      })
    })
  },
  /**
   * 卡券按钮
   */
  useCard: (e) => {
    let data = e.currentTarget.dataset
    if (data.ismaturity) {
      if (data.cardstate === 0) {
        wx.navigateTo({
          url: '/pages/giftCard/giftCardDetail/giftCardDetail?isAppointment=0&activityId=' + data.activityid + '&activitySn=' + data.activitysn + '&id=' + data.id + '&interactId=' + data.interactid + '&activityContentId=' + data.activitycontentid + "&cardName=" + data.cardname
        })
      } else if (data.cardstate === 1) {
        wx.navigateTo({
          url: '/pages/giftCard/giftCardDetail/giftCardDetail?isAppointment=1&activityId=' + data.activityid + '&activitySn=' + data.activitysn + '&id=' + data.id + '&interactId=' + data.interactid + '&activityContentId=' + data.activitycontentid + "&cardName=" + data.cardname
        })
      }
    } else {
      wx.showToast({
        title: '礼券未生效',
        icon: 'none',
        duration: 1000
      })
    }
  }
})