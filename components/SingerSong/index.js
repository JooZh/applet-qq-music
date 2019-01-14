import { song } from '../../tools/song.js';
const App = getApp();
Component({
  properties:{
    singer_mid:{
      type:String,
      description: '歌手的mid'
    }
  },
  data: {
    hasMore: true,
    loaded: true,
    begin:0,
    num:30,
    musicList:[],
    singerInfo: {
      singer_id: 0,
      singer_name: '',
      singer_avatar: '',
      singer_fance:0,
    },
  },
  ready(){
    this.getData()
  },
  methods: {
    lodeMore() {
      this._loadMore()
    },
    // 加载更多
    _loadMore(){
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
            api: App.api.singerDetail,
            order: 'listen',
            begin: this.data.begin,
            num: this.data.num,
            songstatus: 1,
            singermid: this.data.singer_mid
          }
        }).then((res) => {
          // console.log(res)
          let list = res.data.list;
          let musicListArr = this._musicHander(list)
          // 分页加载
          let hasMore = true;
          if (!musicListArr.length || musicListArr.length < this.data.num) {
            hasMore = false
          }
          // 合并数组
          let addMusicList = this.data.musicList;
          let musicList = addMusicList.concat(musicListArr);
          this.setData({
            musicList: musicList,
            begin: this.data.begin + this.data.num,
            hasMore: hasMore,
            loaded: true
          });
        })
      })
    },
    getData(){
      wx.showLoading({
        title: '加载中...',
      })
      App.axios({
        url: App.common.c,
        data: {
          api: App.api.singerFance,
          singermid: this.data.singer_mid
        }
      }).then((fance) => {
        App.axios({
          url: App.common.c,
          data: {
            api: App.api.singerDetail,
            order: 'listen',
            begin: this.data.begin,
            num: this.data.num,
            songstatus: 1,
            singermid: this.data.singer_mid
          }
        }).then((res) => {
          let data = res.data;
          // 分页加载
          let hasMore = true;
          if (!data.list.length || data.list.length < 30) {
            hasMore = false
          }
          this.setData({
            ['singerInfo.singer_fance']: (fance.data.num / 10000).toFixed(2),            
            ['singerInfo.singer_name']: data.singer_name,
            ['singerInfo.singer_avatar']: App.image(data.singer_mid),
            ['singerInfo.singer_id']: data.singer_id,
            musicList: this._musicHander(data.list),
            begin: this.data.begin + 30,
            hasMore: hasMore
          }, () => {
            this.triggerEvent('songTotal', {
              num: data.total,
              singerInfo: this.data.singerInfo
            });
            wx.hideLoading()
          });
        })
      });
    },
    // 监听一个滚动事件
    scrollEvent(e){
      this.triggerEvent('scrollTop', {
        scrollTop: e.detail.scrollTop
      });
    },
    // 处理歌曲数组
    _musicHander(list) {
      let musicList = [];
      list.forEach((item, index) => {
        musicList.push(song(item.musicData));
      });
      return musicList;
    }
  }
})
