<template lang="html">
  <div class="column is-3" style="z-index:80;">
    <aside class="menu">
      <p class="menu-label">
        Channels
      </p>
      <ul class="menu-list">
        <li v-for="(room, index) in rooms" :key="index">
          <a @click="goRoom(room.slug)">{{room.name}}</a>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script>
import ChatServices from '@/services/ChatServices'

export default {
  name: 'RoomList',
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
    },
    goRoom( room ){
      this.$router.push({name: 'Room', params: {initialRoom: room}});
    }
  }
}
</script>

<style lang="css">
</style>
