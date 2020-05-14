<template>
  <div>
    <v-divider></v-divider>
    <v-subheader>Steps</v-subheader>

    <step-logging-item
        v-for="(item) in items"
        :key="item.id"
        :bus="buses[item.id]"
        :wrapper="item">
    </step-logging-item>

    <v-divider class="mt-4" v-if="after.length > 0"></v-divider>
    <v-subheader class="mb-2" v-if="after.length > 0">After</v-subheader>

    <step-logging-item
        v-for="(item) in after"
        :key="item.id"
        :bus="buses[item.id]"
        :wrapper="item">
    </step-logging-item>
  </div>
</template>

<script>
  import Vue from 'vue'
  import StepLoggingItem from '@/components/Jobs/StepLoggingItem'
  import { subscribeTopic, unsubscribeTopic } from '@/store/subscribe'
  import { StepWrapper } from '@/util/steps'
  import { mapState } from 'vuex'

  export default {
    name: 'StepLogging',
    components: {
      StepLoggingItem
    },
    data() {
      return {
        items: [],
        after: [],
        buses: {}
      }
    },
    mounted() {
      subscribeTopic.logs(this.$store)
    },
    destroyed() {
      unsubscribeTopic.logs()
    },
    computed: {
      ...mapState({
        steps: state => state.steps.items,
        change: state => state.steps.change,
        loaded: state => state.logs.loaded,
        pushed: state => state.logs.pushed
      }),
    },
    watch: {
      steps(after) {
        this.items.length = 0
        this.after.length = 0
        this.buses = {}

        after.forEach((s, index) => {
          const wrapper = new StepWrapper(s)
          this.buses[wrapper.id] = new Vue()

          if (wrapper.isAfter) {
            this.after.push(wrapper)
          } else {
            this.items.push(wrapper)
          }
        })
      },

      change(newVal) {
        // ignore
      },

      // action from pushed log
      pushed(logWrapper) {
        this.writeLog(logWrapper)
      },

      // action from loaded logs
      loaded(logs) {
        for (let logWrapper of logs) {
          this.writeLog(logWrapper)
        }
      }
    },
    methods: {
      writeLog(logWrapper) {
        let bus = this.buses[logWrapper.cmdId];
        if (bus) {
          bus.$emit("writeLog", logWrapper.log)
        }
      }
    }
  }
</script>

<style lang="scss">

</style>
