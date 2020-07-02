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
          @click:append="onAddClick"
      ></v-text-field>
    </div>
    <div>
      <v-chip
          close
          label
          class="mr-1"
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
    data () {
      return {
        input: '',
        errors: []
      }
    },
    computed: {
      raw () {
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
      onTagInput () {
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
      }
    }
  }
</script>

<style lang="scss">
  .tag-editor {
    .v-input {
      font-size: 14px
    }
  }
</style>
