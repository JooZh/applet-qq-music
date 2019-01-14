const App = getApp()
Page({
  data: {
    ready:0,
    url: '',
    pic: '',
    otherList: [],
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    let timer = setTimeout(() => {
      this._getData(options.id)
      clearTimeout(timer)
    }, 500)
  },
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  getPlay(e) {
    this.videoContext.pause();
    let vid = e.currentTarget.dataset.id
    this._getData(vid)
  },
  _getData(vid) {
    let getMvUrl = new Promise(resolve => {
      App.axios({
        url: App.common.u,
        data: {
          api: App.api.getMvUrl,
          inCharset: 'utf8',
          outCharset: 'GB2312',
          param: {
            vids: [vid],
          }
        }
      }).then((res) => {
        resolve(res.data.url);
      })
    });
    let getMvInfo = new Promise(resolve => {
      App.axios({
        url: App.common.u,
        data: {
          api: App.api.getMvInfo,
          param: {
            vidlist: [vid],
          }
        }
      }).then((res) => {
        resolve(res.data.url);
      })
    })
    let getMvOther = new Promise(resolve => {
      App.axios({
        url: App.common.u,
        data: {
          api: App.api.getMvOther,
          param: {
            vid: vid
          }
        }
      }).then((res) => {
        res.data.forEach((item, index) => {
          let s = item.playcnt;
          item.playcnt = (s / 10000).toFixed(2)
        })
        resolve(res.data);
      })
    })
    Promise.all([
      getMvUrl, 
      getMvInfo,
      getMvOther
    ]).then((values) => {
      this.setData({
        url: values[0],
        pic: values[1],
        otherList: values[2],
        ready:1
      },()=>{
        this.videoContext.play();
        wx.hideLoading()
      })
    })
  }
})