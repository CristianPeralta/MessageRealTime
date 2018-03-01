<template lang="html">
  <nav class="navbar topNav" style="position: sticky; top:0; z-index:100;">
      <div class="container">
        <div id="topNav" class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item">
              {{room}}
            </a>
          </div>
          <div class="navbar-end">
            <div @click="menuActive()" class="navbar-item has-dropdown" :class="{'is-active':menu}">
              <a class="navbar-link">
                <p class="image is-32x32" style="margin-right:10px;">
                  <img style="border-radius: 50%;" height="32" width="32" :src="user.photo">
                </p>
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
</template>

<script>
import ChatServices from '@/services/ChatServices'
export default {
  name: 'Navbar',
  props: ['user', 'room'],
  data () {
    return {
      menu: false
    }
  },
  methods: {
    menuActive() {
      this.menu = !this.menu
    },
    logout() {
      ChatServices.logout() .then((response) => {
        this.$parent.$socket.emit('userDisconnect', {
          user: this.$parent.user,
          room: this.$parent.room.slug
        });
        this.$router.push({ name: 'Login'});
      });
    }
  }
}
</script>

<style>
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
