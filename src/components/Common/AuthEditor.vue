<template>
  <div>
    <v-row align="center">
      <v-col>
        <span class="body-2 grey--text">Auth Username & Password</span>
        <div v-if="showSelection">
          <v-radio-group v-model="option" row>
            <v-radio label="Select" value="select"></v-radio>
            <v-radio label="Edit" value="edit"></v-radio>
          </v-radio-group>
        </div>
      </v-col>
    </v-row>

    <div v-if="showSelection & isSelectOption">
      <v-row>
        <v-col>
          <v-select
              dense
              v-model="model.selected"
              :items="names"
              label="Select Credential"
          ></v-select>
        </v-col>
      </v-row>
    </div>

    <div v-if="isEditOption">
      <v-row>
        <v-col cols="12">
          <text-box
              label="Username"
              v-model="model.pair.username"
              :rules="authFormRules"
              :readonly="isReadOnly"
          ></text-box>

          <text-box
              label="Password"
              password
              v-model="model.pair.password"
              :rules="authFormRules"
              :readonly="isReadOnly"
          ></text-box>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
  import actions from '@/store/actions'
  import TextBox from '@/components/Common/TextBox'
  import { mapState } from 'vuex'
  import { authFormRules } from '@/util/rules'
  import { CATEGORY_AUTH } from '@/util/secrets'

  export default {
    name: 'AuthEditor',
    props: {
      /**
       * Ex: {
       *   pair: {
       *     username: 'xxx',
       *     password: 'xxx'
       *   },
       *   selected: ''
       * }
       */
      model: {
        type: Object,
        required: true
      },
      showSelection: {
        type: Boolean,
        default () {
          return false
        }
      },
      isReadOnly: {
        type: Boolean,
        default () {
          return false
        }
      }
    },
    components: {
      TextBox
    },
    data () {
      return {
        option: 'edit',
        authFormRules: authFormRules(this)
      }
    },
    mounted () {
      if (this.showSelection) {
        this.$store.dispatch(actions.secrets.listNameOnly, CATEGORY_AUTH).then()
      }
    },
    computed: {
      ...mapState({
        secrets: state => state.secrets.items,
      }),

      names () {
        const nameList = []
        for (let c of this.secrets) {
          nameList.push(c.name)
        }
        return nameList
      },

      isSelectOption () {
        return this.option === 'select'
      },

      isEditOption () {
        return this.option === 'edit'
      }
    }
  }
</script>

<style scoped>

</style>
