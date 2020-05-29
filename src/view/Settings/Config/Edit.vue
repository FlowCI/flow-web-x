<template>
  <div>
    <v-row>
      <v-col cols="8">
        <text-box label="Name"
                  readonly
                  v-model="configObj.name"
        ></text-box>
        <text-select :items="[CATEGORY_SMTP]"
                     label="Category"
                     readonly
                     v-model="configObj.category"
        ></text-select>
      </v-col>
    </v-row>

    <v-form ref="contentForm" lazy-validation>
      <v-row v-if="configObj.category === CATEGORY_SMTP">
        <v-col cols="9">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="8">
          <config-smtp :smtpOption="configObj.smtp"></config-smtp>
        </v-col>
      </v-row>
    </v-form>

    <v-row>
      <v-col cols="8" class="text-end">
        <confirm-btn :text="$t('revoke')" color="error" @click="onDeleteClick">
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
  import ConfirmBtn from '@/components/Common/ConfirmBtn'
  import TextBox from '@/components/Common/TextBox'
  import TextSelect from '@/components/Common/TextSelect'
  import { CATEGORY_SMTP } from '@/util/configs'

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
      TextBox,
      TextSelect
    },
    data() {
      return {
        CATEGORY_SMTP
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
          {text: 'Configuration', href: '#/settings/configs'},
          {text: this.configObj.name}
        ]
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
        this.$store.dispatch(actions.configs.saveSmtp, this.configObj)
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
