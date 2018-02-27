<template>
  <div class="">
    <Navbar :user="user"></Navbar>
    <section class="container">
      <div class="columns" style="margin-left : 3rem; margin-top : 0px;">
        <RoomList></RoomList>
        <div class="column is-7" >
          <div ref="chatbox" class="box content" style="overflow-y: scroll; height:530px; z-index:80;">
            <button @click="chatPosition()" class="button is-primary">Write</button>
            <Message :user="user" tabindex="0">
              <textarea v-model="text" class="textarea is-large" type="text" placeholder="Your message"></textarea>
              <div class="control">
                <button @click="addMessageSocket()" class="button is-primary">Submit</button>
              </div>
            </Message>
            <Message v-for="(message,index) in messages" :user="message.user" :from="message.createdAt"  :key="index">
                {{message.text}}
            </Message>


          </div>
        </div>
        <div class="column is-2">
          <div class="box content">
            <p>Users  ({{users | count}})</p>
            <template v-if="users">
              <p v-for="(userC,index) in users" :key="index">
                <span class="circle"></span>
                <small>
                  {{userC.username}}
                </small>
              </p>
            </template>

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
import RoomList from '@/components/utils/RoomList'
import Message from '@/components/Message'
import ChatServices from '@/services/ChatServices'

Vue.use(VueSocketio, 'ws://localhost:5000')

  export default {
    name: 'Home',
    props: ['room'],
    data(){
      return {
        messages: [],
        user: {},
        users: [],
        text: '',
        isLoad : false
      }
    },
    components:{
      Navbar,
      RoomList,
      Footer,
      Message
    },
    sockets: {
      connect () {
        console.log('socket connected')
      },
      usersConnected (response) {
        console.log(response.data);
          this.users = response.data;
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
      this.getUser(this.checkUser);
      this.getMessagesSocket();
    },
    mounted() {
    },
    filters: {
      count (users) {
        return users.length;
      }
    },
    methods: {
      checkUser () {
        if (!this.user.username) {
          this.$router.push({name: 'Login'});
        }
      },
      chatPosition () {
        if (this.isLoad == true) {
          let chat = this.$refs.chatbox;
          chat.scrollTop = chat.scrollHeight;
        }
      },
      clear () {
        this.text = '';
      },
      getUser (cb) {
        ChatServices.user().then((response) => {
          this.user = response.data;
          if (this.user.username) {
            this.$socket.emit('userConnected', this.user);
          }
          cb();
        });
      },
      getMessages () {
        ChatServices.getMessages().then((response) => {
          this.messages = response.data;
          this.isLoad = true;
        })
      },
      getMessagesSocket () {
        this.$socket.emit('getMessages', this.room._id);
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
.circle:before {
  content: ' \25CF';
  font-size: 20px;
  color:#23d160;
}
</style>
