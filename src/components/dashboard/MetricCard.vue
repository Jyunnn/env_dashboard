<template>
  <div 
    class="bg-aqm-card rounded-xl p-3 md:p-4 flex flex-col justify-between transition-all duration-300 hover:bg-opacity-80 h-full min-h-[120px] cursor-pointer"
    :class="[
      statusColorClass,
      { 'ring-2 ring-aqm-accent': status === 'warning' }
    ]"
    @click="handleClick"
  >
    <div class="flex items-start justify-between">
      <h3 class="text-aqm-text text-xs md:text-sm font-medium truncate">{{ title }}</h3>
      <div 
        class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full flex-shrink-0"
        :class="statusDotClass"
      />
    </div>
    
    <div class="mt-1 md:mt-2">
      <span class="text-white text-xl md:text-2xl lg:text-3xl font-bold">{{ formattedValue }}</span>
      <span class="text-aqm-text-dim text-xs md:text-sm ml-1">{{ unit }}</span>
    </div>
    
    <div class="mt-1 md:mt-2 text-aqm-text-dim text-[10px] md:text-xs">
      {{ statusLabel }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  metricId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  unit: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'normal',
    validator: (value) => ['normal', 'warning', 'danger', 'good'].includes(value)
  }
})

const emit = defineEmits(['configure'])

const handleClick = () => {
  emit('configure', {
    metricId: props.metricId,
    label: props.title,
    unit: props.unit,
    isDirection: false
  })
}

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toFixed(2)
  }
  return props.value
})

const statusColorClass = computed(() => {
  switch (props.status) {
    case 'warning':
      return 'border-l-4 border-yellow-500'
    case 'danger':
      return 'border-l-4 border-aqm-danger'
    case 'good':
      return 'border-l-4 border-aqm-accent'
    default:
      return ''
  }
})

const statusDotClass = computed(() => {
  switch (props.status) {
    case 'warning':
      return 'bg-yellow-500'
    case 'danger':
      return 'bg-aqm-danger'
    case 'good':
      return 'bg-aqm-accent'
    default:
      return 'bg-green-500'
  }
})

const statusLabel = computed(() => {
  switch (props.status) {
    case 'warning':
      return '注意'
    case 'danger':
      return '警告'
    case 'good':
      return '良好'
    default:
      return '正常'
  }
})
</script>
