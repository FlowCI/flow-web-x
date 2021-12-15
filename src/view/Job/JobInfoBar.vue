<template>
  <v-row align="center" :style="{leftBorderColor: wrapper.status.bg}" class="mx-0 info-bar">
    <div class="status" :style="{backgroundColor: wrapper.status.bg}"></div>

    <v-col cols="2">
      <v-icon size="20"
              :class="['mx-2', wrapper.status.rotate ? 'rotate' : '']"
              :style="{color: wrapper.status.bg}"
      >
        {{ wrapper.status.icon }}
      </v-icon>
      <span class="font-weight-bold" :style="{color: wrapper.status.bg}">
        {{ wrapper.status.text }}
      </span>
    </v-col>

    <v-col cols="2">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <span v-on="on">
            <v-icon small>mdi-clock-fast</v-icon>
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
            <v-icon small>mdi-clock-outline</v-icon>
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
            <v-icon small class="mr-2">{{ wrapper.triggerIcon }}</v-icon>
          </span>
        </template>
        <div>{{ wrapper.triggerText }}</div>
      </v-tooltip>
      <span>{{ wrapper.triggerBy }}</span>
    </v-col>

    <v-col cols="2">
      <div v-for="[id, info] of Object.entries(wrapper.snapshots)"
           :key="id">
        <v-icon x-small>{{ agentIcons[info.os] }}</v-icon>
        <span class="ml-1">{{ info.name }}</span>
      </div>

    </v-col>

    <v-col cols="2">
      <v-btn icon @click="onStopClick" v-if="!wrapper.isFinished">
        <v-icon>mdi-stop</v-icon>
      </v-btn>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon @click="onRerunClick" v-if="wrapper.isFinished" v-on="on">
            <v-icon small>mdi-restart</v-icon>
          </v-btn>
        </template>
        <div>{{ $t('job.hint.rerun') }}</div>
      </v-tooltip>
    </v-col>
  </v-row>
</template>

<script>
import {icons} from '@/util/agents'

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
    }
  },
  data() {
    return {
      showTty: false,
      agentIcons: icons,
      duration: 'n/a',
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

<style lang="scss" scoped>
.info-bar {
  min-height: 80px;
  max-height: 80px;
  border: 1px solid #e1e4e8;

  span {
    color: #424242;
    text-overflow: ellipsis;
    max-width: 150px;
    display: inline-block;
    white-space: nowrap;
  }

  .status {
    position: absolute;
    min-width: 8px;
    max-width: 8px;
    min-height: 80px;
    max-height: 80px;
    top: -1px;
    bottom: 0;
    left: 0;
  }
}
</style>
