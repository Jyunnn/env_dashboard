import { ref, onUnmounted } from 'vue'

export function useWebSocket(url) {
  const data = ref(null)
  const status = ref('CONNECTING')
  const error = ref(null)
  const onAlarm = ref(null)
  let ws = null

  const connect = () => {
    const wsUrl = import.meta.env.VITE_WS_URL || url
    ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      status.value = 'CONNECTED'
      error.value = null
    }

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        
        if (message.type === 'alarm' && onAlarm.value) {
          onAlarm.value(message.data)
        } else if (message.type === 'data') {
          data.value = message.data
        } else {
          data.value = message
        }
      } catch {
        data.value = event.data
      }
    }

    ws.onerror = (e) => {
      error.value = e
      status.value = 'ERROR'
    }

    ws.onclose = () => {
      status.value = 'DISCONNECTED'
    }
  }

  const send = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const payload = typeof message === 'string' ? message : JSON.stringify(message)
      ws.send(payload)
    }
  }

  const disconnect = () => {
    if (ws) {
      ws.close()
      ws = null
    }
  }

  const reconnect = () => {
    disconnect()
    connect()
  }

  onUnmounted(() => {
    disconnect()
  })

  connect()

  return {
    data,
    status,
    error,
    send,
    disconnect,
    reconnect,
    onAlarm,
  }
}
