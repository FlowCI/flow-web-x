<template>
  <div class="template-selection">
    <v-row dense>
      <v-col>
        <v-radio-group v-model="selected" :mandatory="true" dense>
          <v-radio label="Do not use template" :value="0"></v-radio>
          <v-radio v-for="(t, n) in templates" :key="t.desc" :label="t.desc" :value="n + 1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <v-row dense>
      <!-- finish button -->
      <v-col cols="1">
        <v-btn small
               :loading="loading"
               color="primary"
               @click="onFinishClick"
        >{{ $t('flow.create_btn_finish') }}</v-btn>
      </v-col>

      <!-- back button -->
      <v-col cols="1">
        <v-btn small
               outlined
               color="warning"
               @click="onBackClick"
        >{{ $t('back') }}</v-btn>
      </v-col>
    </v-row>
  </div>
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
    data () {
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
        if (this.selected > 0) {
          try {
            this.loading = true
            const url = this.templates[this.selected].url
            const response = await axios.get(url)
            yaml = response.data;
          } catch (error) {
            err = error
          }
        }

        this.loading = false
        this.onNextClick({yaml, err})
      }
    }
  }
</script>

<style lang="scss">
.template-selection {
  .v-input__slot {
    margin-bottom: 0 !important;
  }
}
</style>
