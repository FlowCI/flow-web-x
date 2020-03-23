<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-row align="center">
    <v-col>
      <div class="font-weight-bold body-1">{{ $t('delete') }} Flow</div>
      <div>{{ $t('flow.delete_desc') }}</div>
    </v-col>

    <v-col cols="3">
      <v-dialog v-model="dialog" persistent max-width="40%">
        <template v-slot:activator="{ on }">
          <v-btn
              color="error"
              @click="dialog = true"
          >{{ $t('flow.delete_btn') }}
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="subheading">{{ $t('flow.hint.delete_title') }}</span>
            <span class="font-weight-black ml-1">{{ flow.name }}</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="deleteFlowForm" lazy-validation>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                      :rules="confirmRule"
                      v-model="confirmedName">
                  </v-text-field>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="onCloseClick">{{ $t('close') }}</v-btn>
            <v-btn color="error" @click="onDeleteClick">{{ $t('delete') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-col>
  </v-row>
</template>

<script>
  import actions from '@/store/actions'

  export default {
    name: 'OptionDeleteFlow',
    props: {
      flow: {
        required: true,
        type: Object
      }
    },
    data () {
      return {
        confirmedName: '',
        dialog: false,
        confirmRule: [
          v => !!v || this.$t('flow.hint.name_required'),
          v => v === this.flow.name || this.$t('flow.hint.delete_confirm_name_not_same')
        ]
      }
    },
    methods: {
      onDeleteClick () {
        if (!this.$refs.deleteFlowForm.validate()) {
          return
        }

        this.$store.dispatch(actions.flows.delete, this.flow.name).then(() => {
          this.onCloseClick()
          this.$router.push({path: `/flows`})
        })
      },

      onCloseClick () {
        this.dialog = false
        this.$refs.deleteFlowForm.reset()
      }
    }
  }
</script>

<style scoped>

</style>
