<template>
  <div class="overview">
    <v-row align="center" justify="center" class="full-size" v-if="flows.length === 0">
      <v-btn x-large color="info" @click="onCreateFlowClick">{{ $t('flow.create') }}</v-btn>
    </v-row>

    <v-row align="start" justify="start" v-if="flows.length > 0">
      <v-col v-for="flow in flows"
             :key="flow.name"
             cols="3" md="4" lg="3" sm="2"
      >
        <summary-card :wrapper="flow"/>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import SummaryCard from '@/components/Flow/SummaryCard'
  import { toWrapperList } from '@/util/flows'
  import { mapState } from 'vuex'
  import actions from '@/store/actions'

  export default {
    name: 'FlowOverview',
    components: {
      SummaryCard
    },
    computed: {
      ...mapState({
        flows: state => state.flows.items,
      })
    },
    methods: {
      onCreateFlowClick() {
        this.popCreateFlow(true)
      }
    }
  }
</script>

<style scoped>
  .overview {
    height: 80vh;
  }
</style>
