//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var currentTimeIn = Date.now();
    console.log(currentTimeIn)
    var baidu_token = wx.getStorageSync('baidu_token') || {}
    if (baidu_token) {
      if (baidu_token.time - Date.now() <= 300000) {
        this.sysBaiduOpenApiToken();
      }
    }
    var _this = this;
    setTimeout(function () {
      console.log('start ........')
      wx.setStorageSync('baidu_token', baidu_token)
      _this.sysBaiduOpenApiToken();
    }, 5)

  },
  
  sysBaiduOpenApiToken: function () {
    var currentTimeIn = Date.now();
    var baidu_token = wx.getStorageSync('baidu_token') || {}
    if (baidu_token) {
      if (baidu_token.time - Date.now() <= 300000) {
        console.log("request ...")
        this.getBaiduOpenApiToken(function (baidu_token) {
          console.log(baidu_token);
          baidu_token.time = Date.now() + 7200000
          wx.setStorageSync('baidu_token', baidu_token)
        });
      } else {
        console.log("have ...")
      }
    }
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null
  }
})