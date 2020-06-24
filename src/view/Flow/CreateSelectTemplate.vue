<template>
  <v-card class="template-selection" elevation="0">
    <v-card-subtitle>
      {{ $t('flow.create_git_hint') }}
    </v-card-subtitle>
    <v-card-text>
      <v-radio-group v-model="selected" :mandatory="true" dense>
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
  import axios from 'axios'
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
    },
    data() {
      return {
        selected: 0,
        loading: false
      }
    },
    mounted() {
      this.$store.dispatch(actions.flows.templates).then()
    },
    computed: {
      ...mapState({
        templates: state => state.flows.templates
      })
    },
    methods: {
      async onFinishClick() {
        let yaml = ''
        let err = ''

        // load yaml
        try {
          this.loading = true
          const url = this.templates[this.selected].url
          const response = await axios.get(url)
          yaml = response.data;
        } catch (error) {
          err = error
        }

        this.loading = false
        this.onNextClick({yaml, err})
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
