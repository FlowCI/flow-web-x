const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',
  '/': '&#x2F;'
}

const escapeHtml = (string) => {
  return String(string).replace(/[&<>''"/]/g, (s) => {
    return entityMap[s]
  })
}

export default escapeHtml
