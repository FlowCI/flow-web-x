import branchReducer from 'redux/modules/branch'
import jobReducer from 'redux/modules/job'
import nodeReducer from 'redux/modules/node'

export const reducers = {
  job: jobReducer,
  branch: branchReducer,
  node: nodeReducer,
}

export default from './flow'
