export function song(item) {
  let obj = {};
  obj.singer = item.singer[0].name;
  obj.songid = item.songid;
  obj.songmid = item.songmid;
  obj.songname = item.songname;
  obj.filename = `C400${item.songmid}.m4a`;
  obj.songImage = item.albummid;
  obj.albumname = item.albumname;
  obj.interval = time(item.interval);   // 歌曲长度 秒
  obj.longnumber = item.interval        // 歌曲长度

  function time(interval){
    let n = Math.floor(item.interval / 60);
    let m = item.interval % 60;
    if (m<10){
      m = '0'+m;
    }
    let time = `${n}:${m}`;
    return time;
  }
  return obj
}


