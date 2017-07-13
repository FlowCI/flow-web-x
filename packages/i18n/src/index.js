import is from './is'

function isReturnUndefined (options) {
  return options && !is.undefined(options.default) && !options.default
}

function getResource (resource, paths) {
  if (!is.object(resource)) {
    return undefined
  }
  const array = paths.split('.')
  let res = resource
  let i = 0
  let j = array.length
  while (i < j) {
    res = res[array[i]]
    i++
    if (!res) {
      break
    }
  }
  return i === j ? res : undefined
}

function compile (template, params) {
  const reg = /\${(\w+)}/g
  return template.replace(reg, function (match, word) {
    if (params) {
      return params[word] || ''
    }
    return ''
  })
}

export default function createResource (resource, options) {
  function i18n (name, params) {
    const value = getResource(resource, name)
    if (value !== undefined) {
      if (is.string(value)) {
        return compile(value, params)
      } else if (is.func(value)) {
        return value(params)
      }
      return value
    } else if (isReturnUndefined(options)) {
      return undefined
    }
    return name
  }

  const cache = {} // createChild cahce, key is name, value is func
  i18n.createChild = function (name) {
    let fn = cache[name]
    if (fn) {
      return fn
    }
    const childResource = getResource(resource, name)
    fn = createResource(childResource, options)
    cache[name] = fn
    return fn
  }
  return i18n
}
