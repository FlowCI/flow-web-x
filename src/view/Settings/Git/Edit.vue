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

    <v-row>
      <v-col cols="7">
        <text-select :items="secretNameList"
                     label="Secret"
                     v-model="gitObj.secret"
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
import {GIT_SOURCE_GITHUB, GitSourceSelection} from "@/util/git";
import {mapState} from "vuex";
import actions from "@/store/actions";
import {CATEGORY_TOKEN} from "@/util/secrets";

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
    TextSelect
  },
  data() {
    return {
      gitSourceList: GitSourceSelection,
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

    loadRelatedSecret() {
      if (this.gitObj.source === GIT_SOURCE_GITHUB) {
        this.$store.dispatch(actions.secrets.listNameOnly, CATEGORY_TOKEN).then()
      }
    }
  }
}
</script>

<style scoped>

</style>