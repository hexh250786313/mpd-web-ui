import EventEmitter from 'eventemitter3'

export interface WSResponse {
  channel: 'mpd'
  packet:
    | 'database'
    | 'update'
    | 'stored_playlist'
    | 'playlist'
    | 'player'
    | 'mixer'
    | 'output'
    | 'sticker'
    | 'subscription'
    | 'message'
  data?: any
}

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
      const res: WSResponse = JSON.parse(msg.data)
      if (res.channel === 'mpd' && res.packet) {
        console.log('from ws', res)
        this.EE.emit(`mpd-${res.packet}`, res.data)
      }
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
    this.connection.addEventListener('close', () => {
      this.retry()
    })
  }

  private retry() {
    const that = this
    return new Promise((resolve) => {
      ;(function attempt() {
        setTimeout(() => {
          try {
            that.destroy()
            that.connect(that.url)
            resolve(true)
          } catch (e) {
            attempt()
          }
        }, 1000)
      })()
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

  subscribe(
    event: `mpd-${WSResponse['packet']}` | 'error' | 'ok',
    callback: (data: any) => void
  ) {
    this.EE.addListener(event, callback)
  }

  unsubscribe(event: string, callback: (data: any) => void) {
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
