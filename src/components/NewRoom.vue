<template lang="html">
  <div class="">
    <section class="container">
      <div class="columns" style="margin-left : 3rem; margin-top : 0px;">>
        <div class="container has-text-centered">
          <div class="column is-4 is-offset-4">
            <h3 class="title has-text-grey" style="margin-top : 40px;" >NewRoom</h3>
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
import ChatServices from '@/services/ChatServices'

export default {
  name: 'NewRoom',
  props: ['room'],
  data () {
    return {
      newRoom: '',
      rooms: []
    }
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
    }
  }
}
</script>

<style lang="css">
</style>
