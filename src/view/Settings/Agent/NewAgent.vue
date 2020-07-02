<template>
  <div>
    <v-row>
      <v-col cols="8">
        <v-form ref="agentNameForm"
                lazy-validation>
          <v-text-field
              dense
              label="Name"
              :rules="nameRules"
              v-model="wrapper.name"
          ></v-text-field>
        </v-form>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="8">
        <tag-editor :tags="wrapper.tags"></tag-editor>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="8" class="text-end">
        <back-btn :onClick="onBackClick" class="mr-5"></back-btn>
        <save-btn :onClick="onSaveClick"></save-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import actions from '@/store/actions'
  import TagEditor from '@/components/Common/TagEditor'
  import SaveBtn from '@/components/Settings/SaveBtn'
  import BackBtn from '@/components/Settings/BackBtn'
  import { AgentWrapper } from '@/util/agents'
  import { agentNameRules } from '@/util/rules'

  export default {
    name: 'SettingsAgentNew',
    components: {
      TagEditor,
      SaveBtn,
      BackBtn
    },
    data () {
      return {
        nameRules: agentNameRules(this),
        dialog: false,
        wrapper: new AgentWrapper()
      }
    },
    mounted () {
      this.$emit('onConfigNav', {
        navs: [
          {
            text: this.$t('settings.li.agent'),
            href: '#/settings/agents'
          },
          {
            text: `${this.$t('new')} ${this.$t('settings.li.agent')}`,
            href: ''
          }
        ],
        showAddBtn: false
      })
    },
    methods: {
      onBackClick () {
        this.$router.push('/settings/agents')
      },

      onSaveClick () {
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
