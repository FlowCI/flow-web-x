export const CATEGORY_SSH_RSA = 'SSH_RSA'
export const CATEGORY_AUTH = 'AUTH'
export const CATEGORY_TOKEN = 'TOKEN'
export const CATEGORY_ANDROID_SIGN = 'ANDROID_SIGN'

export const CategoriesSelection = [
  {name: 'SSH key', value: CATEGORY_SSH_RSA, icon: 'mdi-key'},
  {name: 'Auth pair', value: CATEGORY_AUTH, icon: 'mdi-account-key-outline'},
  {name: 'Token', value: CATEGORY_TOKEN, icon: 'mdi-file-key'},
  {name: 'Android sign', value: CATEGORY_ANDROID_SIGN, icon: 'mdi-android'}
]

export const Categories = {
  [CATEGORY_SSH_RSA]: {
    name: 'SSH key',
    icon: 'mdi-key'
  },
  [CATEGORY_AUTH]: {
    name: 'Auth pair',
    icon: 'mdi-account-key-outline'
  },
  [CATEGORY_TOKEN]: {
    name: 'Token',
    icon: 'mdi-file-key'
  },
  [CATEGORY_ANDROID_SIGN]: {
    name: 'Android sign',
    icon: 'mdi-android'
  }
}
