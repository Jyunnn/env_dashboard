<template>
  <div class="bg-aqm-panel rounded-lg p-4 border border-aqm-border">
    <div class="flex flex-col lg:flex-row gap-4">
      <div class="flex-1">
        <label class="block text-aqm-text-dim text-xs mb-1">關鍵字搜尋</label>
        <div class="relative">
          <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aqm-text-dim" />
          <input
            type="text"
            v-model="localFilters.keyword"
            placeholder="搜尋訊息、設備或項目..."
            class="w-full bg-aqm-card border border-aqm-border rounded-lg pl-10 pr-3 py-2 text-white text-sm placeholder-aqm-text-dim/50 focus:outline-none focus:border-aqm-accent transition-colors"
          />
        </div>
      </div>

      <div class="lg:w-40">
        <label class="block text-aqm-text-dim text-xs mb-1">設備</label>
        <select
          v-model="localFilters.deviceId"
          class="w-full bg-aqm-card border border-aqm-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-aqm-accent transition-colors appearance-none cursor-pointer"
        >
          <option :value="null">全部設備</option>
          <option v-for="device in devices" :key="device.id" :value="device.id">
            {{ device.name }}
          </option>
        </select>
      </div>

      <div class="lg:w-36">
        <label class="block text-aqm-text-dim text-xs mb-1">嚴重度</label>
        <select
          v-model="localFilters.severity"
          class="w-full bg-aqm-card border border-aqm-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-aqm-accent transition-colors appearance-none cursor-pointer"
        >
          <option :value="null">全部</option>
          <option value="high">超過上限</option>
          <option value="low">低於下限</option>
        </select>
      </div>

      <div class="lg:w-36">
        <label class="block text-aqm-text-dim text-xs mb-1">開始日期</label>
        <input
          type="date"
          v-model="localFilters.startDate"
          class="w-full bg-aqm-card border border-aqm-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-aqm-accent transition-colors"
        />
      </div>

      <div class="lg:w-36">
        <label class="block text-aqm-text-dim text-xs mb-1">結束日期</label>
        <input
          type="date"
          v-model="localFilters.endDate"
          class="w-full bg-aqm-card border border-aqm-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-aqm-accent transition-colors"
        />
      </div>

      <div class="flex items-end gap-2">
        <button
          @click="handleReset"
          class="px-4 py-2 rounded-lg bg-aqm-card text-aqm-text hover:bg-aqm-card/80 transition-colors text-sm"
        >
          重置
        </button>
        <button
          @click="handleSearch"
          class="px-4 py-2 rounded-lg bg-aqm-accent text-aqm-dark font-medium hover:bg-aqm-accent/90 transition-colors text-sm"
        >
          搜尋
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, h } from 'vue'

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
  devices: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:filters', 'search', 'reset'])

const localFilters = ref({
  keyword: '',
  deviceId: null,
  severity: null,
  startDate: null,
  endDate: null,
})

watch(() => props.filters, (newVal) => {
  localFilters.value = { ...newVal }
}, { immediate: true, deep: true })

const handleSearch = () => {
  emit('update:filters', { ...localFilters.value })
  emit('search')
}

const handleReset = () => {
  localFilters.value = {
    keyword: '',
    deviceId: null,
    severity: null,
    startDate: null,
    endDate: null,
  }
  emit('update:filters', { ...localFilters.value })
  emit('reset')
}

const SearchIcon = {
  render() {
    return h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
    }, [
      h('circle', { cx: '11', cy: '11', r: '8' }),
      h('path', { d: 'M21 21l-4.35-4.35', 'stroke-linecap': 'round' }),
    ])
  },
}
</script>
