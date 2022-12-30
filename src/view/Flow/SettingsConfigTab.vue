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
          {{ item.name }}
          <v-spacer></v-spacer>

          <v-menu v-if="item.name !== DEFAULT_YAML_NAME">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" small>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list dense>
              <v-list-item dense @click="onYmlDeleteClick(item)">
                <v-list-item-icon class="mr-1">
                  <v-icon small>mdi-close</v-icon>
                </v-list-item-icon>
                <v-list-item-title>
                  {{ $t('delete') }}
                </v-list-item-title>
              </v-list-item>

              <v-list-item dense @click="onYmlRenameClick(item)">
                <v-list-item-icon class="mr-1">
                  <v-icon small>mdi-pencil</v-icon>
                </v-list-item-icon>
                <v-list-item-title>
                  {{ $t('rename') }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-tab>

        <v-btn icon @click="onAddYmlClick" class="mt-2">
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
                      :is-read-only="!hasPermission('Admin')"
                      :raw="item.raw"
                      :object="item"
                      @change="onYmlChange"
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

    <v-card-actions class="mt-2 mx-6">
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

    <!--delete confirm dialog-->
    <confirm-dialog
        v-model="deleteConfirmDialog.show"
        :text="$t('delete')"
        @confirm="onYmlDeleteConfirmClick"
    >
      <template v-slot:content>
        Delete the YAML file <span class="font-weight-bold">{{ deleteConfirmDialog.ymlObj.name }}</span>?
      </template>
    </confirm-dialog>

    <!--add yml dialog-->
    <confirm-dialog
        v-model="addYmlDialog.show"
        :text="$t('confirm')"
        @cancel="onAddYmlCancelClick"
        @confirm="onAddYmlConfirmClick"
    >
      <template v-slot:content>
        <div>
          Add an new YAML file
        </div>
        <div>
          <text-box label=""
                    v-model="addYmlDialog.name"
          ></text-box>
        </div>
      </template>
    </confirm-dialog>

    <!--edit yml name dialog-->
    <confirm-dialog
        v-model="editNameDialog.show"
        :text="$t('confirm')"
        @cancel="onYmlRenameCancelClick"
        @confirm="onYmlRenameConfirmClick"
    >
      <template v-slot:content>
        <div>
          Edit the YAML file name <span class="font-weight-bold">{{ editNameDialog.ymlObj.name }}</span>
        </div>
        <div>
          <text-box label=""
                    v-model="editNameDialog.name"
          ></text-box>
        </div>
      </template>
    </confirm-dialog>
  </v-card>
</template>

<script>
import YmlEditor from '@/components/Flow/YmlEditor'
import {mapState} from "vuex";
import actions from "@/store/actions";
import {DEFAULT_YAML_NAME} from "@/util/flows";
import ConfirmDialog from "@/components/Common/ConfirmDialog.vue";
import TextBox from "@/components/Common/TextBox.vue";

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
    ConfirmDialog,
    YmlEditor,
    TextBox
  },
  data() {
    return {
      deleteConfirmDialog: {
        show: false,
        ymlObj: {name: ''}
      },
      editNameDialog: {
        show: false,
        ymlObj: {name: ''},
        name: ''
      },
      addYmlDialog: {
        show: false,
        name: ''
      },
      tab: null,
      watchCodeChange: false,
      isCodeChange: false,
      errorOnSave: '',
      DEFAULT_YAML_NAME: DEFAULT_YAML_NAME
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
  watch: {
    ymlList: {
      deep: true,
      handler() {
        if (this.watchCodeChange) {
          this.isCodeChange = true
        }
      }
    }
  },
  methods: {
    reload() {
      this.$store.dispatch(actions.flows.yml.load, this.flow.name)
          .then(() => {
            this.watchCodeChange = true
            this.isCodeChange = false
          })
          .catch((e) => {
            console.log(e.message)
          })
    },

    onAddYmlClick() {
      this.addYmlDialog.show = true
      this.addYmlDialog.name = ''
    },

    onAddYmlCancelClick() {
      this.addYmlDialog.show = false
      this.addYmlDialog.name = ''
    },

    onAddYmlConfirmClick() {
      this.$store.dispatch(actions.flows.yml.add, this.addYmlDialog.name)
          .then(() => {
            this.onAddYmlCancelClick()
          })
          .catch(e => {
            this.errorOnSave = e
          })
    },

    onYmlDeleteClick(yml) {
      this.deleteConfirmDialog.show = true
      this.deleteConfirmDialog.ymlObj = yml
    },

    onYmlDeleteConfirmClick() {
      this.$store.dispatch(actions.flows.yml.delete, this.deleteConfirmDialog.ymlObj)
          .then(() => {
            this.deleteConfirmDialog.show = false
            this.deleteConfirmDialog.ymlObj = {name: ''}
          })
    },

    onYmlRenameClick(yml) {
      this.editNameDialog.show = true
      this.editNameDialog.ymlObj = yml
      this.editNameDialog.name = yml.name
    },

    onYmlRenameCancelClick() {
      this.editNameDialog.show = false
      this.editNameDialog.ymlObj = {name: ''}
      this.editNameDialog.name = ''
    },

    onYmlRenameConfirmClick() {
      this.editNameDialog.ymlObj.name = this.editNameDialog.name
      this.onYmlRenameCancelClick()
    },

    onYmlChange(updated, ymlObj) {
      ymlObj.raw = updated
    },

    onSaveClick() {
      this.errorOnSave = ''

      const payload = {name: this.name, ymlList: this.ymlList}
      this.$store.dispatch(actions.flows.yml.save, payload)
          .then(() => {
            this.isCodeChange = false

            // reload current flow since vars may change
            this.$store.dispatch(actions.flows.select, this.name).then()
          })
          .catch((err) => {
            console.log(err)
            this.errorOnSave = err.message
          })
    },

    onResetClick() {
      this.reload()
    }
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
