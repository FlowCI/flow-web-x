<template>
  <div>
    <v-form ref="nameForm" lazy-validation>
      <v-row>
        <v-col cols="8">
          <text-box label="Name"
                    :rules="nameRules"
                    v-model="configObj.name"
          ></text-box>
          <text-select :items="[CATEGORY_SMTP]"
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
          <config-smtp :configObj="configObj"></config-smtp>
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
  import { CATEGORY_SMTP } from '@/util/configs'
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
        nameRules: secretAndConfigNameRules(this),

        configObj: {
          name: '',
          category: CATEGORY_SMTP,
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
          {text: 'Configuration', href: '#/settings/configs'},
          {text: 'New'}
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

        this.$store.dispatch(actions.configs.createSmtp, this.configObj)
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
