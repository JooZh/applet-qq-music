const App = getApp()
Page({
  data: {
    ready: false,
    hasMore: true,
    loaded: true,

    scrollTop: 0,           
    singerlist: [],
    tags: {},
    letter: -100,
    area: -100,
    genre: -100,
    sex: -100,
    sin: 0,
    page: 1,
    errorImg: 'https://y.gtimg.cn/mediastyle/global/img/singer_300.png?max_age=31536000',
  },


  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    let timer = setTimeout(() => {
      this._getData();
      clearTimeout(timer)
    }, 500)
  },
  // 图片错误
  imgError(e) {
    if (e.type == 'error') {
      let id = e.currentTarget.dataset.errorid;
      let singerlist = this.data.singerlist;
      singerlist[id].singer_avatar = this.data.errorImg
      this.setData({
        singerlist: singerlist
      })
    }
  },
  // 下拉加载下一页
  lodeMore() {
    let timer = setTimeout(() => {
      this._getData();
      clearTimeout(timer)
    }, 500)
  },
  // 点击打开歌手详情
  openSinger(e) {
    let singermid = e.currentTarget.dataset.id;
    let singername = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/SingerDetail/index?singermid=${singermid}&singername=${singername}`
    })
  },
  // 点击切换类目 重置 各种数据
  sexChange(e) {
    let id = e.currentTarget.dataset.id;
    this._changeSetData(id,'sex')
  },
  genreChange(e) {
    let id = e.currentTarget.dataset.id;
    this._changeSetData(id,'genre')
  },
  letterChange(e) {
    let id = e.currentTarget.dataset.id;
    this._changeSetData(id,'letter')
  },
  areaChange(e) {
    let id = e.currentTarget.dataset.id;
    this._changeSetData(id,'area')
  },
  _changeSetData(id,str){
    this.setData({
      hasMore: true,
      scrollTop: 0,
      singerlist: [],
      [str]: id,
      sin: 0,
      cur_page: 1
    }, () => {
      this._getData()
    })
  },
  // 获取数据
  _getData() {
    // 判断是否还能加载更多 
    if (!this.data.hasMore) {
      return;
    }
    // 或者正在加载数据
    if (!this.data.loaded){
      return;
    }
    this.setData({
      loaded: false
    }, () => {
      App.axios({
        url: App.common.u,
        data: {
          api: App.api.singerList,
          param: {
            area: this.data.area,
            sex: this.data.sex,
            genre: this.data.genre,
            index: this.data.letter,
            sin: this.data.sin,
            cur_page: this.data.page
          }
        }
      }).then((res) => {
        let singerarr = res.data.singerlist;
        // 小程序不支持webp图片
        singerarr.forEach((item,index)=>{
          item.singer_avatar = App.image(item.singer_mid,1)
        })
        // 判断当前读取的数据是否存在或者小于包含条数
        let hasMore = true;
        if (!singerarr.length || singerarr.length < 80) {
          hasMore = false
        }
        // 合并数组
        let addSingerlist = this.data.singerlist;
        let singerlist = addSingerlist.concat(singerarr);
        // 第一次的时候处理标签
        if (this.data.page == 1) {
          let tags = res.data.tags;
          tags.index[0].name = '热';
          this.setData({ tags: tags})
        }
        this.setData({
          singerlist: singerlist,
          sin: this.data.sin + 80,
          page: this.data.page + 1,
          ready: true,
          hasMore: hasMore,
          loaded: true
        }, () => {
          wx.hideLoading()
        })
      })
    })
  }
})