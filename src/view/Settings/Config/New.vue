<template>
  <div>
    <v-form ref="nameForm" lazy-validation>
      <v-row>
        <v-col cols="8">
          <text-box label="Name"
                    :rules="nameRules"
                    v-model="configObj.name"
          ></text-box>
          <text-select :items="[CATEGORY_SMTP, CATEGORY_TEXT]"
                       label="Category"
                       v-model="configObj.category"
          ></text-select>
        </v-col>
      </v-row>
    </v-form>

    <v-form ref="contentForm" lazy-validation>
      <v-row v-if="configObj.category === CATEGORY_SMTP">
        <v-col cols="9">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="8">
          <config-smtp :smtpOption="configObj.smtp"></config-smtp>
        </v-col>
      </v-row>

      <v-row v-if="configObj.category === CATEGORY_TEXT">
        <v-col cols="9">
          <v-divider></v-divider>
        </v-col>

        <v-col cols="8">
          <v-textarea
              outlined
              rows="20"
              label="Input free text"
              v-model="configObj.text"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-form>

    <v-row>
      <v-col cols="8" class="text-end">
        <v-btn outlined color="warning" @click="onBackClick">{{ $t('back') }}</v-btn>
        <v-btn color="primary" @click="onSaveClick" class="ml-4">{{ $t('save') }}</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import actions from '@/store/actions'
  import ConfigSmtp from './Smtp'
  import TextBox from '@/components/Common/TextBox'
  import TextSelect from '@/components/Common/TextSelect'
  import { CATEGORY_SMTP, CATEGORY_TEXT } from '@/util/configs'
  import { secretAndConfigNameRules } from '@/util/rules'

  export default {
    name: "SettingsNewConfig",
    components: {
      TextBox,
      TextSelect,
      ConfigSmtp
    },
    data() {
      return {
        CATEGORY_SMTP,
        CATEGORY_TEXT,
        nameRules: secretAndConfigNameRules(this),

        configObj: {
          name: '',
          category: CATEGORY_SMTP,
          smtp: {
            auth: {},
          },
          text: ''
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
          {text: this.$t('settings.li.config'), href: '#/settings/configs'},
          {text: this.$t('new')}
        ]
      },
    },
    methods: {
      onBackClick() {
        this.$router.push('/settings/configs')
      },

      onSaveClick() {
        if (!this.$refs.nameForm.validate()) {
          return
        }

        if (!this.$refs.contentForm.validate()) {
          return
        }

        if (this.configObj.category === CATEGORY_SMTP) {
          this.$store.dispatch(actions.configs.saveSmtp, this.configObj)
              .then(() => {
                this.onBackClick()
              })
              .catch(e => {
                console.log(e)
              })
          return
        }

        if (this.configObj.category === CATEGORY_TEXT) {
          this.$store.dispatch(actions.configs.saveText, this.configObj)
              .then(() => {
                this.onBackClick()
              })
              .catch(e => {
                console.log(e)
              })
        }
      }
    }
  }
</script>

<style scoped>

</style>
