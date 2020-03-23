import Config from '../../store/http'

export default {
  jobs: `${Config.host}/jobs`,
  flows: `${Config.host}/flows`,
  credentials: `${Config.host}/credentials`
}
