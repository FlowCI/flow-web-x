<template>
  <v-data-table
      disable-sort
      disable-pagination
      disable-filtering
      hide-default-footer
      :headers="[{text: 'KEY', value: 'key'}, {text: 'VALUE', value: 'value'}, {}]"
      :items="items"
  >
    <template v-slot:item="{index, item}">
      <tr>
        <td>
          <v-text-field
              v-model="item.key"
              label="Key"
              single-line
              dense
              :error="item.keyError"
              :error-messages="item.keyErrorMessage"
          ></v-text-field>
        </td>
        <td>
          <v-text-field
              v-model="item.value"
              label="Value"
              single-line
              dense
              :error="item.valueError"
              :error-messages="item.valueErrorMessage"
          ></v-text-field>
        </td>
        <td>
          <v-btn icon v-if="item.showAddBtn">
            <v-icon righ small @click="onAddClick(item)">mdi-plus</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon righ small @click="onRemoveClick(item, index)">mdi-minus</v-icon>
          </v-btn>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import {WebhookHelper} from '@/util/triggers'

export default {
  name: "KeyValueTable",
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      WebhookHelper
    }
  },
  methods: {
    onAddClick(item) {
      if (!item.key) {
        item.keyError = true
        item.keyErrorMessage = 'Key is required'
        return
      }

      if (this.hasDuplicateKey(item)) {
        item.keyError = true
        item.keyErrorMessage = 'Duplicate key'
        return
      }

      if (!item.value) {
        item.valueError = true
        item.valueErrorMessage = 'Value is required'
        return
      }

      this.toNoErrorStatus(item)
      this.items.push(this.WebhookHelper.NewKvItem())
      item.showAddBtn = false
    },

    onRemoveClick(item, index) {
      this.items.splice(index, 1)

      if (this.items.length === 0) {
        this.items.push(this.WebhookHelper.NewKvItem())
        return
      }

      let length = this.items.length
      this.items[length - 1].showAddBtn = true
    },

    hasDuplicateKey(item) {
      for (let i of this.items) {
        if (item.index === i.index) {
          continue
        }

        if (item.key === i.key) {
          return true
        }
      }
      return false
    },

    toNoErrorStatus(item) {
      item.keyError = false
      item.keyErrorMessage = ''
      item.valueError = false
      item.valueErrorMessage = ''
    }
  }
}
</script>

<style scoped>

</style>