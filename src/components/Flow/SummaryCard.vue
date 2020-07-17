<template>
  <v-card
      raised
      class="mx-auto flow-summary"
  >
    <div :class="['title', circleColor]" @click="onTitleClick">
      <v-card-title>
        {{ wrapper.name }}
      </v-card-title>
    </div>

    <v-card-text class="text--secondary pa-0">
      <v-progress-linear
          v-if="wrapper.latestJob.isRunning"
          :color="wrapper.latestJob.status.bg"
          buffer-value="100"
          height="3"
          background-opacity="0.3"
          striped
          indeterminate
      ></v-progress-linear>

      <v-row class="pa-2">
        <v-col cols="6" class="text-left pa-4">
          <div>{{ wrapper.latestJob.status.text }}</div>
          <div>{{ wrapper.latestJob.branch }}</div>
          <div>{{ wrapper.latestJob.triggerBy }}</div>
        </v-col>

        <v-col cols="6" class="text-center">
          <v-progress-circular
              rotate="90"
              size="100"
              width="6"
              :value="wrapper.successRate"
              :color="circleColor"
          >
            <div class="rate">{{ wrapper.successRate }} %</div>
            <div class="rate-desc">{{ $t('flow.summary_rate_text') }}</div>
          </v-progress-circular>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'FlowSummaryCard',
    props: {
      wrapper: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        ratio: [0, 20, 50, 85, 100],
        colors: ['red lighten-1', 'orange lighten-1', 'light-green darken-1', 'green darken-1']
      }
    },
    computed: {
      circleColor () {
        for (let i = 0; i < this.ratio.length - 1; i++) {
          const min = this.ratio[i]
          const max = this.ratio[i + 1]
          const rate = this.wrapper.successRate
          if (min < rate && rate <= max) {
            return this.colors[i]
          }
        }

        return 'green accent-4'
      }
    },
    methods: {
      onTitleClick () {
        this.$router.push({path: `/flows/${this.wrapper.name}/jobs`})
      }
    }
  }
</script>

<style lang="scss">
  .flow-summary {
    .title {
      background-color: #0E9A00;
      min-height: 100px;
      color: #ffffff;
    }

    .title div {
      opacity: 1 !important;
      font-weight: bold;
    }

    .rate {
      font-size: large;
      color: #707479;
    }

    .rate-desc {
      font-size: x-small;
      color: #707479;
    }

    .v-progress-circular__info {
      display: block;
    }
  }
</style>
