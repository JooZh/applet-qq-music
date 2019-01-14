const App = getApp();
Component({
  properties: {
    playSongindex:{
      type:Number,
      description:'当前播放的index'
    },
    playerList:{
      type:Array,
      description:'播放列表'
    },
    playerListEmpty:{
      type: Boolean,
      description: '清空播放列表'
    }
  },
  data: {
    musicList: [],
    playerData: {},
    deleteIndex:-1,
  },
  ready() {
    this.setData({
      musicList: this.data.playerList
    })
  },
  methods: {
    clearPlayerList(){
      this.setData({
        musicList:[]
      })
    },
    changeSong(e) {
      let index = e.currentTarget.dataset.index;
      this.setData({
        playSongindex:index,
      },()=>{
        this.triggerEvent('changeSong', {
          index: index
        });
      })
    },
    deleteSong(e){
      let index = e.currentTarget.dataset.index;
      this.triggerEvent('deleteSong', {
        index: index
      });
      this.setData({
        deleteIndex:index,
      },()=>{
        let timer = setTimeout(()=>{
          this.setData({
            musicList: this.data.playerList,
            deleteIndex: -1,
          })
          clearTimeout(timer)
        },300)
      })
    }
  }
})
