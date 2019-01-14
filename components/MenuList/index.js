const App = getApp();
Component({
  properties: {
    menuList: {
      type: Array,
      description: '歌单列表'
    }
  },
  data: {
    defaultImg: 'https://y.gtimg.cn/mediastyle/global/img/playlist_300.png'
  },
  methods: {
    getDetail(e){
      let dissid = e.currentTarget.dataset.dissid;
      let dissname = e.currentTarget.dataset.title;
      wx.navigateTo({
        url: `/pages/SongMenuDetail/index?disstid=${dissid}&dissname=${dissname}`,
      })
    },
    imgError(e) {
      if (e.type == 'error') {
        let id = e.currentTarget.dataset.errorid;
        let changemenuList = this.data.menuList;
        changemenuList[id].pic = this.data.defaultImg
        this.setData({
          menuList: changemenuList
        })
      }
    }
  }
})
