<template>
  <div>
    <v-row align="center">
      <v-col>
        <span class="body-2 grey--text">SSH-RSA Key Pair</span>
        <div v-if="showSelection">
          <v-radio-group v-model="option" row>
            <v-radio label="Select" value="select"></v-radio>
            <v-radio label="Edit or Create" value="edit"></v-radio>
          </v-radio-group>
        </div>
      </v-col>
    </v-row>

    <div v-if="showSelection">
      <v-select dense v-model="model.selected" :items="names" label="Select Credential"></v-select>
    </div>

    <div>
      <v-btn small
             outlined
             color="indigo"
             open-delay="2000"
             :loading="loading"
             @click="onCreateSSHClick"
             v-if="!isReadOnly"
      >
        Create new SSH key
        <v-icon right small>mdi-plus-box</v-icon>

        <template v-slot:loader>
          <span>
            <v-icon light class="loading-anim">mdi-cached</v-icon>
          </span>
        </template>
      </v-btn>

      <v-flex class="mt-1">
        <v-textarea
            filled
            :label="`Public Key: ${model.md5Fingerprint || ''}`"
            rows="4"
            class="font-weight-medium caption"
            :rules="sshPublicKeyRules"
            :append-outer-icon="showHelp ? 'mdi-help-circle-outline' : ''"
            v-model="model.pair.publicKey"
            :readonly="isReadOnly"
            @click:append-outer="onHelpClick('ssh_public')"
        ></v-textarea>
      </v-flex>

      <v-flex>
        <v-textarea
            filled
            class="font-weight-medium caption"
            label="Private Key:"
            rows="8"
            :rules="sshPrivateKeyRules"
            :append-outer-icon="showHelp ? 'mdi-help-circle-outline' : ''"
            v-model="model.pair.privateKey"
            :readonly="isReadOnly"
            @click:append-outer="onHelpClick('ssh_private')"
        ></v-textarea>
      </v-flex>
    </div>
  </div>
</template>

<script>
  import actions from '@/store/actions'
  import { mapState } from 'vuex'
  import { CATEGORY_SSH_RSA } from '@/util/secrets'
  import {
    sshEmailRules,
    sshPrivateKeyRules,
    sshPublicKeyRules
  } from '@/util/rules'

  export default {
    name: 'SshRsaEditor',
    props: {
      /**
       * Ex:
       * {
       *   selected: ''
       *   pair: {
       *     privateKey: '',
       *     publicKey: ''
       *   },
       *   md5Fingerprint: ''
       * }
       */
      model: {
        type: Object,
        required: true
      },
      showSelection: {
        type: Boolean,
        default () {
          return false
        }
      },
      showHelp: {
        type: Boolean,
        required: true
      },
      showCreateNew: {
        type: Boolean,
        required: true
      },
      isReadOnly: {
        type: Boolean,
        default () {
          return false
        }
      }
    },
    data () {
      return {
        email: '',
        option: 'edit',
        loading: false,
        items: [],
        sshEmailRules: sshEmailRules(this),
        sshPublicKeyRules: sshPublicKeyRules(this),
        sshPrivateKeyRules: sshPrivateKeyRules(this)
      }
    },
    mounted () {
      if (this.showSelection) {
        this.$store
          .dispatch(actions.secrets.listNameOnly, CATEGORY_SSH_RSA)
          .then()
      }
    },
    computed: {
      ...mapState({
        secrets: state => state.secrets.items,
        sshRsa: state => state.flows.sshRsa
      }),

      names () {
        const nameList = []
        for (let c of this.secrets) {
          nameList.push(c.name)
        }
        return nameList
      }
    },
    watch: {
      sshRsa (newValue) {
        Object.assign(this.model.pair, newValue)
      }
    },
    methods: {
      onCreateSSHClick () {
        this.loading = true
        this.$store.dispatch(actions.flows.createSshRsa, this.email)
          .then(() => {
            this.loading = false
          })
      },

      onHelpClick () {
      }
    }
  }
</script>

<style scoped>

</style>
