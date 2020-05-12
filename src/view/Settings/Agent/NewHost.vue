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
              :rules="rules.required"
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
        <host-test-btn :host="wrapper.rawInstance"
                       v-if="isEditMode"
                       :disabled="wrapper.type === HOST_TYPE_LOCAL_SOCKET"></host-test-btn>

        <v-btn class="mx-1"
               outlined
               color="error"
               :disabled="wrapper.type === HOST_TYPE_LOCAL_SOCKET"
               @click="deleteDialog = true"
               v-if="isEditMode"
        >{{ $t('delete') }}
        </v-btn>

        <v-dialog
            v-model="deleteDialog"
            width="500"
            v-if="isEditMode">
          <v-card>
            <v-card-title
                class="error--text"
                primary-title
            >Delete agent host '{{ wrapper.name }}'?
            </v-card-title>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="deleteDialog = false">{{ $t('cancel') }}</v-btn>
              <v-btn outlined color="error" @click="onDeleteClick">{{ $t('delete') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-btn class="mx-1" outlined color="warning" @click="onBackClick">{{ $t('back') }}</v-btn>
        <v-btn class="mx-1" color="primary" @click="onSaveClick">{{ $t('save') }}</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import { HOST_TYPE_LOCAL_SOCKET, HOST_TYPE_SSH, HostWrapper } from '@/util/hosts'
  import { required } from '@/util/rules'
  import TagEditor from '@/components/Common/TagEditor'
  import SshHostEditor from '@/components/Settings/SshHostEditor'
  import PoolSizeEditor from '@/components/Settings/PoolSizeEditor'
  import HostTestBtn from '@/components/Settings/HostTestBtn'
  import actions from '@/store/actions'
  import { mapState } from 'vuex'
  import { CATEGORY_SSH_RSA } from '@/util/secrets'

  export default {
    name: 'SettingsAgentNew',
    components: {
      PoolSizeEditor,
      TagEditor,
      SshHostEditor,
      HostTestBtn
    },
    data () {
      return {
        HOST_TYPE_SSH,
        HOST_TYPE_LOCAL_SOCKET,
        deleteDialog: false,
        wrapper: new HostWrapper(),
        tagInput: [],
        rules: {
          required: required('Required')
        }
      }
    },
    mounted () {
      this.$emit('onConfigNav', {
        navs: [
          {
            text: 'Agents',
            href: '#/settings/agents'
          },
          {
            text: this.isEditMode ? 'Edit Agent Host' : 'New Agent Host',
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
