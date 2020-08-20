<template>
  <div>
    <v-row>
      <v-col cols="8">
        <text-box label="Name" readonly v-model="name"></text-box>
        <text-box label="Category"
                  readonly
                  :prepend-inner-icon="Categories[secretObj.category].icon"
                  v-model="Categories[secretObj.category].name"
        ></text-box>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="8" v-if="isSshRsa">
        <ssh-rsa-editor :show-help="false"
                        :show-create-new="false"
                        :is-read-only="true"
                        :model="instance"
        ></ssh-rsa-editor>
      </v-col>

      <v-col cols="8" v-if="isAuth">
        <auth-editor
            :is-read-only="true"
            :model="instance"
        ></auth-editor>
      </v-col>

      <v-col cols="8" v-if="isToken">
        <token-editor
            :is-read-only="true"
            :model="instance"
        ></token-editor>
      </v-col>

      <v-col cols="8" v-if="isAndroidSign">
        <android-sign-editor :is-read-only="true" :model="instance"></android-sign-editor>
      </v-col>

      <v-col cols="8" v-if="isKubeconfig">
        <kube-config-editor :is-read-only="true" :model="instance"></kube-config-editor>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="8" class="text-end">
        <back-btn class="mr-5" :on-click="onBackClick"></back-btn>

        <confirm-btn :text="$t('revoke')"
                     color="error"
                     icon="mdi-delete"
                     @click="onDeleteClick">
          <template v-slot:title>
            <span class="red--text subheading">
              Revoke secret {{ name }}?
            </span>
          </template>
          <template v-slot:content>
            <div>
              You are going to revoke the secret {{ name }}.
              Deleted secret CANNOT be restored!
            </div>
            <div class="mt-3 red--text" v-if="connectedFlows.length > 0">
              <span>The following flow will be affected!</span>
              <ul>
                <li v-for="flow in connectedFlows"
                    :key="flow.id"
                >{{ flow.name }}
                </li>
              </ul>
            </div>
          </template>
        </confirm-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import actions from '@/store/actions'
import SshRsaEditor from '@/components/Common/SshRsaEditor'
import AuthEditor from '@/components/Common/AuthEditor'
import TokenEditor from '@/components/Common/TokenEditor'
import TextBox from '@/components/Common/TextBox'
import AndroidSignEditor from '@/components/Settings/AndroidSignEditor'
import KubeConfigEditor from '@/components/Settings/KubeConfigEditor'
import BackBtn from '@/components/Settings/BackBtn'
import ConfirmBtn from '@/components/Common/ConfirmBtn'
import {
  Categories,
  CATEGORY_AUTH,
  CATEGORY_SSH_RSA,
  CATEGORY_TOKEN,
  CATEGORY_ANDROID_SIGN,
  CATEGORY_KUBE_CONFIG
} from '@/util/secrets'
import { mapState } from 'vuex'

export default {
  name: 'SettingsSecretEdit',
  components: {
    ConfirmBtn,
    TextBox,
    SshRsaEditor,
    AuthEditor,
    TokenEditor,
    AndroidSignEditor,
    KubeConfigEditor,
    BackBtn
  },
  props: {
    secretObj: {
      type: Object,
      required: false,
      default() {
        return {
          name: '',
          privateKey: '',
          publicKey: '',
        }
      }
    }
  },
  data() {
    return {
      Categories,
      dialog: false
    }
  },
  mounted() {
    this.$emit('onConfigNav', {
      navs: this.navs,
      showAddBtn: false
    })
    this.$store.dispatch(actions.flows.listByCredential, this.name).then()
  },
  computed: {
    ...mapState({
      connectedFlows: state => state.flows.itemsByCredential
    }),

    navs() {
      return [
        {text: this.$t('settings.li.secret'), href: '#/settings/secrets'},
        {text: this.name}
      ]
    },

    name() {
      return this.secretObj.name
    },

    isSshRsa() {
      return this.secretObj.category === CATEGORY_SSH_RSA
    },

    isAuth() {
      return this.secretObj.category === CATEGORY_AUTH
    },

    isToken() {
      return this.secretObj.category === CATEGORY_TOKEN
    },

    isAndroidSign() {
      return this.secretObj.category === CATEGORY_ANDROID_SIGN
    },

    isKubeconfig() {
      return this.secretObj.category === CATEGORY_KUBE_CONFIG
    },

    instance() {
      if (this.isSshRsa) {
        return {
          selected: '',
          pair: this.secretObj.pair,
          md5Fingerprint: this.secretObj.md5Fingerprint
        }
      }

      if (this.isAuth) {
        return {
          selected: '',
          pair: this.secretObj.pair
        }
      }

      if (this.isToken || this.isAndroidSign || this.isKubeconfig) {
        return this.secretObj
      }

      return {}
    }
  },
  methods: {
    onBackClick() {
      this.$router.push('/settings/secrets')
    },

    onDeleteClick() {
      this.$store.dispatch(actions.secrets.delete, this.secretObj).then(() => {
        this.onBackClick()
      })
    }
  }
}
</script>

<style scoped>

</style>
