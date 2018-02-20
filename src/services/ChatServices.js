import Api from '@/services/Api'

export default {
  SignUp (params) {
    return Api().post('signup', params)
  },
  fetchPosts () {
    return Api().get('posts')
  },
  addPost (params) {
    return Api().post('posts', params)
  },
  updatePost (params) {
    return Api().put('post', params)
  },
  deletePost (id) {
    return Api().delete('post/' + id)
  }
}
