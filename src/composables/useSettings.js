import { ref } from 'vue'
import { getSettings, updateSettings } from '@/api'

const settings = ref({
  interval: 5,
  aggregation: 'avg',
})

const loading = ref(false)
const saving = ref(false)
const error = ref(null)

const defaultSettings = {
  interval: 5,
  aggregation: 'avg',
}

export function useSettings() {
  const fetchSettings = async () => {
    loading.value = true
    error.value = null

    try {
      const useMock = import.meta.env.VITE_USE_MOCK_DATA !== 'false'

      if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const stored = localStorage.getItem('aqm-settings')
        if (stored) {
          settings.value = JSON.parse(stored)
        } else {
          settings.value = { ...defaultSettings }
        }
      } else {
        const response = await getSettings()
        if (response.success && response.data) {
          settings.value = response.data
        }
      }
    } catch (err) {
      error.value = err.message || '取得設定失敗'
      settings.value = { ...defaultSettings }
    } finally {
      loading.value = false
    }
  }

  const saveSettings = async (newSettings) => {
    saving.value = true
    error.value = null

    try {
      const useMock = import.meta.env.VITE_USE_MOCK_DATA !== 'false'

      if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 300))
        settings.value = { ...newSettings }
        localStorage.setItem('aqm-settings', JSON.stringify(newSettings))
        return { success: true, message: '設定已儲存' }
      } else {
        const response = await updateSettings(newSettings)
        if (response.success) {
          settings.value = { ...newSettings }
        }
        return response
      }
    } catch (err) {
      error.value = err.message || '儲存設定失敗'
      return { success: false, message: error.value }
    } finally {
      saving.value = false
    }
  }

  return {
    settings,
    loading,
    saving,
    error,
    fetchSettings,
    saveSettings,
  }
}
