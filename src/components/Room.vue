<template lang="html">
  <div class="notification">
    <h1>{{room}}</h1>
  </div>
</template>

<script>
export default {
  name: 'Room',
  props: ['room']
}
</script>

<style lang="css">
.notification{
  background: yellow;
}
</style>
