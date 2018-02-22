<template lang="html">
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
</template>

<script>
import ChatServices from '@/services/ChatServices'
export default {
  name: 'Navbar',
  props: ['user'],
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
        this.$router.push({ name: 'Login'});
      });
    }
  }
}
</script>

<style>

</style>
