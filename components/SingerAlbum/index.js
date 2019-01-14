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
    num: 21,
    albumList:[],
  },
  ready(){
    this.getData()
  },
  methods: {
    lodeMore() {
      this.getData()
    },
    getData(){
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
          url: App.common.u,
          data: {
            api: App.api.singerAlbum,
            param: {
              singermid: this.data.singer_mid,
              begin: this.data.begin,
              num: this.data.num,
            }
          }
        }).then((res) => {
          let albumListArr = res.data.list
          albumListArr.forEach((item, index) => {
            item.pic = App.image(item.album_mid, 2)
          })
          // 分页加载
          let hasMore = true;
          if (!albumListArr.length || albumListArr.length < this.data.num) {
            hasMore = false
          }
          // 合并数组
          let addAlbumList = this.data.albumList;
          let albumList = addAlbumList.concat(albumListArr);
          // console.log(albumList)
          this.setData({
            albumList: albumList,
            begin: this.data.begin + this.data.num,
            hasMore: hasMore,
            loaded: true
          },()=>{
            this.triggerEvent('albumTotal', {
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
    }
  }
})
