<template>
  <v-app>
    <v-toolbar color="orange darken-3" fixed app>
      <v-toolbar-title>Vulpes Drawings</v-toolbar-title>
      <template v-slot:extension>
        <v-tabs v-model="tab" color="white">
          <v-tabs-slider color="white"></v-tabs-slider>

          <v-tab v-for="item in items" :key="item" color="white">
            {{ item }}
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-container fluid fill-width>
        <v-tabs-items v-model="tab" style="">
          <v-tab-item>
            <v-main>
              <v-container fluid>
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
                      :type="site.type"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-main>
          </v-tab-item>
          <v-tab-item>
            <v-container>
              <v-alert
                v-if="message.show"
                border="left"
                dense
                text
                :type="['error', 'success'][+message.type]"
                elevation="5"
              >
                {{ message.content }}
              </v-alert>
              <v-alert
                v-if="!logged"
                border="left"
                dense
                text
                type="info"
                elevation="5"
              >
                Para poder comentar, fazer login.
              </v-alert>
              <v-card outlined v-if="logged" :loading="comment.loading">
                <v-card-text>
                  <v-form
                    ref="commentform"
                    v-model="comment.valid"
                    lazy-validation
                  >
                    <v-textarea
                      label="Commentário"
                      v-model="comment.text"
                      required
                    ></v-textarea>
                    <v-btn
                      color="success"
                      :disabled="!comment.valid"
                      class="mr-4"
                      @click="commentUp()"
                    >
                      Enviar
                    </v-btn>
                  </v-form>
                </v-card-text>
              </v-card>
              <v-alert
                v-for="(comment, num) in comments"
                :key="num"
                border="bottom"
                colored-border
                color="orange darken-3"
                elevation="5"
              >
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-text class="text-h5 mb-1">
                      {{ comment.text }}<br />
                    </v-list-item-text>
                    <v-list-item-subtitle>
                      <p class="text-h8 text--primary">by {{ comment.user }}</p>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-alert>
            </v-container>
          </v-tab-item>
          <v-tab-item>
            <v-container>
              <v-card
                outlined
                v-if="!logged"
                :loading="register.loading"
                fill-width
              >
                <v-tabs v-model="accountTab">
                  <v-tabs-slider></v-tabs-slider>

                  <v-tab> Logar </v-tab>
                  <v-tab> Registrar </v-tab>
                </v-tabs>
                <v-tabs-items v-model="accountTab">
                  <v-tab-item>
                    <v-container>
                      <v-form
                        ref="loginForm"
                        v-model="login.valid"
                        lazy-validation
                      >
                        <v-text-field
                          label="Email"
                          v-model="login.email"
                          :rules="[(v) => !!v || 'Email em branco']"
                          required
                        ></v-text-field>
                        <v-text-field
                          label="Senha"
                          type="password"
                          v-model="login.pass"
                          :rules="[(v) => !!v || 'Senha em branco']"
                          required
                        ></v-text-field>
                        <v-btn
                          color="success"
                          :disabled="!login.valid"
                          class="mr-4"
                          @click="loginUp()"
                        >
                          Logar
                        </v-btn>
                      </v-form>
                    </v-container>
                  </v-tab-item>
                  <v-tab-item>
                    <v-container>
                      <v-form
                        ref="registerForm"
                        v-model="register.valid"
                        lazy-validation
                      >
                        <v-text-field
                          label="Nome"
                          v-model="register.name"
                          :rules="[
                            (v) => !!v || 'Nome em branco',
                            (v) => v.length >= 3 || 'Minimo 3 caracteres',
                          ]"
                          required
                        ></v-text-field>
                        <v-text-field
                          label="Email"
                          v-model="register.email"
                          :rules="[
                            (v) => !!v || 'Email em branco',
                            (v) => v.length >= 3 || 'Minimo 3 caracteres',
                          ]"
                          required
                        ></v-text-field>
                        <v-text-field
                          label="Senha"
                          type="password"
                          v-model="register.pass1"
                          :rules="[
                            (v) => !!v || 'Senha em branco',
                            (v) => v.length >= 6 || 'Minimo 6 caracteres',
                          ]"
                          required
                        ></v-text-field>
                        <v-text-field
                          label="Repetir a senha"
                          type="password"
                          v-model="register.pass2"
                          :rules="[
                            (v) => !!v || 'Senha em branco',
                            (v) => v.length >= 6 || 'Minimo 6 caracteres',
                            (v) =>
                              v === register.pass1 ||
                              'senha diferente da anterior',
                          ]"
                          required
                        ></v-text-field>
                        <v-btn
                          color="green"
                          class="mr-4"
                          :disabled="!register.valid"
                          @click="registerUp()"
                        >
                          Registrar
                        </v-btn>
                        <v-btn
                          color="red"
                          class="mr-4"
                          @click="resetRegister()"
                        >
                          Resetar
                        </v-btn>
                      </v-form>
                    </v-container>
                  </v-tab-item>
                </v-tabs-items>
              </v-card>
              <v-alert
                v-if="message.show"
                border="left"
                dense
                text
                :type="['error', 'success'][+message.type]"
                elevation="5"
              >
                {{ message.content }}
              </v-alert>
              <v-card v-if="logged" outlined :loading="register.loading">
                <v-card-text>
                  <p class="text-h4 text--primary">
                    Bem vindo {{ user.name }}!
                  </p>
                  <div>Informações da conta:</div>
                  <p v-if="!editing">
                    <strong>Nome: </strong> {{ user.name }}<br />
                    <strong>Email: </strong> {{ user.email }}<br />
                  </p>
                  <v-form
                    ref="editForm"
                    v-if="editing"
                    v-model="edit.valid"
                    lazy-validation
                  >
                    <v-text-field
                      label="Nome"
                      v-model="edit.name"
                      :rules="[
                        (v) => !!v || 'Nome em branco',
                        (v) => v.length >= 3 || 'Minimo 3 caracteres',
                      ]"
                      required
                    ></v-text-field>
                    <v-text-field
                      label="Senha"
                      type="password"
                      v-model="edit.pass1"
                      :rules="[
                        (v) => !!v || 'Senha em branco',
                        (v) => v.length >= 6 || 'Minimo 6 caracteres',
                      ]"
                      required
                    ></v-text-field>
                    <v-text-field
                      label="Repetir a senha"
                      type="password"
                      v-model="edit.pass2"
                      :rules="[
                        (v) => !!v || 'Senha em branco',
                        (v) => v.length >= 6 || 'Minimo 6 caracteres',
                        (v) =>
                          v === edit.pass1 || 'senha diferente da anterior',
                      ]"
                      required
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions v-if="!editing">
                  <v-btn color="success" @click="editToggle()"> Editar </v-btn>
                  <v-btn color="error" @click="logout()"> Deslogar </v-btn>
                </v-card-actions>
                <v-card-actions v-if="editing">
                  <v-btn
                    color="success"
                    :disabled="!edit.valid"
                    @click="editup()"
                  >
                    Editar
                  </v-btn>
                  <v-btn color="error" @click="resetEdit()"> Resetar </v-btn>
                </v-card-actions>
              </v-card>
            </v-container>
          </v-tab-item>
          <v-tab-item>
            <v-container> Rotfuchs </v-container>
          </v-tab-item>
        </v-tabs-items>
    </v-container>
    <v-container fill-height></v-container>
  </v-app>
</template>

<script>
import api from './api.js';

import Site from './components/site.vue';

export default {
  name: 'App',
  components: {
    Site,
  },
  methods: {
    commentUp() {
      let data = {
        user: this.user.id,
        pass: this.user.pass,
        text: this.comment.text,
      };

      this.comment.loading = true;

      api
        .post('/comment', data)
        .then((res) => {
          let data = res.data;

          console.log(data);

          this.showMessage(data.success, data.message);
          this.comment.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.comment.loading = false;

          this.showMessage(false, 'Algo deu errado...');
        });

      console.log(data);
      this.comments.unshift({ text: data.text, user: this.user.name });
    },
    editup() {
      let data = {
        id: this.user.id,
        name: this.edit.name,
        oldPass: this.user.pass,
        newPass: this.edit.pass1,
      };

      this.edit.loading = true;

      api
        .post('/edit', data)
        .then((res) => {
          let report = res.data;

          console.log(report);

          this.user.name = data.name;
          this.user.pass = data.newPass;
          localStorage.name = data.name;
          localStorage.pass = data.newPass;
          this.editToggle();
          if (report.success) this.accountTab = 0;
          this.showMessage(report.success, report.message);
          this.edit.loading = false;
        })
        .catch((err) => {
          console.error(err.response.data);
          this.showMessage(false, 'Algo deu errado...');
        });
    },
    resetEdit() {
      this.edit.name = this.user.name;
      this.edit.pass1 = this.user.pass;
      this.edit.pass2 = this.user.pass;
    },
    editToggle() {
      this.editing = !this.editing;
      if (this.editing) {
        this.edit.name = this.user.name;
        this.edit.pass1 = this.user.pass;
        this.edit.pass2 = this.user.pass;
      }
    },
    resetRegister() {
      this.$refs.registerForm.reset();
      this.register.name = '';
      this.register.email = '';
      this.register.pass1 = '';
      this.register.pass2 = '';
    },
    showMessage(type, contend) {
      this.message.show = true;
      this.message.type = type;
      this.message.content = contend;
    },
    registerUp() {
      let data = {
        name: this.register.name,
        email: this.register.email,
        password: this.register.pass1,
      };

      this.register.loading = true;
      this.$refs.registerForm.validate();

      api
        .post('/register', data)
        .then((res) => {
          let data = res.data;
          console.log(data);
          if (data.success) this.accountTab = 0;
          this.showMessage(data.success, data.message);
          this.register.loading = false;
        })
        .catch((err) => {
          console.error(err.response.data);
          this.showMessage(false, 'Algo deu errado...');
        });
    },
    setStorage() {
      this.logged = localStorage.logged === 'true' ? true : false;
      this.user.id = localStorage.id;
      this.user.email = localStorage.email;
      this.user.name = localStorage.name;
      this.user.pass = localStorage.password;
    },
    populateStorage() {
      this.logged = false;
      this.user.id = '';
      this.user.email = '';
      this.user.name = '';
      this.user.pass = '';
    },
    logout() {
      this.populateStorage();
      this.message.show = false;
      localStorage.logged = false;
      localStorage.id = '';
      localStorage.email = '';
      localStorage.name = '';
      localStorage.password = '';
    },
    loginUp() {
      let data = {
        email: this.login.email,
        password: this.login.pass,
      };
      this.register.loading = true;
      this.$refs.loginForm.validate();
      api
        .post('/login', data)
        .then((res) => {
          console.log(res.data);
          this.showMessage(res.data.success, res.data.message);
          this.register.loading = false;

          if (res.data.success) {
            this.logged = true;
            this.user.id = res.data.data._id;
            this.user.email = res.data.data.email;
            this.user.name = res.data.data.name;
            this.user.pass = data.password;
            localStorage.logged = this.logged;
            localStorage.id = this.user.id;
            localStorage.email = this.user.email;
            localStorage.name = this.user.name;
            localStorage.password = this.user.pass;
            this.login.email = '';
            this.login.pass = '';
          }
        })
        .catch((err) => {
          console.error(err);
          console.error(err.response.data);
        });
    },
    getComments() {
      api
        .get('/comment')
        .then((res) => {
          res.data.forEach(async (comment) => {
            let data = { text: comment.text };

            await api.post('/user', { id: comment.user }).then((res) => {
              data.user = res.data.name;
            });

            this.comments.push(data);
          });
        })
        .catch((err) => {
          console.log(err);
          this.showMessage(false, 'Falha ao carregar comentários.');
        });
      console.log(this.comments);
    },
    storage() {
      if (localStorage.logged) {
        this.setStorage();
      } else {
        this.populateStorage();
      }
    },
    connect() {
      api
        .get('/')
        .then((res) => {
          console.log(res.data);
          this.backendErronead = false;
          api.get('/databaseStatus').then((res) => {
            console.log(res.data);
            if (!res.data.databaseStatus) {
              this.showMessage(
                false,
                'Não foi possivel se conectar ao banco de dados.'
              );
            } else {
              this.getComments();
            }
          });
        })
        .catch((err) => {
          console.log(err);
          this.showMessage(
            false,
            'Não foi possivel se conectar com o servidor.'
          );
        });
    },
  },
  data: () => ({
    tab: 3,
    accountTab: 0,
    items: ['Sites', 'Comentários', 'Conta', 'Sobre'],
    form: null,
    loginForm: null,
    login: {
      email: '',
      pass: '',
      valid: false,
    },
    registerForm: null,
    register: {
      name: '',
      email: '',
      pass1: '',
      pass2: '',
      valid: false,
      loading: false,
    },
    message: {
      show: false,
      type: null,
      content: null,
    },
    user: {
      id: '',
      email: '',
      name: '',
      pass: '',
    },
    logged: false,
    editing: false,
    editForm: null,
    edit: {
      name: '',
      pass1: '',
    },
    commentform: null,
    comment: {
      text: '',
      valid: false,
      loading: false,
    },
    comments: [],
    sites: [
      {
        name: 'Bolinhas',
        image: 'http://localhost:3000/Images/bolinhasK.png',
        link:
          'https://rotfuchs-von-vulpes.github.io/CanvasWeb/JavaScript/bolinhas/index.html',
        type: 'Plano de fundo',
      },
      {
        name: 'Conjuntos júlia',
        image: 'http://localhost:3000/Images/juliaK.png',
        link:
          'https://rotfuchs-von-vulpes.github.io/CanvasWeb/JavaScript/julia/index.html',
        type: 'Fractal',
      },
      {
        name: 'Du bist eine Fuchs',
        image: 'http://localhost:3000/Images/foxgameK.png',
        link:
          'https://rotfuchs-von-vulpes.github.io/CanvasWeb/JavaScript/foxGame/index.html',
        type: 'Jogo',
      },
      {
        name: 'Formiga de Langton',
        image: 'http://localhost:3000/Images/formigadeLangtonK.png',
        link:
          'https://rotfuchs-von-vulpes.github.io/CanvasWeb/JavaScript/formigaDeLangton/index.html',
        type: 'Autômato celular',
      },
      {
        name: 'Fractal Mandelbrot',
        image: 'http://localhost:3000/Images/mandelbrotK.png',
        link:
          'https://rotfuchs-von-vulpes.github.io/CanvasWeb/JavaScript/Mandelbrot/index.html',
        type: 'Fractal',
      },
      {
        name: 'Labirinto Procedural',
        image: 'http://localhost:3000/Images/mazeK.png',
        link:
          'https://rotfuchs-von-vulpes.github.io/CanvasWeb/JavaScript/maze/index.html',
        type: 'Autômato celular',
      },
      {
        name: 'Labirinto Procedural Instantâneo',
        image: 'http://localhost:3000/Images/maze2K.png',
        link:
          'https://rotfuchs-von-vulpes.github.io/CanvasWeb/JavaScript/maze2/index.html',
        type: 'Autômato celular',
      },
    ],
  }),
  mounted() {
    this.connect();
    this.storage();
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
