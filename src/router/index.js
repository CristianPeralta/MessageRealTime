import Vue from 'vue'
import Router from 'vue-router'
import Message from '@/components/Message'
import Notification from '@/components/Notification'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Message',
      component: Message
    },
    {
      path: '/notification',
      name: 'Notification',
      component: Notification
    }
  ],
})
