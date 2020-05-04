<template>
  <div class="full-size">
    <v-row>
      <v-col class="py-1">
        <v-chip
            v-for="item in tagList"
            :key="item.name"
            class="ma-2"
            color="primary"
            filter
            outlined
            :input-value="item.selected"
            @click="onTagClick(item)"
        >
          {{ item.name }}
        </v-chip>
      </v-col>
    </v-row>

    <v-row class="full-height">

    </v-row>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import actions from '@/store/actions'
  import {PluginWrapper} from '@/util/plugins'
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
      }
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
    updated() {
      for (let wrapper of this.pluginList) {
        this.setSrcIcon(wrapper)
      }
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
      plugins (newVal) {
        this.pluginList = this.toPluginWrapperList(newVal)
      },

      tags (newVal) {
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

        return false
      },

      setMarkdown(raw) {
        let element = document.getElementById('markdown')
        let doc = element.contentWindow.document
        const css =
          `<style type="text/css">
            body {
              margin: 0;
              padding: 0px;
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
      },

      setSrcIcon(wrapper) {
        const element = document.getElementById(wrapper.id)
        if (!element || element.src) {
          return
        }

        const b64 = this.iconCache[wrapper.name]
        if (b64) {
          element.src = `data:${this.getMediaType(wrapper)};base64,${b64}`
          return
        }

        this.$store.dispatch(actions.plugins.icon, wrapper.name).then(() => {
          const b64 = this.iconCache[wrapper.name]
          element.src = `data:${this.getMediaType(wrapper)};base64,${b64}`
        })
      },

      getMediaType(plugin) {
        if (!plugin.icon) {
          return 'image/svg+xml'
        }

        const dotIndex = plugin.icon.lastIndexOf('.')
        if (dotIndex < 0) {
          return 'image/svg+xml'
        }

        const suffix = plugin.icon.substring(dotIndex + 1)

        if (suffix === 'jpg' || suffix === 'jpeg') {
          return 'image/jpeg'
        }

        if (suffix === 'gif') {
          return 'image/gif'
        }

        if (suffix === 'png') {
          return 'image/png'
        }

        return 'image/svg+xml'
      }
    }
  }
</script>

<style lang="scss" scoped>
  .plugin-icon {
    max-height: 60px;
    max-width: 32px;
  }

  .markdown {
    width: 100%;
    height: 95%;
    border: 0;
    background: #fbfbfb;
  }
</style>
