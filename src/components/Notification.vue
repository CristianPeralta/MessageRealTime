<template>
<div class="notification">
  <h1>{{data}}</h1>
</div>
</template>

<script>
  export default {
    name: 'Notification',
    data(){
      return {
        data: 'This is a component Notification'
      }
    }
  }
</script>
<style lang="scss">
  .notification{
    background: yellow;
  }
</style>
