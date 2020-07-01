<template>
  <div>
    <v-form ref="nameForm" lazy-validation>
      <v-row>
        <v-col cols="8">
          <text-box label="Name"
                    :rules="nameRules"
                    v-model="name"
          ></text-box>
          <text-select :items="categories"
                       label="Category"
                       v-model="category"
          ></text-select>
        </v-col>
      </v-row>
    </v-form>

    <v-form ref="contentForm" lazy-validation>
      <v-row v-if="isSmtpConfig">
        <v-col cols="9">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="8">
          <config-smtp :config="config"></config-smtp>
        </v-col>
      </v-row>

      <v-row v-if="isTextConfig">
        <v-col cols="9">
          <v-divider></v-divider>
        </v-col>

        <v-col cols="8">
          <config-free-text :config="config"></config-free-text>
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
  import ConfigFreeText from './FreeText'
  import TextBox from '@/components/Common/TextBox'
  import TextSelect from '@/components/Common/TextSelect'
  import { CategoriesSelection, CATEGORY_SMTP, CATEGORY_TEXT } from '@/util/configs'
  import { secretAndConfigNameRules } from '@/util/rules'

  export default {
    name: "SettingsNewConfig",
    components: {
      TextBox,
      TextSelect,
      ConfigSmtp,
      ConfigFreeText,
    },
    data() {
      return {
        name: '',
        category: CATEGORY_SMTP,
        categories: CategoriesSelection,
        nameRules: secretAndConfigNameRules(this),
        objs: {
          [CATEGORY_SMTP]: {
            auth: {}
          },
          [CATEGORY_TEXT]: {
            text: ''
          }
        },
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
    computed: {
      navs() {
        return [
          {text: this.$t('settings.li.config'), href: '#/settings/configs'},
          {text: this.$t('new')}
        ]
      },

      config() {
        return this.objs[this.category]
      },

      isSmtpConfig() {
        return this.category === CATEGORY_SMTP
      },

      isTextConfig() {
        return this.category === CATEGORY_TEXT
      }
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

        let params = {name: this.name, payload: this.config}
        this.$store.dispatch(this.actionMap[this.category], params)
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
