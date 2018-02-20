<template>
  <div id="app">
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>
<style lang="scss">
  .container{
    margin:0;
    padding: 0;
  }
  .notification{
    background: red;
  }
</style>
