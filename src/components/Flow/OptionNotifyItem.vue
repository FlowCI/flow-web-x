<template>
  <v-card max-width="600" class="notify-plugin">
    <v-card-title>
      <span class="mr-1">
        <v-icon v-if="wrapper.isDefaultIcon">mdi-view-grid-plus-outline</v-icon>
        <v-img v-if="wrapper.isHttpLinkIcon"
               :src="wrapper.icon"
               max-height="24"
               max-width="16"
        ></v-img>
        <img v-if="wrapper.isRepoSrcIcon"
             class="plugin-icon"
             :id="wrapper.id"
             alt=""/>
      </span>

      <span class="title">{{ wrapper.name }}</span>
      <v-spacer></v-spacer>

      <span class="subtitle-2 mr-1">{{ wrapper.version }}</span>
      <v-icon small v-if="wrapper.docker">mdi-docker</v-icon>
      <v-btn icon :href="wrapper.source" target="_blank">
        <v-icon small>mdi-link</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-subtitle>
      {{ wrapper.desc }}
    </v-card-subtitle>

    <v-card-text v-if="showInputs">
      <v-row class="plugin-input">
        <v-col v-for="input in wrapper.inputs" :key="input.name" cols="12">
          <span class="v-label">
            <span>{{ input.name }} :</span>
            <span class="ml-1" v-if="input.value">
              (default = {{ input.value }})
            </span>
            <span class="ml-1" v-if="valuesFromFlow[input.name]">
              (flow variable = {{ valuesFromFlow[input.name] }})
            </span>
          </span>
          <v-text-field single-line
                        dense
                        v-model="inputs[input.name]"
                        :solo="edit"
                        :disabled="!edit"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-switch class="mx-2" :disabled="!edit" v-model="enabled"></v-switch>
      <v-spacer></v-spacer>
      <v-btn icon @click="edit = false" v-if="edit">
        <v-icon small>mdi-undo</v-icon>
      </v-btn>
      <v-btn icon @click="onEditClick">
        <v-icon small v-if="!edit">mdi-pencil</v-icon>
        <v-icon small v-if="edit">mdi-content-save</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import actions from '@/store/actions'
  import { FlowWrapper } from "@/util/flows";
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
      showInputs: {
        required: false,
        type: Boolean,
        default () {
          return true
        }
      }
    },
    data() {
      return {
        enabled: false,
        inputs: {},
        valuesFromFlow: {},
        edit: false
      }
    },
    mounted() {
      this.setSrcIcon(this.wrapper)

      let notify = this.getNotifyObjFromFlow()
      if (!notify) {
        return
      }

      // set value from flow notify to local data
      this.enabled = notify.enabled
      this.inputs = notify.inputs

      // try to get value from flow level variables
      let flowWrapper = new FlowWrapper(this.flow)
      for (let input of this.wrapper.inputs) {
        let value = flowWrapper.fetchVars(input.name)
        if (value) {
          this.valuesFromFlow[input.name] = value
        }
      }
    },
    computed: {
      ...mapState({
        iconCache: state => state.plugins.icon
      })
    },
    methods: {
      getNotifyObjFromFlow() {
        let list = this.flow.notifications
        if (list) {
          for (let item of list) {
            if (item.plugin === this.wrapper.name) {
              return item
            }
          }
        }
        return null
      },

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
      },

      onEditClick() {
        // !! comment out since notification edit from YAML
        // if (this.edit) {
        //   let params = {
        //     flow: this.flow,
        //     plugin: this.wrapper.name,
        //     inputs: this.inputs,
        //     enabled: this.enabled
        //   }
        //   this.$store.dispatch(actions.flows.notify.save, params).then(() => {
        //     this.edit = false
        //   })
        //   return
        // }

        this.edit = !this.edit
      }
    }
  }
</script>

<style lang="scss">
  .notify-plugin {
    .plugin-icon {
      max-height: 60px;
      max-width: 32px;
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

    .plugin-input {
      .col {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }
    }
  }
</style>
