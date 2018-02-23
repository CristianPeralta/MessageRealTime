<template>
  <div class="">
    <Navbar :user="user"></Navbar>
    <section class="container">
      <div class="columns" style="margin-left : 3rem; margin-top : 0px;">
        <MenuList></MenuList>
        <div class="column is-9" >
          <div ref="chatbox" class="box content" style="overflow-y: scroll; height:530px; z-index:80;">
            <button @click="chatPosition()" class="button is-primary">Write</button>
            <Message v-for="(message,index) in messages" :user="message.user" :from="message.createdAt"  :key="index">
                {{message.text}}
            </Message>

            <Message :user="user" tabindex="0">
              <textarea v-model="text" class="textarea is-large" type="text" placeholder="Your message"></textarea>
              <div class="control">
                <button @click="addMessageSocket()" class="button is-primary">Submit</button>
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
        text: '',
        isLoad : false
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
      },
      messageAdded (response) {
        if (response.ok) {
          this.messages.push(response.data);
          this.chatPosition();
          this.clear();
        } else {
          console.log(response.err);
        }
      },
      messagesGetted (response) {
        if (response.ok) {
          this.messages = response.data;
          this.isLoad = true;
        } else {
          console.log(response.err);
        }
      }
    },
    created () {
      this.getUser();
      this.getMessagesSocket();
    },
    mounted() {
      this.chatPosition();
    },
    methods: {
      chatPosition () {
        if (this.isLoad == true) {
          let chat = this.$refs.chatbox;
          chat.scrollTop = chat.scrollHeight;
        }
      },
      clear () {
        this.text = '';
      },
      getUser () {
        ChatServices.user().then((response) => {
          this.user = response.data;
        });
      },
      getMessages () {
        ChatServices.getMessages().then((response) => {
          this.messages = response.data;
          this.isLoad = true;
        })
      },
      getMessagesSocket () {
        this.$socket.emit('getMessages');
      },
      addMessage () {
        ChatServices.addMessage({
          user: this.user._id,
          text: this.text
        }).then((response) => {
          this.messages.push(response.data);
          this.$router.go();
        })
      },
      addMessageSocket () {
        this.$socket.emit('addMessage', {
          user: this.user._id,
          text: this.text
        });
      }
    }
  }
</script>
<style >
@import '../assets/css/styles.css';

</style>
