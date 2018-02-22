import Api from '@/services/Api'

export default {
  signup (params) {
    return Api().post('signup', params, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
  },
  login (params) {
    return Api().post('login', params);
  },
  user () {
    return Api().get('user');
  },
  logout () {
    return Api().post('logout');
  },
  getMessages () {
    return Api().get('messages');
  },
  addMessage (params) {
    return Api().post('message', params);
  }
}
