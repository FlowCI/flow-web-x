<template>
  <div>
    <v-tabs v-model="tab">
      <v-tab class="caption">Settings</v-tab>
      <v-tab class="caption">Recent Deliveries</v-tab>
    </v-tabs>

    <v-divider></v-divider>

    <v-tabs-items v-model="tab">
      <!-- settings tab-->
      <v-tab-item>
        <v-row>
          <v-col cols="9">
            <text-box :label="$t('settings.trigger.name')"
                      :readonly="true"
                      v-model="obj.name"
            ></text-box>
            <text-box readonly
                      :label="$t('settings.trigger.event')"
                      v-model="obj.event"
            ></text-box>
            <text-box readonly
                      :label="$t('settings.trigger.category')"
                      v-model="obj.category"
            ></text-box>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-form ref="contentForm" lazy-validation>
          <v-row v-if="obj.category === CATEGORY_EMAIL">
            <v-col>
              <email-settings
                  v-model="obj"
                  :smtp-list="smtpList"
                  :show-to-flow-users="obj.action === EVENT_ON_JOB_FINISHED"
              ></email-settings>
            </v-col>
          </v-row>

          <v-row v-if="obj.category === CATEGORY_WEBHOOK">
            <v-col>
              <webhook-settings v-model="obj"></webhook-settings>
            </v-col>
          </v-row>
        </v-form>

        <v-row no-gutters dense v-if="error">
          <v-col cols="9">
            <span class="error--text">Error: {{ error }}</span>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="9" class="text-end">
            <back-btn :on-click="onBackClick" class="mr-5"></back-btn>

            <confirm-btn :text="$t('delete')"
                         icon="mdi-delete"
                         color="error"
                         clazz="mr-5"
                         @click="onDeleteClick">
              <template v-slot:title>
            <span class="red--text subheading">
              Delete the trigger {{ obj.name }}?
            </span>
              </template>
            </confirm-btn>

            <save-btn :on-click="onSaveClick"></save-btn>
          </v-col>
        </v-row>
      </v-tab-item>

      <!-- deliveries tab -->
      <v-tab-item>
          <delivery-table :name="name"></delivery-table>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import actions from '@/store/actions'
import {required} from '@/util/rules'
import TextBox from '@/components/Common/TextBox'
import ConfirmBtn from '@/components/Common/ConfirmBtn'
import SaveBtn from '@/components/Settings/SaveBtn'
import BackBtn from '@/components/Settings/BackBtn'
import EmailSettings from './EmailSettings'
import WebhookSettings from './WebhookSettings'
import {
  CATEGORY_EMAIL,
  CATEGORY_WEBHOOK,
  CategorySelection,
  EVENT_ON_JOB_FINISHED,
  WebhookHelper
} from '@/util/triggers'
import {mapState} from "vuex";
import DeliveryTable from "@/view/Settings/Trigger/DeliveryTable";

export default {
  name: "SettingsTriggerEdit",
  components: {
    DeliveryTable,
    ConfirmBtn,
    TextBox,
    SaveBtn,
    BackBtn,
    EmailSettings,
    WebhookSettings
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      tab: null,
      error: '',
      rules: {
        required
      },
      categories: CategorySelection,
      CATEGORY_EMAIL,
      CATEGORY_WEBHOOK,
      EVENT_ON_JOB_FINISHED,
      types: [
        {
          text: 'On Job Finished',
          value: 'OnJobFinished',
          desc: ''
        }
      ]
    }
  },
  mounted() {
    this.$emit('onConfigNav', {
      navs: this.navs,
      showAddBtn: false
    })

    // load smtp list first
    this.$store.dispatch(actions.configs.listSmtp).then(() => {
      this.$store.dispatch(actions.triggers.get, this.name).then(() => {
        // console.log(this.obj)
      })
    })
  },
  computed: {
    ...mapState({
      obj: state => state.triggers.loaded,
      smtpList: state => state.configs.items
    }),

    navs() {
      return [
        {text: this.$t('settings.li.trigger'), href: '#/settings/triggers'},
        {text: this.name}
      ]
    }
  },
  methods: {
    onSaveClick() {
      if (!this.$refs.contentForm.validate()) {
        return
      }

      let action = ''
      if (this.obj.category === CATEGORY_EMAIL) {
        action = actions.triggers.saveEmail
      }

      if (this.obj.category === CATEGORY_WEBHOOK) {
        action = actions.triggers.saveWebhook
        WebhookHelper.SetParamsAndHeaderFromKvItems(this.obj)
      }

      this.$store.dispatch(action, this.obj)
          .then(() => {
            this.showSnackBar(`Trigger ${this.obj.name} has been saved`)
            this.onBackClick()
          })
          .catch(e => {
            this.error = e.message
          })
    },

    onDeleteClick() {
      this.$store.dispatch(actions.triggers.delete, this.obj.name)
          .then(() => {
            this.showSnackBar(`Trigger ${this.obj.name} has been deleted`)
            this.onBackClick()
          })
          .catch((err) => {
            console.log(err)
          })
    },

    onBackClick() {
      this.$router.push('/settings/triggers')
    }
  }
}
</script>

<style scoped>

</style>