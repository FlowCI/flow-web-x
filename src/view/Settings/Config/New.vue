<template>
  <div>
    <v-row>
      <v-col cols="8">
        <v-form ref="nameForm" lazy-validation>
          <text-box title="Name"
                    :rules="nameRules"
                    v-model="configObj.name"
          ></text-box>
        </v-form>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="8">
        <v-select :items="[CATEGORY_SMTP]"
                  label="Category"
                  v-model="configObj.category"
                  dense
        ></v-select>
      </v-col>
    </v-row>

    <v-row v-if="configObj.category === CATEGORY_SMTP">
      <v-col cols="8">
        <config-smtp :configObj="configObj"></config-smtp>
      </v-col>
    </v-row>

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
  import { CATEGORY_SMTP } from '@/util/configs'
  import { secretAndConfigNameRules } from '@/util/rules'

  export default {
    name: "SettingsNewConfig",
    components: {
      TextBox,
      ConfigSmtp
    },
    data() {
      return {
        CATEGORY_SMTP,
        nameRules: secretAndConfigNameRules(this),

        configObj: {
          name: 'abc',
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
          {
            text: 'Configuration',
            href: '#/settings/configs'
          },
          {
            text: 'New'
          }
        ]
      },
    },
    methods: {
      onCreateConfig() {
        this.$store.dispatch(actions.configs.createSmtp, this.configObj)
      },

      onBackClick() {
        this.$router.push('/settings/configs')
      },

      onSaveClick() {
        console.log(this.configObj)

        if (!this.$refs.nameForm.validate()) {
          return
        }
      }
    }
  }
</script>

<style scoped>

</style>
