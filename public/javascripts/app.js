var Message = require('../../components/message.vue');

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
