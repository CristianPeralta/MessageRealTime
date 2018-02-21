<template>
  <div class="notification">
    <img height="128" width="128" :src="user.photo" alt="">
    <h2>Hello {{user.username}}</h2>
  </div>
</template>

<script>
import Vue from 'vue'
import VueSocketio from 'vue-socket.io'
Vue.use(VueSocketio, 'ws://localhost:5000')

  export default {
    name: 'Message',
    props: [
      'user'
    ],
    data(){
      return {
        message: 'Hello World'
      }
    },
    sockets: {
      connect () {
        console.log('socket connected')
      },
      customEmit (val) {
        console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
      }
    }
  }
</script>
<style lang="scss">
  .notification{
    background: yellow;
  }
</style>
