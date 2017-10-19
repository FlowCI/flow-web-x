const radix = 1024
const units = ['B', 'KB', 'MB', 'GB']
export default function (size, defaultUnit) {
  let number = size
  let next
  let unit = units.indexOf(defaultUnit) || 0
  const max = units.length - 1
  while ((next = number / radix) > 1 && unit < max) {
    number = next
    unit++
  }

  const n = Math.round(number * 100) / 100
  return `${n} ${units[unit]}`
}
