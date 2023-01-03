<template>
  <div>
    <v-form ref="form" lazy-validation>
      <v-row>
        <v-col cols="8">
          <text-box label="Server URL"
                    desc="url of flow-core-x"
                    :rules="urlRules"
                    v-model="settings.serverUrl"
          ></text-box>
        </v-col>

        <v-col cols="8">
          <text-box label="Web URL"
                    desc="url of flow-web-x"
                    :rules="urlRules"
                    v-model="settings.webUrl"
          ></text-box>
        </v-col>
      </v-row>
    </v-form>

    <v-row>
      <v-col cols="8" class="text-end">
        <save-btn :on-click="onSaveClick"></save-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import SaveBtn from '@/components/Settings/SaveBtn'
import TextBox from '@/components/Common/TextBox'
import actions from '@/store/actions'
import {mapState} from 'vuex'
import {httpUrl, required} from '@/util/rules'

export default {
  name: "SystemSettingsHome",
  components: {
    TextBox,
    SaveBtn
  },
  data() {
    return {
      urlRules: [].concat(
          required('server url is required'),
          httpUrl('Illegal server url format')
      )
    }
  },
  mounted() {
    this.$emit('onConfigNav', {
      navs: [{text: this.$t('settings.li.system')}],
      showAddBtn: false
    })
  },
  computed: {
    ...mapState({
      settings: state => state.settings.instance
    }),
  },
  methods: {
    onSaveClick() {
      if (!this.$refs.form.validate()) {
        return
      }

      this.$store.dispatch(actions.settings.save, this.settings).then(() => {
        this.showSnackBar("Saved")
      })
    }
  }
}
</script>

<style scoped>

</style>
