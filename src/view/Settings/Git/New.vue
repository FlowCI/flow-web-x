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
import {GitSourceSelection, GIT_SOURCE_GITHUB} from '@/util/git'
import {mapState} from "vuex";
import actions from "@/store/actions";
import {CATEGORY_TOKEN} from "@/util/secrets";

export default {
  name: "SettingsGitNew",
  components: {
    TextSelect,
    SaveBtn,
    BackBtn
  },
  data() {
    return {
      gitSourceList: GitSourceSelection,
      selected: {
        source: GIT_SOURCE_GITHUB,
        secret: ''
      },
      error: null
    }
  },
  mounted() {
    this.loadRelatedSecret()
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
      console.log(this.selected.source)
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
      }
    }
  }
}
</script>

<style scoped>

</style>