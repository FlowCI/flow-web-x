// Reference to https://github.com/sindresorhus/ansi-regex
const regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

const defColors = {
  black: '000',
  red: 'FE423E',
  green: '209805',
  yellow: 'e8bf03',
  blue: '108ee9',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
const styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
const openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': 'font-style: italic', // italic
  '4': 'text-decoration: underline', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
const closeTags = {
  '0': '</span>', // reset all attr
  '7': '</span>', // reverse video, unused
  '23': '</span>', // reset italic
  '24': '</span>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  closeTags[n] = '</span>'
})

function createAnsiHTML (optColors = {}) {
  let _openTags = openTags
  let _closeTags = closeTags

  /**
   * Converts text with ANSI color codes to HTML markup.
   * @param {String} text
   * @returns {*}
   */
  function ansiHTML (text) {
    // Returns the text if the string has no ANSI escape code.
    if (!regANSI.test(text)) {
      return text
    }
    // Cache opened sequence.
    const ansiCodes = []
    // Replace with markup.
    let ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
      const ot = _openTags[seq]
      if (ot) {
        // If current sequence has been opened, close it.
        if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
          ansiCodes.pop()
          return '</span>'
        }
        // Open tag.
        ansiCodes.push(seq)
        return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
      }

      var ct = _closeTags[seq]
      if (ct) {
        // Pop sequence
        ansiCodes.pop()
        return ct
      }
      return ''
    })
    // Make sure tags are closed.
    var l = ansiCodes.length
    ;(l > 0) && (ret += Array(l + 1).join('</span>'))

    return ret
  }
  /**
   * Customize colors.
   * @param {Object} colors reference to _defColors
   */
  ansiHTML.setColors = function (colors = {}) {
    if (typeof colors !== 'object') {
      throw new Error('`colors` parameter must be an Object.')
    }

    const _finalColors = {
      ...defColors,
      ...colors,
    }
    _setTags(_finalColors)
  }
  /**
   * Reset colors.
   */
  ansiHTML.reset = function () {
    _setTags(defColors)
  }
  function _setTags (colors) {
    // dark grey
    _openTags['90'] = 'color:#' + colors.darkgrey

    for (var code in styles) {
      var color = styles[code]
      var oriColor = colors[color] || '000'
      _openTags[code] = 'color:#' + oriColor
      code = parseInt(code)
      _openTags[(code + 10).toString()] = 'background:#' + oriColor
    }
  }

  ansiHTML.setColors(optColors)
  return ansiHTML
}

export default createAnsiHTML
