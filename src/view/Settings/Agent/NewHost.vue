<template>
  <div>
    <v-row>
      <v-col>
        <div v-if="isEditMode">Edit Agent Host</div>
        <div v-else>New Agent Host</div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="8">
        <v-form ref="hostNameForm"
                lazy-validation>
          <v-text-field
              dense
              label="Name"
              :disabled="wrapper.type === HOST_TYPE_LOCAL_SOCKET"
              :rules="nameRules"
              v-model="wrapper.name"
          ></v-text-field>
        </v-form>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="8">
        <tag-editor :tags="wrapper.tags"
                    :disabled="wrapper.type === HOST_TYPE_LOCAL_SOCKET"
        ></tag-editor>
      </v-col>
    </v-row>

    <v-row v-if="!isEditMode">
      <v-col cols="8">
        <v-select
            :items="[HOST_TYPE_SSH]"
            label="Host Types"
            v-model="wrapper.type"
            dense
        ></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="8" v-if="wrapper.type === HOST_TYPE_SSH">
        <v-form ref="sshSettingsForm" lazy-validation>
          <ssh-host-editor :wrapper="wrapper" :secrets="secretNameList"></ssh-host-editor>
        </v-form>
      </v-col>

      <v-col cols="8" v-if="wrapper.type === HOST_TYPE_LOCAL_SOCKET">
        <pool-size-editor :wrapper="wrapper"></pool-size-editor>
      </v-col>

      <v-col cols="8" v-if="wrapper.error">
        <span class="error--text">{{ wrapper.error }}</span>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="8" class="text-end">
        <back-btn :onClick="onBackClick" class="mr-5"></back-btn>

        <host-test-btn :host="wrapper.rawInstance"
                       v-if="isEditMode"
                       clazz="mr-5"
                       :disabled="wrapper.type === HOST_TYPE_LOCAL_SOCKET"
        ></host-test-btn>

        <confirm-btn :text="$t('delete')"
                     icon="mdi-delete"
                     color="error"
                     clazz="mr-5"
                     :disabled="wrapper.type === HOST_TYPE_LOCAL_SOCKET"
                     v-if="isEditMode"
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
  import ConfirmBtn from '@/components/Common/ConfirmBtn'
  import SshHostEditor from '@/components/Settings/SshHostEditor'
  import PoolSizeEditor from '@/components/Settings/PoolSizeEditor'
  import HostTestBtn from '@/components/Settings/HostTestBtn'
  import SaveBtn from '@/components/Settings/SaveBtn'
  import BackBtn from '@/components/Settings/BackBtn'
  import actions from '@/store/actions'
  import { mapState } from 'vuex'
  import { CATEGORY_SSH_RSA } from '@/util/secrets'

  export default {
    name: 'SettingsAgentNew',
    components: {
      PoolSizeEditor,
      TagEditor,
      SshHostEditor,
      HostTestBtn,
      SaveBtn,
      BackBtn,
      ConfirmBtn
    },
    data () {
      return {
        HOST_TYPE_SSH,
        HOST_TYPE_LOCAL_SOCKET,
        deleteDialog: false,
        wrapper: new HostWrapper(),
        tagInput: [],
        nameRules: agentNameRules(this),
      }
    },
    mounted () {
      this.$emit('onConfigNav', {
        navs: [
          {
            text: this.$t('settings.li.agent'),
            href: '#/settings/agents'
          },
          {
            text: this.isEditMode ? `${this.$t('edit')} Agent ${this.$t('agent.host')}` : `${this.$t('new')} Agent ${this.$t('agent.host')}`,
            href: ''
          }
        ],
        showAddBtn: false
      })

      this.$store.dispatch(actions.secrets.listNameOnly, CATEGORY_SSH_RSA).then()

      if (this.isEditMode) {
        this.$store.dispatch(actions.hosts.get, this.hostName).then(() => {
          this.wrapper = new HostWrapper(this.host)
        })
      }
    },
    computed: {
      ...mapState({
        host: state => state.hosts.loaded,
        secrets: state => state.secrets.items,
        updated: state => state.hosts.updated
      }),

      secretNameList () {
        const nameList = []
        for (let c of this.secrets) {
          nameList.push(c.name)
        }
        return nameList
      },

      hostName () {
        return this.$route.params.name
      },

      isEditMode () {
        return this.hostName !== undefined
      }
    },
    watch: {
      updated (val) {
        this.wrapper = new HostWrapper(val)
      }
    },
    methods: {
      onDeleteClick () {
        this.$store.dispatch(actions.hosts.delete, this.wrapper.name).then(() => {
          this.$router.push('/settings/agents')
        })
      },

      onBackClick () {
        this.$router.push('/settings/agents')
      },

      onSaveClick () {
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
