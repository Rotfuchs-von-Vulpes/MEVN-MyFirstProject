<template>
  <a :href="link" target="_blank">
    <v-card link outlined>
      <v-img 
        :src="image" 
        max-height="180"
        gradient="to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, .5)"
      >
        <v-container>
          <v-toolbar-title>
            <v-icon>mdi-eye</v-icon>
            {{ name }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-card-subtitle>
            {{ type }}
          </v-card-subtitle>
        </v-container>
      </v-img>
    </v-card>
  </a>
</template>

<script>
export default {
  name: 'site',
  props: {
    name: String,
    image: String,
    link: String,
    type: String
  }
}
</script>