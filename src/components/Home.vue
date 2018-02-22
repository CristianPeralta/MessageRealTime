<template>
  <div class="">
    <nav class="navbar topNav">
      <div class="container">
        <div id="topNav" class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item">
              Home
            </a>
          </div>
          <div class="navbar-end">
            <div @click="menuActive()" class="navbar-item has-dropdown" :class="{'is-active':menu}">
              <a class="navbar-link">
                <img height="40" width="40" :src="user.photo">
                {{user.username}}
              </a>

              <div class="navbar-dropdown is-right">
                <a class="navbar-item">
                  Profile
                </a>
                <a @click="logout()" class="navbar-item">
                  Logut
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <section class="container" >
      <div class="columns" style="margin-left : 3rem; margin-top : 0px;">
        <div class="column is-3">
          <aside class="menu">
            <p class="menu-label">
              Channels
            </p>
            <ul class="menu-list">
              <li><a>Health</a></li>
              <li><a>Games</a></li>
              <li><a>Sports</a></li>
              <li><a>Music</a></li>
              <li><a>Love</a></li>
              <li><a>IT</a></li>
            </ul>
          </aside>
        </div>
        <div class="column is-9">
          <div class="box content">
            <article class="post">
              <div class="media">
                <div class="media-left">
                  <p class="image is-32x32">
                    <img src="http://api.ning.com/files/4qC6IxZw6coW7mUAhW-EKAZCoX5am7ZInUpgDcnIryjDDypUMgccQe9WaMbCmVQwmod9BEraCpUKvFhG8DDzw2C3xKf0j2L5/Pictures_0328.jpg?width=32&height=32&crop=1%3A1">
                  </p>
                </div>
                <div class="media-content">
                  <div class="content">
                    <p>
                      <a href="#">Hannah Rooser</a> 5 minutes ago  &nbsp;
                    </p>
                  </div>
                </div>
              </div>
              <h4>Hello Guys :D</h4>
            </article>
            <article class="post">
              <div class="media">
                <div class="media-left">
                  <p class="image is-32x32">
                    <img src="https://yt3.ggpht.com/-fwIKW9Sy0-A/AAAAAAAAAAI/AAAAAAAAAAA/NhRCHRmu9Yo/s32-c-k-no-mo-rj-c0xffffff/photo.jpg">
                  </p>
                </div>
                <div class="media-content">
                  <div class="content">
                    <p>
                      <a href="#">John Connor</a> 2 minutes ago  &nbsp;
                    </p>
                  </div>
                </div>
              </div>
              <h4>Hello Hannah</h4>
            </article>
            <article class="post">
              <div class="media">
                <div class="media-left">
                  <p class="image is-32x32">
                    <img :src="user.photo">
                  </p>
                </div>
                <div class="media-content">
                  <div class="content">
                    <p>
                      <a href="#">You ({{user.username}})</a> &nbsp;
                    </p>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <textarea class="textarea is-large" type="text" placeholder="Your message"></textarea>
                </div>
              </div>
              <div class="control">
                <button class="button is-primary">Submit</button>
              </div>
            </article>
          </div>
        </div>

      </div>
    </section>
    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p>
            <strong>Bulma Templates</strong> by <a href="https://github.com/dansup">Daniel Supernault</a>. The source code is licensed
            <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
          </p>
          <p>
            <a class="icon" href="https://github.com/dansup/bulma-templates">
              <i class="fa fa-github"></i>
            </a>
          </p>
        </div>
      </div>
    </footer>

  </div>

</template>

<script>
import Vue from 'vue'
import VueSocketio from 'vue-socket.io'
import ChatServices from '@/services/ChatServices'
Vue.use(VueSocketio, 'ws://localhost:5000')

  export default {
    name: 'Message',
    data(){
      return {
        message: 'Hello World',
        user: {},
        menu: false
      }
    },
    sockets: {
      connect () {
        console.log('socket connected')
      },
      customEmit (val) {
        console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
      }
    },
    created () {
      this.getUser()
    },
    methods: {
      getUser () {
        ChatServices.user().then((response) => {
          console.log(response);
          this.user = response.data;
        });
      },
      logout() {
        ChatServices.logout() .then((response) => {
          this.$router.push({ name: 'Login'});
        });
      },
      menuActive() {
        this.menu = !this.menu
      }
    }
  }
</script>
<style >
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
@import 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,700';
@import 'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.0/css/bulma.min.css';
html,body {
  font-family: 'Open Sans', serif;
  background: #F2F6FA;
}
footer {
  background-color: #F2F6FA !important;
}
.topNav {
  border-top: 5px solid #3498DB;
}
.topNav .container {
  border-bottom: 1px solid #E6EAEE;
}
.container .columns {
  margin: 3rem 0;
}
.navbar-menu .navbar-item {
  padding: 0 2rem;
}
aside.menu {
  padding-top: 3rem;
}
aside.menu .menu-list {
  line-height: 1.5;
}
aside.menu .menu-label {
  padding-left: 10px;
  font-weight: 700;
}
.button.is-primary.is-alt {
  background: #00c6ff;
  background: -webkit-linear-gradient(to bottom, #0072ff, #00c6ff);
  background: linear-gradient(to bottom, #0072ff, #00c6ff);
  font-weight: 700;
  font-size: 14px;
  height: 3rem;
  line-height: 2.8;
}
.media-left img {
  border-radius: 50%;
}
.media-content p {
  font-size: 14px;
  line-height: 2.3;
  font-weight: 700;
  color: #8F99A3;
}
article.post {
  margin: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #E6EAEE;
}
article.post:last-child {
  padding-bottom: 0;
  border-bottom: none;
}
</style>
