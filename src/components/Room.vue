<template lang="html">
  <div class="notification">
    <MenuList></MenuList>
  </div>
</template>

<script>
import Navbar from '@/components/utils/Navbar'
import Footer from '@/components/utils/Footer'
import MenuList from '@/components/utils/MenuList'

export default {
  name: 'Room',
  props: ['room'],
  components:{
    Navbar,
    MenuList,
    Footer
  }
}
</script>

<style lang="css">
.notification{
  background: yellow;
}
</style>
