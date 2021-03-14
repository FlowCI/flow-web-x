<template>
  <div>
    <v-form ref="agentNameForm" lazy-validation>
      <v-row>
        <v-col cols="9">
          <text-box
              label="Name"
              :rules="nameRules"
              v-model="wrapper.name"
          ></text-box>
          <tag-editor :tags="wrapper.tags"></tag-editor>
        </v-col>

        <v-col cols="4">
          <text-box
              label="Exit After Idle (seconds)"
              v-model="wrapper.exitOnIdle"
              type="number"
              :rules="idleTimeRules"
          ></text-box>
        </v-col>
      </v-row>
    </v-form>

    <v-row>
      <v-col cols="9" class="my-3">
        <v-divider></v-divider>
      </v-col>

      <v-col cols="9">
        <text-box label="Token"
                  readonly
                  v-model="wrapper.token"
        ></text-box>
        <text-box label="URL"
                  readonly
                  v-model="wrapper.url"
        ></text-box>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="9" class="text-end">
        <back-btn :onClick="onBackClick" class="mr-5"></back-btn>
        <confirm-btn :text="$t('delete')"
                     color="error"
                     icon="mdi-delete"
                     clazz="mr-5"
                     @click="onDeleteClick">
          <template v-slot:title>
            <span class="red--text subheading">
              Delete Agent {{ wrapper.name }}?
            </span>
          </template>
        </confirm-btn>
        <save-btn :onClick="onSaveClick"></save-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import actions from '@/store/actions'
  import TagEditor from '@/components/Common/TagEditor'
  import ConfirmBtn from '@/components/Common/ConfirmBtn'
  import TextBox from '@/components/Common/TextBox'
  import SaveBtn from '@/components/Settings/SaveBtn'
  import BackBtn from '@/components/Settings/BackBtn'
  import { agentNameRules, timeRuleInSeconds } from '@/util/rules'

  export default {
    name: 'SettingsAgentEdit',
    components: {
      TagEditor,
      ConfirmBtn,
      TextBox,
      SaveBtn,
      BackBtn
    },
    props: {
      wrapper: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        nameRules: agentNameRules(this),
        idleTimeRules: timeRuleInSeconds(this, 'agent.hint.idle_time_rule'),
        dialog: false
      }
    },
    computed: {
      ...mapState({
        loaded: state => state.agents.loaded
      })
    },
    mounted() {
      this.$emit('onConfigNav', {
        navs: [
          {text: this.$t('settings.li.agent'), href: '#/settings/agents'},
          {text: this.wrapper.name}
        ],
        showAddBtn: false
      })
    },
    methods: {
      onDeleteClick() {
        this.$store.dispatch(actions.agents.delete, this.wrapper.rawInstance).then(() => {
          this.$store.dispatch(actions.agents.select, {})
          this.dialog = false
          this.onBackClick()
        })
      },

      onBackClick() {
        this.$router.push('/settings/agents')
      },

      onSaveClick() {
        if (!this.$refs.agentNameForm.validate()) {
          return
        }

        this.$store.dispatch(actions.agents.createOrUpdate, this.wrapper.rawInstance).then(() => {
          this.$router.push('/settings/agents')
        })
      }
    }
  }
</script>

<style scoped>

</style>
