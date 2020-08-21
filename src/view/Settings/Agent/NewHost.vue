<template>
  <div>
    <v-row>
      <v-col>
        <span class="font-weight-bold caption">New Agent Host</span>
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

          <text-select
              :items="[HOST_TYPE_SSH]"
              label="Host Types"
              v-model="wrapper.type"
          ></text-select>
        </v-col>
      </v-row>
    </v-form>

    <v-row>
      <v-col cols="9" v-if="wrapper.type === HOST_TYPE_SSH">
        <v-form ref="sshSettingsForm" lazy-validation>
          <ssh-host-editor :wrapper="wrapper" :secrets="secretNameList"></ssh-host-editor>
        </v-form>
      </v-col>

      <v-col cols="9" v-if="wrapper.type === HOST_TYPE_LOCAL_SOCKET">
        <text-box
            max="50"
            min="1"
            step="1"
            type="number"
            label="Max Pool Size"
            v-model="wrapper.maxSize"
        ></text-box>
      </v-col>

      <v-col cols="9" v-if="wrapper.error">
        <span class="error--text">{{ wrapper.error }}</span>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="9" class="text-end">
        <back-btn :onClick="onBackClick" class="mr-5"></back-btn>
        <save-btn :onClick="onSaveClick"></save-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import { HOST_TYPE_LOCAL_SOCKET, HOST_TYPE_SSH, HostWrapper } from '@/util/hosts'
  import { agentNameRules } from '@/util/rules'
  import TagEditor from '@/components/Common/TagEditor'
  import TextBox from '@/components/Common/TextBox'
  import TextSelect from '@/components/Common/TextSelect'
  import SshHostEditor from '@/components/Settings/SshHostEditor'
  import SaveBtn from '@/components/Settings/SaveBtn'
  import BackBtn from '@/components/Settings/BackBtn'
  import actions from '@/store/actions'
  import { mapState } from 'vuex'
  import { CATEGORY_SSH_RSA } from '@/util/secrets'

  export default {
    name: 'SettingsAgentNew',
    components: {
      TagEditor,
      SshHostEditor,
      SaveBtn,
      BackBtn,
      TextBox,
      TextSelect
    },
    data() {
      return {
        HOST_TYPE_SSH,
        HOST_TYPE_LOCAL_SOCKET,
        deleteDialog: false,
        tagInput: [],
        nameRules: agentNameRules(this),
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

      this.$store.dispatch(actions.secrets.listNameOnly, CATEGORY_SSH_RSA).then()
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
      onBackClick() {
        this.$router.push('/settings/agents')
      },

      onSaveClick() {
        if (!this.$refs.hostNameForm.validate()) {
          return
        }

        if (this.$refs.sshSettingsForm && !this.$refs.sshSettingsForm.validate()) {
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
