// pages/shopList/shopList.js
var app = getApp()
const util = require('../../utils/util.js')
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flagNav: true,
    cityList: [],
    currentItem: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    this.setData({
      options: options
    })
    this.getStoreList()
    this.getStoreBymy()
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
  /**
   * tab 切换
   */
  selectThis: (event) => {
    if (event.currentTarget.dataset.key === 1) {
      // 城市筛选
      that.setData({
        flagNav: false
      })
    } else {
      that.setData({
        flagNav: true
      })
    }
  },
  /**
   * 关闭弹窗
   */
  closeShaixian: () => {
    // 城市筛选
    that.setData({
      flagNav: true
    })
  },
  /**
   * 获取城市数据
   */
  getStoreList: () => {
    app.ajax({
      url: '/yxsee/cityList',
    }, (res) => {
      that.setData({
        cityList: res.data.data.cityList
      })
    })
  },
  /**
   * 城市选择
   */
  cityBtn: (event) => {
    that.setData({
      currentItem: event.currentTarget.dataset.id,
      currentName: event.currentTarget.dataset.name
    })
  },
  /**
   * 全部
   */
  allBtn: () => {
    that.setData({
      currentItem: '',
      currentName: ''
    })
  },
  /**
   * 确定选择
   */
  getInfo: (lat,lng) => {
    let data = {
      cityName: that.data.currentName || ''
    }
    if (lat && lng) {
      data.lat = lat
      data.lng = lng
    }
    app.ajax({
      url: '/yxsee/list?page=1&limit=100',
      method: 'POST',
      data: data
    },(res) => {
      that.setData({
        storeList: res.data.data.rows
      })
    })
  },
  /**
   * 确定选择
   */
  subit: () => {
    let locaCache = wx.getStorageSync('locaCache')
    that.getInfo(locaCache.lat, locaCache.lng)
    that.setData({
      flagNav: true
    })
  },
  /**
   * 获取附近门店
   */
  getStoreBymy: () => {
    var locaCache = wx.getStorageSync('locaCache')
    if (locaCache) {
      that.getInfo(locaCache.lat, locaCache.lng)
    } else {
      util.getLocaltion((res) => {
        that.getInfo(res.latitude, res.longitude)
      })
    }
  },
  /**
   * 预约进店
   */
  appointment: (event) => {
    if (that.data.options.h5) {
      wx.navigateTo({
        url: '/pages/intoShop/intoShop?h5=true&storeId=' + event.currentTarget.dataset.id
      })
    } else {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2]
      prevPage.setData({
        storeId_prev: event.currentTarget.dataset.id
      })
      wx.navigateBack({
        delta: 1
      })
    }
    
  }
})