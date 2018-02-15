import Vue from 'vue';
import axios from 'axios';
import Message from './components/message.vue';

window.axios = axios;

var socket = io.connect('http://localhost:3000', { 'forceNew': true });

var vm = new Vue({
    el: '#app',
    components: {
      Message
    },
    data:{
      newMessage : ''
    }
});
