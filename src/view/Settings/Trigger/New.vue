<template>
  <div>
    <v-form ref="nameForm" lazy-validation>
      <v-row>
        <v-col cols="9">
          <text-box :label="$t('settings.trigger.name')"
                    :rules="rules.required('Name is required')"
                    v-model="obj.name"
          ></text-box>
          <text-select :items="events"
                       :label="$t('settings.trigger.event')"
                       v-model="obj.event"
          ></text-select>
          <text-select :items="categories"
                       :label="$t('settings.trigger.category')"
                       v-model="obj.category"
          ></text-select>
        </v-col>
      </v-row>
    </v-form>

    <v-divider></v-divider>

    <v-form ref="contentForm" lazy-validation>
      <v-row v-if="obj.category === CATEGORY_EMAIL">
        <v-col>
          <email-settings
              v-model="obj"
              :smtp-list="smtpList"
              :show-to-flow-users="obj.event === EVENT_ON_JOB_FINISHED"
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
        <save-btn :on-click="onSaveClick"></save-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import actions from '@/store/actions'
import {required} from '@/util/rules'
import TextBox from '@/components/Common/TextBox'
import TextSelect from '@/components/Common/TextSelect'
import SaveBtn from '@/components/Settings/SaveBtn'
import BackBtn from '@/components/Settings/BackBtn'
import EmailSettings from './EmailSettings'
import WebhookSettings from './WebhookSettings'
import {
  CATEGORY_EMAIL,
  CATEGORY_WEBHOOK,
  CategorySelection,
  EVENT_ON_JOB_FINISHED,
  NewEmptyObj,
  WebhookHelper, EventSelection
} from '@/util/triggers'
import {mapState} from "vuex";

export default {
  name: "SettingsTriggerNew",
  components: {
    TextBox,
    TextSelect,
    SaveBtn,
    BackBtn,
    EmailSettings,
    WebhookSettings
  },
  data() {
    return {
      error: '',
      rules: {
        required
      },
      events: EventSelection,
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
      ],
      obj: NewEmptyObj()
    }
  },
  mounted() {
    this.$emit('onConfigNav', {
      navs: this.navs,
      showAddBtn: false
    })

    this.$store.dispatch(actions.configs.listSmtp).then()
  },
  computed: {
    ...mapState({
      smtpList: state => state.configs.items
    }),
    navs() {
      return [
        {text: this.$t('settings.li.trigger'), href: '#/settings/triggers'},
        {text: this.$t('new')}
      ]
    },
  },
  methods: {
    onSaveClick() {
      if (!this.$refs.nameForm.validate()) {
        return
      }

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

      this.$store.dispatch(action, this.obj).then(() => {
        this.showSnackBar(`Trigger ${this.obj.name} has been created`)
        this.onBackClick()
      }).catch(e => {
        this.error = e.message
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