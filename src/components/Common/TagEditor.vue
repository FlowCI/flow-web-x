<template>
  <div class="tag-editor">
    <div>
      <v-subheader class="no-padding">Tags</v-subheader>
      <v-text-field
          dense
          solo
          v-model="input"
          append-icon="mdi-plus-box"
          :error-messages="errors"
          @input="onTagInput"
          :disabled="disabled"
          @focus="onFocusEvent"
          @blur="onBlurEvent"
          @click:append="onAddClick"
      ></v-text-field>
    </div>
    <div>
      <v-chip
          small
          close
          label
          class="mr-1"
          close-icon="mdi-delete"
          v-for="(tag, index) in raw"
          v-model="tag.enabled"
          :key="tag.text"
          @click:close="onRemoveClick(index)"
      >{{ tag.text }}
      </v-chip>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TagEditor',
    props: {
      tags: {
        type: Array,
        required: true
      },
      min: {
        type: Number,
        required: false,
        default: 2
      },
      max: {
        type: Number,
        required: false,
        default: 10
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data() {
      return {
        input: '',
        errors: []
      }
    },
    computed: {
      raw() {
        const raw = []
        for (let tag of this.tags) {
          raw.push({
            text: tag,
            enabled: true
          })
        }
        return raw
      }
    },
    methods: {
      onTagInput() {
        if (this.errors.length > 0) {
          this.errors = []
        }
      },

      onAddClick() {
        if (this.input === '') {
          this.errors.push('Please input a tag name')
          return
        }

        if (this.input.length > this.max || this.input.length < this.min) {
          this.errors.push(`Tag name length between ${this.min} to 10 ${this.max}`)
          return
        }

        for (let tag of this.raw) {
          if (tag.text === this.input) {
            this.input = ''
            return
          }
        }

        this.raw.push({text: this.input, enabled: true})
        this.tags.push(this.input)
        this.input = ''
      },

      onRemoveClick(index) {
        this.raw.splice(index, 1)
        this.tags.splice(index, 1)
      },

      onFocusEvent(event) {
        if (this.readonly) {
          return
        }
        let inputSlotElem = event.path[2]
        inputSlotElem.classList.add("input-focus");
      },

      onBlurEvent(event) {
        if (this.readonly) {
          return
        }
        let inputSlotElem = event.path[2]
        inputSlotElem.classList.remove("input-focus");
      }
    }
  }
</script>

<style lang="scss">
  .tag-editor {
    .v-input {
      font-size: 14px
    }

    .v-input__slot {
      border: 1px solid #e1e4e8 !important;
      background-color: #fafbfc !important;
      margin-bottom: 0 !important;
      -webkit-box-shadow: inset 0 1px 0 rgba(225, 228, 232, .2) !important;
      box-shadow: inset 0 1px 0 rgba(225, 228, 232, .2) !important;
    }

    .v-text-field__details {
      margin-bottom: 0 !important;
    }

    .input-focus {
      background-color: white !important;
      border: 1px solid #64B5F6 !important;
      box-shadow: 0 0 6px rgb(180, 206, 241, 1) !important;
    }
  }
</style>
