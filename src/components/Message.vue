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
            <a href="#">{{user.username}}</a> {{ from | ago}} &nbsp;
          </p>
        </div>
      </div>
    </div>
    <h4><slot></slot></h4>
  </article>
</template>

<script>
import moment from 'moment';

export default {
  name:'Message',
  props:['user', 'from'],
  filters:{
    ago(date){
      if (date) {
        return moment(date).fromNow();
      }
    }
  },
}
</script>

<style lang="css">
</style>
