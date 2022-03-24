<template>
  <div>
    <v-row>
      <v-col cols="7">
        <text-select :items="gitSourceList"
                     label="Git Source"
                     v-model="selected.source"
                     :on-change="onGitSourceChange"
        ></text-select>
      </v-col>
    </v-row>

    <v-form ref="hostForm" lazy-validation>
      <v-row v-if="showHostField">
        <v-col cols="7">
          <text-box label="Host"
                    :rules="httpUrl"
                    v-model="selected.host"
          ></text-box>
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
    </v-form>

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
import {GIT_SOURCE_GERRIT, GIT_SOURCE_GITHUB, GIT_SOURCE_GITLAB, GIT_SOURCE_GOGS, GitSourceSelection} from '@/util/git'
import {mapState} from "vuex";
import actions from "@/store/actions";
import {CATEGORY_AUTH, CATEGORY_TOKEN} from "@/util/secrets";
import {httpUrl} from "@/util/rules"

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
      GIT_SOURCE_GITLAB,
      GIT_SOURCE_GOGS,
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
    this.$emit('onConfigNav', {
      navs: this.navs,
      showAddBtn: false
    })
    this.loadRelatedSecret(this.selected.source)
  },
  computed: {
    ...mapState({
      secrets: state => state.secrets.items
    }),

    navs() {
      return [
        {text: this.$t('settings.li.git'), href: '#/settings/git'},
        {text: this.$t('new')}
      ]
    },

    showHostField() {
      return this.selected.source === GIT_SOURCE_GERRIT ||
          this.selected.source === GIT_SOURCE_GITLAB ||
          this.selected.source === GIT_SOURCE_GOGS
    },

    secretNameList() {
      const nameList = []
      for (let c of this.secrets) {
        nameList.push(c.name)
      }
      return nameList
    }
  },
  methods: {
    onGitSourceChange(val) {
      this.$refs.hostForm.reset()
      this.loadRelatedSecret(val)
    },

    onBackClick() {
      this.error = null
      this.$router.replace('/settings/git')
    },

    onSaveClick() {
      if (!this.$refs.hostForm.validate()) {
        return
      }

      this.$store.dispatch(actions.git.save, this.selected)
          .then(() => {
            this.onBackClick()
          })
          .catch(e => {
            this.error = e.message
          })
    },

    loadRelatedSecret(source) {
      if (source === GIT_SOURCE_GITHUB || source === GIT_SOURCE_GITLAB) {
        this.$store.dispatch(actions.secrets.listNameOnly, CATEGORY_TOKEN).then()
        return
      }

      if (source === GIT_SOURCE_GERRIT) {
        this.$store.dispatch(actions.secrets.listNameOnly, CATEGORY_AUTH).then()
      }
    }
  }
}
</script>

<style scoped>

</style>