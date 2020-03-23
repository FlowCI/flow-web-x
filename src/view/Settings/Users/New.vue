<template>
  <div>
    <v-row>
      <v-col cols="7">
        <v-form ref="userForm" lazy-validation>
          <v-text-field label="Email" v-model="instance.email"></v-text-field>
          <v-text-field label="Password" v-model="instance.password"></v-text-field>
          <v-select
              :items="['Admin', 'Developer']"
              label="Role"
              v-model="instance.role"
          ></v-select>
        </v-form>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="5">
      </v-col>
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
    name: 'SettingsUsersNew',
    data () {
      return {
        instance: {
          email: '',
          password: '',
          role: 'Developer'
        }
      }
    },
    mounted () {
      this.$emit('onConfigNav', {
        navs: [
          {
            text: 'Users',
            href: '#/settings/users'
          },
          {
            text: 'New'
          }
        ],
        showAddBtn: false
      })
    },
    methods: {
      onBackClick () {
        this.$router.replace('/settings/users')
      },

      onSaveClick () {
        if (!this.$refs.userForm.validate()) {
          return
        }

        this.$store.dispatch(actions.users.create, this.instance)
          .then(() => {
            this.onBackClick()
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  }
</script>

<style scoped>

</style>
