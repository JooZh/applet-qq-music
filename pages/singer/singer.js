const App = getApp()
Page({
  // 页面的初始数据
  data: {
    areas: [
      { 'key': "all_all", "value": "全部" },
      { 'key': "cn_man", "value": "华语男" },
      { "key": "cn_woman", "value": "华语女" },
      { "key": "cn_team", "value": "华语组合" },
      { "key": "k_man", "value": "韩国男" },
      { "key": "k_woman", "value": "韩国女" },
      { "key": "k_team", "value": "韩国组合" },
      { "key": "j_man", "value": "日本男" },
      { "key": "j_woman", "value": "日本女" },
      { "key": "j_team", "value": "日本组合" },
      { "key": "eu_man", "value": "欧美男" },
      { "key": "eu_woman", "value": "欧美女" },
      { "key": "eu_team", "value": "欧美组合" },
      { "key": "c_orchestra", "value": "乐团" },
      { "key": "c_performer", "value": "演奏家" },
      { "key": "c_composer", "value": "作曲家" },
      { "key": "c_cantor", "value": "指挥家" },
      { "key": "other_other", "value": "其他" }
    ],
    pagenum: 1,             // 筛选请求的页面
    keyWord: 'all_all',     // 筛选请求数据关键字
    keyIndex: 0,            // 筛选分类索引
    singerLists: {},        // 歌手列表
    scrollTop: 0,           // 滚动的位置
    topHeight: [],          // 滚动节点的top值集合
    navCurrent: 0,          // 当前选中的导航
    posHeight: 0,           // 顶上去动态节点高度
    fixTop: 0               // 顶上去动态初始值
  },
  /**========================================================================
  * 生命周期函数
  *========================================================================*/
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    this._getData(this.data.keyWord, this.data.page);
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {
  },
  // 生命周期函数--监听页面显示
  onShow: function () {},
  // 生命周期函数--监听页面隐藏
  onHide: function () {},
  // 生命周期函数--监听页面卸载
  onUnload: function () {},
  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {},
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {},
  // 用户点击右上角分享
  onShareAppMessage: function () {},
  /**========================================================================
    * 事件处理
    *=======================================================================*/
  // 点击分类标签
  selectChange: function (e) {
    // 得到当前点击的 id
    let id = e.currentTarget.dataset.id;
    // 选中状态不操作
    if (this.data.keyIndex === id) {
      return;
    }
    // 得到当前选中的 key
    let keyObj = this.data.areas[id];
    let keyWord = keyObj.key;
    // 更新组件数据
    this.setData({
      keyIndex: id,
      keyWord: keyWord
    });
    // 请求数据
    this._getData(this.data.keyWord, this.data.page);
  },
  // 触摸点击事件
  navTouchChange(e) {
    // 得到当前的
    let id = e.currentTarget.dataset.id;
    let topHeightCurrent = this.data.topHeight[id];
    this.setData({
      scrollTop: topHeightCurrent.top,
      navCurrent: id,
    })
  },
  // 滚动事件
  scrollChange(e) {
    let scrollTop = e.detail.scrollTop;
    let topHeight = this.data.topHeight;
    let keys = Object.keys(this.data.singerLists);
    // 拉到顶了
    if (scrollTop < 0) {
      this.setData({
        navCurrent: 0
      })
      return;
    }
    // 在区间内
    for (let i = 0; i < topHeight.length - 1; i++) {
      let height1 = topHeight[i]['top'];
      let height2 = topHeight[i + 1]['top'];
      if (scrollTop >= height1 && scrollTop < height2) {
        this.setData({
          navCurrent: i
        })
        // 调用顶上去的功能
        this._diff(height2 - scrollTop);
        return;
      }
    }
    // 拉到底了
    this.setData({
      navCurrent: topHeight.length - 2
    });
  },
  // 下拉加载下一页 ?
  lodeMoreDown() {
    // if (this.data.page < 1) {
    //   return;
    // }
    // let page = this.data.page;
    // page++;
    // this.setData({
    //   page
    // });
    // this._getData(this.data.keyWord, this.data.page);
  },
  // 上拉加载上一页 ?
  lodeMoreUp() {
    // let page = this.data.page;
    // page--;
    // if (page < 1) {
    //   page = 1;
    //   return;
    // }
    // this.setData({
    //   page
    // });
    // this._getData(this.data.keyWord, this.data.page);
  },
  // 点击打开歌手详情
  openSinger(e){
    let singermid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../singer-detail/singer-detail?singermid=${singermid}`
    })
  },
  /**========================================================================
   * 内部调用
   *=======================================================================*/
  // 获取数据
  _getData(selector, page) {
    // 去掉按字母分类直接是全部
    selector += '_all';
    // 发起请求
    wx.showLoading({
      title: '加载中...',
    })
    App.axios({
      url: App.common.c,
      data:{
        api: App.api.oldSingerList,
        key: selector,
        channel:'singer',
        pagesize:100,
        page:'list',
        pagenum: this.data.pagenum
      }
    }).then((res)=>{
      this.setData({
        singerLists: this._dataHander(res.data.data.list),
        scrollTop: 0,
        navCurrent: 0
      }, () => {
        // 先得到请求数据后再得到top列表
        this._allNodesTop()
        wx.hideLoading()
      });
    })
  },
  // 重新按照字符顺序组装数据
  _dataHander(list) {
    // 按字母排序
    let sortObj = list.sort((obj1, obj2) => {
      let str1 = obj1['Findex'].charCodeAt();
      let str2 = obj2['Findex'].charCodeAt();
      return str1 - str2;
    });
    // 按字母分类
    let data = {};
    sortObj.forEach((item, index) => {
      // 添加图片的链接
      item.Favatar = App.image(item.Fsinger_mid);
      // 在判断是否已经创建对应属性
      if (!data[item.Findex]) {
        data[item.Findex] = [];
        data[item.Findex].push(item);
      } else {
        data[item.Findex].push(item);
      }
    });
    // 保存为一个数组
    let arr = []
    for (let i in data) {
      arr.push({
        name: i,
        data: data[i]
      })
    }
    return arr;
  },
  // 获取节点的高宽数据
  _allNodesTop() {
    let tops = [];
    let leaveTop = 0
    let query = wx.createSelectorQuery();
    // 获取距离顶部的高度
    query.select('.singers-lists-main').boundingClientRect((res) => {
      leaveTop = res.top;
    }).exec();
    // 获取全部的节点top
    query.selectAll('.singers').boundingClientRect((res) => {
      res.forEach((item) => {
        // 计算后的高度
        item.top = item.top - leaveTop;
      });
      let topLast = res[res.length - 1]["top"] + 10000;
      res.push({ top: topLast })
      this.setData({
        topHeight: res
      })
    }).exec();
    // 获取.pos节点的高度
    query.select('#pos').boundingClientRect((res) => {
      this.setData({
        posHeight: res.height
      })
    }).exec();
  },
  // 顶上去效果
  _diff(height) {
    let posHeight = this.data.posHeight;
    let fixTop = (height > 0 && height < posHeight) ? height - posHeight : 0
    if (this.data.fixTop === fixTop) {
      return
    }
    this.setData({
      fixTop: fixTop
    })
  }
})