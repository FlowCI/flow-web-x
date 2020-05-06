<template>
  <div>
    <v-row>
      <v-col cols="8">
        <text-box label="E-Mail"
                  v-model="user.email"
                  readonly
        ></text-box>
        <text-box label="Role"
                  v-model="user.role"
                  readonly
        ></text-box>
      </v-col>

      <v-col cols="3" class="mt-2 ml-4">
        <div class="subheading font-weight-medium">Profile picture here</div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="8">
        <div>Change Password</div>
        <v-divider class="my-2"></v-divider>

        <v-form ref="passwordForm"
                lazy-validation>
          <text-box label="Old password"
                    password
                    v-model="passwords.old"
                    :rules="notEmptyRules"
          ></text-box>
          <text-box label="New password"
                    password
                    v-model="passwords.newOne"
                    :rules="notEmptyRules"
          ></text-box>
          <text-box label="Confirm New password"
                    password
                    v-model="passwords.confirm"
                    :rules="confirmedRules"
          ></text-box>
        </v-form>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="8" class="text-end">
        <v-btn color="primary" tile @click="onUpdatePasswordClick">Update password</v-btn>
        <v-btn color="info" outlined @click="onForgotPasswordClick" class="ml-4">I forgot my password</v-btn>
      </v-col>
    </v-row>

    <!-- password change confirmed dialog -->
    <v-dialog
        v-model="dialog"
        width="500"
    >
      <v-card>
        <v-card-title class="headline error--text" primary-title>
          Password been changed, please re-login
        </v-card-title>
        <v-card-actions>
          <v-btn block color="primary" dark @click="onReLoginClick">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import TextBox from '@/components/Common/TextBox'
  import actions from '@/store/actions'

  export default {
    name: 'SettingsProfileHome',
    components: {
      TextBox
    },
    data() {
      return {
        dialog: false,
        passwords: {
          old: '',
          newOne: '',
          confirm: ''
        },
        notEmptyRules: [
          v => !!v || this.$t('settings.profile.password_not_empty')
        ],
        confirmedRules: [
          v => !!v || this.$t('settings.profile.password_not_empty'),
          v => v === this.passwords.newOne || this.$t('settings.profile.password_not_same')
        ]
      }
    },
    mounted() {
      this.$emit('onConfigNav', {
        navs: [
          {
            text: 'Profile'
          }
        ],
        showAddBtn: false
      })
    },
    methods: {
      onUpdatePasswordClick() {
        if (!this.$refs.passwordForm.validate()) {
          return
        }

        this.$store.dispatch(actions.users.changePassword, this.passwords).then(() => {
          this.dialog = true
        }).catch((err) => {
          console.log(err)
        })
      },

      onForgotPasswordClick() {

      },

      onReLoginClick() {
        this.dialog = false
        this.$router.replace('/login')
      }
    }
  }
</script>

<style scoped>

</style>
