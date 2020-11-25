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

      <v-card-text class="list">
        <text-divider class="my-2" text="Git Branch"></text-divider>

        <parameter-item :item="branchVar"
                        :values="gitBranches"
                        :readonly="{key: true, value: false}"
        ></parameter-item>

        <text-divider class="my-2" text="Variables">
          <template v-slot:action>
            <v-btn small icon @click="onAddVar">
              <v-icon>mdi-plus-box</v-icon>
            </v-btn>
          </template>
        </text-divider>

        <v-form ref="varsForm" lazy-validation>
          <parameter-item class="my-2"
                          v-for="(item, i) of vars"
                          :key="i"
                          :item=item>
            <template v-slot:action>
              <v-btn icon @click="onRemoveVar(i)">
                <v-icon class="red--text" small>mdi-trash-can-outline</v-icon>
              </v-btn>
            </template>
          </parameter-item>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="onCancelClick">
          {{ $t('cancel') }}
        </v-btn>
        <v-btn color="success" @click="onRunClick">
          {{ $t('job.run') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ParameterItem from "@/components/Flow/ParameterItem"
import TextDivider from "@/components/Common/TextDivider"
import {mapState} from "vuex"
import VarsList from "@/util/vars"
import actions from "@/store/actions"

export default {
  name: "RunDialog",
  components: {
    ParameterItem,
    TextDivider
  },
  data() {
    return {
      VarsList,
      show: false,
      vars: []
    }
  },
  computed: {
    ...mapState({
      selected: state => state.flows.selected,
      gitBranches: state => state.flows.gitBranches,
    }),

    flowName() {
      return this.selected.obj.name
    },

    branchVar() {
      return {
        key: VarsList.git.branch,
        value: this.vars[VarsList.git.branch] || 'master'
      }
    },
  },
  watch: {
    selected() {
      this.vars = []
    }
  },
  methods: {
    onRunClick() {
      if (!this.$refs.varsForm.validate()) {
        return
      }

      const payload = {flow: this.flowName, inputs: this.toVarsMap()}
      this.$store.dispatch(actions.jobs.start, payload)
          .then(() => {
            this.show = false
            this.vars = []
          })
          .catch((e) => {
            console.log(e.message)
            this.showSnackBar(e.message, 'error')
          })
    },

    onCancelClick() {
      this.show = false
      this.vars = []
    },

    onAddVar() {
      if (!this.$refs.varsForm.validate()) {
        return
      }

      this.vars.push({
        key: '',
        value: ''
      })
    },

    onRemoveVar(index) {
      this.vars.splice(index, 1)
    },

    toVarsMap() {
      let inputs = {}
      for (let item of this.vars) {
        inputs[item.key] = item.value
      }
      inputs[this.branchVar.key] = this.branchVar.value
      return inputs
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