const db = wx.cloud.database()

Page({

  data: {
    image_url: 'https://7765-wechatdevelop-b98915-1258857271.tcb.qcloud.la/index/person_1.jpg?sign=5b37344d6eed8bd4355370f59ad5e289&t=1582463978'
  },
  
  onLoad: function (options) {
    db.collection('welcome').get().then((res) => {
      this.setData({
        image_url:res.data[0].image_url
      })
    })
  },

  nav_album: function (res) {
    wx.navigateTo({
      url: '../album/album'
    })
  },

  onShareAppMessage: function () {

  }

})