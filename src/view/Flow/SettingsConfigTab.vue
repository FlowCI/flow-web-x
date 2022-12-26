<template>
  <v-card flat class="flow-yml-settings">
    <v-card-text>
      <v-tabs v-model="tab" fixed-tabs>
        <v-tabs-slider color="lighten-3"></v-tabs-slider>

        <v-tab
            v-for="item in ymlList"
            :key="item.name"
            :href="'#' + item.name"
        >
          <v-spacer></v-spacer>
          <span>{{ item.name }}</span>
          <v-spacer></v-spacer>
          <v-btn icon small>
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </v-tab>

        <v-btn icon @click="onAddYml">
          <v-icon>mdi-plus-box</v-icon>
        </v-btn>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in ymlList"
                    :key="item.name"
                    :value="item.name"
                    class="yml-editor"
        >
          <yml-editor :id="item.name"
                      :is-read-only="false"
                      :raw="item.raw"
          ></yml-editor>
        </v-tab-item>
      </v-tabs-items>

      <div class="info-message" v-if="flow.yamlFromRepo">
        <span class="px-5 py-1">{{ $t('flow.hint.yaml_from_git', [flow.yamlRepoBranch]) }}</span>
      </div>

      <div class="error-message" v-if="errorOnSave">
        <span class="px-5 py-1">{{ errorOnSave }}</span>
      </div>
    </v-card-text>

    <v-card-actions class="mt-2">
      <a href="https://github.com/FlowCI/templates" target="_blank">{{ $t('flow.more_template') }}</a>

      <v-spacer></v-spacer>

      <v-btn color="secondary"
             tile
             class="action-btn"
             @click="onResetClick"
             :disabled="!isCodeChange"
             v-if="hasPermission('Admin')"
      >
        {{ $t('reset') }}
      </v-btn>

      <v-btn color="primary"
             tile
             class="action-btn"
             @click="onSaveClick"
             :disabled="!isCodeChange"
             v-if="hasPermission('Admin')"
      >
        {{ $t('save') }}
      </v-btn>

    </v-card-actions>
  </v-card>
</template>

<script>
import YmlEditor from '@/components/Flow/YmlEditor'
import {mapState} from "vuex";
import actions from "@/store/actions";

export default {
  name: 'SettingsConfigTab',
  props: {
    // wrapper
    flow: {
      required: true,
      type: Object
    },
    steps: {
      required: true,
      type: Array
    }
  },
  components: {
    YmlEditor
  },
  data() {
    return {
      tab: null,
      isCodeChange: false,
      errorOnSave: '',
    }
  },
  mounted() {
    this.reload()
  },
  computed: {
    ...mapState({
      ymlList: state => state.flows.selected.ymlList
    }),

    name() {
      return this.flow.name
    }
  },
  methods: {
    reload() {
      this.$store.dispatch(actions.flows.yml.load, this.flow.name)
          .then() // handled on watch yml
          .catch((e) => {
            console.log(e.message)
          })
    },

    onAddYml() {
      this.$store.dispatch(actions.flows.yml.add, 'envs')
          .then()
          .catch(e => {
            this.errorOnSave = e
          })
    },

    onSaveClick() {
      this.errorOnSave = ''

      const payload = {name: this.name, yml: this.editor.getValue()}
      this.$store.dispatch(actions.flows.yml.save, payload)
          .then(() => {
            this.isCodeChange = false

            // reload current flow since vars may change
            this.$store.dispatch(actions.flows.select, this.name).then()
          })
          .catch((err) => {
            this.errorOnSave = err.message
          })
    },

    onCodeChange(e) {
      this.isCodeChange = true
    },

    onResetClick() {
      this.editor.setValue(this.yml)
      this.isCodeChange = false
    },
  }
}
</script>

<style lang="scss">
.flow-yml-settings {
  .tab-text {
    min-width: 65px;
    text-align: left;
    font-size: small;
    font-weight: bold;
  }

  .tab-active {
    color: #757575 !important;
  }
  .action-btn {
    min-width: 200px !important;
  }

  .yml-editor {
    height: 550px;
  }
}
</style>
