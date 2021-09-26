<template>
  <a :href="link">
    <v-card link>
      <v-img 
        :src="image" 
        max-height="180"
        gradient="to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, .5)"
      >
        <v-app-bar
          flat
          color="rgba(0, 0, 0, 0)"
        >
          <v-toolbar-title>
            <v-icon>mdi-eye</v-icon>
            {{ name }}
          </v-toolbar-title>
        </v-app-bar>
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
    link: String
  }
}
</script>