<template>
  <div>
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
          <td>
            <v-icon small color="green" v-if="item.status === 'Success'">mdi-check-circle</v-icon>
            <v-icon small color="red" v-else>mdi-close-circle-outline</v-icon>
          </td>
          <td>
            <v-btn icon @click="onDetailDescClick(item.desc)" v-if="item.desc">
              <v-icon small color="red">mdi-dots-horizontal</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title></v-card-title>
        <v-card-text>{{ dialogText }}</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              text
              @click="dialog = false"
          >
            {{ $t('close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
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
      dialog: false,
      dialogText: '',
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
    },

    onDetailDescClick(text) {
      this.dialogText = text
      this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>