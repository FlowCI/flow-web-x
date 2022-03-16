<template>
  <div>
    <v-row>
      <v-col cols="7">
        <text-select :items="gitSourceList"
                     label="Git Source"
                     v-model="selected.source"
                     :onChange="onGitSourceChange"
        ></text-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="7" v-if="selected.source === GIT_SOURCE_GERRIT">
        <text-box label="Host"
                  :rules="httpUrl"
                  v-model="selected.host"
        ></text-box>
      </v-col>

      <v-col cols="7">
        <text-select :items="secretNameList"
                     label="Secret"
                     v-model="selected.secret"
        ></text-select>
      </v-col>
    </v-row>

    <v-row no-gutters dense v-if="error">
      <v-col cols="9">
        <span class="error--text">Error: {{ error }}</span>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="7" class="text-end">
        <back-btn :on-click="onBackClick" class="mr-5"></back-btn>
        <save-btn :on-click="onSaveClick"></save-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import SaveBtn from '@/components/Settings/SaveBtn'
import BackBtn from '@/components/Settings/BackBtn'
import TextSelect from '@/components/Common/TextSelect'
import TextBox from '@/components/Common/TextBox'
import {GIT_SOURCE_GERRIT, GIT_SOURCE_GITHUB, GitSourceSelection} from '@/util/git'
import {mapState} from "vuex";
import actions from "@/store/actions";
import {CATEGORY_AUTH, CATEGORY_TOKEN} from "@/util/secrets";
import {httpUrl} from "@/util/rules"
import code from "@/util/code";

export default {
  name: "SettingsGitNew",
  components: {
    TextSelect,
    TextBox,
    SaveBtn,
    BackBtn
  },
  data() {
    return {
      gitSourceList: GitSourceSelection,
      GIT_SOURCE_GERRIT,
      httpUrl: httpUrl("invalid url"),
      selected: {
        source: GIT_SOURCE_GITHUB,
        secret: '',
        host: '',
      },
      error: null
    }
  },
  mounted() {

  },
  watch: {
    selected: {
      immediate: true,
      deep: true,
      handler: function (value) {
        this.loadRelatedSecret()
      }
    }
  },
  computed: {
    ...mapState({
      secrets: state => state.secrets.items
    }),

    secretNameList() {
      const nameList = []
      for (let c of this.secrets) {
        nameList.push(c.name)
      }
      return nameList
    }
  },
  methods: {
    onGitSourceChange() {
    },

    onBackClick() {
      this.error = null
      this.$router.replace('/settings/git')
    },

    onSaveClick() {
      this.$store.dispatch(actions.git.save, this.selected)
          .then(() => {
            this.onBackClick()
          })
          .catch(e => {
            this.error = e.message
          })
    },

    loadRelatedSecret() {
      if (this.selected.source === GIT_SOURCE_GITHUB) {
        this.$store.dispatch(actions.secrets.listNameOnly, CATEGORY_TOKEN).then()
        return
      }

      if (this.selected.source === GIT_SOURCE_GERRIT) {
        this.$store.dispatch(actions.secrets.listNameOnly, CATEGORY_AUTH).then()
      }
    }
  }
}
</script>

<style scoped>

</style>