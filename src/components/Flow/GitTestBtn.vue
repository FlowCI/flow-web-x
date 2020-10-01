<template>
  <span>
    <v-btn color="info"
           outlined
           small
           @click="onTestClick"
           :loading="loading"
           :disabled="loading"
    >
      {{ $t('test') }}

      <v-icon small :class="['ml-2', currentGitTest.class]">{{ currentGitTest.icon }}</v-icon>

      <template v-slot:loader>
        <span>
          <v-icon small light class="loading-anim">flow-icon-loading1</v-icon>
        </span>
      </template>
    </v-btn>

    <span class="ml-2 error--text">{{ currentGitTest.message }}</span>
    <span class="ml-2 error--text">{{ error }}</span>
  </span>
</template>

<script>
  import actions from '@/store/actions'
  import { GIT_TEST_DONE, GIT_TEST_ERROR, gitTestStatus } from '@/util/flows'
  import { subscribeTopic, unsubscribeTopic } from '@/store/subscribe'
  import { mapState } from 'vuex'

  export default {
    name: 'GitTestBtn',
    props: {
      wrapper: {
        required: true,
        type: Object
      },
      onBeforeTest: {
        type: Function,
        default () {
          return true
        }
      }
    },
    data () {
      return {
        loading: false,
        error: ''
      }
    },
    computed: {
      ...mapState({
        gitTestMessage: state => state.flows.gitTestMessage
      }),

      currentGitTest () {
        if (this.error !== '') {
          return gitTestStatus[ GIT_TEST_ERROR ]
        }

        if (this.gitTestMessage === undefined) {
          return gitTestStatus.default
        }

        const gitTest = gitTestStatus[ this.gitTestMessage.status ] || gitTestStatus.default
        let message = gitTest.message

        if (this.gitTestMessage.status === GIT_TEST_ERROR) {
          message += ' : ' + this.gitTestMessage.error
        }

        return {
          icon: gitTest.icon,
          class: gitTest.class,
          message: message
        }
      }
    },
    watch: {
      gitTestMessage (newValue) {
        if (newValue.status === GIT_TEST_DONE) {
          this.stop()
        }

        if (newValue.status === GIT_TEST_ERROR) {
          this.stop()
        }
      }
    },
    methods: {
      stop () {
        this.loading = false
        unsubscribeTopic.gitTest(this.wrapper.id)
      },

      onTestClick () {
        this.error = ''

        if (this.onBeforeTest()) {
          subscribeTopic.gitTest(this.$store, this.wrapper.id)

          this.$store.dispatch(actions.flows.gitTestStart, this.wrapper)
            .then(() => {
              this.loading = true
            })
            .catch((err) => {
              this.error = err.message
            })
        }
      }
    }
  }
</script>

<style scoped>

</style>
