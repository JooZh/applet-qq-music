const App = getApp();
Component({
  properties: {
    musicList: {
      type: Array,
      description: '歌曲列表'
    },
  },
  methods: {
    // 点击播放
    getPlay(e) {
      // 添加到列表
      let index = e.currentTarget.dataset.index;
      this.pushPlayList(index);
      // 跳转到play页面
      wx.navigateTo({
        url: `/pages/SongPlayer/index?songid=${this.getSongid(index)}`
      })
    },
    // 点击添加歌曲
    addPlay(e) {
      let index = e.currentTarget.dataset.index;
      let notice;
      if (this.isInPlayList(index) == -1){
        this.pushPlayList(index);
        notice = '添加成功'
      }else{
        notice = '歌曲已存在'
      }
      wx.showToast({
        title: notice,
        icon: 'none',
        duration: 500
      })
    },
    /*------------------------------------------
    * 添加之前的判断方法
    *------------------------------------------*/
    // 添加歌曲到列表
    pushPlayList(index) {
      if (this.isInPlayList(index) == -1) {
        App.appData.playerList.unshift(this.data.musicList[index]);
      }
    },
    // 判断添加歌曲是否已经在列表
    isInPlayList(index) {
      let find = App.appData.playerList.findIndex(song => {
        return song.songid == this.getSongid(index)
      });
      return find;
    },
    // 获取歌曲的id
    getSongid(index) {
      return this.data.musicList[index].songid;
    }
  }
})
