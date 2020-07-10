<template>
  <v-data-table
      class="job-list"
      hide-default-header
      :items="jobs"
      :options.sync="pagination"
      :server-items-length="total"
      :loading="loading"
      :footer-props="{
        itemsPerPageOptions: [10, 25, 50]
      }"
  >

    <template v-slot:item="{ item }">
      <tr>
        <td @click="onItemClick(item)">
          <job-list-item :job="item"></job-list-item>
        </td>
      </tr>
    </template>

    <template slot="no-data">
      <v-alert :value="true">
        <span class="caption">{{ $t('job.list_empty_message') }}</span>
      </v-alert>
    </template>
  </v-data-table>
</template>

<script>
  import equal from 'fast-deep-equal'
  import { mapState } from 'vuex'
  import JobListItem from '@/components/Jobs/ListItem'
  import actions from '@/store/actions'

  export default {
    name: 'JobList',
    data () {
      return {
        dialog: false,
        loading: false,
        alert: false,
        pagination: {
          page: 1,
          itemsPerPage: 10
        },
        confirmBtn: {
          text: 'Run',
          action: () => {
            this.dialog = false
            this.onRunClick(false)
          },
          color: 'success'
        },
        cancelBtn: {
          text: 'Cancel',
          action: () => {
            this.dialog = false
          },
          color: 'error'
        }
      }
    },
    components: {
      JobListItem
    },
    mounted () {
    },
    computed: {
      ...mapState({
        flow: state => state.flows.selected.obj,
        jobs: state => state.jobs.items,
        total: state => state.jobs.pagination.total,
      })
    },
    watch: {
      flow () {
        this.loadJobList()
      },

      pagination (newVal, oldVal) {
        if (!equal(newVal, oldVal)) {
          this.loadJobList()
        }
      }
    },
    methods: {
      onItemClick (job) {
        this.$router.push({path: `/flows/${this.flow.name}/jobs/${job.buildNumber}`})
      },

      loadJobList () {
        if (!this.flow.name) {
          return
        }

        this.loading = true
        const {page, itemsPerPage} = this.pagination
        const payload = {
          flowObj: this.flow,
          page,
          size: itemsPerPage
        };

        this.$store.dispatch(actions.jobs.list, payload)
          .then(() => {
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    }
  }
</script>

<style lang="scss">
  .job-list {
    height: 100%;
    position: relative;
    overflow: auto;
  }
</style>
