<template>
  <div
    class="bg-aqm-card rounded-[14px] p-4 border-l-4 transition-colors"
    :class="notification.severity === 'high' ? 'border-l-aqm-danger' : 'border-l-yellow-500'"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <span class="text-white font-medium text-sm truncate">
          {{ notification.deviceName }}
        </span>
        <span class="text-aqm-text text-sm truncate">
          {{ notification.metricName }}
        </span>
        <span
          class="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
          :class="notification.severity === 'high' 
            ? 'bg-aqm-danger/20 text-aqm-danger' 
            : 'bg-yellow-500/20 text-yellow-500'"
        >
          <span
            class="w-1.5 h-1.5 rounded-full"
            :class="notification.severity === 'high' ? 'bg-aqm-danger' : 'bg-yellow-500'"
          />
          {{ notification.severity === 'high' ? '超過上限' : '低於下限' }}
        </span>
      </div>
      <span class="text-aqm-text-dim text-xs flex-shrink-0">
        {{ formattedDate }}
      </span>
    </div>
    <div class="mt-2 text-aqm-text text-sm">
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  notification: {
    type: Object,
    required: true,
  },
})

const formattedDate = computed(() => {
  const date = new Date(props.notification.timestamp)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${month}/${day} ${hours}:${minutes}`
})
</script>
