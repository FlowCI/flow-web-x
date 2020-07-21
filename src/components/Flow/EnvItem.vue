<template>
  <v-row class="env-item" no-gutters>
    <v-col cols="4">
      <v-text-field
          :label="$t('flow.var_name')"
          :readonly="!edit"
          v-model="obj.name"
          :error-messages="errors"
          append-outer-icon="mdi-equal"
          solo
      ></v-text-field>
    </v-col>

    <v-col cols="4">
      <v-text-field
          class="ml-2"
          :label="$t('flow.var_value')"
          :readonly="!edit"
          v-model="obj.value"
          solo
      ></v-text-field>
    </v-col>

    <!--  show type while editing  -->
    <v-col cols="2" v-if="edit">
      <v-select
          dense
          :items="types"
          :label="$t('flow.var_type')"
          v-model="obj.type"
          class="ml-2"
          solo
      ></v-select>
    </v-col>

    <v-col cols="2">
      <v-btn icon
             v-if="editable && !edit"
             class="mt-0 mr-2 mr-0"
             @click="edit = !edit"
      >
        <v-icon small>mdi-pencil-outline</v-icon>
      </v-btn>

      <!--  show save and remove button while editing  -->
      <div v-if="edit">
        <v-btn icon
               class="mt-0 mx-0"
               @click="onSaveClick"
        >
          <v-icon class="light-green--text" small>mdi-check-outline</v-icon>
        </v-btn>
        <v-btn icon
               class="mt-0 mx-0"
               @click="onRemoveClick"
        >
          <v-icon class="red--text" small>mdi-trash-can-outline</v-icon>
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  import { VarTypes } from '@/util/vars'
  import actions from '@/store/actions'

  export default {
    name: 'EnvItem',
    props: {
      flow: {
        required: true,
        type: Object
      },

      /**
       * {
       *   name: 'xxxx',
       *   value: 'xxxx',
       *   type: 'xxxx',
       *   edit: true | false (option) , edit status
       * }
       */
      obj: {
        type: Object,
        required: true
      },

      editable: {
        type: Boolean,
        required: true
      },

      onSaved: {
        type: Function,
        required: false
      },

      onRemoved: {
        type: Function,
        required: false
      }
    },
    data: () => ({
      types: VarTypes,
      edit: false,
      errors: []
    }),
    mounted () {
      if (this.obj.edit) {
        this.edit = this.obj.edit
      }
    },
    methods: {
      onSaveClick () {
        this.errors = []

        let flow = this.flow
        this.$store.dispatch(actions.flows.vars.add, {flow, ...this.obj})
          .then(() => {
            if (this.onSaved) {
              this.onSaved(this.item, this.obj)
            }
            this.edit = false
          })
          .catch((err) => {
            this.errors.push(err.message)
          })
      },

      onRemoveClick () {
        this.errors = []

        let flow = this.flow
        this.$store.dispatch(actions.flows.vars.remove, {flow, ...this.obj})
          .then(() => {
            if (this.onRemoved) {
              this.onRemoved(this.obj)
            }
            this.edit = false
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  }
</script>

<style lang="scss">
  .env-item {
    .v-input__control {
      min-height: 34px !important;
      max-height: 34px !important;
    }

    .v-input__slot {
      font-size: 12px !important;
    }

    .v-input__append-outer {
      margin-top: 5px !important;
    }
  }
</style>
