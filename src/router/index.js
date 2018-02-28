import Vue from 'vue'
import Router from 'vue-router'
import Notification from '@/components/Notification'
import Room from '@/components/Room'
import NewRoom from '@/components/NewRoom'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/room/:initialRoom',
      name: 'Room',
      component: Room,
      props: true
    },
    {
      path: '/newroom/:room',
      name: 'NewRoom',
      component: NewRoom,
      props: true
    },
    {
      path: '/notification',
      name: 'Notification',
      component: Notification
    }

  ],
})
