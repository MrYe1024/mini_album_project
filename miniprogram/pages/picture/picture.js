const db = wx.cloud.database()
const limit = 20

Page({

  data: {
    list: []
  },

  onLoad: function(options) {
    let title = options.title
    this.setData({
      title: title
    })
    wx.cloud.callFunction({
      name: 'login'
    })
      .then(res => {
        this.setData({
          openid: res.result.openid
        })
      })
      .catch(console.error)
    this.getData()
  },

  getData: async function() {
    let res = await db.collection('picture').where({
      title: this.data.title
    }).skip(this.data.list.length).get()
    this.setData({
      list: [...this.data.list, ...res.data], //合并数据
      isEndOfList: res.data.length < limit ? true : false //判断是否数据结束
    })
  },

  upload_image: function (res) {
    if (this.data.openid !== '你的openid') {
      wx.showToast({
        title: '你不是志远',
        icon: 'loading',
        duration: 1000
      })
    } else {
      wx.chooseImage({
        count: 9,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempFilePaths = res.tempFilePaths
          for (let i = 0; i < tempFilePaths.length; i++) {
            wx.cloud.uploadFile({
              cloudPath: `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}.png`,
              filePath: tempFilePaths[i]
            }).then((res) => {
              db.collection('picture').add({
                data: {
                  title: this.data.title,
                  image_url: res.fileID
                }
              }).then((res) => {
                let result_i = i + 1;
                if (result_i === tempFilePaths.length) {
                  this.getData()
                  wx.showToast({
                    title: '添加成功',
                    duration: 500
                  })
                }
              })
            }).catch((err) => {
              console.log(err)
            })
          }
        }
      })
    }
  },

  preview_image: function(res) {
    let imageUrl = res.currentTarget.dataset.imageurl
    let urls = []
    for (let i = 0; i < this.data.list.length; i++) {
      urls.push(this.data.list[i].image_url)
    }
    wx.previewImage({
      current: imageUrl,
      urls: urls
    })
  },

  onReachBottom: function() {
    !this.data.isEndOfList && this.getData()
  },

  onShareAppMessage: function() {

  }

})