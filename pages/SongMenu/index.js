const App = getApp()
Page({
  data: {
    infosHeight: 0,
    fixed: false,
    ready: 0,
    hasMore: true,
    loaded: true,
    menuList: [],
    targs:[],
    sortId:5,
    categoryId: 10000000,
    selectTag:{},
    sin: 0,
    ein: 29,
  },
  onLoad(options) {
    wx.showLoading({
      title: '加载中...',
    })
    this._getInfosHeight();
    this.getTags();
  },
  onReachBottom(){
    this.getData()
  },
  areaChange(e) {
    let id = e.currentTarget.dataset.id;
    if (id == this.data.categoryId){
      return
    }
    this.setData({
      menuList:[],
      hasMore: true,
      categoryId:id,
      sin: 0,
      ein: 29
    },()=>{
      this.getData();
    })
  },
  changeAll(){
    if (this.data.categoryId == 10000000){
      return
    }
    this.setData({
      menuList: [],
      hasMore: true,
      categoryId: 10000000,
      sin: 0,
      ein: 29
    }, () => {
      this.getData();
    })
  },
  changeTop(e){
    console.log(e)
    let sortId = e.currentTarget.dataset.sortid;
    this.setData({
      menuList: [],
      hasMore: true,
      sortId: sortId,
      sin: 0,
      ein: 29
    }, () => {
      this.getData();
    })
  },
  getTags(){
    App.axios({
      url: App.common.c,
      data: {
        api: App.api.songMenuTags,
        format: 'json',
        inCharset: 'utf8',
        outCharset: 'utf-8',
      }
    }).then((res) => {
      let selectTag = res.data[0];
      res.data.shift()
      this.setData({
        selectTag: selectTag,
        targs: res.data
      },()=>{
        this.getData();
      })
    })
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
          api: App.api.songMenuList,
          picmid:1,
          format:'json',
          inCharset:'utf8',
          outCharset:'utf-8',
          categoryId: this.data.categoryId,
          sortId: this.data.sortId,
          sin:this.data.sin,
          ein:this.data.ein
        }
      }).then((res) => {
        let menuListArr = this._menuHandler(res.data);
        // 分页加载
        let hasMore = true;
        if (!menuListArr.length || menuListArr.length < 30) {
          hasMore = false
        }
        // 合并数组
        let addArr = this.data.menuList;
        let menuList = addArr.concat(menuListArr);
        this.setData({
          menuList: menuList,
          hasMore: hasMore,
          loaded: true,
          ready:1,
          sin: this.data.sin + 30,
          ein: this.data.ein + 30,
        },()=>{
          wx.hideLoading()
        })
      });
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
  _menuHandler(list){
    let arr = [];
    list.forEach((item)=>{
      let obj = {
        pic: item.imgurl,
        dissname: item.dissname,
        dissid: item.dissid,
        creator_name: item.creator.name,
        listen_count: (item.listennum / 10000).toFixed(2),
        pub_time: item.commit_time
      }
      arr.push(obj)
    })
    return arr
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