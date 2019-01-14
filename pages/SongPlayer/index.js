const App = getApp();
const music = wx.getBackgroundAudioManager();
Page({
  data: {
    // 进度条
    progress_color: '#ffcd32',
    // 播放列表展开
    openList: '0',
    // 被选择的列表数据
    playListStateSelect: [{
        status: 0,
        name: '列表循环'
      },{
        status: 1,
        name: '单曲循环'
      },{
        status: 2,
        name: '随机播放'
      },
    ],
    playerList:[],
    // 播放数据
    playerData: {
      playSong: {},           // 当前播放歌曲信息
      playSongid: 0,          // 当前播放的歌曲songid
      playSongindex: 0,       // 当前播放的歌曲列表位置
      playSongUrl: '',        // 当前播放的歌曲连接
      playLyric: [],          // 当前播放的歌词列表
      playLyricIndex: 0,      // 当前显示的歌词行数
      playLyricPlace: 0,      // 当前显示的歌词滚动的位置
      playLyricShow: 's',     // 当前显示的是歌词还是cd false为cd   
      playListState: 0,       // 当前播放列表状态 1列表循环，2单曲循环，3随机播放
      playStatus: 0,          // 当前播放状态
      playImage: '',          // 当前播放的图片连接
      playTime: 0,            // 当前播放的时间
      playProgress: 0,        // 当前进度条位置
    }
  },
  onLoad: function(options) {
    // 点击新歌曲进入
    if (options.songid) {
      this.setData({
        playerList: App.appData.playerList
      },()=>{
        this.getPlaySong(options.songid)
      })
    } else {
      // 获取全局播放数据
      this.setData({
        playerList: App.appData.playerList,
        playerData: App.appData.playerData
      }, () => {
        if (!this.data.playerList.length){
          wx.setNavigationBarTitle({
            title: '暂无歌曲'
          });
        }else{
          wx.setNavigationBarTitle({
            title: this.data.playerData.playSong.songname
          });
          this.readPlay()
          this.listenTime();
          this.playEnd()
        }
      })
    }
  },
  // 切换cd和歌词
  toggleShow(e) {
    let status = e.currentTarget.dataset.status
    App.appData.playerData.playLyricShow = status;
    this.setData({
      ['playerData.playLyricShow']: status
    })
  },
  // 播放列表点击切换
  changeSong(e){
    let index = e.detail.index;
    let songid = this.data.playerList[index].songid
    this.getPlaySong(songid)
    this._setPlayStatus0()
  },
  // 播放列表点击删除
  deleteSong(e){
    let index = e.detail.index;
    let playSongindex = this.data.playerData.playSongindex
    App.appData.playerList.splice(index, 1)
    let playerList = App.appData.playerList
    this.setData({
      playerList: playerList
    },()=>{
      if (index == playSongindex) {
        let songid = this.data.playerList[index].songid
        this.getPlaySong(songid)
        this._setPlayStatus0()
      } else if (index < playSongindex) {
        App.appData.playerData.playSongindex = playSongindex - 1
        this.setData({
          ['playerData.playSongindex']: playSongindex-1,
        })
      }
    })
  },
  // 清空播放列表 
  clearPlayerList(){
    wx.showModal({
      title: '确定要清空播放列表？',
      success:res =>{
        if (res.confirm) {
          App.appData.playerList = [];
          this.selectComponent('#playList').clearPlayerList()
          this.setData({
            playerList: [],
            playerListEmpty:true
          })
        }
      }
    })
  },
  // 获得当前需要播放的歌曲信息
  getPlaySong(songid) {
    let playList = this.data.playerList;
    let song = playList.find(song => song.songid == songid)
    let index = playList.findIndex(song => song.songid == songid)
    // 设置导航标题栏位歌曲名称
    wx.setNavigationBarTitle({
      title: song.songname
    });
    // 获取播放链接
    let playSongUrl = new Promise(resolve => {
      App.axios({
        url: App.common.c,
        data: {
          api: App.api.songPlayUrl,
          cid: 205361747,
          songmid: song.songmid,
          filename: song.filename,
          guid: 9449044610
        }
      }).then((res) => {
        resolve(res.data.url)
      })
    })
    // 获取歌词
    let playLyric = new Promise(resolve => {
      App.axios({
        url: App.common.c,
        data: {
          api: App.api.songLyric,
          songmid: song.songmid
        }
      }).then((res) => {
        resolve(res.data.lines)
      })
    })
    // 获取图片
    let playImage = new Promise(resolve => {
      resolve(App.image(song.songImage, 2))
    })
    Promise.all([playSongUrl, playLyric, playImage]).then((values) => {
      App.appData.playerData.playSong = song;
      App.appData.playerData.playSongindex = index;
      App.appData.playerData.playImage = values[2];
      App.appData.playerData.playSongUrl = values[0];
      App.appData.playerData.playSongid = song.songid;
      App.appData.playerData.playLyric = values[1];
      this.setData({
        ['playerData.playSong']: song,
        ['playerData.playSongindex']: index,
        ['playerData.playImage']: values[2],
        ['playerData.playSongUrl']: values[0],
        ['playerData.playSongid']: song.songid,
        ['playerData.playLyric']: values[1],
      }, () => {
        this.createPlay();
        this.listenTime();
        this.playEnd()
      })
    })
  },
  // 创建背景播放
  createPlay() {
    music.src = this.data.playerData.playSongUrl;
    music.title = this.data.playerData.playSong.songname;
    music.epname = this.data.playerData.playSong.songname;
    music.coverImgUrl = this.data.playerData.playImage;
    music.singer = this.data.playerData.playSong.singer;
  },
  // 加载背景播放
  readPlay(){
    music.title = this.data.playerData.playSong.songname;
    music.epname = this.data.playerData.playSong.songname;
    music.coverImgUrl = this.data.playerData.playImage;
    music.singer = this.data.playerData.playSong.singer;
  },
  // 监听播放
  listenTime() {
    music.onTimeUpdate(() => {
      this.changeTime(Math.ceil(music.currentTime))
      this.changeLyric(Math.ceil(music.currentTime * 1000))
    })
  },
  // 进度条和时间变化
  changeTime(time) {
    // 计算数字显示时间
    let formatTime = this.formatTime(time)
    // 防止频发设置
    if (formatTime != this.data.playerData.playTime) {
      this.setData({
        ['playerData.playTime']: formatTime,
        ['playerData.playProgress']: time,
      })
      App.appData.playerData.playTime = formatTime;
      App.appData.playerData.playProgress = time;
    }
  },
  // 格式化时间
  formatTime(time) {
    let n = 0;
    let m = 0;
    let s = time % 60;
    if (time < 10) {
      n = 0;
      m = `0${time}`;
    } else if (time < 60) {
      n = 0;
      m = time;
    } else {
      n = Math.floor(time / 60);
      m = s < 10 ? `0${s}` : s;
    }
    return `${n}:${m}`
  },
  // 歌词滚动
  changeLyric(time) {
    let oLyric = this.data.playerData.playLyric;
    let index = oLyric.filter(item => time >= item.time).length;
    // 防止频发设置
    if (index != this.data.playerData.playLyricIndex + 1) {
      let changeIndex = index - 1;
      let changeDis = index < 7 ? 0 : (index - 6) * 30;
      App.appData.playerData.playLyricIndex = changeIndex;
      App.appData.playerData.playLyricPlace = changeDis;
      this.setData({
        ['playerData.playLyricIndex']: changeIndex,
        ['playerData.playLyricPlace']: changeDis
      })
    }
  },
  /*------------------------------------------
   * 播放控制
   *------------------------------------------*/
  // 设置播放状态为播放
  _setPlayStatus0() {
    App.appData.playerData.playStatus = 0;
    this.setData({
      ['playerData.playStatus']: 0
    })
  },
  // 设置播放状态为暂停
  _setPlayStatus1() {
    App.appData.playerData.playStatus = 1;
    this.setData({
      ['playerData.playStatus']: 1
    })
  },
  // 自动播放结束
  playEnd() {
    // 监听播放结束事件
    music.onEnded(() => {
      if(!this.data.playerList.length){
        music.pause();
        this._setPlayStatus1()
      }
      switch (this.data.playerData.playListState) {
        case 0:
          this._next();
          break;
        case 1:
          this.repeat();
          break;
        case 2:
          this.random();
          break;
      }
    });
  },
  // 点击播放
  play() {
    music.play();
    this._setPlayStatus0()
  },
  // 点击暂停
  pause() {
    music.pause();
    this._setPlayStatus1()
  },
  // 点击下一曲
  next() {
    switch (this.data.playerData.playListState) {
      case 0:
        this._next();
        break;
      case 1:
        this.repeat();
        break;
      case 2:
        this.random();
        break;
    }
  },
  // 点击上一曲
  prev() {
    switch (this.data.playerData.playListState) {
      case 0:
        this._prev();
        break;
      case 1:
        this.repeat();
        break;
      case 2:
        this.random();
        break;
    }
  },
  // 判断播放上一曲
  _prev() {
    let index = this.data.playerData.playSongindex;
    let long = App.appData.playerList.length - 1;
    if (index != 0) {
      index--;
    }else{
      index = long
    }
    this._start(index)
  },
  // 判断播放下一曲
  _next() {
    let index = this.data.playerData.playSongindex;
    let long = App.appData.playerList.length - 1;
    if (index != long) {
      index++;
    }else{
      index = 0
    }
    this._start(index)
  },
  // 切换后播放
  _start(index) {
    this.pause()
    let songid = App.appData.playerList[index].songid
    this._setPlay(songid)
  },
  // 切换后播放 延迟500
  _setPlay(songid) {
    let timer = setTimeout(() => {
      this.getPlaySong(songid);
      this._setPlayStatus0()
      clearTimeout(timer)
    }, 500)
  },
  // 重复播放
  repeat() {
    this.pause()
    let songid = this.data.playerData.playSong.songid;
    this._setPlay(songid)
  },
  // 随机播放
  random() {
    let listLength = App.appData.playerList.length;
    if (listLength < 2) {
      this.repeat()
    } else {
      let random = Math.floor(Math.random() * listLength)
      this._start(random)
    }
  },
  // 切换列表小循环事件
  changeListStatus() {
    let index = this.data.playerData.playListState;
    let long = this.data.playListStateSelect.length - 1;
    if (index == long) {
      index = 0
    } else {
      index++
    }
    App.appData.playerData.playListState = index;
    this.setData({
      ['playerData.playListState']: index,
    })
  },
  /*------------------------------------------
   * 播放进度条
   *------------------------------------------*/
  // 拖动后
  sliderChange(e) {
    music.seek(e.detail.value)
  },
  // 拖动中
  sliderChanging(e) {
    let currentTime = this.formatTime(e.detail.value)
    App.appData.playerData.playTime = currentTime;
    this.setData({
      ['playerData.playTime']: currentTime
    })
  },
  /*------------------------------------------
   * 播放列表
   *------------------------------------------*/
  // 打开列表
  openList() {
    this.setData({
      openList: '-100%'
    })
  },
  // 关闭列表
  closeList() {
    this.setData({
      openList: '0'
    })
  }
})