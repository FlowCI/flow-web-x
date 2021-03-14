<template>
  <div>
    <v-row no-gutters class="mb-2" v-if="wrapper.disabled">
      <v-col cols="9">
        <message-box :message="$t('settings.hint.agent_disabled')"></message-box>
      </v-col>
    </v-row>

    <v-form ref="hostNameForm" lazy-validation>
      <v-row no-gutters>
        <v-col cols="9">
          <text-box
              label="Name"
              :disabled="wrapper.type === HOST_TYPE_LOCAL_SOCKET"
              :rules="nameRules"
              v-model="wrapper.name"
          ></text-box>
          <tag-editor :tags="wrapper.tags"
                      :disabled="wrapper.type === HOST_TYPE_LOCAL_SOCKET"
          ></tag-editor>
        </v-col>
      </v-row>
    </v-form>

    <v-form ref="hostSettingsForm" lazy-validation>
      <v-row>
        <v-col cols="9" v-if="wrapper.type === HOST_TYPE_SSH">
          <ssh-host-editor :wrapper="wrapper" :secrets="secretNameList"></ssh-host-editor>
        </v-col>

        <v-col cols="2" v-if="wrapper.type === HOST_TYPE_LOCAL_SOCKET">
          <text-box
              min="1"
              step="1"
              type="number"
              label="Max Pool Size"
              v-model="wrapper.maxSize"
          ></text-box>
        </v-col>

        <v-col cols="9" v-if="wrapper.type === HOST_TYPE_K8S">
          <k8s-host-editor :wrapper="wrapper" :secrets="secretNameList"></k8s-host-editor>
        </v-col>

        <v-col cols="9" v-if="wrapper.error">
          <span class="error--text">{{ wrapper.error }}</span>
        </v-col>
      </v-row>
    </v-form>

    <v-form ref="agentSettingForm" lazy-validation>
      <v-row>
        <v-col cols="12">
          <span class="font-weight-bold caption">Agent Settings</span>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="4">
          <text-box
              label="Exit After Idle (seconds)"
              v-model="wrapper.exitOnIdle"
              type="number"
              :rules="idleTimeRules"
          ></text-box>
        </v-col>
      </v-row>
    </v-form>

    <v-row>
      <v-col cols="9" class="text-end">
        <back-btn :onClick="onBackClick" class="mr-5"></back-btn>

        <host-test-btn :host="wrapper.rawInstance"
                       clazz="mr-5"
                       v-if="wrapper.type !== HOST_TYPE_LOCAL_SOCKET"
        ></host-test-btn>

        <confirm-btn :text="wrapper.disabled ? $t('enable') : $t('disable')"
                     icon="mdi-delete"
                     color="grey dark-1"
                     clazz="mr-5"
                     @click="onDisableOrEnableClick">
          <template v-slot:title>
            <span class="subheading" v-if="!wrapper.disabled">
              Disable agent host '{{ wrapper.name }}'? (you can enable it later)
            </span>

            <span class="subheading" v-if="wrapper.disabled">
              Enable agent host '{{ wrapper.name }}'?
            </span>
          </template>
        </confirm-btn>

        <confirm-btn :text="$t('delete')"
                     icon="mdi-delete"
                     color="error"
                     clazz="mr-5"
                     v-if="wrapper.type !== HOST_TYPE_LOCAL_SOCKET"
                     @click="onDeleteClick">
          <template v-slot:title>
            <span class="red--text subheading">
              Delete agent host '{{ wrapper.name }}'?
            </span>
          </template>
        </confirm-btn>

        <save-btn :onClick="onSaveClick"></save-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {HOST_TYPE_LOCAL_SOCKET, HOST_TYPE_SSH, HOST_TYPE_K8S} from '@/util/hosts'
import {agentNameRules, timeRuleInSeconds} from '@/util/rules'
import TagEditor from '@/components/Common/TagEditor'
import TextBox from '@/components/Common/TextBox'
import MessageBox from '@/components/Common/MessageBox'
import ConfirmBtn from '@/components/Common/ConfirmBtn'
import SshHostEditor from '@/components/Settings/SshHostEditor'
import K8sHostEditor from '@/components/Settings/K8sHostEditor'
import HostTestBtn from '@/components/Settings/HostTestBtn'
import SaveBtn from '@/components/Settings/SaveBtn'
import BackBtn from '@/components/Settings/BackBtn'
import actions from '@/store/actions'
import {mapState} from 'vuex'
import {CATEGORY_KUBE_CONFIG, CATEGORY_SSH_RSA} from '@/util/secrets'

export default {
  name: 'SettingsAgentNew',
  components: {
    TagEditor,
    SshHostEditor,
    K8sHostEditor,
    HostTestBtn,
    SaveBtn,
    BackBtn,
    ConfirmBtn,
    TextBox,
    MessageBox
  },
  props: {
    wrapper: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      HOST_TYPE_SSH,
      HOST_TYPE_LOCAL_SOCKET,
      HOST_TYPE_K8S,
      deleteDialog: false,
      tagInput: [],
      nameRules: agentNameRules(this),
      idleTimeRules: timeRuleInSeconds(this, 'agent.hint.idle_time_rule'),
    }
  },
  mounted() {
    this.$emit('onConfigNav', {
      navs: [
        {text: this.$t('settings.li.agent'), href: '#/settings/agents'},
        {text: `${this.$t('edit')} Agent ${this.$t('agent.host')}`, href: ''}
      ],
      showAddBtn: false
    })


    if (this.wrapper.type === HOST_TYPE_SSH) {
      this.$store.dispatch(actions.secrets.listNameOnly, CATEGORY_SSH_RSA).then()
    }

    if (this.wrapper.type === HOST_TYPE_K8S) {
      this.$store.dispatch(actions.secrets.listNameOnly, CATEGORY_KUBE_CONFIG).then()
    }
  },
  computed: {
    ...mapState({
      secrets: state => state.secrets.items,
      updated: state => state.hosts.updated
    }),

    secretNameList() {
      const nameList = []
      for (let c of this.secrets) {
        nameList.push(c.name)
      }
      return nameList
    }
  },
  watch: {
    updated(val) {
      this.wrapper.error = val.error
    }
  },
  methods: {
    onDeleteClick() {
      this.$store.dispatch(actions.hosts.delete, this.wrapper.name).then(() => {
        this.$router.push('/settings/agents')
      })
    },

    onDisableOrEnableClick() {
      const value = !this.wrapper.disabled
      const name = this.wrapper.name

      this.$store.dispatch(actions.hosts.switch, {name, value})
          .then(() => {
            this.showSnackBar(`Agent host ${this.wrapper.name} has been updated`)
            this.wrapper.disable = value
            this.$router.push('/settings/agents')
          })
          .catch((e) => {
            this.wrapper.error = e.message
          })
    },

    onBackClick() {
      this.$router.push('/settings/agents')
    },

    onSaveClick() {
      if (!this.$refs.hostNameForm.validate()) {
        return
      }

      if (!this.$refs.hostSettingsForm.validate()) {
        return
      }

      if (!this.$refs.agentSettingForm.validate()) {
        return
      }

      this.$store.dispatch(actions.hosts.createOrUpdate, this.wrapper.rawInstance)
          .then(() => {
            this.showSnackBar(`Agent host ${this.wrapper.name} has been saved`)
          })
          .catch((e) => {
            this.wrapper.error = e.message
          })
    }
  }
}
</script>

<style scoped>

</style>
