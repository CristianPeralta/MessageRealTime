<template lang="html">
  <div class="column is-3" style="z-index:80;">
    <aside class="menu">
      <p class="menu-label">
        Channels
      </p>
      <ul class="menu-list">
        <li v-for="(room, index) in rooms" :key="index"><a>{{room.name}}</a></li>
      </ul>
    </aside>
  </div>
</template>

<script>
export default {
  name: 'MenuList',
  props: ['rooms']
}
</script>

<style lang="css">
</style>
