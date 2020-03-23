<template>
  <div>
    <v-row>
      <v-col cols="7">
        <v-form ref="userForm" lazy-validation>
          <v-text-field label="Email"
                        readonly
                        v-model="userObj.email"
          ></v-text-field>
          <v-select
              :items="['Admin', 'Developer']"
              label="Role"
              v-model="userObj.role"
          ></v-select>
        </v-form>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="5"></v-col>
      <v-col cols="1">
        <v-btn outlined color="warning" @click="onBackClick">{{ $t('back') }}</v-btn>
      </v-col>
      <v-col cols="1">
        <v-btn color="primary" @click="onSaveClick">{{ $t('save') }}</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import actions from '@/store/actions'

  export default {
    name: 'Edit',
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
            text: 'Users',
            href: '#/settings/users'
          },
          {
            text: 'Edit'
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
