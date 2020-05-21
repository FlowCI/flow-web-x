<template>
  <v-card max-width="600" class="notify-plugin">
    <v-card-title>
      <v-icon large left>
        mdi-twitter
      </v-icon>
      <span class="title">{{ wrapper.name }}</span>
      <v-spacer></v-spacer>

      <span class="subtitle-2">{{ wrapper.version }}</span>
      <v-btn icon :href="wrapper.source" target="_blank">
        <v-icon small>mdi-link</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-subtitle>
      {{ wrapper.desc }}
    </v-card-subtitle>

    <v-card-text>
      <v-row class="plugin-input">
        <v-col v-for="input in wrapper.inputs" :key="input.name" cols="12">
          <span class="v-label">{{ input.name }} : </span>
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
      }
    },
    data () {
      return {
        enabled: false,
        inputs: {},
        edit: false
      }
    },
    mounted() {
      let notify = this.getNotifyObjFromFlow()
      if (!notify) {
        return
      }

      this.enabled = notify.enabled
      this.inputs = notify.inputs
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

      onEditClick() {
        if (this.edit) {
          let params = {
            flow: this.flow,
            plugin: this.wrapper.name,
            inputs: this.inputs,
            enabled: this.enabled
          }
          this.$store.dispatch(actions.flows.notify.save, params).then(() => {
            this.edit = false
          })
          return
        }

        this.edit = !this.edit
      }
    }
  }
</script>

<style lang="scss">
  .notify-plugin {
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
