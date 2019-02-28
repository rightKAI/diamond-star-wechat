// pages/member/member.js
const app = getApp()
const util = require('../../utils/util.js')
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityPage: [],
    diamondChange: '',
    memberInfo: {},
    token: app.getUserInfo().token
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.token)
    console.log(app.getUserInfo().token)
    var that = this
    //获取活动信息
    app.ajax({
      url: '/mllad/list?pageCode=yx_applet_rights'
    }, (rsp) => {
      rsp.data.data[0].contentList[0].pageUrl = '/pages/member/meetGift/meetGift?activitySn=10007'
      rsp.data.data[0].contentList[1].pageUrl = '/pages/member/caratGift/caratGift?activitySn=10006'
      rsp.data.data[0].contentList[2].pageUrl = '/pages/member/motherGift/motherGift?activitySn=10005'
      rsp.data.data[0].contentList[3].pageUrl = '/pages/member/babyGift/babyGift?activitySn=10008'

      setTimeout(() => {
        this.setData({
          activityPage: rsp.data.data[0].contentList,
          diamondChange: rsp.data.data[1].contentList
        })
      }, 0)
    })
  },
  // 获取积分信息
  getIntergral: () => {
    if (app.getUserInfo().token) {
      app.ajax({
        url: '/yxuser/getUserIntegral',
        data: {
          token: app.getUserInfo().token
        }
      }, (rsp) => {
        console.log(rsp)
        that.setData({
          memberInfo: rsp.data.data
        })
      })
    }
  }, 
  // 跳转校验
  navigateFnc: (e) => {
    var token = app.getUserInfo().token
    if (e.currentTarget.dataset.key === 'change' && token) {
      if (that.data.memberInfo.diamond <= 0) {
        wx.showModal({
          title: '温馨提示',
          content: '哎呀，你口袋里没有钻石，先去邀请好友赚钻石吧!',
          showCancel: false
        })
      } else if (that.data.memberInfo.diamondStatus) {
        wx.showModal({
          title: '温馨提示',
          content: '您已经预约过钻石兑换啦，期待您到店~',
          showCancel: false
        })
      } else {
        util.navigateFnc(e.currentTarget.dataset.url)
      }
    } else {
      util.navigateFnc(e.currentTarget.dataset.url)
    }
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
    this.getIntergral()
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