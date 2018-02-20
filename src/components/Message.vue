<template>
  <div class="notification">
    <h1>{{message}}</h1>
    <h2>Hello </h2>
  </div>
</template>

<script>
import Vue from 'vue'
import VueSocketio from 'vue-socket.io'
Vue.use(VueSocketio, 'ws://localhost:5000')

  export default {
    name: 'Message',
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
    background: red;
  }
</style>
