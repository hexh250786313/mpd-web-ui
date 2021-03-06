import EventEmitter from 'eventemitter3'

export class StreamReader<T> {
  protected EE = new EventEmitter()
  protected connection: WebSocket | null = null
  protected url = ''
  protected retryInterval = 5000
  connected = false

  protected connectWebsocket() {
    const url = new URL(this.url)
    this.connection = new WebSocket(url.toString())
    this.connection.addEventListener('message', (msg) => {
      const data = JSON.parse(msg.data)
      this.EE.emit('data', data?.data)
    })
    this.connection.addEventListener('error', (err) => {
      this.EE.emit('error', err)
      this.connection?.close()
      setTimeout(this.connectWebsocket, this.retryInterval)
    })
    this.connection.addEventListener('open', () => {
      this.connected = true
      this.EE.emit('ok', true)
    })
  }

  connect(url: string) {
    if (this.url === url && this.connection) {
      return
    }
    this.url = url
    this.connection?.close()
    this.connectWebsocket()
  }

  subscribe(event: string, callback: (data: T[]) => void) {
    this.EE.addListener(event, callback)
  }

  unsubscribe(event: string, callback: (data: T[]) => void) {
    this.EE.removeListener(event, callback)
  }

  destroy() {
    this.EE.removeAllListeners()
    this.connection?.close()
    this.connected = false
    this.connection = null
  }

  send(data: T) {
    this.connection?.send(JSON.stringify(data))
  }
}
