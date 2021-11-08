<template>
  <div>
    <v-form ref="nameForm" lazy-validation>
      <v-row>
        <v-col cols="9">
          <text-box label="Name"
                    :readonly="true"
                    v-model="obj.name"
          ></text-box>
          <text-box readonly
                    label="Trigger"
                    v-model="obj.trigger"
          ></text-box>
          <text-box readonly
                    label="Category"
                    v-model="obj.category"
          ></text-box>
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
              :show-to-flow-users="obj.trigger === TRIGGER_ON_JOB_FINISHED"
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

        <confirm-btn :text="$t('delete')"
                     icon="mdi-delete"
                     color="error"
                     clazz="mr-5"
                     @click="onDeleteClick">
          <template v-slot:title>
            <span class="red--text subheading">
              Delete the notification {{ obj.name }}?
            </span>
          </template>
        </confirm-btn>

        <save-btn :on-click="onSaveClick"></save-btn>
      </v-col>
    </v-row>
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
import {
  CATEGORY_EMAIL,
  CATEGORY_WEBHOOK,
  CategorySelection,
  TRIGGER_ON_JOB_FINISHED,
  TriggerSelection
} from '@/util/notifications'
import {mapState} from "vuex";

export default {
  name: "SettingsNotificationEdit",
  components: {
    ConfirmBtn,
    TextBox,
    SaveBtn,
    BackBtn,
    EmailSettings,
  },
  props: {
    name: {
      type: String,
      required: true
    }
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
      this.$store.dispatch(actions.notifications.get, this.name).then(() => {
        // console.log(this.obj)
      })
    })
  },
  computed: {
    ...mapState({
      obj: state => state.notifications.loaded,
      smtpList: state => state.configs.items
    }),

    navs() {
      return [
        {text: this.$t('settings.li.notify'), href: '#/settings/notifications'},
        {text: this.name}
      ]
    }
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
        action = actions.notifications.saveEmail
      }

      this.$store.dispatch(action, this.obj)
          .then(() => {
            this.showSnackBar(`Notification ${this.obj.name} has been saved`)
            this.onBackClick()
          })
          .catch(e => {
            this.error = e.message
          })
    },

    onDeleteClick() {

    },

    onBackClick() {
      this.$router.push('/settings/notifications')
    }
  }
}
</script>

<style scoped>

</style>