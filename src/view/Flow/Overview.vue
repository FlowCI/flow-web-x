<template>
  <div class="overview">
    <v-row align="start" justify="start" class="mx-0">
      <v-col v-for="item in items"
             :key="item.name"
             cols="3" md="4" lg="3" sm="2"
      >
        <summary-card :wrapper="item"/>
      </v-col>

      <v-col cols="3" md="4" lg="3" sm="2" v-if="flowItems.length === 0">
        <v-card raised class="create">
          <v-card-title class="justify-center">
            <v-btn large outlined color="primary" @click="onCreateFlowClick">
              {{ $t('flow.create') }}
              <v-icon small class="ml-1">flow-icon-control_point</v-icon>
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import SummaryCard from '@/components/Flow/SummaryCard'
  import { mapState } from 'vuex'

  export default {
    name: 'FlowOverview',
    components: {
      SummaryCard
    },
    data() {
      return {
      }
    },
    computed: {
      ...mapState({
        flowItems: state => state.flowItems.items,
      }),

      items() {
        let flows = []
        for (let item of this.flowItems) {
          if (item.isFlow) {
            flows.push(item)
          }
        }
        return flows;
      }
    },
    methods: {
      onCreateFlowClick() {
        this.popCreateFlow(true)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .overview {
    height: 80vh;
  }

  .create {
    min-height: 200px;
    max-height: 200px;

    .v-card__title {
      height: 195px;
    }
  }
</style>
