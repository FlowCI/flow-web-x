<template>
  <div>
    <v-form ref="nameForm" lazy-validation>
      <v-row>
        <v-col cols="9">
          <text-box label="Name"
                    :rules="rules.required('Name is required')"
                    v-model="name"
          ></text-box>
          <text-select :items="triggers"
                       label="Trigger"
                       v-model="trigger"
          ></text-select>
          <text-select :items="categories"
                       label="Category"
                       v-model="category"
          ></text-select>
        </v-col>
      </v-row>
    </v-form>

    <v-divider></v-divider>

    <v-form ref="contentForm" lazy-validation>
      <v-row v-if="category === CATEGORY_EMAIL">
        <v-col>
          <email-settings
              v-model="objs[CATEGORY_EMAIL]"
              :show-to-flow-users="trigger === TRIGGER_ON_JOB_FINISHED"
          ></email-settings>
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
import {
  CATEGORY_EMAIL,
  CATEGORY_WEBHOOK,
  CategorySelection,
  TRIGGER_ON_JOB_FINISHED,
  TriggerSelection
} from '@/util/notifications'

export default {
  name: "SettingsNotificationNew",
  components: {
    TextBox,
    TextSelect,
    SaveBtn,
    BackBtn,
    EmailSettings,
  },
  data() {
    return {
      error: '',
      rules: {
        required
      },
      triggers: TriggerSelection,
      categories: CategorySelection,
      CATEGORY_EMAIL,
      CATEGORY_WEBHOOK,
      TRIGGER_ON_JOB_FINISHED,
      types: [
        {
          text: 'On Job Finished',
          value: 'OnJobFinished',
          desc: ''
        }
      ],
      name: '',
      category: CATEGORY_EMAIL,
      trigger: TRIGGER_ON_JOB_FINISHED,
      objs: {
        [CATEGORY_EMAIL]: {
          from: '',
          to: '',
          subject: '',
          smtp: '',
        },
        [CATEGORY_WEBHOOK]: {}
      }
    }
  },
  mounted() {
    this.$emit('onConfigNav', {
      navs: this.navs,
      showAddBtn: false
    })
  },
  computed: {
    navs() {
      return [
        {text: this.$t('settings.li.notify'), href: '#/settings/notifications'},
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

      const payload = {
        name: this.name,
        category: this.category,
        trigger: this.trigger
      }

      let action = ''

      if (this.category === CATEGORY_EMAIL) {
        let es = this.objs[CATEGORY_EMAIL];
        payload.from = es.from
        payload.to = es.to
        payload.subject = es.subject
        payload.smtpConfig = es.smtp
        action = actions.notifications.saveEmail
      }

      this.$store.dispatch(action, payload).then(() => {
        this.onBackClick()
      }).catch(e => {
        this.error = e.message
      })
    },

    onBackClick() {
      this.$router.push('/settings/notifications')
    }
  }
}
</script>

<style scoped>

</style>