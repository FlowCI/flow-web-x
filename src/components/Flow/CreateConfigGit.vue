<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-row>
      <v-col cols="4">
        <v-form
            ref="form"
            lazy-validation
        >
          <v-text-field
              v-model="webhook"
              label="Webhook"
              readonly
              append-icon="mdi-help-circle-outline"
              @click:append="onHelpClick('hook')"
          ></v-text-field>

          <v-text-field
              v-model="gitUrl"
              label="Git URL"
              required
              append-icon="mdi-help-circle-outline"
              :rules="gitUrlRules"
              @click:append="onHelpClick('url')"
          ></v-text-field>
        </v-form>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="1">
        <v-btn small
               color="primary"
               @click="handleNextClick"
        >{{ $t('next') }}</v-btn>
      </v-col>

      <v-col cols="1">
        <v-btn small
               outlined
               color="warning"
               @click="onBackClick"
        >{{ $t('back') }}</v-btn>
      </v-col>

      <v-col cols="1">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn small
                   outlined
                   color="secondary"
                   @click="onSkipClick"
                   v-on="on"
            >{{ $t('skip') }}</v-btn>
          </template>
          <span>{{ $t('flow.hint.git_skip') }}</span>
        </v-tooltip>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import { gitUrlRules } from '@/util/rules'

  export default {
    name: 'CreateConfigGit',
    props: {
      webhook: {
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
      },
      onSkipClick: {
        required: true,
        type: Function
      }
    },
    data () {
      return {
        gitUrl: '',
        gitUrlRules: gitUrlRules(this)
      }
    },
    methods: {
      handleNextClick () {
        if (this.$refs.form.validate()) {
          this.onNextClick(this.gitUrl)
        }
      },
    }
  }
</script>

<style scoped>

</style>
