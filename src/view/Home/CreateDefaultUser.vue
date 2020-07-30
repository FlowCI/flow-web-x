<template>
  <v-row align="center" justify="center" class="create-default-view">
    <v-col cols="4">
      <v-card>
        <v-card-title class="justify-center">
          <span class="title font-weight-bold">{{ $t('welcome') }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
              v-model="email"
              label="Email"
              required
              prepend-inner-icon="mdi-account"
          ></v-text-field>

          <v-text-field
              prepend-inner-icon="mdi-key"
              type="password"
              label="Password"
              v-model="password"
              class="input-group--focused"
          ></v-text-field>

          <v-text-field
              prepend-inner-icon="mdi-key"
              type="password"
              label="Confirm Password"
              v-model="confirmPassword"
              class="input-group--focused"
          ></v-text-field>

          <span class="error--text caption">{{ error }}</span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn tile
                 block
                 color="primary"
                 @click="onCreateClick">{{ $t('Create') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import actions from '@/store/actions'

export default {
  name: 'CreateDefaultUser',
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      error: ''
    }
  },
  methods: {
    onCreateClick() {

    }
  }
}
</script>

<style lang="scss">
.create-default-view {
  .v-input__prepend-inner:after{
    content: '';
    margin-right: 10px;
    position: relative;
  }
}
</style>
