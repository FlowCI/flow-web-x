<template>
  <div>
    <step-logging-item
        v-for="(item, i) in items"
        :key="i"
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
    destroyed() {
      for (let item of this.items) {
        unsubscribeTopic.logs(item.id)
      }
    },
    computed: {
      ...mapState({
        steps: state => state.steps.items,
        stepChange: state => state.steps.change,
        logs: state => state.logs.items
      }),
    },
    watch: {
      steps(after) {
        this.items.length = 0
        this.buses = {}

        after.forEach((s, index) => {
          const wrapper = new StepWrapper(s)
          this.buses[wrapper.id] = new Vue()

          if (wrapper.isAfter) {
            this.after.push(wrapper)
          } else {
            this.items.push(wrapper)
          }

          unsubscribeTopic.logs(wrapper.id)

          if (!wrapper.isFinished) {
            subscribeTopic.logs(wrapper.id, (logWrapper) => {
              this.writeLog(wrapper.id, logWrapper)
            })
          }
        })
      },

      stepChange(newVal) {
        for (let i = 0; i < this.items.length; i++) {
          const item = this.items[i]
          if (item.id === newVal.id) {
            this.$set(this.items, i, new StepWrapper(newVal, i))
            return
          }
        }
      },

      logs(after, before) {
        for (let logWrapper of after) {
          const stepId = logWrapper.id
          this.writeLog(stepId, logWrapper)
        }
      }
    },
    methods: {
      writeLog(stepId, logWrapper) {
        let bus = this.buses[stepId];
        if (bus) {
          bus.$emit("writeLog", logWrapper)
        }
      }
    }
  }
</script>

<style lang="scss">

</style>
