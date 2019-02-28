// pages/myLover/love/love.js
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loverInfo: [],
    activityPage: [],
    untieFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    this.getBannerInfo()
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
    this.getLoverInfo()
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
   * 获取情侣信息
   */
  getLoverInfo: () => {
    app.ajax({
      url: '/myFamily/list',
      data: {
        token: app.getUserInfo().token
      }
    }, (res) => {
      console.log(res)
      var newPhone = res.data.data.listMylove[0].mobile.slice(0, 3)+ '****' + res.data.data.listMylove[0].mobile.slice(-4)
      res.data.data.listMylove[0].createTime = res.data.data.listMylove[0].createTime.split(" ")[0]
      that.setData({
        newPhone: newPhone,
        loverInfo: res.data.data.listMylove[0]
      })
    })
  },
  /**
   * 获取广告位信息
   */
  getBannerInfo: () => {
    //获取活动信息
    app.ajax({
      url: '/mllad/list?pageCode=yx_applet_rights'
    }, (rsp) => {
      rsp.data.data[0].contentList[0].pageUrl = '/pages/member/meetGift/meetGift?activitySn=10007'
      rsp.data.data[0].contentList[1].pageUrl = '/pages/member/caratGift/caratGift?activitySn=10006'
      rsp.data.data[0].contentList[2].pageUrl = '/pages/member/motherGift/motherGift?activitySn=10005'
      rsp.data.data[0].contentList[3].pageUrl = '/pages/member/babyGift/babyGift?activitySn=10008'
      setTimeout(() => {
        that.setData({
          activityPage: rsp.data.data[0].contentList
        })
      }, 0)
    })
  },
  /**
    *弹窗模块 
  */
  showConfirm: () => {
    that.setData({
      untieFlag: true
    })
  },
  cancelTap: () => {
    that.setData({
      untieFlag: false
    })
  },
  untieTap: () => {
    app.ajax({
      url: '/myFamily/delete',
      method: 'POST',
      data: {
        token: app.getUserInfo().token,
        id: that.data.loverInfo.id
      }
    }, (res) => {
      console.log(res)
      wx.showToast({
        title: '解绑成功',
        duration: 1000
      })
      var userInfo = wx.getStorageSync('USER_INFO')
      userInfo.checkLove = false
      wx.setStorage({
        key: "USER_INFO",
        data: userInfo,
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/star/star'
            })
          }, 500)
        }
      })
    })
  }
})