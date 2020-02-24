const db = wx.cloud.database()
const date = new Date()

Page({

  data: {
    photosNew: []
  },

  onLoad: function (options) {

  },

  create_title: function (event) {
    this.setData({
      title: event.detail.value
    })
  },

  upload_image: function () {
    const uploadTasks = this.data.photosNew.map(item => this.uploadPhoto(item.src))
    if(this.data.title === undefined || this.data.photosNew[0] === undefined) {
      wx.showToast({
        title: '都写好了吗？',
        icon: 'loading',
        duration: 500
      })
    }else {
      Promise.all(uploadTasks).then((result) => {
        db.collection('album').add({
          data: {
            title:this.data.title,
            date: date.toLocaleDateString(),
            image_url: result[0].fileID
          }
        })
          .then(res => {
            wx.showToast({
              title: 'Ok',
              duration: 500
            })
            wx.navigateTo({
              url: '../album/album',
            })
          })
      })
    }
  },

  //选择图片
  chooseImage: function () {
    const items = this.data.photosNew
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        let tempFilePaths = res.tempFilePaths
        for (const tempFilePath of tempFilePaths) {
          items.push({
            src: tempFilePath
          })
        }
        this.setData({
          photosNew: items,
        })
      }
    })
  },

  // 上传图片
  uploadPhoto(filePath) {
    return wx.cloud.uploadFile({
      cloudPath: `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}.png`,
      filePath
    })
  },

  // 预览图片
  previewImage(e) {
    const current = e.target.dataset.src
    const photos = this.data.photosNew.map(photo => photo.src)
    wx.previewImage({
      current: current.src,
      urls: photos
    })
  },

  // 删除图片
  cancel(e) {
    const index = e.currentTarget.dataset.index
    const photos = this.data.photosNew.filter((p, idx) => idx !== index)
    this.setData({
      photosNew: photos
    })
  },

  onShareAppMessage: function () {

  }
})