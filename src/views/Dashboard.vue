<template>
  <div class="w-screen h-screen min-w-[1024px] min-h-[768px] bg-aqm-dark overflow-hidden flex flex-col">
    <Navbar 
      :notification-count="notifications"
      @settings="handleSettings"
      @trend="handleTrend"
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
            :title="chemical.title"
            :value="chemical.value"
            :unit="chemical.unit"
            :status="chemical.status"
          />
        </div>
      </section>
      
      <section class="flex-1 p-4 md:p-6 overflow-y-auto">
        <h2 class="text-aqm-text text-sm font-medium mb-4">環境監測</h2>
        <div class="grid grid-cols-4 auto-rows-[minmax(100px,auto)] gap-3 md:gap-4">
          <EnvCard
            v-for="env in environment"
            :key="env.id"
            :type="env.icon"
            :label="env.label"
            :value="env.value"
            :unit="env.unit"
            :size="env.size || '1x1'"
          />
        </div>
      </section>
      
      <DeviceMenu 
        :devices="devices"
        @select="handleDeviceSelect"
      />
    </main>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import MetricCard from '@/components/dashboard/MetricCard.vue'
import EnvCard from '@/components/dashboard/EnvCard.vue'
import DeviceMenu from '@/components/dashboard/DeviceMenu.vue'
import { useMockData } from '@/composables/useMockData'

const {
  chemicals,
  environment,
  devices,
  notifications,
  currentTime,
  selectDevice,
  updateTime
} = useMockData()

let timeInterval = null

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

const handleSettings = () => {
  console.log('Settings clicked')
}

const handleTrend = () => {
  console.log('Trend clicked')
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
</script>
