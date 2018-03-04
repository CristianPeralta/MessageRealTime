<template>
  <div class="">
    <Navbar :room="room.name" :user="user"></Navbar>
    <section class="container">
      <div class="columns" style="margin-left : 3rem; margin-top : 0px;">
        <RoomList>
          <div class="box content" style="overflow-y: scroll; height:250px; z-index:80;">
            <Message :user="user">
                  Waiting...
            </Message>
            <Message v-for="(mprivate,index) in messageprivated" :user="mprivate.user" :key="index">
                  {{mprivate.text}}
            </Message>
          </div>
        </RoomList>
        <div class="column is-7" >
          <button @click="chatPosition()" class="button is-primary">Write</button>
          <div ref="chatbox" class="box content" style="overflow-y: scroll; height:530px; z-index:80;">

            <Message v-for="(message,index) in messages" :user="message.user" :from="message.createdAt"  :key="index">
                <template v-if="message.photo">
                  <img :src="message.photo" alt="">
                </template>
                <template v-else>
                  {{message.text}}
                </template>
            </Message>

            <Message :user="user" tabindex="0">
              <textarea ref="chatmessage" v-model="text" class="textarea is-large" type="text" placeholder="Your message" autofocus=""></textarea>
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
                  <a @click="addPrivateUser(userC)">{{userC.user.username}}</a>
                </small>
              </p>
            </template>
            <Message :user="user" tabindex="0">
              <textarea ref="chatmessage" v-model="textprivated" class="textarea" type="text" placeholder="Your message" autofocus=""></textarea>
              <div class="control">
                <button @click="addMessagePrivateSocket()" class="button is-primary">Submit</button>
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
        messageprivated: [],
        user: {},
        users: [],
        text: '',
        textprivated: '',
        userPrivated: {},
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
          let usersRoom = response.data.map((element) => {
            if (element.room == this.room.slug) {
              return element
            }
          })
          usersRoom = usersRoom.filter(function(n){ return n != undefined })
          this.users = usersRoom;
      },
      messageAdded (response) {
        if (response.ok) {
          this.messages.push(response.data);

          this.clear();
        } else {
          console.log(response.err);
        }
      },
      addMessagePrivated (data) {
        console.log('received');
        console.log(data);
        this.messageprivated.push(data);
        this.textprivated = '';
      },
      messagesGetted (response) {
        if (response.ok) {
          this.messages = response.data;
          this.isLoad = true;
          this.chatPosition();
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
          this.chatPosition();
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
          this.$refs.chatmessage.focus();
        }
      },
      clear () {
        this.text = '';
      },
      addPrivateUser (to) {
        this.userPrivated = to;
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
      },
      addMessagePrivateSocket () {
        this.$socket.emit('addMessagePrivated', {
          to: this.userPrivated,
          user: this.user,
          text: this.textprivated
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
