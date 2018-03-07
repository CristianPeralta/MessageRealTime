<template lang="html">
	<div id="live-chat">

		<header @click="minimize" class="clearfix">

			<a @click="close" class="chat-close">x</a>

			<h4>John Doe</h4>

			<span ref="counter" class="chat-message-counter">3</span>

		</header>

		<div ref="chat" class="chat">

			<div class="chat-history">

				<div class="chat-message clearfix">

					<img src="http://lorempixum.com/32/32/people" alt="" width="32" height="32">

					<div class="chat-message-content clearfix">

						<span class="chat-time">13:35</span>

						<h5>John Doe</h5>

						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error, explicabo quasi ratione odio dolorum harum.</p>

					</div> <!-- end chat-message-content -->

				</div> <!-- end chat-message -->

				<hr>

				<div class="chat-message clearfix">

					<img src="http://gravatar.com/avatar/2c0ad52fc5943b78d6abe069cc08f320?s=32" alt="" width="32" height="32">

					<div class="chat-message-content clearfix">

						<span class="chat-time">13:37</span>

						<h5>Marco Biedermann</h5>

						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis, nulla accusamus magni vel debitis numquam qui tempora rem voluptatem delectus!</p>

					</div> <!-- end chat-message-content -->

				</div> <!-- end chat-message -->

				<hr>

				<div class="chat-message clearfix">

					<img src="http://lorempixum.com/32/32/people" alt="" width="32" height="32">

					<div class="chat-message-content clearfix">

						<span class="chat-time">13:38</span>

						<h5>John Doe</h5>

						<p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>

					</div> <!-- end chat-message-content -->

				</div> <!-- end chat-message -->

				<hr>

			</div> <!-- end chat-history -->

			<p class="chat-feedback">Your partner is typing…</p>

			<form action="#" method="post">

				<fieldset>

					<input type="text" placeholder="Type your message…" autofocus>
					<input type="hidden">

				</fieldset>

			</form>

		</div> <!-- end chat -->

	</div> <!-- end live-chat -->
</template>

<script>
export default {
  data () {
    return {
      open: true,
      heightChecked: false,
      initHeight: 0
    }
  },
  methods: {
    minimize () {
      this.slideToggle(this.$refs.chat);
    },
    close () {
      this.fadeOut(this.$refs.chat);
    },
    slideToggle(el) {
      if(!this.heightChecked) {
          this.initHeight = el.offsetHeight;
          this.heightChecked = true;
      }
      if(this.open) {
          this.open = false;
          el.style.height = '0px';
      }
      else {
          this.open = true;
          el.style.height = this.initHeight + 'px';
      }
    },
    fadeOut (el)
    {
      el.style.opacity=1;
      (function fade(){
        if((el.style.opacity-=.1)<0)
        {
          el.style.display="none";
        }
        else
        {
          requestAnimationFrame(fade);
        }
      })();
    }
  }
}
</script>

<style lang="css">
@import '../assets/css/imbox.css'
</style>
