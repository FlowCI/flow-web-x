<template>
  <div>
    <v-form ref="configForm" lazy-validation>
      <v-row>
        <v-col cols="4" v-if="category === CATEGORY_AUTH">
          <auth-editor :model="instance[CATEGORY_AUTH]"
                       :show-selection="true"
          ></auth-editor>
        </v-col>

        <v-col cols="4" v-if="category === CATEGORY_SSH_RSA">
          <ssh-rsa-editor :show-help="true"
                          :show-create-new="true"
                          :show-selection="true"
                          :model="instance[CATEGORY_SSH_RSA]"
          ></ssh-rsa-editor>
        </v-col>
      </v-row>
    </v-form>

    <v-row>
      <v-col cols="1">
        <v-btn small
               color="primary"
               @click="handleNextClick"
        >{{ $t('next') }}
        </v-btn>
      </v-col>
      <v-col cols="1">
        <v-btn small
               outlined
               color="warning"
               @click="onBackClick"
        >{{ $t('back') }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import SshRsaEditor from '../Common/SshRsaEditor'
  import AuthEditor from '../Common/AuthEditor'
  import { CATEGORY_AUTH, CATEGORY_SSH_RSA } from '@/util/secrets'

  export default {
    name: 'CreateConfigAccess',
    props: {
      gitUrl: {
        required: true,
        type: String
      },
      onBackClick: {
        required: true,
        type: Function
      },
      onNextClick: {
        required: true,
        type: Function
      }
    },
    data () {
      return {
        CATEGORY_SSH_RSA,
        CATEGORY_AUTH,
        instance: {
          [ CATEGORY_SSH_RSA ]: {
            category: CATEGORY_SSH_RSA,
            pair: {
              publicKey: '',
              privateKey: ''
            },
            selected: ''
          },

          [ CATEGORY_AUTH ]: {
            category: CATEGORY_AUTH,
            pair: {
              username: '',
              password: ''
            },
            selected: ''
          }
        }
      }
    },
    components: {
      SshRsaEditor,
      AuthEditor
    },
    computed: {
      isHttpUrl () {
        return this.gitUrl.startsWith('http://') || this.gitUrl.startsWith('https://')
      },

      category () {
        return this.isHttpUrl ? CATEGORY_AUTH : CATEGORY_SSH_RSA
      }
    },
    methods: {
      handleNextClick () {
        if (this.$refs.configForm.validate()) {
          this.onNextClick(this.instance[ this.category ])
        }
      }
    }
  }
</script>

<style scoped>

</style>
