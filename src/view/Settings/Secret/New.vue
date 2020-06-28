<template>
  <div>
    <v-row>
      <v-col cols="8">
        <v-form ref="nameForm" lazy-validation>
          <text-box label="Name"
                    :rules="nameRules"
                    v-model="name"
          ></text-box>
        </v-form>

        <text-select :items="[CATEGORY_SSH_RSA, CATEGORY_AUTH, CATEGORY_TOKEN]"
                     label="Category"
                     v-model="category"
        ></text-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="8" v-if="isSshRsa">
        <v-form ref="sshForm" lazy-validation>
          <ssh-rsa-editor :showHelp="false"
                          :showCreateNew="true"
                          :model="instance"
          ></ssh-rsa-editor>
        </v-form>
      </v-col>

      <v-col cols="8" v-if="isAuth">
        <v-form ref="authForm" lazy-validation>
          <auth-editor :model="instance"></auth-editor>
        </v-form>
      </v-col>

      <v-col cols="8" v-if="isToken">
        <v-form ref="tokenForm" lazy-validation>
          <token-editor :model="instance"></token-editor>
        </v-form>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="8" class="text-end">
        <v-btn outlined color="warning" @click="onBackClick">{{ $t('back') }}</v-btn>
        <v-btn color="primary" @click="onSaveClick" class="ml-4">{{ $t('save') }}</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import SshRsaEditor from '@/components/Common/SshRsaEditor'
  import AuthEditor from '@/components/Common/AuthEditor'
  import TokenEditor from '@/components/Common/TokenEditor'
  import TextBox from '@/components/Common/TextBox'
  import TextSelect from '@/components/Common/TextSelect'
  import actions from '@/store/actions'
  import { CATEGORY_AUTH, CATEGORY_SSH_RSA, CATEGORY_TOKEN } from '@/util/secrets'
  import { secretAndConfigNameRules } from '@/util/rules'

  export default {
    name: 'SettingsSecretNew',
    components: {
      TextBox,
      TextSelect,
      SshRsaEditor,
      AuthEditor,
      TokenEditor
    },
    data() {
      return {
        CATEGORY_SSH_RSA,
        CATEGORY_AUTH,
        CATEGORY_TOKEN,

        name: '',
        nameRules: secretAndConfigNameRules(this),
        category: CATEGORY_SSH_RSA,

        credential: {
          [CATEGORY_SSH_RSA]: {
            selected: '',
            pair: {
              publicKey: '',
              privateKey: ''
            }
          },

          [CATEGORY_AUTH]: {
            selected: '',
            pair: {
              username: '',
              password: ''
            }
          },

          [CATEGORY_TOKEN]: {
            token: {
              data: ''
            }
          }
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
          {
            text: this.$t('settings.li.secret'),
            href: '#/settings/secrets'
          },
          {
            text: this.$t('new')
          }
        ]
      },

      instance() {
        return this.credential[this.category]
      },

      isSshRsa() {
        return this.category === CATEGORY_SSH_RSA
      },

      isAuth() {
        return this.category === CATEGORY_AUTH
      },

      isToken() {
        return this.category === CATEGORY_TOKEN
      }
    },
    methods: {
      onBackClick() {
        this.$router.push('/settings/secrets')
      },

      onSaveClick() {
        if (!this.$refs.nameForm.validate()) {
          return
        }

        const payload = {
          name: this.name
        }

        if (this.isSshRsa && this.$refs.sshForm.validate()) {
          payload.publicKey = this.instance.pair.publicKey
          payload.privateKey = this.instance.pair.privateKey
          this.$store.dispatch(actions.secrets.createRsa, payload).then(() => {
            this.onBackClick()
          })
          return
        }

        if (this.isAuth && this.$refs.authForm.validate()) {
          payload.username = this.instance.pair.username
          payload.password = this.instance.pair.password
          this.$store.dispatch(actions.secrets.createAuth, payload).then(() => {
            this.onBackClick()
          })
          return
        }

        if (this.isToken && this.$refs.tokenForm.validate()) {
          payload.token = this.instance.token.data
          this.$store.dispatch(actions.secrets.createToken, payload).then(() => {
            this.onBackClick()
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
