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
import ChatServices from '@/services/ChatServices'

export default {
  name: 'MenuList',
  data () {
    return {
      rooms: []
    }
  },
  created () {
    this.getRooms();
  },
  methods: {
    getRooms () {
      ChatServices.getRooms().then((response) => {
          this.rooms = response.data;
      })
    }
  }
}
</script>

<style lang="css">
</style>
