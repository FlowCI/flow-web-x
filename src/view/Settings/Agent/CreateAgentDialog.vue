<template>
  <v-dialog v-model="value"
            max-width="500"
            @click:outside="onClick"
  >
    <v-card>
      <v-card-text>
        <radio-box-list :items="items"
                        v-model="selected"
        ></radio-box-list>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="onConfirmClick">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import RadioBoxList from "@/components/Common/RadioBoxList"

  export default {
    name: "CreateAgentDialog",
    props: {
      value: {
        type: Boolean,
        required: true
      }
    },
    components: {
      RadioBoxList
    },
    data() {
      return {
        selected: 0,
        items: ['Manual agent', 'Host with auto agent']
      }
    },
    methods: {
      onNewAgentClick() {
        this.$emit('input', false)
        this.$router.push('/settings/agents/new')
      },

      onNewHostClick() {
        this.$emit('input', false)
        this.$router.push('/settings/agents/host/new')
      },

      onClick() {
        this.$emit('input', false)
      },

      onConfirmClick() {
        console.log(this.selected)
      }
    }
  }
</script>

<style scoped>

</style>
