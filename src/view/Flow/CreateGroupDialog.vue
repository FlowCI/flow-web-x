<template>
  <v-dialog v-model="dialog"
            max-width="600"
            @click:outside="onOutsideClick">
    <v-card>
      <v-card-title class="blue lighten-1 white--text">
        <span class="text-h5">Create flow group</span>
      </v-card-title>

      <v-card-text class="pt-4 pb-2">
        <v-form
            ref="form"
            v-model="valid"
            lazy-validation
        >
          <v-text-field
              required
              :counter="20"
              v-model="name"
              :rules="nameRules"
              :error-messages="errorMsg"
          ></v-text-field>
        </v-form>

      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small
               outlined
               min-width="70"
               color="warning"
               @click="onBackClick"
        >{{ $t('cancel') }}
        </v-btn>
        <v-btn small
               class="ml-6"
               min-width="70"
               :loading="loading"
               color="primary"
               @click="onFinishClick"
        >{{ $t('save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapState} from "vuex";
import { flowNameRules } from '@/util/rules'
import actions from "@/store/actions";

export default {
  name: "CreateFlowGroupDialog",
  data () {
    return {
      loading: false,
      valid: true,
      errorMsg: '',
      nameRules: flowNameRules(this),
      name: ''
    }
  },
  computed: {
    ...mapState({
      showCreateGroup: state => state.g.showCreateGroup,
      created: state => state.flows.created
    }),
    dialog: {
      get() {
        return this.showCreateGroup
      },

      set(val) {
        this.popCreateGroup(val)
      }
    },
  },
  methods: {
    onOutsideClick() {
      this.dialog = false
    },

    onFinishClick() {
      if (!this.$refs.form.validate()) {
        return
      }

      this.errorMsg = []

      this.$store.dispatch(actions.flowGroups.create, this.name).then(() => {
        this.name = ''
        this.dialog = false
      })
    },

    onBackClick() {
      this.dialog = false
    }
  }
}
</script>

<style scoped>

</style>