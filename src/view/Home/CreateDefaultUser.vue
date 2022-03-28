<template>
  <v-row align="center" justify="center" class="create-default-view">
    <v-col cols="4">
      <v-card>
        <v-card-title class="justify-center">
          <span class="headline font-weight-bold">{{ $t('welcome') }}</span>
        </v-card-title>

        <v-card-subtitle class="text-center">
          <span class="title font-weight-bold">{{ $t('create_default_admin') }}</span>
        </v-card-subtitle>

        <v-card-text>
          <v-form ref="inputForm" lazy-validation>
            <v-text-field
                v-model="email"
                label="Email"
                :rules="emailRule"
                prepend-inner-icon="mdi-account"
            ></v-text-field>

            <v-text-field
                prepend-inner-icon="mdi-key"
                type="password"
                :label="$t('password')"
                :rules="passwordRule"
                v-model="password"
                class="input-group--focused"
            ></v-text-field>

            <v-text-field
                prepend-inner-icon="mdi-key"
                type="password"
                :label="$t('password_confirm')"
                :rules="confirmedRules"
                v-model="confirmPassword"
                class="input-group--focused"
            ></v-text-field>
          </v-form>

          <span class="error--text caption">{{ error }}</span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn tile
                 block
                 color="primary"
                 @click="onCreateClick">{{ $t('create') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-dialog
        v-model="dialog"
        width="500"
    >
      <v-card>
        <v-card-text class="pt-3">
          <p :class="message.color" v-html="message.text"></p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="primary" @click="onConfirmClick">{{ $t('confirm') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-row>
</template>

<script>
import actions from '@/store/actions'
import { required, email, inputRange } from '@/util/rules'

export default {
  name: 'CreateDefaultUser',
  data() {
    return {
      dialog: false,
      message: {
        text: '',
        color: '',
        isError: false
      },
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      error: '',
      emailRule: [].concat(
          required('Email is required'),
          email('Illegal email format'),
      ),
      passwordRule: [].concat(
          required('Password is required'),
          inputRange(6, 50, 'Password length should between 6 - 50')
      ),
      confirmedRules: [].concat(
          required('Confirmed password is required'),
          [v => (v === this.password) || this.$t('settings.profile.password_not_same')]
      ),
    }
  },
  methods: {
    onCreateClick() {
      if (!this.$refs.inputForm.validate()) {
        return
      }

      this.$store.dispatch(actions.users.createDefault, {
        email: this.email,
        pw: this.password,
        onSuccess: this.onSuccess
      }).catch((e) => {
        this.onError(e.message)
      })
    },

    onConfirmClick() {
      this.dialog = false

      if (this.message.isError) {
        return
      }

      this.message = {}
      this.$router.replace('/login')
    },

    onError(msg) {
      this.message = {
        text: msg,
        color: 'red--text',
        isError: true
      }
      this.dialog = true
    },

    onSuccess() {
      this.message = {
        text: this.$t('createAdmin.created', [this.email]),
        isError: false
      }
      this.dialog = true
    }
  }
}
</script>

<style lang="scss">
.create-default-view {
  .v-input__prepend-inner:after {
    content: '';
    margin-right: 10px;
    position: relative;
  }
}
</style>
