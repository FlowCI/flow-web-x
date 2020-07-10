<template>
  <v-list shaped>
    <v-subheader>
      <v-text-field
          :placeholder="$t('flow.search')"
          single-line
          append-icon="mdi-magnify"
          v-model="searchVal"/>
    </v-subheader>

    <v-list-item-group v-model="selected">
      <v-list-item v-for="item in items"
                   :key="item.id"
                   class="mx-2"
                   @click="onItemClick(item)">
        <v-list-item-action>
          <v-icon size="20" :class="item.latestJob.status.class">{{ item.latestJob.status.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>

    <!-- button to create-->
    <v-list-item>
      <v-list-item-content class="btn-create">
        <flow-create-dialog></flow-create-dialog>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
  import {toWrapperList} from '@/util/flows'
  import {mapState} from 'vuex'
  import FlowCreateDialog from './CreateDialog'
  import actions from '@/store/actions'

  export default {
    name: 'FlowMenu',
    components: {
      FlowCreateDialog
    },
    data() {
      return {
        searchVal: '',
        items: [],
      }
    },
    mounted() {
      this.$store.dispatch(actions.flows.list).then()
    },
    computed: {
      ...mapState({
        flows: state => state.flows.items,
        // to receive job updated event and show latest job status on flow list
        latest: state => state.jobs.latest
      }),

      // current flow name
      current() {
        return this.$route.params.id
      },

      selected: {
        get () {
          for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i]
            if (item.name === this.current) {
              return i
            }
          }
          return 0
        },

        set (newValue) {

        }
      }
    },
    watch: {
      flows(after) {
        this.items = toWrapperList(after)
        this.fetchLatestStatus(this.items)
      },

      latest: {
        handler(after) {
          for (let latestJob of after) {
            for (let flow of this.items) {
              if (flow.id === latestJob.flowId) {
                flow.latestJob = latestJob
              }
            }
          }
        },
        deep: true,
        immediate: true
      },

      searchVal(after) {
        this.querySelections(after)
      }
    },
    methods: {
      onItemClick(flow) {
        this.$router.push({path: `/flows/${flow.name}/jobs`})
      },

      querySelections(v) {
        this.items = toWrapperList(this.flows.filter(e => {
          return (e.name || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
        }))
      },

      fetchLatestStatus(items) {
        items.forEach((wrapper) => {
          this.$store.dispatch(actions.jobs.latest, wrapper.name)
            .then(() => {

              for (let latest of this.latest) {
                if (latest.flowId === wrapper.id) {
                  wrapper.latestJob = latest
                  break
                }
              }
            })
            .catch(() => {
            })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn-create {
    align-items: center;
  }
</style>
