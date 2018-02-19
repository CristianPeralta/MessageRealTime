<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data(){
      return {
        message: 'Hello World'
      }
    }
  }
</script>
<style lang="scss">
  .notification{
    background: red;
  }
</style>
