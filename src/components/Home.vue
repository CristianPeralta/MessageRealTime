<template>
  <div class="">
    <Navbar :user="user"></Navbar>
    <section class="container" >
      <div class="columns" style="margin-left : 3rem; margin-top : 0px;">
        <MenuList></MenuList>
        <div class="column is-9">
          <div class="box content">

            <Message v-for="(message,index) in messages" :user="message.user" :from="message.createdAt"  :key="index">
                {{message.text}}
            </Message>

            <Message :user="user">
              <textarea v-model="text" class="textarea is-large" type="text" placeholder="Your message"></textarea>
              <div class="control">
                <button @click="addMessage()" class="button is-primary">Submit</button>
              </div>
            </Message>
            
          </div>
        </div>
      </div>
    </section>
    <Footer></Footer>
  </div>

</template>

<script>
import Vue from 'vue'
import VueSocketio from 'vue-socket.io'
import Navbar from '@/components/utils/Navbar'
import Footer from '@/components/utils/Footer'
import MenuList from '@/components/utils/MenuList'
import Message from '@/components/Message'
import ChatServices from '@/services/ChatServices'

Vue.use(VueSocketio, 'ws://localhost:5000')

  export default {
    name: 'Home',
    data(){
      return {
        messages: [],
        user: {},
        text: ''
      }
    },
    components:{
      Navbar,
      MenuList,
      Footer,
      Message
    },
    sockets: {
      connect () {
        console.log('socket connected')
      },
      customEmit (val) {
        console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
      }
    },
    created () {
      this.getUser();
      this.getMessages()
    },
    methods: {
      getUser () {
        ChatServices.user().then((response) => {
          this.user = response.data;
        });
      },
      getMessages () {
        ChatServices.getMessages().then((response) => {
          this.messages = response.data;
        })
      },
      addMessage () {
        ChatServices.addMessage({
          user: this.user._id,
          text: this.text
        }).then((response) => {
          this.messages.push(response.data);
          this.$router.go();
        })
      }
    }
  }
</script>
<style >
@import '../assets/css/styles.css';

</style>
