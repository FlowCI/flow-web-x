<template>
  <v-row align="center" justify="center">
    <v-col cols="4">
      <v-card>
        <v-card-title class="justify-center">
          <span class="title font-weight-bold">{{ $t('welcome') }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
              v-model="email"
              label="E-mail"
              required
          ></v-text-field>

          <v-text-field
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              :label="$t('password')"
              v-model="password"
              class="input-group--focused"
              @click:append="showPassword = !showPassword"
          ></v-text-field>

          <span class="error--text caption">{{ error }}</span>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn tile
                 block
                 color="primary"
                 @click="onLoginClick">{{ $t('login') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import actions from '@/store/actions'

  export default {
    name: 'Login',
    data() {
      return {
        email: '',
        password: '',
        showPassword: false,
        error: ''
      }
    },
    methods: {
      onLoginClick() {
        let data = {username: this.email, password: this.password}
        this.$store.dispatch(actions.auth.login, data)
          .then(() => {
            this.$router.replace('/flows')
          })
          .catch((error) => {
            this.error = error.message
          })
      }
    }
  }
</script>

<style scoped>

</style>
