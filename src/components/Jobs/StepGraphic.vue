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

      let edges = this.toEdges(nodes)
      return {nodes, edges}
    },

    toEdges(nodes) {
      let edges = []
      for (let i = 0; i < nodes.length - 1; i++) {
        let current = nodes[i]
        let next = nodes[i + 1]
        edges.push({
          source: current.id,
          target: next.id
        })
      }
      return edges
    },

    // only transfer real step to nodes
    toNodes(root) {
      let nodes = []

      forEachStep(root, (step) => {
        if (step.isRoot || step.isStage) {
          return
        }

        const node = {
          id: step.id,
          label: step.name,
        }

        Object.assign(node, step.status.config)
        nodes.push(node)
      })

      console.log(nodes)

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
