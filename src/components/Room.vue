<template lang="html">
  <div class="">
    <section class="container">
      <div class="columns" style="margin-left : 3rem; margin-top : 0px;">
      <RoomList></RoomList>
        <div class="container has-text-centered">
          <div class="column is-4 is-offset-4">
            <h3 class="title has-text-grey" style="margin-top : 40px;" >Sign Up</h3>
            <div class="box">
                <div class="field">
                  <div class="control">
                    <input class="input is-large" type="text" v-model="newRoom" placeholder="New Room" autofocus="">
                  </div>
                </div>
                <button @click="sendForm()" class="button is-block is-info is-large is-fullwidth">Add</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Navbar from '@/components/utils/Navbar'
import Footer from '@/components/utils/Footer'
import RoomList from '@/components/utils/RoomList'
import ChatServices from '@/services/ChatServices'

export default {
  name: 'RoomExample',
  props: ['room'],
  data () {
    return {
      newRoom: '',
      rooms: []
    }
  },
  components:{
    Navbar,
    RoomList,
    Footer
  },
  created() {
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
    }
  }
}
</script>

<style lang="css">
@import '../assets/css/styles.css';

</style>
