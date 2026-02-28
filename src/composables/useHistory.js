import { ref, computed } from 'vue'
import { getHistory } from '@/api'

const chemicalMetrics = [
  { id: 'voc', label: 'VOC 2.0', unit: 'ppb', group: 'chemical' },
  { id: 'nox', label: 'NOX 2.0', unit: 'ppm', group: 'chemical' },
  { id: 'co', label: 'CO 2.0', unit: 'ppm', group: 'chemical' },
  { id: 'so2', label: 'SO2', unit: 'ppm', group: 'chemical' },
  { id: 'o3', label: 'O3', unit: 'ppm', group: 'chemical' },
  { id: 'pm25', label: 'PM2.5', unit: 'µg/m³', group: 'chemical' },
]

const environmentMetrics = [
  { id: 'odor', label: '臭味', unit: '級', group: 'environment' },
  { id: 'temp', label: '溫度', unit: '°C', group: 'environment' },
  { id: 'humidity', label: '濕度', unit: '%', group: 'environment' },
  { id: 'wind', label: '風速', unit: 'm/s', group: 'environment' },
  { id: 'direction', label: '風向', unit: '°', group: 'environment' },
  { id: 'noise', label: '噪音', unit: 'dB', group: 'environment' },
  { id: 'pm10', label: 'PM10', unit: 'µg/m³', group: 'environment' },
]

const allMetrics = [...chemicalMetrics, ...environmentMetrics]

const selectedDevices = ref([])
const selectedMetric = ref(null)
const timeRange = ref({
  preset: '24h',
  customStart: null,
  customEnd: null,
})
const interval = ref(5)

const historyData = ref(null)
const loading = ref(false)
const error = ref(null)

const presetOptions = [
  { value: '1h', label: '1小時', hours: 1 },
  { value: '6h', label: '6小時', hours: 6 },
  { value: '24h', label: '24小時', hours: 24 },
  { value: '7d', label: '7天', hours: 168 },
  { value: '30d', label: '30天', hours: 720 },
]

function generateMockData(deviceIds, metricId, startTime, endTime, intervalMinutes) {
  const metric = allMetrics.find(m => m.id === metricId)
  if (!metric) return null

  const start = new Date(startTime)
  const end = new Date(endTime)
  const intervalMs = intervalMinutes * 60 * 1000

  const colors = ['#00E5D0', '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3']
  
  const devices = deviceIds.map((deviceId, index) => {
    const data = []
    let currentTime = new Date(start)
    
    const baseValue = metricId === 'temp' ? 25 : 
                      metricId === 'humidity' ? 65 :
                      metricId === 'voc' ? 200 :
                      metricId === 'pm25' ? 35 : 10
    
    while (currentTime <= end) {
      const variance = baseValue * 0.2
      const value = baseValue + (Math.random() - 0.5) * variance + Math.sin(currentTime.getTime() / 100000) * variance * 0.5
      
      data.push({
        timestamp: currentTime.toISOString(),
        value: Math.round(value * 100) / 100
      })
      
      currentTime = new Date(currentTime.getTime() + intervalMs)
    }
    
    return {
      id: deviceId,
      name: `設備 ${String.fromCharCode(64 + deviceId)}`,
      color: colors[index % colors.length],
      data
    }
  })

  return {
    metric: {
      id: metric.id,
      label: metric.label,
      unit: metric.unit
    },
    devices
  }
}

function getTimeRange() {
  if (timeRange.value.preset === 'custom') {
    return {
      startTime: timeRange.value.customStart,
      endTime: timeRange.value.customEnd
    }
  }
  
  const preset = presetOptions.find(p => p.value === timeRange.value.preset)
  if (!preset) return null
  
  const end = new Date()
  const start = new Date(end.getTime() - preset.hours * 60 * 60 * 1000)
  
  return {
    startTime: start.toISOString(),
    endTime: end.toISOString()
  }
}

export function useHistory() {
  const canQuery = computed(() => {
    return selectedDevices.value.length > 0 && selectedMetric.value !== null
  })

  const fetchHistory = async (devices) => {
    const range = getTimeRange()
    if (!range) {
      error.value = '請選擇有效的時間範圍'
      return
    }

    loading.value = true
    error.value = null

    try {
      const useMock = import.meta.env.VITE_USE_MOCK_DATA !== 'false'
      
      if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 500))
        historyData.value = generateMockData(
          selectedDevices.value,
          selectedMetric.value,
          range.startTime,
          range.endTime,
          interval.value
        )
      } else {
        const response = await getHistory({
          deviceIds: selectedDevices.value,
          metricId: selectedMetric.value,
          startTime: range.startTime,
          endTime: range.endTime,
          interval: interval.value
        })
        historyData.value = response.data
      }
    } catch (err) {
      error.value = err.message || '查詢失敗，請稍後再試'
      historyData.value = null
    } finally {
      loading.value = false
    }
  }

  const resetQuery = () => {
    selectedDevices.value = []
    selectedMetric.value = null
    timeRange.value = {
      preset: '24h',
      customStart: null,
      customEnd: null,
    }
    interval.value = 5
    historyData.value = null
    error.value = null
  }

  return {
    chemicalMetrics,
    environmentMetrics,
    allMetrics,
    presetOptions,
    selectedDevices,
    selectedMetric,
    timeRange,
    interval,
    historyData,
    loading,
    error,
    canQuery,
    fetchHistory,
    resetQuery,
  }
}
