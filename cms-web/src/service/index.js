import Vue from 'vue'
import Vuex from 'vuex'
import Http from './Http'
import Local from './Local'
import System from './System'
import User from './model/User'

Vue.use(Vuex)

class Context {
  constructor () {
    this.store = new Vuex.Store({state: {}})
  }

  async initialize () {
    this.install('http', Http)
    this.install('local', Local)
    this.install('system', System)
    this.install('user', User)

    window.http = this.http
    return await this.user.start()
  }

  async install (name, Service) {
    this[name] = new Service({})
    Vue.set(this.store.state, name, this[name].store)
  }
}

export default new Context()
