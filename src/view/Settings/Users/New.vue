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
        <v-btn outlined color="warning" @click="onBackClick">{{ $t('back') }}</v-btn>
        <v-btn color="primary" @click="onSaveClick" class="ml-4">{{ $t('save') }}</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import actions from '@/store/actions'
  import TextBox from '@/components/Common/TextBox'
  import TextSelect from '@/components/Common/TextSelect'

  export default {
    name: 'SettingsUsersNew',
    components: {
      TextBox,
      TextSelect
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
