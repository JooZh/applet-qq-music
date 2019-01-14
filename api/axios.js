
import { Host } from './host.js'
// 请求数据
export function axios(params) {
  // 默认数据
  let url = params.url || '';
  let method = params.method || 'GET';
  let data = params.data || {};
  let dataType = params.dataType || 'json';
  let header = params.header || { 'content-type': 'application/json' }

  let geturl = Host.host + url;
  // 执行请求 返回Promise
  return new Promise((resolve,reject)=>{
    wx.request({
      url: geturl,
      method: method.toUpperCase(),
      data: data,
      dataType: dataType,
      header: header,
      // 收到开发者服务成功返回的回调函数
      // data 开发者服务器返回的数据
      // statusCode 开发者服务器返回的 HTTP 状态码
      // header 开发者服务器返回的 HTTP Response Header
      success: data => {
        resolve(data)
      },
      // 接口调用失败的回调函数
      fail: error => {
        reject(error)
      },
      // 接口调用结束的回调函数（调用成功、失败都会执行）
      complete: () => {}
    });
  })
}