<template>
  <div>
    <v-row>
      <v-col>
        <div>Create New Agent</div>
      </v-col>
    </v-row>

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
        <v-btn outlined color="warning" @click="onBackClick">{{ $t('back') }}</v-btn>
        <v-btn color="primary" @click="onSaveClick" class="ml-4">{{ $t('save') }}</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import actions from '@/store/actions'
  import TagEditor from '@/components/Common/TagEditor'
  import { AgentWrapper } from '@/util/agents'
  import { agentNameRules } from '@/util/rules'

  export default {
    name: 'SettingsAgentNew',
    components: {
      TagEditor
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
            text: 'Agents',
            href: '#/settings/agents'
          },
          {
            text: 'New Agent',
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
