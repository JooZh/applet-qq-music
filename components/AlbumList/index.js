const App = getApp();
Component({
  properties: {
    albumList: {
      type: Array,
      description: '专辑列表'
    }
  },
  data: {
    defaultImg: 'https://y.gtimg.cn/mediastyle/global/img/playlist_300.png'
  },
  methods: {
    getDetail(e) {
      let albumid = e.currentTarget.dataset.albumid;
      let title = e.currentTarget.dataset.title;
      wx.navigateTo({
        url: `/pages/AlbumDetail/index?album_mid=${albumid}&albumname=${title}`,
      })
    },
    imgError(e) {
      if (e.type == 'error') {
        let id = e.currentTarget.dataset.errorid;
        let changealbumList = this.data.albumList;
        changealbumList[id].pic = this.data.defaultImg
        this.setData({
          albumList: changealbumList
        })
      }
    }
  }
})
