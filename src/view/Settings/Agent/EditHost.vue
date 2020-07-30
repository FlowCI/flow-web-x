<template>
  <div>
    <v-row>
      <v-col>
        <span class="font-weight-bold caption">Edit Agent Host</span>
      </v-col>
    </v-row>

    <v-form ref="hostNameForm" lazy-validation>
      <v-row no-gutters>
        <v-col cols="8">
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

    <v-row>
      <v-col cols="8" v-if="wrapper.type === HOST_TYPE_SSH">
        <v-form ref="sshSettingsForm" lazy-validation>
          <ssh-host-editor :wrapper="wrapper" :secrets="secretNameList"></ssh-host-editor>
        </v-form>
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

      <v-col cols="8" v-if="wrapper.error">
        <span class="error--text">{{ wrapper.error }}</span>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="8" class="text-end">
        <back-btn :onClick="onBackClick" class="mr-5"></back-btn>

        <host-test-btn :host="wrapper.rawInstance"
                       clazz="mr-5"
                       v-if="wrapper.type !== HOST_TYPE_LOCAL_SOCKET"
        ></host-test-btn>

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
  import { HOST_TYPE_LOCAL_SOCKET, HOST_TYPE_SSH, HostWrapper } from '@/util/hosts'
  import { agentNameRules } from '@/util/rules'
  import TagEditor from '@/components/Common/TagEditor'
  import TextBox from '@/components/Common/TextBox'
  import ConfirmBtn from '@/components/Common/ConfirmBtn'
  import SshHostEditor from '@/components/Settings/SshHostEditor'
  import HostTestBtn from '@/components/Settings/HostTestBtn'
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
      HostTestBtn,
      SaveBtn,
      BackBtn,
      ConfirmBtn,
      TextBox
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
        deleteDialog: false,
        tagInput: [],
        nameRules: agentNameRules(this),
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

      this.$store.dispatch(actions.secrets.listNameOnly, CATEGORY_SSH_RSA).then()
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
