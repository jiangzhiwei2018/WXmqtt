const util = require('../../../utils/util.js')
var mqtt = require('../../../utils/mqtt.min.js')
const crypto = require('../../../utils/hex_hmac_sha1.js')
var app = getApp()
var clients=null;
Page({
  data: {
    subscribe:'/a1ioaELpsed/test/user/cha/dy',
    publish:'/a1ioaELpsed/test/user/chat2/fb',
    type:0,
    scrollTop:0,
    motto: 'Hello World',
    message: '设备1调试ing',
    token: '',
    tmpleData: [{
      id: '',
      msg: '',
      dateTime: ''
    }],
    userInfo: {},
    deviceConfig :{
      productKey: "a1ioaELpsed",
      deviceName: "test",
      deviceSecret: "ejPlHPPXPyTMdpHa3nYjxq9zdkKfa21b",
      regionId: "cn-shanghai"
    },
    deviceConfig2: {
      productKey: "a1ioaELpsed",
      deviceName: "test2",
      deviceSecret: "yJZZsFp2pJZ2RGy9JE8we1RrS9LpJ2Ls",
      regionId: "cn-shanghai"
    }
  },
  onLoad: function (option) {
    console.log('onLoad')
    var that = this
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    this.setData({
      type: option.type,
    });
    switch (this.data.type){
      case '1':
       console.log("1");
      break;
      case '2':
        console.log("第二个 2");
        this.setData({
          message:'设备2调试ing',
          deviceConfig: this.data.deviceConfig2,
          publish:'/a1ioaELpsed/test2/user/chat2/fb',
          subscribe:'/a1ioaELpsed/test2/user/chat2/dy'
        });
      break;
      default:
        console.log(this.data.type);
      break;
    }
    console.log(option.type);
    this.doConnect();
  },
  doConnect() {
    const deviceConfig = this.data.deviceConfig;
    const that=this;
    const options = this.initMqttOptions(deviceConfig);
    console.log(options)
    //替换productKey为你自己的产品的
    const client = mqtt.connect('wxs://a1ioaELpsed.iot-as-mqtt.cn-shanghai.aliyuncs.com', options);
    client.on('connect', function () {
      console.log('连接服务器成功')
      //订阅主题，替换productKey和deviceName
      client.subscribe(that.data.subscribe, function (err) {
        if (!err) {
          console.log("订阅成功");
          clients=client;
          //发布
         client.publish(that.data.publish,"用户"+that.data.type+'上线了');
        }
      })
    })
    //接收消息
    client.on('message', function (topic, message) {
      that.getMessage(message);
      console.log('收到消息：' + message.toString())
      
      //关闭连接 client.end()
    })
  },
  //收到来自另外的用户消息时回调
  getMessage:function(message){
    const that=this;
    var _tmpleData = that.data.tmpleData;
    // message is Buffer
    _tmpleData.push({
      id: '2',
      msg: message.toString(),
      dateTime: util.formatTime(new Date)
    });
    that.setData({
      tmpleData: _tmpleData,
      scrollTop: (_tmpleData.length - 1) * 100
    })
  },
  //发送消息时回调
   senMessage: function (message) {
    const that = this;
    var _tmpleData = that.data.tmpleData;
    // message is Buffer
    _tmpleData.push({
      id: '1',
      msg: message.toString(),
      dateTime: util.formatTime(new Date)
    });
     console.log((_tmpleData.length - 1) * 1000);
    that.setData({
      tmpleData: _tmpleData,
    
    })
  },
  //IoT平台mqtt连接参数初始化
  initMqttOptions(deviceConfig) {
    const params = {
      productKey: deviceConfig.productKey,
      deviceName: deviceConfig.deviceName,
      timestamp: Date.now(),
      clientId: Math.random().toString(36).substr(2),
    }
    //CONNECT参数
    const options = {
      keepalive: 60, //60s
      clean: true, //cleanSession不保持持久会话
      protocolVersion: 4 //MQTT v3.1.1
    }
    //1.生成clientId，username，password
    options.password =this.signHmacSha1(params, deviceConfig.deviceSecret);
    options.clientId = `${params.clientId}|securemode=2,signmethod=hmacsha1,timestamp=${params.timestamp}|`;
    options.username = `${params.deviceName}&${params.productKey}`;
    console.log(options.password);
    return options;
  },
  /*
    生成基于HmacSha1的password
    参考文档：https://help.aliyun.com/document_detail/73742.html?#h2-url-1
  */
  signHmacSha1(params, deviceSecret) {
    let keys = Object.keys(params).sort();
    // 按字典序排序
    keys = keys.sort();
    const list = [];
    keys.map((key) => {
      list.push(`${key}${params[key]}`);
    });
    const contentStr = list.join('');
    return crypto.hex_hmac_sha1(deviceSecret, contentStr);
  },
  
  sendBt: function () {
    console.log(this.data.inputValue);
    var _this = this;
    var _tmpleData = _this.data.tmpleData;
    console.log(_tmpleData);
    _tmpleData.push({
      id: '1',
      msg: this.data.inputValue,
      dateTime: util.formatTime(new Date)
    });
    _this.setData({
      tmpleData: _tmpleData,
      scrollTop: (_tmpleData.length - 1) *100
    });
    clients.publish(_this.data.publish, _this.data.inputValue);
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value,
    })
  },
  onHide:function(){
  },
  onUnload:function(){
    clients.end();
    console.log("finsh");
  }
})