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
      <p class="menu-label">
        New Room
      </p>
      <ul class="menu-list">
        <input class="input" type="text" v-model="newRoom" placeholder="New Room">
        <button @click="sendForm()" class="button is-block is-info is-fullwidth">Add</button>
      </ul>
      <slot></slot>
    </aside>
  </div>
</template>

<script>
import ChatServices from '@/services/ChatServices'

export default {
  name: 'RoomList',
  data () {
    return {
      newRoom: '',
      rooms: []
    }
  },
  created () {
    this.getRooms();
  },

  methods: {
    sendForm () {
      ChatServices.addRoom({
        name: this.newRoom
      }).then((response) => {
          this.rooms.push(response.data)
          console.log(response.data);
          this.newRoom = '';
      })
    },
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
