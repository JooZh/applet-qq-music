const App = getApp();
Component({
  properties: {
    singer_mid: {
      type: String,
      description: '歌手的mid'
    }
  },
  data: {
    hasMore: true,
    loaded: true,
    begin: 0,
    num: 20,
    mvList: [],
  },
  ready() {
    this.getData()
  },
  methods: {
    lodeMore() {
      this.getData()
    },
    getData() {
      // 判断是否还能加载更多 
      if (!this.data.hasMore) {
        return;
      }
      // 或者正在加载数据
      if (!this.data.loaded) {
        return;
      }
      this.setData({
        loaded: false
      }, () => {
        App.axios({
          url: App.common.c,
          data: {
            api: App.api.singerMv,
            order: 'listen',
            cid: 205360581,
            begin: this.data.begin,
            num: this.data.num,
            singermid: this.data.singer_mid
          }
        }).then((res) => {
          let mvListArr = res.data.list;
          mvListArr.forEach((item, index) => {
            let s = item.listenCount;
            item.listenCount = (s / 10000).toFixed(2)
          })
          // 分页加载
          let hasMore = true;
          if (!mvListArr.length || mvListArr.length < this.data.num) {
            hasMore = false
          }
          // 合并数组
          let addMvList = this.data.mvList;
          let mvList = addMvList.concat(mvListArr);
          this.setData({
            mvList: mvList,
            begin: this.data.begin + this.data.num,
            hasMore: hasMore,
            loaded: true
          }, () => {
            this.triggerEvent('mvTotal', {
              num: res.data.total
            });
          })
        });
      })
    },
    // 监听一个滚动事件
    scrollEvent(e) {
      this.triggerEvent('scrollTop', {
        scrollTop: e.detail.scrollTop
      });
    },
    
  },
})