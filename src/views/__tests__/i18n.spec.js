describe('Views i18n module Test', function () {
  const languages = LANGUAGES.split(',')

  const i18nTestContext = require.context('../', true, /i18n\.js$/)
  const keys = i18nTestContext.keys()
  keys.forEach((key) => {
    describe(`in file ${key}`, () => {
      const getI18n = i18nTestContext(key).default

      it ('should be export default a function', function () {
        expect(getI18n).to.be.a('function')
      })

      languages.forEach((lang) => {
        it(`should has ${lang} resource`, function () {
          expect(function () {
            getI18n(lang)
          }).to.not.throws()
        })
      })
    })
  })
})
