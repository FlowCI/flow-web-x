<template>
  <v-dialog
      v-model="show"
      persistent
      max-width="650"
      max-height="600"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          text
          color="success"
          v-on="on"
      >
        <v-icon class="mr-1">mdi-play</v-icon>
        {{ $t('job.run') }}
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="headline">
        <span class="mr-1">Start a new job from</span>
        <span class="font-weight-bold">{{ selected.obj.name }}</span>
      </v-card-title>

      <v-divider class="mb-1"></v-divider>

      <v-card-text class="list">
        <parameter-item :item="branchVar"
                        :values="gitBranches"
        ></parameter-item>

        <parameter-item class="my-2"
                        v-for="(item, i) of vars"
                        :key="i"
                        :item=item
        ></parameter-item>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="show = false">
          {{ $t('cancel') }}
        </v-btn>
        <v-btn color="success" @click="show = false">
          {{ $t('job.run') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ParameterItem from "@/components/Flow/ParameterItem"
import {mapState} from "vuex"
import VarsList from "@/util/vars"

export default {
  name: "RunDialog",
  components: {
    ParameterItem
  },
  data() {
    return {
      VarsList,
      show: false
    }
  },
  computed: {
    ...mapState({
      selected: state => state.flows.selected,
      gitBranches: state => state.flows.gitBranches,
    }),

    branchVar() {
      return {
        key: VarsList.git.branch,
        value: this.vars[VarsList.git.branch] || 'master'
      }
    },

    vars() {
      let flow = this.selected.obj
      return this.toListOfItem(flow)
    }
  },
  methods: {
    toListOfItem(flow) {
      let varsFromYaml = flow.variables || {}
      let varsFromLocal = flow.locally || {}
      let vars = []

      for (let key of Object.keys(varsFromYaml)) {
        vars.push({
          key: key,
          value: varsFromYaml[key]
        })
      }

      for (let key of Object.keys(varsFromLocal)) {
        vars.push({
          key: key,
          value: varsFromLocal[key].data
        })
      }

      return vars
    }
  }
}
</script>

<style lang="scss" scoped>
  .list {
    max-height: 400px;
    overflow-y: auto;
  }
</style>