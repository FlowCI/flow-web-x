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
        >{{ $t('next') }}</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { flowNameRules } from '@/util/rules'
  import actions from '@/store/actions'

  export default {
    name: 'CreateFlowName',
    props: {
      onNextClick: {
        required: true,
        type: Function
      }
    },
    data () {
      return {
        valid: true,
        errorMsg: [],
        name: '',
        nameRules: flowNameRules(this)
      }
    },
    computed: {
      ...mapState({
        isExist: state => state.flows.isExist
      })
    },
    methods: {
      handleNextClick () {
        if (!this.$refs.form.validate()) {
          return
        }

        this.errorMsg.length = 0
        this.$store.dispatch(actions.flows.exist, this.name).then()
      }
    },

    watch: {
      isExist(after) {
        if (after === undefined) {
          return
        }

        if (after === false) {
          this.$store.dispatch(actions.flows.create, this.name).then(() => {
            this.onNextClick(this.name)
          }).catch((error) => {
            this.errorMsg.push(error.message)
          })

          this.$store.dispatch(actions.flows.reset).then()
          return
        }

        this.errorMsg.push(this.$t('flow.hint.name_duplicate'))
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
