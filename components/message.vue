<template>
<div class="notification">
  <h1>{{message}}</h1>
</div>
</template>

<script>
  export default {
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
