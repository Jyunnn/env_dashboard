<template>
  <div 
    class="w-[70px] md:w-[90px] lg:w-device-menu h-full bg-aqm-panel border-l border-aqm-border overflow-y-auto flex-shrink-0"
  >
    <div class="flex flex-col py-1 md:py-2">
      <button
        v-for="device in devices"
        :key="device.id"
        @click="$emit('select', device.id)"
        class="flex flex-col items-center justify-center py-3 md:py-4 px-1 md:px-2 transition-all duration-200 hover:bg-white/5 relative group"
        :class="{ 'bg-white/10': device.active }"
      >
        <div 
          class="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center mb-0.5 md:mb-1 transition-colors"
          :class="[
            device.active ? 'bg-aqm-accent/20 text-aqm-accent' : 'bg-aqm-card text-aqm-text-dim group-hover:bg-aqm-card/80'
          ]"
        >
          <svg class="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M6 21h12M9 17v4M15 17v4" stroke-linecap="round" />
            <circle cx="12" cy="10" r="2" />
          </svg>
        </div>
        
        <span 
          class="text-[10px] md:text-xs text-center truncate w-full px-0.5 md:px-1 hidden md:block"
          :class="device.active ? 'text-aqm-accent' : 'text-aqm-text-dim'"
        >
          {{ device.name }}
        </span>
        
        <div 
          class="absolute top-1 md:top-2 right-1 md:right-2 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full"
          :class="statusClass(device.status)"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  devices: {
    type: Array,
    required: true
  }
})

defineEmits(['select'])

const statusClass = (status) => {
  switch (status) {
    case 'online':
      return 'bg-green-500'
    case 'offline':
      return 'bg-gray-500'
    case 'warning':
      return 'bg-yellow-500'
    default:
      return 'bg-gray-500'
  }
}
</script>

<style scoped>
.w-device-menu {
  width: 110px;
}
</style>
