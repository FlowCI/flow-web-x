<template>
  <div>
    <v-row>
      <v-col cols="7">
        <text-select :items="gitSourceList"
                     label="Git Source"
                     v-model="gitObj.source"
                     :onChange="onGitSourceChange"
        ></text-select>
      </v-col>
    </v-row>

    <v-form ref="hostForm" lazy-validation>
      <v-row v-if="showHostField">
        <v-col cols="7">
          <text-box label="Host"
                    :rules="httpUrl"
                    v-model="gitObj.host"
          ></text-box>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="7">
          <text-select :items="secretNameList"
                       label="Secret"
                       v-model="gitObj.secret"
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
        <confirm-btn :text="$t('delete')"
                     icon="mdi-delete"
                     color="error"
                     clazz="mr-5"
                     @click="onDeleteClick">
          <template v-slot:title>
            <span class="red--text subheading">
              Revoke git setting for {{ gitObj.source }}?
            </span>
          </template>
        </confirm-btn>
        <save-btn :on-click="onSaveClick"></save-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import SaveBtn from '@/components/Settings/SaveBtn'
import BackBtn from '@/components/Settings/BackBtn'
import ConfirmBtn from '@/components/Common/ConfirmBtn'
import TextSelect from '@/components/Common/TextSelect'
import TextBox from '@/components/Common/TextBox'
import {GIT_SOURCE_GERRIT, GIT_SOURCE_GITHUB, GIT_SOURCE_GITLAB, GIT_SOURCE_GOGS, GitSourceSelection} from "@/util/git";
import {mapState} from "vuex";
import actions from "@/store/actions";
import {CATEGORY_AUTH, CATEGORY_TOKEN} from "@/util/secrets";
import {GitSources} from "@/util/git";
import {httpUrl} from "@/util/rules"

export default {
  name: "SettingsGitEdit",
  props: {
    gitObj: {
      type: Object,
      required: true,
    }
  },
  components: {
    ConfirmBtn,
    SaveBtn,
    BackBtn,
    TextSelect,
    TextBox
  },
  data() {
    return {
      GitSources,
      GIT_SOURCE_GERRIT,
      GIT_SOURCE_GITLAB,
      GIT_SOURCE_GOGS,
      gitSourceList: GitSourceSelection,
      error: null,
      httpUrl: httpUrl("invalid url"),
    }
  },
  mounted() {
    this.$emit('onConfigNav', {
      navs: this.navs,
      showAddBtn: false
    })

    this.loadRelatedSecret(this.gitObj.source)
  },
  computed: {
    ...mapState({
      secrets: state => state.secrets.items
    }),

    navs() {
      return [
        {text: this.$t('settings.li.git'), href: '#/settings/git'},
        {text: this.GitSources[this.gitObj.source].name}
      ]
    },

    showHostField() {
      return this.gitObj.source === GIT_SOURCE_GERRIT ||
          this.gitObj.source === GIT_SOURCE_GITLAB ||
          this.gitObj.source === GIT_SOURCE_GOGS
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
    onGitSourceChange() {

    },

    onBackClick() {
      this.error = null
      this.$router.replace('/settings/git')
    },

    onDeleteClick() {
      this.$store.dispatch(actions.git.delete, this.gitObj.source)
          .then(() => {
            this.showSnackBar(`Git setting for ${this.gitObj.source} has been deleted`)
            this.onBackClick()
          })
          .catch(e => {
            this.error = e.message
          })
    },

    onSaveClick() {
      this.$store.dispatch(actions.git.save, this.gitObj)
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