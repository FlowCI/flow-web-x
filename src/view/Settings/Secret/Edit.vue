<template>
  <div>
    <v-row>
      <v-col cols="8">
        <v-text-field label="Name"
                      readonly
                      v-model="name"
        ></v-text-field>
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
    </v-row>

    <v-row>
      <v-col cols="5"></v-col>
      <v-col cols="2">
        <v-dialog
            v-model="dialog"
            width="500"
        >
          <template v-slot:activator="{ on }">
            <v-btn
                outlined
                color="error"
                v-on="on"
            >{{ $t('delete') }}
            </v-btn>
          </template>
          <v-card>
            <v-card-title
                class="red--text subheading"
                primary-title
            >Delete credential {{ name }}?
            </v-card-title>

            <!-- list the flows which are connected with credential -->
            <v-card-text>
              <div>
                You are going to credential {{ name }}.
                Removed credential CANNOT be restored!
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
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="dialog = false">{{ $t('cancel') }}</v-btn>
              <v-btn outlined color="error" @click="onDeleteClick">{{ $t('delete') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col cols="1">
        <v-btn outlined color="warning" @click="onBackClick">{{ $t('back') }}</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import actions from '@/store/actions'
  import SshRsaEditor from '@/components/Common/SshRsaEditor'
  import AuthEditor from '@/components/Common/AuthEditor'
  import { CATEGORY_SSH_RSA, CATEGORY_AUTH } from '@/util/secrets'
  import { mapState } from 'vuex'

  export default {
    name: 'SettingsSecretEdit',
    components: {
      SshRsaEditor,
      AuthEditor
    },
    props: {
      credentialObj: {
        type: Object,
        required: false,
        default () {
          return {
            name: '',
            privateKey: '',
            publicKey: ''
          }
        }
      }
    },
    data () {
      return {
        dialog: false
      }
    },
    mounted () {
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

      navs () {
        return [
          {
            text: 'Secrets',
            href: '#/settings/secrets'
          },
          {
            text: 'Edit'
          },
          {
            text: this.name
          }
        ]
      },

      name () {
        return this.credentialObj.name
      },

      isSshRsa () {
        return this.credentialObj.category === CATEGORY_SSH_RSA
      },

      isAuth () {
        return this.credentialObj.category === CATEGORY_AUTH
      },

      instance() {
        if (this.isSshRsa) {
          return {
            selected: '',
            pair: this.credentialObj.pair
          }
        }

        if (this.isAuth) {
          return {
            selected: '',
            pair: this.credentialObj.pair
          }
        }

        return {}
      }
    },
    methods: {
      onBackClick () {
        this.$router.push('/settings/credentials')
      },

      onDeleteClick () {
        this.$store.dispatch(actions.secrets.delete, this.credentialObj).then(() => {
          this.onBackClick()
        })
      }
    }
  }
</script>

<style scoped>

</style>
