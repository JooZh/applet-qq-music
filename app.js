//app.js
import {axios} from './api/axios.js';
import {api,common} from './api/api.js';
import {image} from './api/image.js';

App({
  onLaunch: function () {
    wx.getNetworkType({
      success: (res)=> {
        this.appData.networkType = res.networkType
      }
    }),
    wx.onNetworkStatusChange((res)=>{
      let notice = res.isConnected ? `网络已连接${res.networkType}` : '网络已断开';
      wx.showToast({
        title: notice,
        icon: 'none',
        duration: 2000
      })
      this.appData.networkType = res.networkType
    })
  },
  appData: {
    confirmNetwork: false,  // 是否已经确认过网络提示
    networkType:'',         // 当前的网络类型

    playerList: [],          // 播放列表    
    playerData: {
      playSong: {},           // 当前播放歌曲信息
      playSongid: 0,          // 当前播放的歌曲songid
      playSongindex: 0,       // 当前播放的歌曲列表位置
      playSongUrl: '',        // 当前播放的歌曲连接
      playLyric: [],          // 当前播放的歌词列表
      playLyricIndex: 0,      // 当前显示的歌词行数
      playLyricPlace: 0,      // 当前显示的歌词滚动的位置
      playLyricShow: 's',     // 当前显示的是歌词还是cd s为cd   
      playListState: 0,       // 当前播放列表状态 1列表循环，2单曲循环，3随机播放
      playStatus: 0,          // 当前播放状态
      playImage: '',          // 当前播放的图片连接
      playTime: 0,            // 当前播放的时间
      playProgress: 0,        // 当前进度条位置
    }
  },
  
  axios: axios,
  api: api,
  common: common,
  image: image,

})