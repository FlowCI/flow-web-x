<template>
  <v-card class="template-selection" elevation="0">
    <v-card-subtitle>
      {{ $t('flow.create_git_hint') }}
    </v-card-subtitle>
    <v-card-text>
      <v-list>
        <v-list-item-group v-model="selected">
          <v-list-item>
            <v-list-item-avatar>
              <v-icon x-large>{{ getIcon() }}</v-icon>
            </v-list-item-avatar>
            <v-list-item-content class="ml-3">
              <v-list-item-title v-text="$t('flow.create_blank_template_title')"></v-list-item-title>
              <v-list-item-subtitle v-text="$t('flow.create_blank_template_desc')"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <template v-for="(tmp, index) in templates">
            <v-list-item :key="tmp.title">
              <v-list-item-avatar>
                <v-icon x-large>{{ getIcon(tmp) }}</v-icon>
              </v-list-item-avatar>
              <v-list-item-content class="ml-3">
                <v-list-item-title v-text="tmp.title"></v-list-item-title>
                <v-list-item-subtitle v-text="tmp.desc"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider
                v-if="index < templates.length - 1"
                :key="index"
            ></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-btn small
             outlined
             color="warning"
             @click="onBackClick"
      >{{ $t('back') }}
      </v-btn>
      <v-btn small
             class="ml-10"
             :loading="loading"
             color="primary"
             @click="onFinishClick"
      >{{ $t('flow.create_btn_finish') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import actions from '@/store/actions'
  import { mapState } from 'vuex'

  export default {
    name: "CreateSelectTemplate",
    props: {
      onBackClick: {
        required: true,
        type: Function
      },
      onNextClick: {
        required: true,
        type: Function
      },
      loading: {
        required: true,
        type: Boolean
      }
    },
    data() {
      return {
        selected: 0,
        blankValue: -1,
        icons: {
          'Hello World': 'mdi-code-braces',
          'Maven': '$vuetify.icons.maven',
          'Android': '$vuetify.icons.android',
          '.NetCore': '$vuetify.icons.dotnetcore',
          'Golang': '$vuetify.icons.golang',
          'PHP': '$vuetify.icons.php',
          'npm': '$vuetify.icons.npm',
          'Ruby': '$vuetify.icons.ruby',
          'Python': '$vuetify.icons.python',
        }
      }
    },
    mounted() {
      this.$store.dispatch(actions.flows.templates).then()
    },
    computed: {
      ...mapState({
        showCreateFlow: state => state.g.showCreateFlow,
        templates: state => state.flows.templates,
        settings: state => state.settings.instance
      })
    },
    watch: {
      showCreateFlow() {
        // reset
        this.selected = 0
      }
    },
    methods: {
      getIcon(template) {
        if (!template) {
          return 'mdi-code-braces'
        }

        for (let key of Object.keys(this.icons)) {
          if (template.title.includes(key)) {
            return this.icons[key]
          }
        }
        return 'mdi-code-braces'
      },

      async onFinishClick() {
        let title = "_blank_"
        if (this.selected > 0) {
          title = this.templates[this.selected - 1].title
        }

        this.onNextClick(title)
      }
    }
  }
</script>

<style lang="scss">
  .template-selection {
    .v-card__subtitle {
      padding-bottom: 0 !important;
    }

    .v-input__slot {
      margin-bottom: 0 !important;
    }
  }
</style>
