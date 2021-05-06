<template>
  <div>
    <v-form ref="hostNameForm" lazy-validation>
      <v-row no-gutters>
        <v-col cols="9">
          <text-box
              label="Name"
              :rules="nameRules"
              v-model="wrapper.name"
          ></text-box>

          <tag-editor :tags="wrapper.tags"></tag-editor>

          <text-select
              :items="[HOST_TYPE_SSH, HOST_TYPE_K8S]"
              label="Host Types"
              v-model="wrapper.type"
              :on-change="onTypeChange"
          ></text-select>
        </v-col>
      </v-row>
    </v-form>

    <v-form ref="hostSettingsForm" lazy-validation>
      <v-row>
        <v-col cols="9" v-if="wrapper.type === HOST_TYPE_SSH">
          <ssh-host-editor :wrapper="wrapper" :secrets="secretNameList"></ssh-host-editor>
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
        <save-btn :onClick="onSaveClick"></save-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { HOST_TYPE_SSH, HOST_TYPE_K8S, HostWrapper } from '@/util/hosts'
import {agentNameRules, timeRuleInSeconds} from '@/util/rules'
import TagEditor from '@/components/Common/TagEditor'
import TextBox from '@/components/Common/TextBox'
import TextSelect from '@/components/Common/TextSelect'
import SshHostEditor from '@/components/Settings/SshHostEditor'
import K8sHostEditor from '@/components/Settings/K8sHostEditor'
import SaveBtn from '@/components/Settings/SaveBtn'
import BackBtn from '@/components/Settings/BackBtn'
import actions from '@/store/actions'
import { mapState } from 'vuex'
import { CATEGORY_SSH_RSA, CATEGORY_KUBE_CONFIG } from '@/util/secrets'

export default {
  name: 'SettingsAgentNew',
  components: {
    SshHostEditor,
    K8sHostEditor,
    TagEditor,
    SaveBtn,
    BackBtn,
    TextBox,
    TextSelect
  },
  data() {
    return {
      HOST_TYPE_SSH,
      HOST_TYPE_K8S,
      deleteDialog: false,
      tagInput: [],
      nameRules: agentNameRules(this),
      idleTimeRules: timeRuleInSeconds(this, 'agent.hint.idle_time_rule'),
      wrapper: new HostWrapper()
    }
  },
  mounted() {
    this.$emit('onConfigNav', {
      navs: [
        {text: this.$t('settings.li.agent'), href: '#/settings/agents'},
        {text: `${this.$t('new')} Agent ${this.$t('agent.host')}`, href: ''}
      ],
      showAddBtn: false
    })
  },
  watch: {

  },
  computed: {
    ...mapState({
      secrets: state => state.secrets.items,
    }),

    secretNameList() {
      const nameList = []
      for (let c of this.secrets) {
        nameList.push(c.name)
      }
      return nameList
    }
  },
  methods: {
    onTypeChange(val) {
      if (val === HOST_TYPE_SSH) {
        this.$store.dispatch(actions.secrets.listNameOnly, CATEGORY_SSH_RSA).then()
      }

      if (val === HOST_TYPE_K8S) {
        this.$store.dispatch(actions.secrets.listNameOnly, CATEGORY_KUBE_CONFIG).then()
      }
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

      this.$store.dispatch(actions.hosts.createOrUpdate, this.wrapper.rawInstance).then(() => {
        this.$router.push('/settings/agents')
      })
    }
  }
}
</script>

<style scoped>

</style>
