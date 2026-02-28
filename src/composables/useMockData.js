import { ref, reactive } from 'vue'

const chemicals = ref([
  { id: 'voc', title: 'VOC 2.0', value: 227.17, unit: 'ppb', status: 'normal' },
  { id: 'nox', title: 'NOX 2.0', value: 12.17, unit: 'ppm', status: 'normal' },
  { id: 'co', title: 'CO 2.0', value: 0.77, unit: 'ppm', status: 'warning' },
  { id: 'so2', title: 'SO2', value: 1.27, unit: 'ppm', status: 'normal' },
  { id: 'o3', title: 'O3', value: 27.87, unit: 'ppm', status: 'normal' },
  { id: 'pm25', title: 'PM2.5', value: 34.78, unit: 'µg/m³', status: 'good' },
])

const environment = ref([
  { id: 'odor', label: '臭味', value: 2.5, unit: '級', icon: 'odor', size: '1x1' },
  { id: 'temp', label: '溫度', value: 25.5, unit: '°C', icon: 'thermometer', size: '1x1' },
  { id: 'humidity', label: '濕度', value: 65, unit: '%', icon: 'droplet', size: '1x1' },
  { id: 'wind', label: '風速', value: 3.2, unit: 'm/s', icon: 'wind', size: '1x1' },
  { id: 'direction', label: '風向', value: 'NE', unit: '', icon: 'compass', size: '2x2' },
  { id: 'noise', label: '噪音', value: 45, unit: 'dB', icon: 'volume', size: '1x1' },
  { id: 'pm25-env', label: 'PM2.5', value: 34.78, unit: 'µg/m³', icon: 'particle', size: '1x1' },
  { id: 'pm10', label: 'PM10', value: 52.3, unit: 'µg/m³', icon: 'particle', size: '1x1' },
])

const devices = ref([
  { id: 1, name: '設備 A', icon: 'server', status: 'online', active: true },
  { id: 2, name: '設備 B', icon: 'server', status: 'online', active: false },
  { id: 3, name: '設備 C', icon: 'server', status: 'offline', active: false },
  { id: 4, name: '設備 D', icon: 'server', status: 'online', active: false },
  { id: 5, name: '設備 E', icon: 'server', status: 'warning', active: false },
  { id: 6, name: '設備 F', icon: 'server', status: 'online', active: false },
  { id: 7, name: '設備 G', icon: 'server', status: 'offline', active: false },
  { id: 8, name: '設備 H', icon: 'server', status: 'online', active: false },
])

const notifications = ref(6)

const currentTime = ref('23:59')

export function useMockData() {
  const updateChemicalValue = (id, newValue) => {
    const item = chemicals.value.find(c => c.id === id)
    if (item) {
      item.value = newValue
    }
  }

  const updateEnvironmentValue = (id, newValue) => {
    const item = environment.value.find(e => e.id === id)
    if (item) {
      item.value = newValue
    }
  }

  const selectDevice = (id) => {
    devices.value.forEach(d => {
      d.active = d.id === id
    })
  }

  const updateTime = () => {
    const now = new Date()
    currentTime.value = now.toLocaleTimeString('zh-TW', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  return {
    chemicals,
    environment,
    devices,
    notifications,
    currentTime,
    updateChemicalValue,
    updateEnvironmentValue,
    selectDevice,
    updateTime,
  }
}
