import getI18n from 'views/Home/i18n'

describe('Views Home i18n Test', function(){
  const languages = LANGUAGES.split(',')
  languages.forEach((lang) => {
    it(`should has ${lang} resource`, function () {
      expect(function () {
        getI18n(lang)
      }).to.not.throws()
    })
  })
})
