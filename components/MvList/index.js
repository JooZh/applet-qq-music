const App = getApp()
Component({
  properties: {
    mvList:{
      type:Array
    }
  },
  data: {
    defaultImg: 'https://y.gtimg.cn/mediastyle/global/img/mv_300.png?max_age=31536000'
  },

  methods: {
    getPlay(e) {
      let id = e.currentTarget.dataset.id
      if (App.appData.confirmNetwork || App.appData.networkType == 'wifi') {
        wx.navigateTo({
          url: '/pages/MvPlayer/index?id=' + id,
        })
      } else {
        wx.showModal({
          title: '提示',
          content: `当前网络状态是${App.appData.networkType},观看视频会消耗大量移动数据。`,
          showCancel: true,
          confirmText: '继续',
          cancelText: '返回',
          success: (res) => {
            if (res.confirm) {
              App.appData.confirmNetwork = true;
              wx.navigateTo({
                url: '/pages/MvPlayer/index?id=' + id,
              })
            }
          }
        })
      }
    }
  }
})
