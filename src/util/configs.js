export const CATEGORY_SMTP = 'SMTP'
export const CATEGORY_TEXT = 'TEXT'

export const SECURE_NONE = 'NONE'
export const SECURE_SSL = 'SSL'
export const SECURE_TLS = 'TLS'

export const CategoriesSelection = [
  {name: 'SMTP', value: CATEGORY_SMTP, icon: 'mdi-email-outline'},
  {name: 'Text', value: CATEGORY_TEXT, icon: 'mdi-text'},
]

export const Categories = {
  [CATEGORY_SMTP]: {
    name: 'SMTP',
    icon: 'mdi-email-outline'
  },
  [CATEGORY_TEXT]: {
    name: 'Text',
    icon: 'mdi-text'
  }
}
