<template>
  <div class="plugin-item pa-1">
    <v-row no-gutters align="center" class="my-1">
      <v-col cols="2">
        <v-icon small class="ml-2" v-if="wrapper.isDefaultIcon">mdi-view-grid-plus-outline</v-icon>
        <v-img v-if="wrapper.isHttpLinkIcon"
               :src="wrapper.icon"
               max-height="25"
               max-width="25"
        ></v-img>
        <img v-if="wrapper.isRepoSrcIcon"
             class="plugin-icon"
             :id="wrapper.id"
             alt=""/>
      </v-col>

      <v-col cols="9">
        <span class="font-weight-bold">{{ wrapper.name }}</span>
      </v-col>

      <v-col cols="1">
        <v-btn icon x-small :href="wrapper.source" target="_blank">
          <v-icon small>mdi-link</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row no-gutters class="my-1" align="center">
      <v-col cols="2">
        <span class="caption font-weight-bold pl-1">v{{ wrapper.version }}</span>
      </v-col>

      <v-col cols="10" class="text-end">
        <v-tooltip bottom v-if="isInstalled">
          <template v-slot:activator="{ on }">
            <v-icon small class="mx-1" color="green" v-on="on">mdi-check-circle</v-icon>
          </template>
          <span>{{ $t('flow.hint.plugin_installed') }}</span>
        </v-tooltip>

        <v-tooltip bottom v-if="wrapper.docker">
          <template v-slot:activator="{ on }">
            <v-icon small class="mx-1" color="blue lighten-1" v-on="on">mdi-docker</v-icon>
          </template>
          <span>{{ $t('flow.hint.plugin_docker_run') }}</span>
        </v-tooltip>
      </v-col>
    </v-row>

    <v-row no-gutters class="my-1" align="center">
      <v-col cols="12">
        <span class="caption font-weight-medium pl-1">{{ wrapper.desc }}</span>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import actions from '@/store/actions'
  import { mapState } from "vuex";

  export default {
    name: "OptionNotifyItem",
    props: {
      flow: {
        required: true,
        type: Object
      },
      // plugin wrapper
      wrapper: {
        required: true,
        type: Object
      },
      isInstalled: {
        required: false,
        type: Boolean,
        default() {
          return true
        }
      }
    },
    data() {
      return {
        enabled: false,
        edit: false
      }
    },
    mounted() {
      this.setSrcIcon(this.wrapper)
    },
    computed: {
      ...mapState({
        iconCache: state => state.plugins.icon
      })
    },
    methods: {
      setSrcIcon(wrapper) {
        const element = document.getElementById(wrapper.id)
        if (!element || element.src) {
          return
        }

        const b64 = this.iconCache[wrapper.name]
        if (b64) {
          element.src = `data:${this.getMediaType(wrapper)};base64,${b64}`
          return
        }

        this.$store.dispatch(actions.plugins.icon, wrapper.name).then(() => {
          const b64 = this.iconCache[wrapper.name]
          element.src = `data:${this.getMediaType(wrapper)};base64,${b64}`
        })
      },

      getMediaType(plugin) {
        if (!plugin.icon) {
          return 'image/svg+xml'
        }

        const dotIndex = plugin.icon.lastIndexOf('.')
        if (dotIndex < 0) {
          return 'image/svg+xml'
        }

        const suffix = plugin.icon.substring(dotIndex + 1)

        if (suffix === 'jpg' || suffix === 'jpeg') {
          return 'image/jpeg'
        }

        if (suffix === 'gif') {
          return 'image/gif'
        }

        if (suffix === 'png') {
          return 'image/png'
        }

        return 'image/svg+xml'
      }
    }
  }
</script>

<style lang="scss">
  .plugin-item {
    width: 100%;

    .plugin-icon {
      height: 20px;
      width: 35px;
      vertical-align: middle;
    }
  }
</style>
