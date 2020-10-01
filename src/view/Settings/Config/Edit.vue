<template>
  <div>
    <v-row>
      <v-col cols="9">
        <text-box label="Name"
                  readonly
                  v-model="configObj.name"
        ></text-box>
        <text-box label="Category"
                  readonly
                  :prepend-inner-icon="Categories[configObj.category].icon"
                  v-model="Categories[configObj.category].name"
        ></text-box>
      </v-col>
    </v-row>

    <v-form ref="contentForm" lazy-validation>
      <v-row v-if="isSmtpConfig">
        <v-col cols="9">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="9">
          <config-smtp :config="configObj"></config-smtp>
        </v-col>
      </v-row>

      <v-row v-if="isTextConfig">
        <v-col cols="9">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="9">
          <config-free-text :config="configObj"></config-free-text>
        </v-col>
      </v-row>
    </v-form>

    <v-row>
      <v-col cols="9" class="text-end">
        <back-btn :on-click="onBackClick" class="mr-5"></back-btn>

        <confirm-btn :text="$t('delete')"
                     icon="mdi-delete"
                     color="error"
                     clazz="mr-5"
                     @click="onDeleteClick">
          <template v-slot:title>
            <span class="red--text subheading">
              Revoke config {{ configObj.name }}?
            </span>
          </template>
        </confirm-btn>

        <save-btn :on-click="onSaveClick"></save-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import actions from '@/store/actions'
  import ConfigSmtp from './Smtp'
  import ConfigFreeText from './FreeText'
  import ConfirmBtn from '@/components/Common/ConfirmBtn'
  import TextBox from '@/components/Common/TextBox'
  import SaveBtn from '@/components/Settings/SaveBtn'
  import BackBtn from '@/components/Settings/BackBtn'
  import { Categories, CATEGORY_SMTP, CATEGORY_TEXT } from '@/util/configs'

  export default {
    name: "SettingsConfigEdit",
    props: {
      configObj: {
        type: Object,
        required: true
      }
    },
    components: {
      ConfirmBtn,
      ConfigSmtp,
      ConfigFreeText,
      TextBox,
      SaveBtn,
      BackBtn
    },
    data() {
      return {
        Categories,
        actionMap: {
          [CATEGORY_SMTP]: actions.configs.saveSmtp,
          [CATEGORY_TEXT]: actions.configs.saveText
        }
      }
    },
    mounted() {
      this.$emit('onConfigNav', {
        navs: this.navs,
        showAddBtn: false
      })
    },
    errorCaptured(err, vm, info) {
      if (!this.configObj) {
        this.onBackClick()
      }
    },
    computed: {
      navs() {
        return [
          {text: this.$t('settings.li.config'), href: '#/settings/configs'},
          {text: this.configObj.name}
        ]
      },

      isSmtpConfig() {
        return this.configObj.category === CATEGORY_SMTP
      },

      isTextConfig() {
        return this.configObj.category === CATEGORY_TEXT
      }
    },
    methods: {
      onBackClick() {
        this.$router.push('/settings/configs')
      },

      onDeleteClick() {
        this.$store.dispatch(actions.configs.delete, this.configObj.name)
          .then(() => {
            this.onBackClick()
          })
          .catch((err) => {
            console.log(err)
          })
      },

      onSaveClick() {
        let params = {name: this.configObj.name, payload: this.configObj}
        this.$store.dispatch(this.actionMap[this.configObj.category], params)
          .then(() => {
            this.onBackClick()
          })
          .catch(e => {
            console.log(e)
          })
      }
    }
  }
</script>

<style scoped>

</style>
