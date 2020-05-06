<template>
  <div>
    <v-row>
      <v-col cols="8">
        <v-form ref="nameForm" lazy-validation>
          <v-text-field label="Name"
                        v-model="configObj.name"
                        dense
          ></v-text-field>
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
  </div>
</template>

<script>
  import actions from '@/store/actions'
  import { CATEGORY_SMTP } from '@/util/configs'

  export default {
    name: "SettingsNewConfig",
    data () {
      return {
        CATEGORY_SMTP,

        configObj: {
          name: '',
          category: CATEGORY_SMTP,
        }
      }
    },
    mounted () {
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
      }
    }
  }
</script>

<style scoped>

</style>
