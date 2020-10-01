<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn color="info"
             outlined
             v-on="on"
             :disabled="disabled"
             @click="onClick"
             :loading="loading"
             :class="clazz"
      >
        {{ $t('test') }}
        <v-icon small right :class="[statusClass]">{{ statusIcon }}</v-icon>
        <template v-slot:loader>
        <span>
          <v-icon small light class="loading-anim">flow-icon-loading1</v-icon>
        </span>
        </template>
      </v-btn>
    </template>
    <span>Save current settings and test connection</span>
  </v-tooltip>
</template>

<script>
  import actions from '@/store/actions'
  import { HostWrapper, HOST_STATUS_CONNECTED, HOST_STATUS_DISCONNECTED } from '@/util/hosts'
  import { mapState } from 'vuex'

  export default {
    name: 'HostTestBtn',
    props: {
      host: {
        type: Object,
        required: true
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      clazz: {
        type: String,
        required: false,
        default: ''
      }
    },
    data () {
      return {
        loading: false,
        wrapper: new HostWrapper(this.host),
        statusData: {
          [ HOST_STATUS_CONNECTED ]: {
            icon: 'mdi-checkbox-blank-circle',
            class: 'green--text'
          },

          [ HOST_STATUS_DISCONNECTED ]: {
            icon: 'mdi-checkbox-blank-circle',
            class: 'grey--text'
          }
        }
      }
    },
    computed: {
      ...mapState({
        updated: state => state.hosts.updated
      }),

      statusIcon () {
        const meta = this.statusData[ this.wrapper.status ]
        return meta ? meta.icon : 'mdi-checkbox-blank-circle'
      },

      statusClass () {
        const meta = this.statusData[ this.wrapper.status ]
        return meta ? meta.class : 'grey--text'
      }
    },
    watch: {
      host (val) {
        this.wrapper = new HostWrapper(val)
      },

      updated(val) {
        if (val.id === this.wrapper.id) {
          this.loading = false
          this.wrapper = new HostWrapper(val)
        }
      }
    },
    methods: {
      onClick () {
        this.$store.dispatch(actions.hosts.createOrUpdate, this.wrapper.rawInstance).then(() => {
          this.loading = true

          setTimeout(() => {
            this.$store.dispatch(actions.hosts.test, this.wrapper.name).then()
          }, 1000)
        })
      }
    }
  }
</script>

<style scoped>

</style>
