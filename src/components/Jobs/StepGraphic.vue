<template>
  <div id="stepgraphic" class="graphic"></div>
</template>

<script>
import G6 from "@antv/g6"
import { StepWrapper } from '@/util/steps'
import { mapState } from 'vuex'
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
      steps: state => state.steps.items,
      change: state => state.steps.change
    }),
  },
  mounted() {
    this.graph = this.initG6()
  },
  watch: {
    steps() {
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

      let items = this.toWrapperItems(this.allRoots())
      nodes = nodes.concat(this.toNodes(items))

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
    toNodes(wrapperItems) {
      let nodes = []
      wrapperItems.forEach((v, i) => {
        if (v.children) {
          let children = this.toNodes(v.wrapperChildren);
          nodes = nodes.concat(children)
          return
        }

        const node = {
          id: v.id,
          label: v.name,
        }

        Object.assign(node, v.status.config)
        nodes.push(node)
      })
      return nodes
    },

    toWrapperItems(rootSteps) {
      let items = []

      rootSteps.forEach((val, index) => {
        let wrapper = new StepWrapper(val, index);
        items.push(wrapper)

        if (val.children) {
          let children = this.toWrapperItems(val.children);
          for (let child of children) {
            child.wrapperParent = wrapper
          }
          wrapper.wrapperChildren = children
        }
      })

      return items
    },

    allRoots() {
      let map = {}
      let parents = []

      for (let step of this.steps) {
        map[step.nodePath] = step
        if (step.children) {
          parents.push(step)
        }
      }

      // set children and parent to step instance
      for (let step of parents) {
        let children = []
        for (let nodePath of step.children) {
          let child = map[nodePath];
          child.parent = step
          children.push(child)
        }
        step.children = children
      }

      return this.steps.filter((a) => {
        return a.rootStep === true
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.graphic {
  height: 150px;
}
</style>
