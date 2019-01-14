import { song } from '../../tools/song.js';
const App = getApp()
Page({
  data: {
    infosHeight: 0,
    fixed: false,
    imageList: [],
    mvList:[],
    ready: 0,
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    this._getInfosHeight();
    this.getData()
  },
  getData() {
    let mvList = new Promise(resolve=>{
      App.axios({
        url: App.common.c,
        data: {
          api: App.api.homeMvList,
          cmd: 'shoubo',
          lan: 'all'
        }
      }).then((res) => {
        let mvListArr = [];
        res.data.forEach(item => {
          let s = (item.listennum / 10000).toFixed(2);
          let obj = {
            pic: item.picurl,
            vid: item.vid,
            title: item.mvtitle,
            listenCount: s
          };
          mvListArr.push(obj)
        })
        resolve(mvListArr)
      })
    });
    let imageList = new Promise(resolve=>{
      App.axios({
        url: App.common.u,
        data: {
          api: App.api.homeFocusImage,
        }
      }).then((res) => {
        resolve(res.data)
      })
    });

    Promise.all([mvList, imageList]).then(values=>{
      this.setData({
        imageList: values[1],
        mvList: values[0],
        ready:1
      },()=>{
        wx.hideLoading()
      })
    })
  },
  onPageScroll(e) {
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