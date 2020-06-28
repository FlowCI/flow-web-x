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
    name: 'Edit',
    components: {
      TextSelect,
      TextBox
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
