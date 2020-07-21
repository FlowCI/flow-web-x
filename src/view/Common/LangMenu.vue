<template>
  <v-menu offset-y nudge-bottom="15" nudge-left="50">
    <template v-slot:activator="{ on }">
      <v-btn text v-on="on" small class="mx-0 px-0">
        <v-icon>mdi-translate</v-icon>
      </v-btn>
    </template>
    <radio-box-list v-model="item"
                    :items="items"
    ></radio-box-list>
  </v-menu>
</template>

<script>
  import RadioBoxList from "@/components/Common/RadioBoxList"

  export default {
    name: "LangMenu",
    components: {RadioBoxList},
    data() {
      return {
        item: 0,
        items: ['English', '简体中文'],
        mapping: {
          'en': 0,
          'cn': 1
        },
        indexes: {
          0: 'en',
          1: 'cn'
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
    watch: {
      item(val) {
        this.onLangChange(this.indexes[val])
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
