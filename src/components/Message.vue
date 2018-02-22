<template>
  <div class="">
    <nav class="navbar is-white topNav">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item" href="../">
              <img src="" width="112" height="28">
          </a>
          <div class="navbar-burger burger" data-target="topNav">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div id="topNav" class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item" href="forum.html">
              Home
            </a>
          </div>

          <div class="navbar-end">
            <div class="navbar-item">
              <div class="field is-grouped">
                <p class="control">
                  <a class="button is-small">
                    <span class="icon">
                      <i class="fa fa-user-plus"></i>
                    </span>
                    <span>
                      Register
                    </span>
                  </a>
                </p>
                <p class="control">
                  <a class="button is-small is-info is-outlined">
                    <span class="icon">
                      <i class="fa fa-user"></i>
                    </span>
                    <span>Login</span>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <nav class="navbar is-white">
      <div class="container">
        <div class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item is-active" href="#">Popular</a>
            <a class="navbar-item" href="#">Recent</a>
            <a class="navbar-item" href="#">Rising</a>
          </div>
          <div class="navbar-end">
            <div class="navbar-item">
              <input class="input" type="text" placeholder="Search forum...">
            </div>
          </div>
        </div>
      </div>
    </nav>
    <section class="container">
      <div class="columns">
        <div class="column is-3">
          <a class="button is-primary is-block is-alt is-large" href="#">New Post</a>
          <aside class="menu">
            <p class="menu-label">
              Tags
            </p>
            <ul class="menu-list">
              <li><a>Dashboard</a></li>
              <li><a>Customers</a></li>
              <li><a>Authentication</a></li>
              <li><a>Payments</a></li>
              <li><a>Transfers</a></li>
              <li><a>Balance</a></li>
            </ul>
          </aside>

        </div>

        <div class="column is-9">
          <div class="box content">
            <article class="post">
              <h4>Bulma: How do you center a button in a box?</h4>
              <div class="media">
                <div class="media-left">
                  <p class="image is-32x32">
                    <img src="http://bulma.io/images/placeholders/128x128.png">
                  </p>
                </div>
                <div class="media-content">
                  <div class="content">
                    <p>
                      <a href="#">@jsmith</a> replied 34 minutes ago  &nbsp;
                      <span class="tag">Question</span>
                    </p>
                  </div>
                </div>
              <div class="media-right">
                 <span class="has-text-grey-light"><i class="fa fa-comments"></i> 1</span>
              </div>
              </div>
            </article>
            <article class="post">
              <h4>How can I make a bulma button go full width?</h4>
              <div class="media">
                <div class="media-left">
                  <p class="image is-32x32">
                    <img src="http://bulma.io/images/placeholders/128x128.png">
                  </p>
                </div>
                <div class="media-content">
                  <div class="content">
                    <p>
                      <a href="#">@red</a> replied 40 minutes ago  &nbsp;
                      <span class="tag">Question</span>
                    </p>
                  </div>
                </div>
                <div class="media-right">
                 <span class="has-text-grey-light"><i class="fa fa-comments"></i> 0</span>
                </div>
              </div>
            </article>
            <article class="post">
              <h4>TypeError: Data must be a string or a buffer when trying touse vue-bulma-tabs</h4>
              <div class="media">
                <div class="media-left">
                  <p class="image is-32x32">
                    <img src="http://bulma.io/images/placeholders/128x128.png">
                  </p>
                </div>
                <div class="media-content">
                  <div class="content">
                    <p>
                      <a href="#">@jsmith</a> replied 53 minutes ago  &nbsp;
                      <span class="tag">Question</span>
                    </p>
                  </div>
                </div>
                <div class="media-right">
                 <span class="has-text-grey-light"><i class="fa fa-comments"></i> 13</span>
                </div>
              </div>
            </article>
            <article class="post">
              <h4>How to vertically center elements in Bulma?</h4>
              <div class="media">
                <div class="media-left">
                  <p class="image is-32x32">
                    <img src="http://bulma.io/images/placeholders/128x128.png">
                  </p>
                </div>
                <div class="media-content">
                  <div class="content">
                    <p>
                      <a href="#">@brown</a> replied 3 hours ago  &nbsp;
                      <span class="tag">Question</span>
                    </p>
                  </div>
                </div>
                <div class="media-right">
                 <span class="has-text-grey-light"><i class="fa fa-comments"></i> 2</span>
                </div>
              </div>
            </article>
            <article class="post">
              <h4>I'm trying to use hamburger menu on bulma css, but it doesn't work. What is wrong?</h4>
              <div class="media">
                <div class="media-left">
                  <p class="image is-32x32">
                    <img src="http://bulma.io/images/placeholders/128x128.png">
                  </p>
                </div>
                <div class="media-content">
                  <div class="content">
                    <p>
                      <a href="#">@hamburgler</a> replied 5 hours ago  &nbsp;
                      <span class="tag">Question</span>
                    </p>
                  </div>
                </div>
                <div class="media-right">
                 <span class="has-text-grey-light"><i class="fa fa-comments"></i> 2</span>
                </div>
              </div>
            </article>
            <article class="post">
              <h4>How to make tiles wrap with Bulma CSS?</h4>
              <div class="media">
                <div class="media-left">
                  <p class="image is-32x32">
                    <img src="http://bulma.io/images/placeholders/128x128.png">
                  </p>
                </div>
                <div class="media-content">
                  <div class="content">
                    <p>
                      <a href="#">@rapper</a> replied 3 hours ago  &nbsp;
                      <span class="tag">Question</span>
                    </p>
                  </div>
                </div>
                <div class="media-right">
                 <span class="has-text-grey-light"><i class="fa fa-comments"></i> 2</span>
                </div>
              </div>
            </article>

          </div>
        </div>

      </div>
    </section>
    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p>
            <strong>Bulma Templates</strong> by <a href="https://github.com/dansup">Daniel Supernault</a>. The source code is licensed
            <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
          </p>
          <p>
            <a class="icon" href="https://github.com/dansup/bulma-templates">
              <i class="fa fa-github"></i>
            </a>
          </p>
        </div>
      </div>
    </footer>

  </div>

</template>

<script>
import Vue from 'vue'
import VueSocketio from 'vue-socket.io'
Vue.use(VueSocketio, 'ws://localhost:5000')

  export default {
    name: 'Message',
    props: [
      'user'
    ],
    data(){
      return {
        message: 'Hello World'
      }
    },
    sockets: {
      connect () {
        console.log('socket connected')
      },
      customEmit (val) {
        console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
      }
    }
  }
</script>
<style >
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
@import 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,700';
@import 'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.0/css/bulma.min.css';
html,body {
  font-family: 'Open Sans', serif;
  background: #F2F6FA;
}
footer {
  background-color: #F2F6FA !important;
}
.topNav {
  border-top: 5px solid #3498DB;
}
.topNav .container {
  border-bottom: 1px solid #E6EAEE;
}
.container .columns {
  margin: 3rem 0;
}
.navbar-menu .navbar-item {
  padding: 0 2rem;
}
aside.menu {
  padding-top: 3rem;
}
aside.menu .menu-list {
  line-height: 1.5;
}
aside.menu .menu-label {
  padding-left: 10px;
  font-weight: 700;
}
.button.is-primary.is-alt {
  background: #00c6ff;
  background: -webkit-linear-gradient(to bottom, #0072ff, #00c6ff);
  background: linear-gradient(to bottom, #0072ff, #00c6ff);
  font-weight: 700;
  font-size: 14px;
  height: 3rem;
  line-height: 2.8;
}
.media-left img {
  border-radius: 50%;
}
.media-content p {
  font-size: 14px;
  line-height: 2.3;
  font-weight: 700;
  color: #8F99A3;
}
article.post {
  margin: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #E6EAEE;
}
article.post:last-child {
  padding-bottom: 0;
  border-bottom: none;
}
</style>
