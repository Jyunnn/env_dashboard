import { ref, onMounted, onUnmounted } from 'vue'

const notifications = ref([])
const unreadCount = ref(0)

const metricLabels = {
  voc: 'VOC 2.0',
  nox: 'NOX 2.0',
  co: 'CO 2.0',
  so2: 'SO2',
  o3: 'O3',
  pm25: 'PM2.5',
  odor: '臭味',
  temp: '溫度',
  humidity: '濕度',
  wind: '風速',
  direction: '風向',
  noise: '噪音',
  pm10: 'PM10',
}

function generateMockAlarm() {
  const devices = [
    { id: 1, name: '設備 A' },
    { id: 2, name: '設備 B' },
    { id: 3, name: '設備 C' },
    { id: 4, name: '設備 D' },
  ]
  const metrics = ['voc', 'temp', 'humidity', 'pm25', 'co', 'nox']
  const severities = ['high', 'low']
  
  const device = devices[Math.floor(Math.random() * devices.length)]
  const metric = metrics[Math.floor(Math.random() * metrics.length)]
  const severity = severities[Math.floor(Math.random() * severities.length)]
  const value = Math.round((Math.random() * 100 + 50) * 10) / 10
  const threshold = severity === 'high' ? 80 : 20
  
  return {
    id: Date.now() + Math.random(),
    timestamp: new Date().toISOString(),
    deviceId: device.id,
    deviceName: device.name,
    metricId: metric,
    metricName: metricLabels[metric] || metric,
    message: severity === 'high' 
      ? `超過上限閾值 (${value} > ${threshold})`
      : `低於下限閾值 (${value} < ${threshold})`,
    severity,
  }
}

let mockInterval = null

export function useAlarmNotifications() {
  const handleAlarm = (alarm) => {
    const notification = {
      ...alarm,
      metricName: alarm.metricName || metricLabels[alarm.metricId] || alarm.metricId,
      receivedAt: new Date().toISOString(),
    }
    
    notifications.value.unshift(notification)
    unreadCount.value++
  }

  const markAllAsRead = () => {
    unreadCount.value = 0
  }

  const clearAll = () => {
    notifications.value = []
    unreadCount.value = 0
  }

  const startMockAlarms = () => {
    if (mockInterval) return
    
    const initialCount = Math.floor(Math.random() * 5) + 3
    for (let i = 0; i < initialCount; i++) {
      const alarm = generateMockAlarm()
      alarm.timestamp = new Date(Date.now() - i * 600000).toISOString()
      notifications.value.push({
        ...alarm,
        receivedAt: alarm.timestamp,
      })
    }
    unreadCount.value = initialCount
    
    mockInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        handleAlarm(generateMockAlarm())
      }
    }, 15000)
  }

  const stopMockAlarms = () => {
    if (mockInterval) {
      clearInterval(mockInterval)
      mockInterval = null
    }
  }

  onMounted(() => {
    const useMock = import.meta.env.VITE_USE_MOCK_DATA !== 'false'
    if (useMock) {
      startMockAlarms()
    }
  })

  onUnmounted(() => {
    stopMockAlarms()
  })

  return {
    notifications,
    unreadCount,
    handleAlarm,
    markAllAsRead,
    clearAll,
  }
}
