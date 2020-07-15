<template>
  <v-row :style="{'background-color': wrapper.status.bg}" align="center" class="mx-0">
    <v-col cols="2">
      <v-icon size="20" :class="['mx-2', wrapper.status.rotate ? 'rotate' : '']" dark>
        {{ wrapper.status.icon }}
      </v-icon>
      <span class="font-weight-bold">{{ wrapper.status.text }}</span>
    </v-col>

    <v-col cols="2">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <span v-on="on">
            <v-icon small dark>mdi-clock-fast</v-icon>
            {{ duration }} sec
          </span>
        </template>
        <div>Ran for {{ duration }} sec</div>
      </v-tooltip>
    </v-col>

    <v-col cols="2">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <span v-on="on">
            <v-icon small dark>mdi-clock-outline</v-icon>
            {{ wrapper.finishedAtInStr }}
          </span>
        </template>
        <div>Finished at {{ wrapper.finishedAtInStr }}</div>
      </v-tooltip>
    </v-col>

    <v-col cols="2">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <span v-on="on">
            <v-icon small dark class="mr-2">{{ wrapper.triggerIcon }}</v-icon>
          </span>
        </template>
        <div>{{ wrapper.triggerText }}</div>
      </v-tooltip>
      <span>{{ wrapper.triggerBy }}</span>
    </v-col>

    <v-col cols="2">
      <v-icon small dark>{{ agentIcons[wrapper.agentInfo.os] }}</v-icon>
      <span class="ml-2">{{ wrapper.agentInfo.name }}</span>
    </v-col>

    <v-col cols="2">
      <v-tooltip bottom v-if="!wrapper.isFinished">
        <template v-slot:activator="{ on }">
          <v-btn icon color="black" @click="onDebugClick" v-on="on">
            <v-icon small>mdi-console</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('job.hint.tty') }}</span>
      </v-tooltip>

      <v-btn icon @click="onStopClick" v-if="!wrapper.isFinished">
        <v-icon dark>mdi-stop</v-icon>
      </v-btn>

      <v-btn icon @click="onRerunClick" v-if="wrapper.isFinished">
        <v-icon small>mdi-restart</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
  import { icons } from '@/util/agents'

  export default {
    name: "JobInfoBar",
    props: {
      wrapper: {
        type: Object,
        required: true
      },
      onStopClick: {
        type: Function,
        required: true
      },
      onRerunClick: {
        type: Function,
        required: true
      },
      onDebugClick: {
        type: Function,
        required: true
      }
    },
    data() {
      return {
        showTty: false,
        agentIcons: icons,
        duration: '-',
        durationInterval: null,
      }
    },
    watch: {
      wrapper(w) {
        this.duration = w.duration

        if (this.durationInterval) {
          clearInterval(this.durationInterval)
        }

        if (w.isFinished) {
          return
        }

        this.durationInterval = setInterval(() => {
          this.duration += 1
        }, 1000)
      }
    }
  }
</script>

<style scoped>
  span {
    color: #fbfbfb;
    text-overflow: ellipsis;
    max-width: 150px;
    display: inline-block;
    white-space: nowrap;
  }
</style>
