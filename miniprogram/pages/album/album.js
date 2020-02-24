const db = wx.cloud.database()
const _ = db.command
const limit = 20
const sql = { _id: _.neq(1) }


Page({

  data: {
    list: [],
    isEndOfList: false,
  },

  onLoad: function (options) {
    this.getData()
  },

  getData: async function () {
    let res = await db.collection('album').where(sql).skip(this.data.list.length).get()
    this.setData({
      list: [...this.data.list, ...res.data], //合并数据
      isEndOfList: res.data.length < limit ? true : false //判断是否数据结束
    })
  },

  nav_picture: function (res) {
    let title = res.currentTarget.dataset.title
    wx.navigateTo({
      url: '../picture/picture?title='+title,
    })
  },
  
  nav_create_album: function (res) {
    wx.navigateTo({
      url: '../create/create',
    })
  },

  onReachBottom: function (res) {
    !this.data.isEndOfList && this.getData()
  },

  onShareAppMessage: function () {

  }

})