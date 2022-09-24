<template>
  <v-form ref="gitAccessForm" lazy-validation>
    <v-row align="center">
      <v-col>
        <span class="caption grey--text text--darken-1">{{ `Webhook` }}</span>
        <v-text-field
            class="pt-0"
            v-model="webhook"
            @click:append="onHelpClick('hook')"
            readonly
        ></v-text-field>
      </v-col>
      <v-col cols="1">
        <v-icon small :class="['ml-4', 'mt-2', wrapper.webhookStatus.color]">{{ wrapper.webhookStatus.icon }}</v-icon>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="11">
        <span class="caption grey--text text--darken-1">{{ `Git URL (${vars.git.url})` }}</span>
        <v-text-field
            class="pt-0"
            v-model="wrapper.gitUrl"
            :rules="rules.gitUrl"
            @click:append="onHelpClick('url')"
            readonly
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="11">
        <span class="caption grey--text text--darken-1">{{ `Credential (${vars.git.credential})` }}</span>
        <v-text-field
            class="pt-0"
            v-model="wrapper.secret"
            :rules="[rules.credential]"
            @click:append="onHelpClick('url')"
            readonly
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="11">
        <git-test-btn :wrapper="wrapper"
                      :onBeforeTest="onTestClick"
                      :disabled="!hasPermission('Admin')"
        ></git-test-btn>
      </v-col>
    </v-row>
  </v-form>

</template>

<script>
import vars from '@/util/vars'
import GitTestBtn from '@/components/Flow/GitTestBtn'
import { gitUrlRules } from '@/util/rules'
import { mapState } from 'vuex'

export default {
  name: 'OptionGitAccess',
  props: {
    wrapper: {
      required: true,
      type: Object
    }
  },
  components: {
    GitTestBtn
  },
  data() {
    return {
      vars: vars,

      rules: {
        gitUrl: gitUrlRules(this),
        credential: (value) => {
          const gitUrl = this.wrapper.gitUrl

          if (gitUrl.startsWith('http') || gitUrl.startsWith('https')) {
            return true
          }

          return !!value || this.$t('flow.hint.credential_name_required')
        }
      },
    }
  },
  computed: {
    ...mapState({
      settings: state => state.settings.instance
    }),

    webhook() {
      return this.settings.serverUrl + '/webhooks/' + this.wrapper.name
    }
  },
  methods: {
    onTestClick() {
      return this.$refs.gitAccessForm.validate()
    },

    onHelpClick(type) {

    }
  }
}
</script>

<style>
.ssh-add-btn.v-btn--floating.v-btn--small {
  height: 22px !important;
  width: 22px !important;
}
</style>
