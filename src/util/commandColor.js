// 日志颜色转换表
// https://en.wikipedia.org/wiki/ANSI_escape_code
// 30–37  Set text color

export default function (v) {
  if (!v) {
    return ''
  }

  let str = v

  str = v.replace(/\[(0|22|24|39)m/g, '</span>')
    .replace(/\[31(;1)?m/g, '<span style="color:#E56065;">') // red E63462
    .replace(/\[32(;1)?m/g, '<span style="color:#61B136;">') // green
    .replace(/\[33(;1)?m/g, '<span style="color:#FAFC00;">') // yellow
    .replace(/\[34(;1)?m/g, '<span style="color:#5863F8;">')
    .replace(/\[35(;1)?m/g, '<span style="color:#492EE1;">')
    .replace(/\[36(;1)?m/g, '<span style="color:cyan;">')
    .replace(/\[37(;1)?m/g, '<span style="color:#FFF;">')
    .replace(/\[1m/g, '<span style="font-weight:bold;">')
    .replace(/\[4m/g, '<span style="text-decoration: underline;">')
    .replace(/\[2J.*\n/g, '')

  return str
}
