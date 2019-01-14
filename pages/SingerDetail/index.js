const App = getApp()
Page({
  data: {
    current: 0,
    singer_mid: '',
    singerInfo: {},
    song_total: 0,
    album_total: 0,
    mv_total: 0,

    infosHeight: 0,
    fixed: false,
    scrollTop: 0,
    // 采用透明
    ready: 0,
  },
  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    this.setData({
      singer_mid: options.singermid
    })
    wx.setNavigationBarTitle({
      title: options.singername,
    })
  },
  // 子组件加载的数据
  albumTotal(e) {
    this._totals(e.detail.num, 'album_total')
  },
  songTotal(e) {
    this._totals(e.detail.num, 'song_total')
    this.setData({
      singerInfo: e.detail.singerInfo,
      ready: 1
    },()=>{
      // 获取infos节点的高度
      this._getInfosHeight();
    })
  },
  mvTotal(e) {
    this._totals(e.detail.num, 'mv_total')
  },
  _totals(num, str) {
    this.setData({
      [str]: num
    })
  },
  // 切换tab
  swiperChange(e) {
    let current = e.detail.current;
    this.setData({
      current: current,
    })
  },
  tabChange: function(e) {
    let current = e.currentTarget.dataset.current;
    if (this.data.current === current) {
      return;
    }
    this.setData({
      current: current,
    })
  },
  // 监听页面滚动
  scrollTop(e) {
    let scrollTop = e.detail.scrollTop;
    let fixed = false
    if (scrollTop > this.data.infosHeight) {
      fixed = true
    } else if (scrollTop < this.data.infosHeight) {
      fixed = false
    }
    this.setData({
      scrollTop: scrollTop,
      fixed: fixed
    })
  },
  // 获取infos节点的高度
  _getInfosHeight() {
    let query = wx.createSelectorQuery();
    query.select('#infos').boundingClientRect((res) => {
      this.setData({
        infosHeight: res.height
      });
    }).exec();
  },
})