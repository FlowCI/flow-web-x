<template>
  <div>
    <v-row>
      <v-col cols="8">
        <text-box label="Name"
                  readonly
                  v-model="configObj.name"
        ></text-box>
        <text-box label="Category"
                  readonly
                  v-model="configObj.category"
        ></text-box>
      </v-col>
    </v-row>

    <v-form ref="contentForm" lazy-validation>
      <v-row v-if="isSmtpConfig">
        <v-col cols="9">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="8">
          <config-smtp :config="configObj"></config-smtp>
        </v-col>
      </v-row>

      <v-row v-if="isTextConfig">
        <v-col cols="9">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="8">
          <config-free-text :config="configObj"></config-free-text>
        </v-col>
      </v-row>

      <v-row v-if="isAndroidSignConfig">
        <v-col cols="9">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="8">
          <config-android-sign :config="config"></config-android-sign>
        </v-col>
      </v-row>
    </v-form>

    <v-row>
      <v-col cols="8" class="text-end">
        <confirm-btn :text="$t('delete')" color="error" @click="onDeleteClick">
          <template v-slot:title>
            <span class="red--text subheading">
              Revoke config {{ configObj.name }}?
            </span>
          </template>
        </confirm-btn>
        <v-btn color="warning" outlined @click="onBackClick" class="ml-4">{{ $t('back') }}</v-btn>
        <v-btn color="primary" @click="onSaveClick" class="ml-4">{{ $t('save') }}</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import actions from '@/store/actions'
  import ConfigSmtp from './Smtp'
  import ConfigFreeText from './FreeText'
  import ConfigAndroidSign from './AndroidSign'
  import ConfirmBtn from '@/components/Common/ConfirmBtn'
  import TextBox from '@/components/Common/TextBox'
  import { CATEGORY_SMTP, CATEGORY_TEXT, CATEGORY_ANDROID_SIGN } from '@/util/configs'

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
      ConfigAndroidSign,
      TextBox,
    },
    data() {
      return {
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
      },

      isAndroidSignConfig() {
        return this.configObj.category === CATEGORY_ANDROID_SIGN
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
