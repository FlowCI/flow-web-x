<template>
  <v-card max-width="600" class="notify-plugin">
    <v-card-title>
      <span class="mr-1">
        <v-icon v-if="wrapper.isDefaultIcon">mdi-view-grid-plus-outline</v-icon>
        <v-img v-if="wrapper.isHttpLinkIcon"
               :src="wrapper.icon"
               max-height="25"
               max-width="25"
        ></v-img>
        <img v-if="wrapper.isRepoSrcIcon"
             class="plugin-icon"
             :id="wrapper.id"
             alt=""/>
      </span>

      <span class="title">{{ wrapper.name }}</span>
      <v-spacer></v-spacer>

      <span class="subtitle-2 mx-1">{{ wrapper.version }}</span>
      <v-icon small v-if="isInstalled" color="green">mdi-check-circle</v-icon>
      <v-icon small v-if="wrapper.docker" class="mx-1" color="blue lighten-1">mdi-docker</v-icon>
      <v-btn icon x-small :href="wrapper.source" target="_blank">
        <v-icon small>mdi-link</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-subtitle>
      {{ wrapper.desc }}
    </v-card-subtitle>
  </v-card>
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
  .notify-plugin {
    .plugin-icon {
      height: 25px;
      width: 25px;
      vertical-align: middle;
    }

    .v-label {
      font-size: 12px;
    }

    .v-input--selection-controls {
      margin-top: 0 !important;
      padding-top: 0 !important;
    }

    .v-card__actions {
      padding-top: 0 !important;
      padding-bottom: 0 !important;
    }

    .v-subheader {
      padding: 0;
    }

    .v-input {
      font-size: 14px
    }

    .v-input__slot {
      margin-bottom: 0 !important;
    }

    .plugin-input {
      .col {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }
    }
  }
</style>
