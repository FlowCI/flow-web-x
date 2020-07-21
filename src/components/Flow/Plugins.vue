<template>
  <div class="full-size plugin-view left-border">
    <div class="bottom-border">
      <v-chip
          v-for="item in tagList"
          :key="item.name"
          class="ma-2 font-weight-bold"
          label
          small
          outlined
          :input-value="item.selected"
          @click="onTagClick(item)"
      >
        {{ item.name }}
      </v-chip>
    </div>

    <div class="d-flex">
      <v-list dense class="left-list">
        <v-list-item-group v-model="selected" color="primary">
          <v-list-item v-for="plugin in pluginList"
                       :key="plugin.id"
                       class="bottom-border"
                       @click="getReadMe(plugin)"
          >
            <v-list-item-content>
              <plugin-item :wrapper="plugin"
                           :flow="flow"
                           :is-installed="isInstalledOnFlow(plugin)"
              ></plugin-item>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <iframe id="markdown"></iframe>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import actions from '@/store/actions'
  import { PluginWrapper } from '@/util/plugins'
  import PluginItem from "./PluginItem";
  import marked from 'marked'

  export default {
    name: 'Plugins',
    props: {
      flow: {
        required: true,
        type: Object
      },
      steps: {
        required: true,
        type: Array
      },
      notifications: {
        required: true,
        type: Array
      }
    },
    components: {
      PluginItem
    },
    data() {
      return {
        selected: 0,
        tagList: [],
        pluginList: []
      }
    },
    mounted() {
      this.$store.dispatch(actions.plugins.list).then(() => {
        let plugin = this.plugins[this.selected]
        if (plugin) {
          this.getReadMe(plugin.name)
        }
      })
    },
    computed: {
      ...mapState({
        tags: state => state.plugins.tags,
        plugins: state => state.plugins.items,
        readmeCache: state => state.plugins.readme,
        iconCache: state => state.plugins.icon
      })
    },

    watch: {
      plugins(newVal) {
        this.pluginList = this.toPluginWrapperList(newVal)
      },

      tags(newVal) {
        let list = []
        for (let t of newVal) {
          list.push({
            name: t,
            selected: false
          })
        }
        this.tagList = list
      }
    },
    methods: {
      onTagClick(tag) {
        tag.selected = !tag.selected

        let selected = new Set()

        for (let tag of this.tagList) {
          if (tag.selected) {
            selected.add(tag.name)
          }
        }

        if (selected.size === 0) {
          this.pluginList = this.toPluginWrapperList(this.plugins)
          return
        }

        this.pluginList = this.toPluginWrapperList(this.plugins).filter(((p) => {
          let s = new Set(p.tags)
          let intersect = new Set([...selected].filter(i => s.has(i)));
          return intersect.size > 0
        }))
      },

      toPluginWrapperList(plugins) {
        let list = []
        for (let p of plugins) {
          list.push(new PluginWrapper(p))
        }

        return list
      },

      getReadMe(plugin) {
        let name = plugin.name
        let loaded = this.readmeCache[name]

        if (loaded) {
          this.setMarkdown(loaded)
          return
        }

        this.$store.dispatch(actions.plugins.readme, name)
            .then(() => {
              this.setMarkdown(this.readmeCache[name])
            })
            .catch(() => {
            })
      },

      isInstalledOnFlow(plugin) {
        for (let step of this.steps) {
          if (step.plugin && step.plugin === plugin.name) {
            return true
          }
        }

        for (let n of this.notifications) {
          if (n.plugin && n.plugin === plugin.name) {
            return true
          }
        }

        return false
      },

      setMarkdown(raw) {
        let element = document.getElementById('markdown')
        let doc = element.contentWindow.document
        const css =
            `<style type="text/css">
            body {
              margin: 0;
              padding: 0;
              font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
              height: 100%;
            }

            body div {
              margin: 15px;
            }
          </style>`

        doc.body.innerHTML =
            `<html>
            <head>${css}</head>
            <body><div>${marked(raw)}</div></body>
          </html>`
      }
    }
  }
</script>

<style lang="scss">
  .plugin-view {

    .left-list {
      max-height: 70vh;
      min-width: 300px;
      overflow-y: auto;
    }

    .v-list-item {
      padding: 5px !important;
    }

    .v-list-item__content {
      padding: 0 !important;
    }
  }

  #markdown {
    width: 100%;
    min-height: 550px;
    border: 0;
    background: #fbfbfb;
  }

</style>
