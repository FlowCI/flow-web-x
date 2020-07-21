<template>
  <div>
    <v-row>
      <v-col cols="8">
        <v-form ref="userForm" lazy-validation>
          <text-box label="Email" v-model="instance.email"></text-box>
          <text-box label="Password" v-model="instance.password"></text-box>
          <text-select
              :items="['Admin', 'Developer']"
              label="Role"
              v-model="instance.role"
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
    name: 'SettingsUsersNew',
    components: {
      TextBox,
      TextSelect,
      SaveBtn,
      BackBtn
    },
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
            text: this.$t('settings.li.users'),
            href: '#/settings/users'
          },
          {
            text: this.$t('new')
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
