<template>
  <div>
    <v-divider></v-divider>
    <v-subheader>{{ $t('job.tab.summary') }}</v-subheader>

    <step-logging-item
        v-for="(item) in stepItems"
        :key="item.id"
        :bus="buses[item.id]"
        :wrapper="item">
    </step-logging-item>

    <v-divider class="mt-4" v-if="taskItems.length > 0"></v-divider>
    <v-subheader class="mb-2" v-if="taskItems.length > 0">Notifications</v-subheader>

    <step-logging-item
        v-for="(item) in taskItems"
        :key="item.id"
        :wrapper="item">
    </step-logging-item>
  </div>
</template>

<script>
  import Vue from 'vue'
  import StepLoggingItem from '@/components/Jobs/StepLoggingItem'
  import { StepWrapper } from '@/util/steps'
  import { mapState } from 'vuex'

  export default {
    name: 'StepLogging',
    components: {
      StepLoggingItem
    },
    data() {
      return {
        stepItems: [],
        taskItems: [],
        buses: {}
      }
    },
    computed: {
      ...mapState({
        steps: state => state.steps.items,
        tasks: state => state.steps.tasks,
        loaded: state => state.logs.loaded,
        pushed: state => state.logs.pushed
      }),
    },
    watch: {
      steps(steps) {
        this.stepItems.length = 0
        this.buses = {}

        steps.forEach((s, index) => {
          const wrapper = new StepWrapper(s)
          this.buses[wrapper.id] = new Vue()
          this.stepItems.push(wrapper)
        })
      },

      tasks(tasks) {
        this.taskItems.length = 0
        tasks.forEach((s, index) => {
          const wrapper = new StepWrapper(s)
          this.taskItems.push(wrapper)
        })
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
