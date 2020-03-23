export function browserDownload (url, file) {
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', file)
  document.body.appendChild(link)
  link.click()
  window.URL.revokeObjectURL(url)
}