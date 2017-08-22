import createResource from '../index'

describe('i18n function', function () {

  it ('should be a function & has createChild props', () => {
    const i18n = createResource({})
    expect(i18n).to.be.a('function')
    expect(i18n.createChild).to.be.a('function')
    // expect(i18n.loadResource).to.be.a('function')
  })

  describe('i18n', function () {
    let i18n
    const resource = {
      a: 1,
      b: 'bbbb',
      c: function () { return 'c' },
      d: function (params) { return params },
      e: {
        a: 2
      },
      f: 'hello ${name}'
    }
    beforeEach(() => {
      i18n = createResource(resource)
    })

    it ('should return resource[name] when name has found', () => {
      expect(i18n('a')).to.eql(1)
      expect(i18n('b')).to.eql('bbbb')
    })

    it ('should return func result when resource[name] is func', () => {
      expect(i18n('c')).to.eql('c')
    })

    it ('should call func with args[1] when resource[name] is func', () => {
      expect(i18n('d', { a: 1 })).to.eql({ a: 1 })
    })

    it ('should return deep value when name can be split by .', () => {
      expect(i18n('e.a')).to.equal(2)
    })

    it ('should replace ${argument} value by params when resource[name] is string template', () => {
      expect(i18n('f', { name: 'world' })).to.equal('hello world')
      expect(i18n('f')).to.equal('hello ')
    })

    describe('not match resource', () => {
      const name = 'something not match'
      it ('should return name argumnet by default', () => {
        expect(i18n(name)).to.eql(name)
        expect(i18n('a.b.c')).to.eql('a.b.c')

        const childI18n = i18n.createChild('a')
        expect(childI18n('b.c')).to.eql('b.c')
        expect(childI18n('c')).to.eql('c')
      })

      it ('should return undefined when options.default is not undefined and !options.default is true', () => {
        i18n = createResource(resource, { default: '' })
        expect(i18n(name)).to.eql(undefined)
        expect(i18n('a.b')).to.eql(undefined)
      })

      // 暂时不支持 params.default 配置
      // it ('should return params.default when params.default is set', () => {
      //   expect(i18n(name)).to.eql(name)
      //   expect(i18n(name, { default: '' })).to.eql('')
      // })
    })
  })

  describe('createChild function', function () {
    let i18n
    const resource = {
      a: {
        b: 2,
      },
      c: {
        d: {
          e: 1
        }
      }
    }
    beforeEach(() => {
      i18n = createResource(resource)
    })

    it ('should always same child function when name is same', () => {
      expect(i18n.createChild('a')).to.eql(i18n.createChild('a'))
      expect(i18n.createChild('a.b')).to.eql(i18n.createChild('a.b'))
    })

    it ('if abs path is same but child path is not same, fn is not eql', () => {
      // for the moment
      const ci18n = i18n.createChild('c')
      expect(ci18n.createChild('d')).to.not.eql(i18n.createChild('c.d'))
    })

    it ('should auto bind parent path', () => {
      const ci18n = i18n.createChild('a')
      expect(i18n('a.b')).to.eql(2)
      expect(i18n('a.b')).to.eql(ci18n('b'))

      const di18n = i18n.createChild('c.d')
      expect(i18n('c.d.e')).to.eql(1)
      expect(i18n('c.d.e')).to.eql(di18n('e'))
    })
  })

  function usePerformanceTest () {
    describe('performance', function () {
      const times = 10000

      function getElapsed (fn) {
        const start = performance.now()
        fn()
        const end = performance.now()
        return end - start
      }

      describe(`string ${times}`, function () {
        const resource = {
          a: {
            b: {
              c: {
                d: {
                  e: '1'
                }
              }
            }
          }
        }

        it ('normal', function (){
          const number = getElapsed(function () {
            const i18n = createResource(resource)
            for (let i = 0; i < times; i++) {
              i18n('a.b.c.d.e')
            }
          })
          console.log(`string ${times} is ${number}ms`)
        })

        it ('createChild', function () {
          const number = getElapsed(function () {
            const i18n = createResource(resource)
            for (let i = 0; i < times; i++) {
              const ci18n = i18n.createChild('a.b.c.d')
              ci18n('e')
            }
          })
          console.log(`use createChild string ${times} is ${number}ms`)
        })
      })
      describe(`func ${times}`, function () {
        const resource = {
          a: {
            b: {
              c: {
                d: {
                  e: function () { return 1 }
                }
              }
            }
          }
        }

        it ('normal', function () {
          const number = getElapsed(function () {
            const i18n = createResource(resource)
            for (let i = 0; i < times; i++) {
              i18n('a.b.c.d.e')
            }
          })
          console.log(`func ${times} is ${number}ms`)
        })
      })
    })
  }
  usePerformanceTest()
})
