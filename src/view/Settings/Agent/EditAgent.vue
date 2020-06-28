<template>
  <div>
    <v-row>
      <v-col cols="8">
        <v-form ref="agentNameForm"
                lazy-validation>
          <v-text-field
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

    <v-col cols="8" class="my-3">
      <v-divider></v-divider>
    </v-col>

    <v-col cols="8">
      <v-text-field label="Token"
                    readonly
                    v-model="wrapper.token"
      ></v-text-field>
      <v-text-field label="URL"
                    readonly
                    v-model="wrapper.url"
      ></v-text-field>
    </v-col>

    <v-row>
      <v-col cols="8" class="text-end">
        <v-dialog
            v-model="dialog"
            width="500"
        >
          <template v-slot:activator="{ on }">
            <v-btn
                outlined
                color="error"
                v-on="on"
            >{{ $t('delete') }}
            </v-btn>
          </template>
          <v-card>
            <v-card-title
                class="error--text"
                primary-title
            >Delete Agent {{ name }}?
            </v-card-title>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="dialog = false">{{ $t('cancel') }}</v-btn>
              <v-btn outlined color="error" @click="onDeleteClick">{{ $t('delete') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn outlined color="warning" @click="onBackClick" class="ml-4">{{ $t('back') }}</v-btn>
        <v-btn color="primary" @click="onSaveClick" class="ml-4">{{ $t('save') }}</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import actions from '@/store/actions'
  import TagEditor from '@/components/Common/TagEditor'
  import { AgentWrapper } from '@/util/agents'
  import { agentNameRules } from '@/util/rules'

  export default {
    name: 'SettingsAgentEdit',
    components: {
      TagEditor
    },
    data () {
      return {
        nameRules: agentNameRules(this),
        dialog: false
      }
    },
    computed: {
      ...mapState({
        loaded: state => state.agents.loaded
      }),

      wrapper () {
        return new AgentWrapper(this.loaded)
      },

      name () {
        return this.$route.params.name
      }
    },
    mounted () {
      this.$store.dispatch(actions.agents.get, this.name).then(() => {
        this.$emit('onConfigNav', {
          navs: [
            {
              text: this.$t('settings.li.agent'),
              href: '#/settings/agents'
            },
            {
              text: this.wrapper.name,
            }
          ],
          showAddBtn: false
        })
      })
    },
    watch: {
      name (newValue) {
        this.$store.dispatch(actions.agents.get, newValue)
      }
    },
    methods: {
      onDeleteClick () {
        this.$store.dispatch(actions.agents.delete, this.wrapper.rawInstance).then(() => {
          this.$store.dispatch(actions.agents.select, {})
          this.dialog = false
          this.onBackClick()
        })
      },

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
