/* eslint-disable space-before-function-paren */
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import * as hub from '@/service/eventHub'
const SockUrl = `/websocket`
// const SockUrl = `http://192.168.1.186:81/websocket`
let timer
let socketStore = {
  stomp: null,
  isConnect: false
}
class Socket {
  constructor(notifyList = {}, tenantKey = '', token = null) {
    this.notifyList = notifyList
    this.tenantKey = tenantKey
    this.token = token
  }
  messageDetail(result) {
    let RESULT = result
    let _this = this
    return function () {
      _this.notifyList[RESULT.messageId].close()
      hub.eventHub.$emit('openMessageDetail', RESULT.messageId)
    }
  }
  send() {
    console.log('发送中...')
    let obj = {
      'id': 1,
      'tenantKey': 'danran',
      'title': 'sadadsaDS',
      'type': 'MESSAGE',
      'userId': ['321']
    }
    socketStore.stomp.send('/app/hello', obj)
  }
  connectSeccess(rep) {
    console.log(rep)
    if (!rep.headers['user-name']) return
    let _this = this
    let SubscribeUrl = `/queue/${rep.headers['user-name']}/message`
    socketStore.stomp.subscribe(SubscribeUrl, async message => {
      let result = JSON.parse(message.body)
      hub.eventHub.$emit('messageCome', result.messageId)
      _this.notifyList[result.messageId] = await hub.eventHub.$notify({
        title: result.messageType,
        message: result.messageTopic,
        duration: 5000,
        type: 'info',
        customClass: 'messageNotify',
        onClick: _this.messageDetail(result)
      })
    })
  }
  connect() {
    let ws = new SockJS(SockUrl)
    let stomp = Stomp.over(ws)
    let headers = {
      tenantKey: this.tenantKey,
      Authorization: `bearer ${this.token}`
    }
    stomp.connect(headers, (rep) => {
      socketStore.stomp = stomp
      socketStore.isConnect = true
      console.log('链接成功')
      this.connectSeccess(rep)
    }, (error) => {
      socketStore.isConnect = false
      // timer = setTimeout(() => {
      //   if (!socketStore.isConnect) {
      //     hub.eventHub.$emit('initSocket')
      //   }
      // }, 5000)
      console.log(`链接失败: ${error}，或许是后端服务未开启`)
    })
  }
  disconnect() {
    clearTimeout(timer)
    if (socketStore.stomp) {
      socketStore.stomp.disconnect()
      console.log(`链接断开: 手动断开`)
    }
    for (let i in this.notifyList) {
      if (this.notifyList[i].visible) this.notifyList[i].close()
    }
  }
}
export default Socket
