<template>
  <div>
    <v-row>
      <v-col cols="8">
        <v-form ref="userForm" lazy-validation>
          <text-box label="Email"
                    readonly
                    v-model="userObj.email"
          ></text-box>
          <text-select
              :items="['Admin', 'Developer']"
              label="Role"
              v-model="userObj.role"
          ></text-select>
        </v-form>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="8" class="text-end">
        <back-btn :onClick="onBackClick" class="mr-5"></back-btn>
        <save-btn :onClick="onSaveClick"></save-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import actions from '@/store/actions'
  import TextBox from '@/components/Common/TextBox'
  import TextSelect from '@/components/Common/TextSelect'
  import SaveBtn from '@/components/Settings/SaveBtn'
  import BackBtn from '@/components/Settings/BackBtn'

  export default {
    name: 'Edit',
    components: {
      TextSelect,
      TextBox,
      SaveBtn,
      BackBtn
    },
    props: {
      userObj: {
        type: Object,
        required: false,
        default () {
          return {
            email: '',
            role: '',
            default: true
          }
        }
      }
    },
    mounted () {
      if (this.userObj.default) {
        this.onBackClick()
        return
      }

      this.$emit('onConfigNav', {
        navs: [
          {
            text: this.$t('settings.li.users'),
            href: '#/settings/users'
          },
          {
            text: this.userObj.email
          }
        ],
        showAddBtn: false
      })
    },
    methods: {
      onBackClick () {
        this.$router.replace({name: 'SettingsUsersHome'})
      },

      onSaveClick () {
        this.$store.dispatch(actions.users.changeRole, this.userObj)
          .then(() => {
            this.onBackClick()
          }).catch((err) => {
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped>

</style>
