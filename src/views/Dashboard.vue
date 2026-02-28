<template>
  <div class="w-screen h-screen min-w-[1024px] min-h-[768px] bg-aqm-dark overflow-hidden flex flex-col">
    <Navbar 
      :notification-count="notifications"
      @settings="handleSettings"
      @trend="handleTrend"
      @history="handleHistory"
      @refresh="handleRefresh"
      @notification="handleNotification"
    />
    
    <main class="flex-1 flex overflow-hidden">
      <section class="flex-1 p-4 md:p-6 overflow-y-auto border-r border-aqm-border">
        <h2 class="text-aqm-text text-sm font-medium mb-4">化學品監測</h2>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <MetricCard
            v-for="chemical in chemicals"
            :key="chemical.id"
            :metric-id="chemical.id"
            :title="chemical.title"
            :value="chemical.value"
            :unit="chemical.unit"
            :status="chemical.status"
            @configure="handleOpenConfig"
          />
        </div>
      </section>
      
      <section class="flex-1 p-4 md:p-6 overflow-y-auto">
        <h2 class="text-aqm-text text-sm font-medium mb-4">環境監測</h2>
        <div class="grid grid-cols-4 auto-rows-[minmax(100px,auto)] gap-3 md:gap-4">
          <EnvCard
            v-for="env in environment"
            :key="env.id"
            :metric-id="env.id"
            :type="env.icon"
            :label="env.label"
            :value="env.value"
            :unit="env.unit"
            :size="env.size || '1x1'"
            @configure="handleOpenConfig"
          />
        </div>
      </section>
      
      <DeviceMenu 
        :devices="devices"
        @select="handleDeviceSelect"
      />
    </main>

    <AlarmConfigModal
      :visible="modalState.visible"
      :loading="modalState.loading"
      :device-id="modalState.deviceId"
      :metric-id="modalState.metricId"
      :title="modalState.title"
      :unit="modalState.unit"
      :is-direction="modalState.isDirection"
      :config="modalState.config"
      @close="handleCloseModal"
      @save="handleSaveConfig"
    />

    <HistoryModal
      :visible="historyModalVisible"
      :devices="devices"
      @close="historyModalVisible = false"
    />

    <SettingsModal
      :visible="settingsModalVisible"
      :settings="settings"
      :saving="settingsSaving"
      @close="settingsModalVisible = false"
      @save="handleSaveSettings"
    />

    <AlarmHistoryModal
      :visible="alarmHistoryModalVisible"
      :devices="devices"
      @close="alarmHistoryModalVisible = false"
    />

    <Toast />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, computed, ref } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import MetricCard from '@/components/dashboard/MetricCard.vue'
import EnvCard from '@/components/dashboard/EnvCard.vue'
import DeviceMenu from '@/components/dashboard/DeviceMenu.vue'
import AlarmConfigModal from '@/components/common/AlarmConfigModal.vue'
import HistoryModal from '@/components/history/HistoryModal.vue'
import SettingsModal from '@/components/common/SettingsModal.vue'
import AlarmHistoryModal from '@/components/alarm/AlarmHistoryModal.vue'
import Toast from '@/components/common/Toast.vue'
import { useMockData } from '@/composables/useMockData'
import { useAlarmConfig } from '@/composables/useAlarmConfig'
import { useSettings } from '@/composables/useSettings'
import { useToast } from '@/composables/useToast'

const {
  chemicals,
  environment,
  devices,
  notifications,
  currentTime,
  selectDevice,
  updateTime
} = useMockData()

const { getAlarmConfig, setAlarmConfig } = useAlarmConfig()
const { settings, loading: settingsLoading, saving: settingsSaving, fetchSettings, saveSettings } = useSettings()
const { showSuccess, showError } = useToast()

const activeDeviceId = computed(() => {
  const activeDevice = devices.value.find(d => d.active)
  return activeDevice ? activeDevice.id : null
})

const modalState = reactive({
  visible: false,
  loading: false,
  deviceId: null,
  metricId: '',
  title: '',
  unit: '',
  isDirection: false,
  config: { min: null, max: null, enabled: false }
})

const historyModalVisible = ref(false)
const settingsModalVisible = ref(false)
const alarmHistoryModalVisible = ref(false)

let timeInterval = null

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  fetchSettings()
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

const handleSettings = () => {
  settingsModalVisible.value = true
}

const handleTrend = () => {
  historyModalVisible.value = true
}

const handleHistory = () => {
  alarmHistoryModalVisible.value = true
}

const handleRefresh = () => {
  console.log('Refresh clicked')
}

const handleNotification = () => {
  console.log('Notification clicked')
}

const handleDeviceSelect = (deviceId) => {
  selectDevice(deviceId)
  console.log('Device selected:', deviceId)
}

const handleOpenConfig = (payload) => {
  if (!activeDeviceId.value) return
  
  modalState.deviceId = activeDeviceId.value
  modalState.metricId = payload.metricId
  modalState.title = payload.label
  modalState.unit = payload.unit
  modalState.isDirection = payload.isDirection
  modalState.config = getAlarmConfig(activeDeviceId.value, payload.metricId)
  modalState.loading = false
  modalState.visible = true
}

const handleCloseModal = () => {
  if (!modalState.loading) {
    modalState.visible = false
  }
}

const handleSaveConfig = async (payload) => {
  modalState.loading = true
  
  const result = await setAlarmConfig(payload.deviceId, payload.metricId, payload.config)
  
  if (result.success) {
    showSuccess(result.message)
    modalState.visible = false
  } else {
    showError(result.message)
  }
  
  modalState.loading = false
}

const handleSaveSettings = async (newSettings) => {
  const result = await saveSettings(newSettings)
  
  if (result.success) {
    showSuccess(result.message)
    settingsModalVisible.value = false
  } else {
    showError(result.message)
  }
}
</script>
