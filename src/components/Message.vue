<template lang="html">
  <article class="post">
    <div class="media">
      <div class="media-left">
        <p class="image is-32x32">
          <img :src="user.photo">
        </p>
      </div>
      <div class="media-content">
        <div class="content">
          <p>
            <a href="#">{{user.username}}</a> 5 minutes ago  &nbsp;
          </p>
        </div>
      </div>
    </div>
    <h4><slot></slot></h4>
  </article>
</template>

<script>
import ChatServices from '@/services/ChatServices'

export default {
  name:'Message',
  props:['user']
}
</script>

<style lang="css">
</style>
