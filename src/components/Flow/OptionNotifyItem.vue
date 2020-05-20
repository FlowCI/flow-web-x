<template>
  <v-card max-width="400" class="notify-plugin">
    <v-card-title>
      <v-icon large left>
        mdi-twitter
      </v-icon>
      <span class="title">{{ wrapper.name }}</span>
      <v-spacer></v-spacer>

      <span class="subtitle-2">{{ wrapper.version }}</span>
      <v-btn icon :href="wrapper.source" target="_blank">
        <v-icon small>mdi-link</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-subtitle>
      {{ wrapper.desc }}
    </v-card-subtitle>

    <v-card-text>
      <v-row class="plugin-input">
        <v-col v-for="input in wrapper.inputs" :key="input.name" cols="12">
          <v-text-field :label="input.name" dense></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-switch class="mx-2"></v-switch>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: "OptionNotifyItem",
    props: {
      wrapper: {
        required: true,
        type: Object
      }
    }
  }
</script>

<style lang="scss">
  .notify-plugin {
    .v-label {
      font-size: 12px;
    }

    .v-input--selection-controls {
      margin-top: 0 !important;
      padding-top: 0 !important;
    }

    .v-card__actions {
      padding-top: 0 !important;
      padding-bottom: 0 !important;
    }

    .v-subheader {
      padding: 0;
    }

    .v-input {
      font-size: 14px
    }

    .plugin-input {
      .col {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }
    }
  }
</style>
