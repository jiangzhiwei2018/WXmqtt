//index.js
//获取应用实例
const app = getApp()
var isEmptyObject = function (e) {
  var temp;
  for (temp in e)
    return !1;
  return !0
}
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.reLaunch({
      url: '../mqtt/mqtt'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e);
    var failuserInfo={
      avatarUrl: "/images/users.png",
      nickName:"测试用户"
    }
    if (e.detail.errMsg=="getUserInfo:fail 登录用户不是该小程序的开发者"){
      console.log(1);
      app.globalData.userInfo = failuserInfo;
      this.setData({
        userInfo: failuserInfo,
        hasUserInfo: true
      });

    }else{
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
    }
    wx.reLaunch({
      url: '../mqtt/mqtt'
    })
  }
})
