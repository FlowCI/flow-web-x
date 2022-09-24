<template>
  <v-card
      raised
      class="mx-auto flow-summary"
  >
    <div :class="['title', wrapper.successRateColor]" @click="onTitleClick">
      <v-card-title>
        {{ wrapper.name }}
      </v-card-title>
      <v-card-subtitle>
        #{{ wrapper.latestJob.buildNumber }}
      </v-card-subtitle>
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
              size="80"
              width="6"
              :value="wrapper.successRate"
              :color="wrapper.successRateColor"
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
    data() {
      return {
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
      min-height: 85px;
      max-height: 85px;
    }

    .v-card__text {
      min-height: 115px;
      max-height: 115px;
    }

    .v-card__title {
      color: white;
    }

    .v-card__subtitle {
      color: white !important;
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
