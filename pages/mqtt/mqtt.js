//index.js
//获取应用实例
var app = getApp()
var arr_name = ["设备1", "设备2", "待开发", "其他", "其他", "其他", "其他", "其他",
  "其他", "其他", "其他", "其他", "其他", "其他", "其他",
  "其他", "其他", "其他", "其他", "其他", "其他"]
var arr_link = [1, 10, 15, 52, 62, 68, 75, 82, 98, 112, 147, 161, 218, 166, 182,
  188, 192, 197, 202, 205, 212, 227, 132]
var file = "../../pages/list/list"
Page({
  data: {
    items: [{
      id: "1",
      src: "../../images/number1.png",
      text: arr_name[0],
      url: "client/client?type=1"
    }, {
      id: "10",
        src: "../../images/numbe2.png",
      text: arr_name[1],
        url: "client/client?type=2"
      }],
    url: file,

  },
  onLoad: function () {
    
  },
  onShow: function () {

  }
})
