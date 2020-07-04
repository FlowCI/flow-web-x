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
                fontSize: 16,
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
          defaultNode: {
            shape: 'circle',
            size: 20,
            style: {
              fill: '#C6E5FF',
              stroke: '#FFFFFF',
              lineWidth: 3,
            },
            labelCfg: {
              position: 'bottom',
              offset: 10,
              style: {
                fontSize: 16,
                fontWeight: 'normal'
              }
            }
          },
          defaultEdge: {
            shape: 'polyline',
            style: {
              radius: 5,
              offset: 50,
              endArrow: true,
              lineWidth: 2,
              stroke: '#C2C8D5'
            }
          },
          layout: {
            type: 'dagre',
            rankdir: 'LR',
            ranksep: 20,
            nodesep: 10
          }
        });
      },

      buildGraphData() {
        let nodes = []

        const start = _.cloneDeep(this.points.terminal)
        start.id = 'Start'
        start.label = 'Start'
        nodes.push(start)

        this.steps.forEach((s, index) => {
          const wrapper = new StepWrapper(s)
          const node = {
            id: wrapper.id,
            label: wrapper.name
          }

          Object.assign(node, wrapper.status.config)
          nodes.push(node)
        })

        const end = _.cloneDeep(this.points.terminal)
        end.id = 'End'
        end.label = 'End'
        nodes.push(end)

        let edges = []

        for (let i = 0; i < nodes.length - 1; i++) {
          let current = nodes[i]
          let next = nodes[i + 1]
          edges.push({
            source: current.id,
            target: next.id
          })
        }

        return {nodes, edges}
      }
    }
  };
</script>

<style lang="scss" scoped>
  .graphic {
    height: 150px;
  }
</style>
