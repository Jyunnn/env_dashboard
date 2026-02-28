import { ref, watch } from 'vue'

const STORAGE_KEY = 'alarm-configs'
const API_BASE_URL = import.meta.env.VITE_API_URL || ''

const loadConfigs = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

const configs = ref(loadConfigs())

watch(configs, (newConfigs) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfigs))
}, { deep: true })

const updateLocalConfig = (deviceId, metricId, config) => {
  const deviceKey = String(deviceId)
  if (!configs.value[deviceKey]) {
    configs.value[deviceKey] = {}
  }
  configs.value[deviceKey][metricId] = { ...config }
}

const simulateApiCall = (success = true, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ok: success })
    }, delay)
  })
}

export function useAlarmConfig() {
  const getAlarmConfig = (deviceId, metricId) => {
    const deviceKey = String(deviceId)
    if (!configs.value[deviceKey]) {
      return { min: null, max: null, enabled: false }
    }
    return configs.value[deviceKey][metricId] || { min: null, max: null, enabled: false }
  }

  const setAlarmConfig = async (deviceId, metricId, config) => {
    try {
      let response
      
      if (API_BASE_URL) {
        response = await fetch(`${API_BASE_URL}/api/devices/${deviceId}/alarms/${metricId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config)
        })
      } else {
        response = await simulateApiCall(true)
      }

      if (response.ok) {
        updateLocalConfig(deviceId, metricId, config)
        return { success: true, message: '設定已儲存' }
      } else {
        return { success: false, message: '儲存失敗，請稍後再試' }
      }
    } catch (error) {
      console.error('Alarm config save error:', error)
      return { success: false, message: '網路錯誤，請檢查連線' }
    }
  }

  const getAllConfigs = (deviceId) => {
    const deviceKey = String(deviceId)
    return configs.value[deviceKey] || {}
  }

  return {
    configs,
    getAlarmConfig,
    setAlarmConfig,
    getAllConfigs,
  }
}
