import Vue from 'vue'

Vue.prototype.$tools = {
  isEmpty (obj) {
    return obj === undefined || obj === null || obj === ''
  }
}
