import { song } from '../../tools/song.js';
const App = getApp()
Page({
  data: {
    infosHeight: 0,
    fixed: false,
    songlist:[],
    topInfo:{},
    ready:0,
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    this._getInfosHeight();
    wx.setNavigationBarTitle({
      title: options.title,
    })
    let timer = setTimeout(() => {
      this.getData(options.id)
      clearTimeout(timer)
    }, 500)
  },
  getData(id) {
    App.axios({
      url: App.common.c,
      data: {
        api: App.api.topListDetail,
        platform: 'h5',
        needNewCode: 1,
        topid:id,
        page:'detail',
        tpl:3,
        type:'top',
      }
    }).then((res) => {
      let topInfo = res.data.topInfo;
      let pts = '';
      if (topInfo.day_of_year){
        pts = `第${topInfo.day_of_year}天`;
      }else{
        let str = topInfo.date.substr(5)
        pts = `第${str}周`;
      }
      let songlist = this._musicHander(res.data.songlist)
      topInfo.pts = pts;
      this.setData({
        topInfo: topInfo,
        songlist: songlist,
        ready:1,
      },()=>{
        wx.hideLoading()
      })
    })
  },
  onPageScroll(e){
    let fixed = false
    if (e.scrollTop > this.data.infosHeight) {
      fixed = true
    } else if (e.scrollTop < this.data.infosHeight) {
      fixed = false
    }
    this.setData({
      fixed: fixed
    })
  },
  playAll(){
    App.appData.playerList = this.data.songlist;
    let songid = this.data.songlist[0].songid
    // 跳转到play页面
    wx.navigateTo({
      url: `/pages/SongPlayer/index?songid=${songid}`
    })
  },
  // 处理歌曲数组
  _musicHander(list) {
    let musicList = [];
    list.forEach((item, index) => {
      musicList.push(song(item.data));
    });
    return musicList;
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