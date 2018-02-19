<template>
  <div id="app">
    <div class="container">
      <router-view></router-view>
    </div>
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
