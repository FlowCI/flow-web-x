<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-breadcrumbs :items="itemsObjArray" class="pt-1">
    <template v-slot:divider>
      <v-icon>mdi-chevron-right</v-icon>
    </template>

    <template v-slot:item="{ item }">
      <v-breadcrumbs-item
          :href="item.href"
          :disabled="item.disabled"
          class="headline font-weight-bold"
      >
        {{ item.text }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script>
  export default {
    name: 'Nav',
    props: {
      items: {
        required: true,
        type: Array
      },
      links: {
        required: true,
        type: Array
      }
    },
    computed: {
      itemsObjArray () {
        let data = []

        for (let i = 0; i < this.items.length; i++) {
          const text = this.items[i]
          const link = this.links[i]

          data.push({
            text: text,
            disabled: false,
            href: link
          })
        }

        return data
      }
    }
  }
</script>

<style>

</style>
