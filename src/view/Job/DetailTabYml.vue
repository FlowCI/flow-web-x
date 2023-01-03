<template>
  <v-card flat class="job-yml-settings">
    <v-card-text class="pa-0">
      <v-tabs v-model="tab" fixed-tabs>
        <v-tabs-slider color="lighten-3"></v-tabs-slider>
        <v-tab
            v-for="item in jobYml.list"
            :key="item.name"
            :href="'#' + item.name"
        >
          <v-spacer></v-spacer>
          {{ item.name }}
          <v-spacer></v-spacer>
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in jobYml.list"
                    :key="item.name"
                    :value="item.name"
                    class="yml-editor"
        >
          <yml-editor :id="item.name"
                      :is-read-only="true"
                      :raw="item.raw"
          ></yml-editor>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </v-card>
</template>

<script>
import YmlEditor from '@/components/Flow/YmlEditor'
import {mapState} from 'vuex'
import actions from '@/store/actions'

export default {
  name: 'DetailTabYml',
  props: {
    flow: {
      type: String,
      required: true
    },
    buildNumber: {
      type: String,
      required: true
    }
  },
  components: {
    YmlEditor
  },
  data() {
    return {
      tab: null
    }
  },
  mounted() {
    this.$store.dispatch(actions.jobs.getYml, {flow: this.flow, buildNumber: this.buildNumber}).then()
  },
  computed: {
    ...mapState({
      jobYml: state => state.jobs.jobYml
    })
  }
}
</script>

<style lang="scss">
.job-yml-settings {
  .tab-text {
    min-width: 65px;
    text-align: left;
    font-size: small;
    font-weight: bold;
  }

  .tab-active {
    color: #757575 !important;
  }

  .yml-editor {
    height: 600px;
  }
}
</style>
