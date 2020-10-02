<template>
  <v-dialog v-model="value"
            max-width="500"
            @click:outside="onOutsideClick"
  >
    <v-card>
      <v-card-text class="no-padding">
        <radio-box-list :items="items"
                        v-model="selected"
        ></radio-box-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <back-btn :onClick="onCancelClick" small></back-btn>
        <save-btn :onClick="onConfirmClick"
                  text="next"
                  icon="mdi-arrow-right"
                  small
        ></save-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import RadioBoxList from "@/components/Common/RadioBoxList"
  import SaveBtn from '@/components/Settings/SaveBtn'
  import BackBtn from '@/components/Settings/BackBtn'

  export default {
    name: "CreateAgentDialog",
    props: {
      value: {
        type: Boolean,
        required: true
      }
    },
    components: {
      RadioBoxList,
      SaveBtn,
      BackBtn
    },
    data() {
      return {
        selected: 0,
        items: ['Manual Agent', 'Dynamic Agent'],
        links: {
          0: '/settings/agents/new',
          1: '/settings/agents/host/new'
        }
      }
    },
    methods: {
      onOutsideClick() {
        this.$emit('input', false)
      },

      onCancelClick() {
        this.$emit('input', false)
      },

      onConfirmClick() {
        this.$emit('input', false)
        this.$router.push(this.links[this.selected])
      }
    }
  }
</script>

<style scoped>

</style>
