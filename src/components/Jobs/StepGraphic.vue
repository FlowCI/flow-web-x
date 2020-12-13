<template>
  <div id="stepgraphic" class="graphic"></div>
</template>

<script>
import G6 from "@antv/g6"
import {forEachStep} from '@/util/steps'
import {mapState} from 'vuex'
import _ from 'lodash'

export default {
  name: "StepGraphic",
  data() {
    return {
      graph: null,
      points: {
        terminal: {
          size: 15,
          style: {
            fill: '#808080',
            lineWidth: 0,
          },
          labelCfg: {
            position: 'bottom',
            offset: 14,
            style: {
              fontSize: 14,
              fontWeight: 'normal'
            }
          }
        }
      }
    };
  },
  computed: {
    ...mapState({
      root: state => state.steps.root,
      steps: state => state.steps.items,
      change: state => state.steps.change
    }),
  },
  mounted() {
    this.graph = this.initG6()
  },
  watch: {
    root() {
      this.graph.data(this.buildGraphData())
      this.graph.render()
    }
  },
  methods: {
    initG6() {
      const stepWidth = 165 * this.steps.length
      const screenWidth = document.getElementById('stepgraphic').scrollWidth - 20;
      const height = 150;

      return new G6.Graph({
        container: "stepgraphic",
        width: screenWidth,
        height: height,
        modes: {
          default: [
            'drag-canvas',
            'zoom-canvas',
          ]
        },
        fitView: stepWidth > screenWidth,
        fitCenter: true,
        groupByTypes: false,
        defaultNode: {
          type: 'circle',
          size: 20,
          style: {
            fill: '#C6E5FF',
            stroke: '#FFFFFF',
            lineWidth: 5,
          },
          labelCfg: {
            position: 'bottom',
            offset: 10,
            style: {
              fontSize: 14,
              fontWeight: 'bold'
            }
          }
        },
        defaultEdge: {
          type: 'polyline',
          style: {
            radius: 5,
            offset: 50,
            endArrow: true,
            lineWidth: 3,
            stroke: '#C2C8D5'
          }
        },
        layout: {
          type: 'dagre',
          rankdir: 'LR',
        }
      });
    },

    buildGraphData() {
      // build edges
      let nodes = []
      let start = _.cloneDeep(this.points.terminal)
      start.id = 'Start'
      start.label = 'Start'
      nodes.push(start)

      nodes = nodes.concat(this.toNodes(this.root))

      const end = _.cloneDeep(this.points.terminal)
      end.id = 'End'
      end.label = 'End'
      nodes.push(end)

      // build edges
      let edges = []
      for (let step of this.findNext(this.root.next)) {
        edges.push({
          source: start.id,
          target: step.path
        })
      }

      edges = edges.concat(this.toEdges(this.root.next))

      for (let step of this.findLastSteps(this.root)) {
        edges.push({
          source: step.path,
          target: end.id
        })
      }

      return {nodes, edges}
    },

    findNext(nextSteps) {
      let out = []
      for (let next of nextSteps) {
        if (next.isFlow || next.isStage || next.isParallel) {
          out = out.concat(this.findNext(next.next))
          continue
        }
        out.push(next)
      }
      return out
    },

    findLastSteps(root) {
      let lastSteps = []
      forEachStep(root, (step) => {
        if (step.next.length === 0) {
          lastSteps.push(step)
        }
      })
      return lastSteps
    },

    toEdges(steps) {
      let edges = []
      for (let step of steps) {
        let nextList = this.findNext(step.next)

        for (let next of nextList) {
          edges.push({
            source: step.path,
            target: next.path
          })

          edges = edges.concat(this.toEdges(nextList))
        }
      }

      return edges
    },

    // only transfer real step to nodes
    toNodes(root) {
      let nodes = []
      let added = {}

      forEachStep(root, (step) => {
        if (step.isStage || step.isFlow || step.isParallel) {
          return
        }

        const node = {
          id: step.path,
          label: step.name,
        }
        Object.assign(node, step.status.config)

        if (!added[node.id]) {
          nodes.push(node)
          added[node.id] = node
        }
      })

      return nodes
    }
  }
};
</script>

<style lang="scss" scoped>
.graphic {
  height: 150px;
}
</style>
