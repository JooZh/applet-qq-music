// 引入api文件
import {Host} from './host.js';

// 参数 t=1 为头像链接 t=2 为播放背景图链接
export function image(id,t=1) {
  return `${Host.img}/music/photo_new/T00${t}R300x300M000${id}.jpg?max_age=2592000`;
}
