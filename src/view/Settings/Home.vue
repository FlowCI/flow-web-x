<template>
  <v-container class="full-height py-0">
    <v-row class="full-size pa-0">
      <v-col class="d-flex pa-0" cols="2">
        <settings-fun-list></settings-fun-list>
      </v-col>

      <v-col class="ml-2 pa-0" cols="9">
        <v-card class="full-size">
          <v-card-title class="pa-0 bottom-border-large">
            <v-breadcrumbs :items="navs" divider=">">
              <template v-slot:item="{item}">
                <v-breadcrumbs-item
                    :href="item.href"
                    :class="[item.disabled && 'disabled']"
                >
                  <span class="font-weight-bold">{{ item.text }}</span>
                </v-breadcrumbs-item>
              </template>
            </v-breadcrumbs>
            <v-btn icon
                   v-if="showAddBtn"
                   @click="$refs.childView.onAddBtnClick"
            >
              <v-icon>mdi-plus-box</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pt-0">
            <router-view ref="childView" v-on:onConfigNav="onConfigNav"></router-view>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import SettingsFunList from './FunList'

  export default {
    name: 'SettingsHome',
    components: {
      SettingsFunList
    },
    data () {
      return {
        navs: [],
        showAddBtn: false
      }
    },
    methods: {
      /**
       * Val : {
       *   navs: [{ text: 'user' }],
       *   showAddBtn: true \ false
       * }
       * @param val
       */
      onConfigNav (val) {
        this.navs = val.navs
        this.showAddBtn = val.showAddBtn
      }
    }
  }
</script>

<style scoped>

</style>
