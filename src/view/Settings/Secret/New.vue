<template>
  <div>
    <v-form ref="nameForm" lazy-validation>
      <v-row>
        <v-col cols="9">
          <text-box label="Name"
                    :rules="nameRules"
                    v-model="name"
          ></text-box>
          <text-select :items="categories"
                       label="Category"
                       v-model="category"
          ></text-select>
        </v-col>
      </v-row>
    </v-form>

    <v-divider></v-divider>

    <v-form ref="contentForm" lazy-validation>
      <v-row>
        <v-col cols="9" v-if="isSshRsa">
          <ssh-rsa-editor :showHelp="false"
                          :showCreateNew="true"
                          :model="instance"
          ></ssh-rsa-editor>
        </v-col>

        <v-col cols="9" v-if="isAuth">
          <auth-editor :model="instance"></auth-editor>
        </v-col>

        <v-col cols="9" v-if="isToken">
          <token-editor :model="instance"></token-editor>
        </v-col>

        <v-col cols="9" v-if="isAndroidSign">
          <android-sign-editor :model="instance"></android-sign-editor>
        </v-col>

        <v-col cols="9" v-if="isKubeconfig">
          <data-editor v-model="instance.content.data" mode="yaml"></data-editor>
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
import SshRsaEditor from '@/components/Common/SshRsaEditor'
import AuthEditor from '@/components/Common/AuthEditor'
import TokenEditor from '@/components/Common/TokenEditor'
import AndroidSignEditor from '@/components/Settings/AndroidSignEditor'
import DataEditor from '@/components/Settings/DataEditor'
import SaveBtn from '@/components/Settings/SaveBtn'
import BackBtn from '@/components/Settings/BackBtn'
import TextBox from '@/components/Common/TextBox'
import TextSelect from '@/components/Common/TextSelect'
import actions from '@/store/actions'
import {
  CategoriesSelection,
  CATEGORY_ANDROID_SIGN,
  CATEGORY_AUTH,
  CATEGORY_KUBE_CONFIG,
  CATEGORY_SSH_RSA,
  CATEGORY_TOKEN
} from '@/util/secrets'
import {secretAndConfigNameRules} from '@/util/rules'

export default {
  name: 'SettingsSecretNew',
  components: {
    TextBox,
    TextSelect,
    SshRsaEditor,
    AuthEditor,
    TokenEditor,
    SaveBtn,
    BackBtn,
    AndroidSignEditor,
    DataEditor
  },
  data() {
    return {
      name: '',
      categories: CategoriesSelection,
      nameRules: secretAndConfigNameRules(this),
      category: CATEGORY_SSH_RSA,
      error: '',
      secrets: {
        [CATEGORY_SSH_RSA]: {
          selected: '',
          pair: {publicKey: '', privateKey: ''}
        },
        [CATEGORY_AUTH]: {
          selected: '',
          pair: {username: '', password: ''}
        },
        [CATEGORY_TOKEN]: {
          token: {data: ''}
        },
        [CATEGORY_ANDROID_SIGN]: {
          keyStore: null,
          keyStoreFileName: '',
          keyStorePassword: {data: ''},
          keyAlias: '',
          keyPassword: {data: ''}
        },
        [CATEGORY_KUBE_CONFIG]: {
          content: {data: ''}
        },
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
      return this.secrets[this.category]
    },

    isSshRsa() {
      return this.category === CATEGORY_SSH_RSA
    },

    isAuth() {
      return this.category === CATEGORY_AUTH
    },

    isToken() {
      return this.category === CATEGORY_TOKEN
    },

    isAndroidSign() {
      return this.category === CATEGORY_ANDROID_SIGN
    },

    isKubeconfig() {
      return this.category === CATEGORY_KUBE_CONFIG
    }
  },
  methods: {
    onBackClick() {
      this.error = null
      this.$router.push('/settings/secrets')
    },

    onSaveClick() {
      if (!this.$refs.nameForm.validate()) {
        return
      }

      if (!this.$refs.contentForm.validate()) {
        return
      }

      const payload = {
        name: this.name
      }

      let action = ''

      if (this.isSshRsa) {
        payload.publicKey = this.instance.pair.publicKey
        payload.privateKey = this.instance.pair.privateKey
        action = actions.secrets.createRsa
      }

      if (this.isAuth) {
        payload.username = this.instance.pair.username
        payload.password = this.instance.pair.password
        action = actions.secrets.createAuth
      }

      if (this.isToken) {
        payload.token = this.instance.token.data
        action = actions.secrets.createToken
      }

      if (this.isAndroidSign) {
        let option = {
          keyStorePassword: this.instance.keyStorePassword.data,
          keyAlias: this.instance.keyAlias,
          keyPassword: this.instance.keyPassword.data
        }

        payload.keyStore = this.instance.keyStore
        payload.option = option
        action = actions.secrets.createAndroidSign
      }

      if (this.isKubeconfig) {
        payload.content = this.instance.content.data
        action = actions.secrets.createKubeConfig
      }

      this.$store.dispatch(action, payload).then(() => {
        this.onBackClick()
      }).catch((e) => {
        this.error = e.message
      })
    }
  }
}
</script>

<style scoped>

</style>
