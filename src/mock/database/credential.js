import types from 'redux/modules/credentialType'

export default {
  [types.query]: function () {
    return {
      ios: [{
        name: '证书1',
        author: 'gy',
        createdAt: 1502266861,

      }],
      rsa: [{
        name: 'c-name',
        author: 'gy',
        createdAt: 1502266861,
        fingerprint: '92:27:9d:77:fc:17:58:31:e7:32:03:bf:35:f7:ef:8a',
      }, {
        name: 'c-name2',
        author: 'gy',
        createdAt: 1502266861,
        fingerprint: '92:27:9d:77:fc:17:58:31:e7:32:03:bf:35:f7:ef:8a',
      }, {
        name: 'c-name3',
        author: 'gy',
        createdAt: 1502266861,
        fingerprint: '92:27:9d:77:fc:17:58:31:e7:32:03:bf:35:f7:ef:8a',
      }]
    }
  },
}
