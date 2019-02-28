var app = getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
 * 获取用户地址
 */
const getLocaltion = (promise,fail) => {
  // 获取经纬度和定位门店
  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      var latitude = res.latitude // 纬度
      var longitude = res.longitude // 经度
      var locaCache = {};
      locaCache.lat = res.latitude;
      locaCache.lng = res.longitude;
      wx.setStorageSync("locaCache", locaCache);
      var speed = res.speed
      var accuracy = res.accuracy
      var localtionInfo = {}
      promise(res)
      //请求列表接口
      // app.ajax({
      //   url: '/store/getRecentlyStore',
      //   data: {
      //     lat: latitude,
      //     lng: longitude
      //   },
      //   success: function (res) {
      //     promise(res)
      //   }
      // })
    },
    fail: (res) => {
      if (fail) {
        fail()
      }
    }
  })
}
/**
 * 跳转校验
 */
const navigateFnc = (url) => {
  var isLogin = app.getUserInfo().token ? true : false
  if (isLogin) {
    wx.navigateTo({
      url: url
    })
  } else {
    wx.showToast({
      title: '请先登录玛丽莱星球',
      icon: 'none',
      duration: 1000
    })
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/star/star'
      })
    },1000)
  }
}
module.exports = {
  formatTime: formatTime,
  getLocaltion: getLocaltion,
  navigateFnc: navigateFnc
}
