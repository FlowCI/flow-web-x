<template>
  <v-data-table
      :headers="[{text: 'Timestamp', value: 'timestamp'}, {text: 'Status', value: 'status'}, {text: 'Desc', value: 'desc'}]"
      :items="delivery.items"
      :options.sync="pagination"
      :server-items-length="delivery.pagination.total"
      :footer-props="{
              itemsPerPageOptions: [10, 25, 50]
            }"
  >
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ timeFormat(item.timestamp) }}</td>
        <td>{{ item.status }}</td>
        <td>{{ item.desc }}</td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import {mapState} from "vuex"
import actions from "@/store/actions"
import equal from "fast-deep-equal"
import {timeFormat} from "@/util/time"

export default {
  name: "DeliveryTable",
  props: {
    name: {
      required: true,
      type: String
    }
  },
  mounted() {
    this.load()
  },
  data() {
    return {
      timeFormat,
      pagination: {
        page: 1,
        itemsPerPage: 10
      },
    }
  },
  computed: {
    ...mapState({
      delivery: state => state.triggers.delivery,
    })
  },
  watch: {
    pagination(newVal, oldVal) {
      if (!equal(newVal, oldVal)) {
        this.load()
      }
    }
  },
  methods: {
    load() {
      const payload = {
        name: this.name,
        page: this.pagination.page,
        size: this.pagination.itemsPerPage
      };

      this.$store.dispatch(actions.triggers.deliveries, payload).then(() => {
        // console.log(this.obj)
      })
    }
  }
}
</script>

<style scoped>

</style>