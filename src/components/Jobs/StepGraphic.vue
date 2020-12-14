<template>
  <div id="stepgraphic"></div>
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
      maxHeight: state => state.steps.maxHeight,
      change: state => state.steps.change
    }),
  },
  watch: {
    root() {
      if (this.graph) {
        this.graph.clear();
        this.graph.destroy()
      }

      this.graph = this.initG6()
      this.graph.data(this.buildGraphData())
      this.graph.render()
    }
  },
  methods: {
    initG6() {
      const element = document.getElementById('stepgraphic');
      const screenWidth = element.scrollWidth - 30;
      const height = this.maxHeight * 100;

      element.style.height = height + 'px'

      return new G6.Graph({
        container: "stepgraphic",
        width: screenWidth,
        height: height,
        fitView: false,
        fitCenter: true,
        groupByTypes: false,
        modes: {
          default: [
            'drag-canvas',
          ]
        },
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
          ranksep: 40,
          nodesep: 25,
          controlPoints: true,
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

      edges = edges.concat(this.toEdges({}, this.root.next))

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
        if (next.isFlow || next.isStage) {
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

    toEdges(added, steps) {
      let edges = []
      for (let step of steps) {
        let nextList = this.findNext(step.next)

        for (let next of nextList) {
          const id = step.path + "-" + next.path

          if (!added[id]) {
            edges.push({
              source: step.path,
              target: next.path
            })
            added[id] = true
          }

          edges = edges.concat(this.toEdges(added, nextList))
        }
      }

      return edges
    },

    // only transfer real step to nodes
    toNodes(root) {
      let nodes = []
      let added = {}

      forEachStep(root, (step) => {
        if (step.isStage || step.isFlow) {
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
</style>
