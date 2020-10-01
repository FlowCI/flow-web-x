<template>
  <div>
    <v-row>
      <v-col cols="9">
        <v-form ref="form" lazy-validation>
          <text-box label="Server URL"
                    :rules="urlRules"
                    v-model="settings.serverUrl"
          ></text-box>
        </v-form>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="9" class="text-end">
        <save-btn :on-click="onSaveClick"></save-btn>
      </v-col>
    </v-row>

    <v-divider></v-divider>
  </div>
</template>

<script>
import SaveBtn from '@/components/Settings/SaveBtn'
import TextBox from '@/components/Common/TextBox'
import actions from '@/store/actions'
import { mapState } from 'vuex'
import { httpUrl, required } from '@/util/rules'

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
