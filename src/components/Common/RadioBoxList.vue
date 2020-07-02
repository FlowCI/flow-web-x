<template>
  <v-list :dense="dense">
    <v-list-item-group v-model="item" mandatory @change="onItemChange">
      <v-list-item
          v-for="(item, i) in items"
          :key="i"
      >
        <template v-slot:default="{ active }">
          <v-list-item-title>
            <v-icon :size="iconSize">{{ active ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank' }}</v-icon>
            <span class="ml-3">{{ item }}</span>
          </v-list-item-title>
        </template>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
  export default {
    name: "RadioBoxList",
    props: {
      value: {
        type: Number,
        required: false,
        default: 0
      },
      items: {
        type: Array,
        required: true
      },
      iconSize: {
        type: String,
        required: false,
        default: 'small'
      },
      dense: {
        type: Boolean,
        required: false,
        default: true
      }
    },
    data() {
      return {
        item: this.value
      }
    },
    methods: {
      onItemChange(val) {
        this.$emit('input', val)
      }
    }
  }
</script>

<style scoped>

</style>
