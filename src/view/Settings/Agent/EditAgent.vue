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
        <back-btn :onClick="onBackClick" class="mr-5"></back-btn>
        <confirm-btn :text="$t('delete')"
                     color="error"
                     icon="mdi-delete"
                     clazz="mr-5"
                     @click="onDeleteClick">
          <template v-slot:title>
            <span class="red--text subheading">
              Delete Agent {{ name }}?
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
  import SaveBtn from '@/components/Settings/SaveBtn'
  import BackBtn from '@/components/Settings/BackBtn'
  import { AgentWrapper } from '@/util/agents'
  import { agentNameRules } from '@/util/rules'

  export default {
    name: 'SettingsAgentEdit',
    components: {
      TagEditor,
      ConfirmBtn,
      SaveBtn,
      BackBtn
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
