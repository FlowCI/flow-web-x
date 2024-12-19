<template>
  <div>
    <v-row>
      <v-col cols="4">
        <v-form
            ref="form"
            v-model="valid"
            lazy-validation
        >
          <v-text-field
              required
              :counter="20"
              v-model="name"
              :rules="nameRules"
              :error-messages="errorMsg"
          ></v-text-field>
        </v-form>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="1">
        <v-btn small
               color="primary"
               @click="handleNextClick"
        >{{ $t('next') }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { flowNameRules } from '@/util/rules'
  import actions from '@/store/actions'

  export default {
    name: 'InputFlowName',
    props: {
      onNextClick: {
        required: true,
        type: Function
      }
    },
    data() {
      return {
        valid: true,
        errorMsg: [],
        name: '',
        nameRules: flowNameRules(this)
      }
    },
    computed: {
      ...mapState({
        showCreateFlow: state => state.g.showCreateFlow,
        isExist: state => state.flowItems.isExist
      })
    },
    watch: {
      showCreateFlow() {
        // reset
        this.name = ''
        this.errorMsg = []
      }
    },
    methods: {
      handleNextClick() {
        if (!this.$refs.form.validate()) {
          return
        }

        this.errorMsg = []
        this.onNextClick(this.name)
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
