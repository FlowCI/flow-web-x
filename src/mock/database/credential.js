import types from 'redux/modules/credentialType'

export default {
  [types.query]: function () {
    return [
      {
        'name': 'android-credential',
        'type': 'ANDROID',
        'detail': {
          'file': {
            'name': 'android.jks'
          },
          'keyStorePassword': '12345',
          'keyStoreAlias': 'android',
          'keyStoreAliasPassword': '12345'
        },
        'createdAt': 1504737923,
        'updatedAt': 1504737923
      },
      {
        'name': 'ios-credential',
        'type': 'IOS',
        'detail': {
          'provisionProfiles': [
            {
              'name': 'pp'
            }
          ],
          'p12s': [
            {
              'password': '12345',
              'name': 'p12'
            }
          ]
        },
        'createdAt': 1504737923,
        'updatedAt': 1504737923
      },
      {
        'name': 'ras-credential',
        'type': 'RSA',
        'detail': {
          'publicKey': 'public key',
          'privateKey': 'private key'
        },
        'createdAt': 1504737923,
        'updatedAt': 1504737923
      },
      {
        'name': 'username-credential',
        'type': 'USERNAME',
        'detail': {
          'username': 'user',
          'password': 'pass'
        },
        'createdAt': 1504737923,
        'updatedAt': 1504737923
      }
    ]
  },
}
