<template lang="html">
  <section class="hero is-success is-fullheight container">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4">
          <h3 class="title has-text-grey">Login</h3>
          <p v-model="session.username"></p>
          <p class="subtitle has-text-grey">Please login to proceed.</p>
          <div class="box">
            <figure class="avatar">
              <img height="128" width="128" src='https://www.viniloscasa.com/img/message.png'>
            </figure>
              <div class="field">
                <div class="control">
                  <input class="input is-large" v-model="email" type="email" placeholder="Your Email" autofocus="">
                </div>
              </div>

              <div class="field">
                <div class="control">
                  <input class="input is-large" v-model="password" type="password" placeholder="Your Password">
                </div>
              </div>
              <button class="button is-block is-info is-large is-fullwidth" @click="login()">Login</button>
          </div>
          <p class="has-text-grey">
            <router-link to="/signup" exact>
              <a>Sign Up</a> &nbsp;·&nbsp;
            </router-link>
            <a href="../">Need Help?</a>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ChatServices from '@/services/ChatServices'

export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: '',
      session: {}
    }
  },
  created () {
    this.getUser(this.checkUser)
  },
  methods: {
    checkUser () {
      if (this.session.username) {
        this.$router.push({name: 'Room', params: {initialRoom: 'home'}});
      }
    },
    login () {
      ChatServices.login({
        email: this.email,
        password: this.password
      }).then((response) =>{
        let user = response.data;
        this.$router.push({ name: 'Room', params: {initialRoom: 'home'}})
      })
    },
    getUser (cb) {
      ChatServices.user().then((response) => {
        this.session = response.data;
        cb();
      });
    },
  }
}
</script>

<style>
  html,body {
    font-family: 'Open Sans', serif;
    font-size: 14px;
    font-weight: 300;
  }
  .container{
  }
  .hero.is-success {
    background: #F2F6FA;
  }
  .hero .nav, .hero.is-success .nav {
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  .box {
    margin-top: 5rem;
  }
  .avatar {
    margin-top: -70px;
    padding-bottom: 20px;
  }
  .avatar img {
    padding: 5px;
    background: #fff;
    border-radius: 50%;
    -webkit-box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);
    box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);
  }
  input {
    font-weight: 300;
  }
  p {
    font-weight: 700;
  }
  p.subtitle {
    padding-top: 1rem;
  }
</style>
