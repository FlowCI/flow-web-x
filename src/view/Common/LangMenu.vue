<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn text v-on="on" small class="mx-0 px-0">
        <v-icon>mdi-translate</v-icon>
      </v-btn>
    </template>

    <v-list dense>
      <v-list-item-group v-model="item">
        <v-list-item @click="onLangChange('en')">
          <template v-slot:default="{ active }">
            <v-list-item-title>
              <v-icon x-small>{{ active ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank' }}</v-icon>
              <span class="ml-3">English</span>
            </v-list-item-title>
          </template>
        </v-list-item>

        <v-list-item @click="onLangChange('cn')">
          <template v-slot:default="{ active }">
            <v-list-item-title>
              <v-icon x-small>{{ active ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank' }}</v-icon>
              <span class="ml-3">简体中文</span>
            </v-list-item-title>
          </template>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    name: "LangMenu",
    data() {
      return {
        item: 0,
        mapping: {
          'en': 0,
          'cn': 1
        }
      }
    },
    mounted() {
      let lang = localStorage.getItem('lang');
      if (lang) {
        this.$i18n.locale = lang
        this.item = this.mapping[lang]
      }
    },
    methods: {
      onLangChange(lang) {
        this.$i18n.locale = lang
        localStorage.setItem('lang', lang)
      }
    }
  }
</script>

<style scoped>

</style>
