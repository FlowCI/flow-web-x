import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { mount } from 'enzyme'
import autoCancel from '../index'

import httpMiddleware from 'packages/redux-http/mock'
import { isCancel, cancel } from 'packages/promise-cancelable'

describe('React Redux Http Promise Cancel Highter-Order Components', function () {
  const spec1 = {
    name: 'string',
    config: {
      funcs: 'query'
    }
  }

  const spec2 = {
    name: 'string array',
    config: {
      funcs: ['query']
    }
  }

  const spec3 = {
    config: {
      funcs: ['query'],
      cancel: sinon.spy()
    }
  }
}