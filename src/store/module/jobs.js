import http from '../http'
import {browserDownload} from '../util'

const emptyFunc = () => {
}

const state = {
  flowId: '',
  items: [],
  pagination: {
    page: 0,
    size: 10,
    total: 0
  },
  JobsStatus: {},
  selected: {}, // current selected job
  yml: '',
  latest: [], // latest job object array
  reports: [],
  reportUrlPath: '',
  artifacts: [],
  relatedJobs: [],
}

const mutations = {
  add(state, job) {
    if (state.items.length >= state.pagination.size) {
      state.items.pop()
    }

    state.items.unshift(job)
    state.pagination.total += 1
  },

  setFlowId(state, flowId) {
    state.flowId = flowId
  },

  list(state, page) {
    state.items = page.content

    state.pagination.page = page.number
    state.pagination.size = page.size
    state.pagination.total = page.totalElements
  },

  related(state, jobs) {
    state.relatedJobs = jobs
  },

  setLatest(state, job) {
    const latestList = state.latest

    for (let i = 0; i < latestList.length; i++) {
      if (latestList[i].id === job.id) {
        latestList.splice(i, 1, job)
        return
      }
    }

    latestList.push(job)
  },

  updateStatus(state, updatedJob) {
    let itemIndex = 0

    // update job in list
    state.items.forEach((job, index) => {
      if (job.id !== updatedJob.id) {
        return
      }

      Object.assign(job, updatedJob)
      itemIndex = index
    })

    // update job selected
    if (state.selected && state.selected.id === updatedJob.id) {
      state.selected = updatedJob
    }
  },

  selected(state, job) {
    state.selected = job
  },

  JobsStatus(state, res) {
    state.JobsStatus = res
  },

  updateYml(state, yml) {
    state.yml = yml
  },

  setReports(state, reports) {
    state.reports = reports
  },

  setReportUrlPath(state, reportUrlPath) {
    state.reportUrlPath = reportUrlPath
  },

  setArtifacts(state, artifacts) {
    state.artifacts = artifacts
  }
}

const actions = {

  latest({commit}, flow) {
    const url = `jobs/${flow}/latest`

    return http.get(url, (job) => {
      commit('setLatest', job)
    })
  },

  getYml({commit}, {flow, buildNumber}) {
    const url = `jobs/${flow}/${buildNumber}/yml`
    return http.get(url, (base64Yml) => {
      commit('updateYml', atob(base64Yml))
    })
  },

  getDesc({commit}, {jobId, onCallback}) {
    const url = `jobs/${jobId}/desc`
    return http.get(url, onCallback)
  },

  /**
   * Start a new job
   */
  async start({commit, state}, {flow, inputs}) {
    await http.post('jobs/run', emptyFunc, {flow, inputs})
  },

  async rerun({commit}, {jobId, fromFailureStep}) {
    await http.post('jobs/rerun', emptyFunc, {jobId, fromFailureStep})
  },

  async cancel({commit}, {flow, buildNumber}) {
    await http.post(`jobs/${flow}/${buildNumber}/cancel`, emptyFunc)
  },

  /**
   * Add a job instance to current job list
   */
  create({commit, state}, job) {
    if (state.page > 1) {
      return
    }

    if (state.flowId === job.flowId) {
      commit('add', job)
    }
  },

  /**
   * Load job list by flow name
   */
  list({commit, state}, {flowObj, page, size}) {
    commit('setFlowId', flowObj.id)

    return http.get('jobs/' + flowObj.name,
      (page) => {
        commit('list', page)
      },
      {
        page: page - 1,
        size
      }
    )
  },

  related({commit, state}, {flow, buildNumber}) {
    return http.get(`jobs/${flow}/${buildNumber}/related`, (jobs) => {
      commit('related', jobs)
    })
  },

  /**
   * Update job status
   */
  statusUpdate({commit, state}, jobWithNewStatus) {
    commit('setLatest', jobWithNewStatus)
    commit('updateStatus', jobWithNewStatus)
  },

  /**
   * Select job by flow name and build number
   */
  select({commit}, {flow, buildNumber}) {
    return http.get(`jobs/${flow}/${buildNumber}`,
      (job) => {
        commit('selected', job)
      }
    )
  },

  JobsStatus({commit}, args) {
    commit('JobsStatus', args)
  },

  async listReport({commit}, {flow, buildNumber}) {
    await http.get(`jobs/${flow}/${buildNumber}/reports`, (reports) => {
      commit('setReports', reports)
    })
  },

  async fetchReport({commit}, {flow, buildNumber, reportId}) {
    await http.get(`jobs/${flow}/${buildNumber}/reports/${reportId}`, (urlPath) => {
      commit('setReportUrlPath', urlPath)
    })
  },

  async listArtifact({commit}, {flow, buildNumber}) {
    await http.get(`jobs/${flow}/${buildNumber}/artifacts`, (artifacts) => {
      commit('setArtifacts', artifacts)
    })
  },

  downloadArtifact({commit}, {flow, buildNumber, artifactId}) {
    let url = `jobs/${flow}/${buildNumber}/artifacts/${artifactId}`
    return http.get(url, (data, file) => {
      const url = window.URL.createObjectURL(new Blob([data]))
      browserDownload(url, file)
    })
  }
}

/**
 * Export Vuex store object
 */
export const Store = {
  namespaced: true,
  state,
  mutations,
  actions
}
