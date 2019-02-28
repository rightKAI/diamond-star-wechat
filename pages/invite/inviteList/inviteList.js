// pages/invite/inviteList/inviteList.js
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteList: []
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
    that.setData({
      userInfo: app.getUserInfo()
    })
    that.getInviteList()
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
  * 获取邀请列表
  */
  getInviteList: () => {
    app.ajax({
      url: '/yxinvite/getInviteList',
      data: {
        token: app.getUserInfo().token,
        pageNo: 1,
        pageSize: 100
      }
    }, (res) => {
      res.data.data.map((item,index) => {
        if (index === 0) {
          item.imgNum = 'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/yx_applet/invite/img_sy_04_01.png'
          item.crown = 'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/yx_applet/invite/icon_sy_01.png'
        }
        else if (index < 9) {
          item.imgNum = 'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/yx_applet/invite/img_sy_04_0'+ (index+1) +'.png'
          if (index === 1) {
            item.crown = 'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/yx_applet/invite/icon_sy_02.png'
          } else if (index === 2) {
            item.crown = 'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/yx_applet/invite/icon_sy_03.png'
          }
        } else if (index === 9) {
          item.imgNum = 'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/yx_applet/invite/img_sy_04_10.png'
        }
      })
      that.setData({
        inviteList: res.data.data
      })
    })
  }
})