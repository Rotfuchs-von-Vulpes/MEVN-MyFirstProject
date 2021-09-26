<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
    <v-avatar>
      <v-img src="../public/Images/fox1.jpg"></v-img>
    </v-avatar>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col
            v-for="(site, key) in sites"
            :key="key"
            class="col-md-6 col-lg-4 col-12"
          >
            <site 
              :name="site.name" 
              :image="site.image"
              :link="site.link"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'

import Site from './components/site.vue'

export default {
  name: 'App',
  components: {
    Site
  },
  methods: {
    getUrl: function(pic) {
      var images = require.context('../public/', false, /\.png$/)
      return images(pic)
    }
  },
  data: () => ({
    image: '../public/Images/fox1.jpg',
    sites: [
      {
        name: "Bolinhas",
        image: "https://rotfuchs-von-vulpes.github.io/CanvasWeb/Images/bolinhasK.png",
        link: "https://rotfuchs-von-vulpes.github.io/CanvasWeb/JavaScript/bolinhas/index.html",
        type: "Plano de fundo",
      },
      {
        name: "Conjuntos júlia",
        image: "https://rotfuchs-von-vulpes.github.io/CanvasWeb/Images/juliaK.png",
        link: "https://rotfuchs-von-vulpes.github.io/CanvasWeb/JavaScript/julia/index.html",
        type: "Fractal",
      },
      {
        name: "Du bist eine Fuchs",
        image: "https://rotfuchs-von-vulpes.github.io/CanvasWeb/Images/foxgameK.png",
        link: "https://rotfuchs-von-vulpes.github.io/CanvasWeb/JavaScript/foxGame/index.html",
        type: "Jogo",
      },
      {
        name: "Formiga de Langton",
        image: "https://rotfuchs-von-vulpes.github.io/CanvasWeb/Images/formigadeLangtonK.png",
        link: "https://rotfuchs-von-vulpes.github.io/CanvasWeb/JavaScript/formigaDeLangton/index.html",
        type: "Autômato celular",
      },
      {
        name: "Fractal Mandelbrot",
        image: "https://rotfuchs-von-vulpes.github.io/CanvasWeb/Images/mandelbrotK.png",
        link: "https://rotfuchs-von-vulpes.github.io/CanvasWeb/JavaScript/Mandelbrot/index.html",
        type: "Fractal",
      },
      {
        name: "Labirinto Procedural",
        image: "https://rotfuchs-von-vulpes.github.io/CanvasWeb/Images/mazeK.png",
        link: "https://rotfuchs-von-vulpes.github.io/CanvasWeb/JavaScript/maze/index.html",
        type: "Autômato celular",
      },
      {
        name: "Labirinto Procedural Instantâneo",
        image: "https://rotfuchs-von-vulpes.github.io/CanvasWeb/Images/maze2K.png",
        link: "https://rotfuchs-von-vulpes.github.io/CanvasWeb/JavaScript/maze2/index.html",
        type: "Autômato celular",
      },
    ],
  }),
  mounted() {
    try {
      axios
        .get("http://localhost:3001")
        .then((res) => {
          console.log(res.data);
        });
    } catch(err) {
      console.log(err);
    }
  }
};
</script>
