const App = getApp();
Page({
  data: {
    ready:false,
    topList:[]
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    setTimeout(()=>{
      this.getData()
    },500)
  },
  getData(){
    App.axios({
      url: App.common.c,
      data: {
        api: App.api.topList,
        platform: 'h5',
        needNewCode: 1
      }
    }).then((res)=>{
      this.setData({
        topList:res.data,
        ready:true
      },()=>{
        wx.hideLoading()
      })
    })
  },
  goDetail(e){
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: `/pages/TopListDetail/index?id=${id}&title=${title}`,
    })
  }
})