<template>
  <div class="">
    <Navbar :room="room.name" :user="user"></Navbar>
    <section class="container">
      <div class="columns" style="margin-left : 3rem; margin-top : 0px;">
        <RoomList></RoomList>
        <div class="column is-7" >
          <div ref="chatbox" class="box content" style="overflow-y: scroll; height:530px; z-index:80;">
            <button @click="chatPosition()" class="button is-primary">Write</button>

            <Message v-for="(message,index) in messages" :user="message.user" :from="message.createdAt"  :key="index">
                <template v-if="message.photo">
                  <img :src="message.photo" alt="">
                </template>
                <template v-else>
                  {{message.text}}
                </template>
            </Message>

            <Message :user="user" tabindex="0">
              <textarea v-model="text" class="textarea is-large" type="text" placeholder="Your message"></textarea>
              <div class="control">
                <button @click="addMessageSocket()" class="button is-primary">Submit</button>
                <div class="field">
                  <div class="file is-info">
                    <label class="file-label has-name">
                      <input @change="processFile($event)" class="file-input" type="file" name="resume">
                      <span class="file-cta">
                        <span class="file-icon">
                          <i class="fa fa-upload"></i>
                        </span>
                        <span class="file-label">
                          File…
                        </span>
                        <span class="file-name">
                          Screen Shot 2017-07-29 at 15.54.25.png
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </Message>

          </div>
        </div>
        <div class="column is-2">
          <div class="box content">
            <p>Users  ({{users | count}})</p>
            <template v-if="users.length!=0">
              <p v-for="(userC,index) in users" :key="index">
                <span class="circle"></span>
                <small>
                  {{userC.user.username}}
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
    name: 'Room',
    props: ['initialRoom'],
    data(){
      return {
        room: {},
        messages: [],
        user: {},
        users: [],
        text: '',
        photo: {},
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
      this.saveRoom(this.getMessagesSocket, this.getUser, this.checkUser);
    },
    afterRouteUpdate() {
      this.getMessagesSocket();
    },
    mounted() {
    },
    filters: {
      count (users) {
        return users.length;
      }
    },
    watch: {
      initialRoom () {
        this.saveRoom(this.getMessagesSocket, this.getUser, this.checkUser);
      }
    },
    methods: {
      processFile (e) {
        this.photo = e.target.files[0];
        let form = new FormData();
        form.append('photo', this.photo);
        form.append('room', this.room.slug);
        form.append('user' , this.user._id);
        ChatServices.upload(form).then((response) => {
              console.log('success upload');
            })
      },
      saveRoom (message, user, check) {
        ChatServices.room(this.initialRoom).then((response) => {
          this.room = response.data;
          message();

        }).then(() => {
          user(check);
        })
      },
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
            this.$socket.emit('userConnected', {
              user: this.user,
              room: this.room.slug
            });
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
        this.$socket.emit('getMessages', this.room.slug);
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
          room: this.room.slug,
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
