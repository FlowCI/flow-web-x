<template>
  <v-card class="template-selection" elevation="0">
    <v-card-subtitle>
      {{ $t('flow.create_git_hint') }}
    </v-card-subtitle>
    <v-card-text>
      <v-radio-group v-model="selected" :mandatory="true" dense>
        <v-radio :label="$t('flow.create_blank_template')" :value="blankValue"></v-radio>
        <v-divider class="my-1"></v-divider>
        <v-radio v-for="(t, n) in templates" :key="t.desc" :label="t.desc" :value="n"></v-radio>
      </v-radio-group>
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
      async onFinishClick() {
        let desc = "blank"

        // load yaml
        if (this.selected !== this.blankValue) {
          desc = this.templates[this.selected].desc
        }

        this.onNextClick(desc)
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
