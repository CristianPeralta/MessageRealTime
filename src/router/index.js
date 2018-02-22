import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Notification from '@/components/Notification'
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
      path: '/home',
      name: 'Home',
      component: Home,
      props: true
    },
    {
      path: '/notification',
      name: 'Notification',
      component: Notification
    }

  ],
})
