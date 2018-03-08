<template lang="html">
	<div ref="allbox" id="live-chat">

		<header @click="minimize" class="clearfix">

			<a @click="close($event)" class="chat-close">x</a>

			<h4>{{user.username}}</h4>

			<span ref="counter" class="chat-message-counter">3</span>

		</header>

		<div ref="chat" class="chat">

			<div class="chat-history">
				<template>
					<div class="chat-message clearfix">

						<img src="http://lorempixum.com/32/32/people" alt="" width="32" height="32">

						<div class="chat-message-content clearfix">

							<span class="chat-time">13:35</span>

							<h5>John Doe</h5>

							<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error, explicabo quasi ratione odio dolorum harum.</p>

						</div> <!-- end chat-message-content -->

					</div> <!-- end chat-message -->

					<hr>
				</template>

			</div> <!-- end chat-history -->

			<p class="chat-feedback">Your partner is typing…</p>

				<fieldset>

					<input type="text" placeholder="Type your message…" v-model="text" autofocus>
					<input type="hidden">
					<button type="button" @click="addMessage" name="button">Send</button>
				</fieldset>

		</div> <!-- end chat -->

	</div> <!-- end live-chat -->
</template>

<script>
export default {
  data () {
    return {
      open: true,
      heightChecked: false,
      initHeight: 0,
			message: [],
			text:""
    }
  },
  props: ['user'],
  methods: {
		addMessage () {
			console.log({
				to: this.user,
				user: this.$parent.user,
				text: this.text
			});
			this.$parent.$socket.emit('addMessagePrivated', {
				to: this.user,
				user: this.$parent.user,
				text: this.text
			});
		},
    minimize () {
      this.slideToggle(this.$refs.chat);
    },
    close (e) {
      e.preventDefault();
      this.fadeOut(this.$refs.allbox);
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
    fadeOut(el) {
        el.style.opacity = 1 / 100;
        el.style.filter = 'alpha(opacity=' + 1 + ')';
        if (1 == 1) {
            el.style.display = 'none';
        }
    }
  }
}
</script>

<style lang="css">
@import '../assets/css/imbox.css'
</style>
