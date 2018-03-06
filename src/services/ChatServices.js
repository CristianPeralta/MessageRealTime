import Api from '@/services/Api'

export default {
  room (params) {
    return Api().get('room/'+ params);
  },
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
  },
  addRoom (params) {
    return Api().post('room', params);
  },
  getRooms () {
    return Api().get('room');
  },
  upload (params) {
    return Api().post('upload', params);
  },
  addFriend (params) {
    return Api().post('friend', params);
  },
  deleteFriend (params) {
    return Api().post('friend/delete', params);
  }
}
