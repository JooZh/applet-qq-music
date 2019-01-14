

const isDev = false

let host;
if(isDev){
  host = 'http://localhost:3000/api_qqmusic'
}else{
  host = 'https://joozh.cn/api_qqmusic'
}

// 域名
export const Host = {
  host: host,
  img: 'https://y.gtimg.cn',
  play: 'http://dl.stream.qqmusic.qq.com',
}
