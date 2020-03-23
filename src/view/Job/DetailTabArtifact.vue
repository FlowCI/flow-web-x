<template>
  <div>
    <div v-if="!hasArtifacts" class="text-center pa-2">
      There are no artifacts for this job
    </div>

    <v-treeview
        :open="open"
        :items="treeItems"
        activatable
        item-key="id"
        open-on-click
    >
      <template v-slot:prepend="{ item, open }">
        <v-icon v-if="item.isDir">
          {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
        </v-icon>
        <v-icon v-else>
          {{ files[item.extension] || 'mdi-application' }}
        </v-icon>
      </template>

      <template v-slot:append="{ item }">
  <!--      <span class="mx-2" v-if="item.isDir">-->
  <!--        {{ moment(item.createdAt).format('YYYY/MM/DD hh:mm A') }}-->
  <!--      </span>-->
        <span class="mx-2" v-if="!item.isDir">
          {{ item.contentSize }} bytes
        </span>

        <v-btn icon
              class="mx-2"
              @click="onDownloadClick(item)"
              v-if="!item.isDir"
        >
          <v-icon small>mdi-download</v-icon>
        </v-btn>
      </template>
    </v-treeview>
  </div>
</template>

<script>
  import moment from 'moment'
  import actions from '@/store/actions'
  import {ArtifactNode} from '@/util/artifact'
  import {mapState} from 'vuex'

  export default {
    name: 'DetailTabArtifact',
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
    data() {
      return {
        moment,
        headers: [
          {
            text: 'Name',
            align: 'left',
            sortable: false,
            value: 'Name',
          },
          {
            text: 'Size',
            align: 'left',
            sortable: true,
            value: 'Size',
          },
          {
            text: 'Uploaded at',
            align: 'left',
            sortable: false,
            value: 'date',
          },
          {}
        ],
        files: {
          html: 'mdi-language-html5',
          js: 'mdi-nodejs',
          json: 'mdi-json',
          md: 'mdi-markdown',
          pdf: 'mdi-file-pdf',
          png: 'mdi-file-image',
          txt: 'mdi-file-document-outline',
          xls: 'mdi-file-excel',
          zip: 'mdi-zip-box',
          jar: 'mdi-zip-box',
          java: 'mdi-language-java'
        },
        open: ['public'],
        loading: false
      }
    },
    mounted() {
      this.loading = true
      let payload = {flow: this.flow, buildNumber: this.buildNumber}
      this.$store.dispatch(actions.jobs.artifacts.list, payload)
        .then(() => {
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    computed: {
      ...mapState({
        artifacts: state => state.jobs.artifacts
      }),

      hasArtifacts() {
        return this.artifacts.length > 0
      },

      treeItems() {
        let tree = this.buildTree(this.artifacts, {})
        return Object.values(tree)
      },

      pagination: {
        get() {
          return {
            page: 1,
            itemsPerPage: this.artifacts.length
          }
        },

        set(newVal) {

        }
      },
    },
    methods: {
      buildTree(artifacts) {

        // a/b/c/0.jar
        // a/b/c/d/1.json
        // a/b/2.zip
        // a/3.java

        // b/c/0.jar
        // b/c/d/1.json
        // b/2.zip
        // 3.java

        let root = {}
        let children = {}

        for (let a of artifacts) {
          if (!a.srcDir || a.srcDir === '') {
            let obj = new ArtifactNode(a)
            root[obj.name] = obj
            continue
          }

          let dirs = a.srcDir.split('/')

          if (dirs.length > 0) {
            let dir = dirs[0]

            // put dir to root if not existed
            if (!root[dir]) {
              let obj = new ArtifactNode({fileName: dirs[0]}, true)
              root[obj.name] = obj
            }

            // remove first dir in srcDir for artifact
            let newSrcDir = ''
            for (let i = 1; i < dirs.length; i++) {
              newSrcDir += dirs[i] + '/'
            }

            if (newSrcDir.length > 0) {
              newSrcDir = newSrcDir.slice(0, -1)
            }

            a.srcDir = newSrcDir

            // put to children map
            if (!children[dir]) {
              children[dir] = []
            }

            children[dir].push(a)
          }
        }

        for (let dir of Object.keys(children)) {
          let childrenNodes = this.buildTree(children[dir])
          root[dir].children = Object.values(childrenNodes)
        }

        return root
      },

      onDownloadClick(artifact) {
        let payload = {flow: this.flow, buildNumber: this.buildNumber, artifactId: artifact.id}
        this.$store.dispatch(actions.jobs.artifacts.download, payload).then()
      }
    }
  }
</script>

<style scoped>
  .name-col {
    width: 60%;
  }

  .size-col {
    width: 15%;
  }

  .date-col {
    width: 15%;
  }
</style>