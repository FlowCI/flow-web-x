<template>
  <v-list class="pa-0 func-list full-size">
    <v-list-item-group v-model="selected" color="primary" active-class="on-active">
      <v-list-item v-for="(item, index) in items"
                   :key="item.path"
                   dense
                   :class="[ index === 0 ? 'top-border bottom-border' : 'bottom-border', 'left-border']"
                   @click="onMenuItemClick(item.path)">

        <v-list-item-icon>
          <v-icon small>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-subtitle class="font-weight-bold">
            {{ $t(`${item.i18n}`) }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
  export default {
    name: 'SettingsFunList',
    data() {
      return {
        selected: 0,
        items: [
          {
            i18n: 'settings.li.profile',
            path: 'profile',
            icon: 'mdi-account-circle-outline'
          },
          {
            i18n: 'settings.li.users',
            path: 'users',
            icon: 'mdi-account-multiple-outline'
          },
          {
            i18n: 'settings.li.agent',
            path: 'agents',
            icon: 'mdi-server'
          },
          {
            i18n: 'settings.li.secret',
            path: 'secrets',
            icon: 'mdi-key'
          },
          {
            i18n: 'settings.li.config',
            path: 'configs',
            icon: 'mdi-code-braces'
          },
          {
            i18n: 'settings.li.plugin',
            path: 'plugins',
            icon: 'mdi-puzzle-outline'
          },
          {
            i18n: 'settings.li.trigger',
            path: 'triggers',
            icon: 'mdi-bell-outline'
          },
          {
            i18n: 'settings.li.git',
            path: 'git',
            icon: 'mdi-git'
          },
          {
            i18n: 'settings.li.system',
            path: 'system',
            icon: 'mdi-cog'
          }
        ]
      }
    },
    methods: {
      onMenuItemClick(path) {
        this.$router.push(`/settings/${path}`)
      }
    }
  }
</script>

<style lang="scss">
  .func-list {
    font-size: 1px !important;

    .v-list-item {
      .v-list-item__icon {
        margin-right: 16px !important;
      }
    }
  }
</style>
