<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 bg-aqm-dark flex flex-col"
      >
        <header class="flex items-center justify-between px-6 py-4 border-b border-aqm-border flex-shrink-0">
          <h2 class="text-white text-xl font-medium">歷史數據查詢</h2>
          <button
            @click="handleClose"
            class="text-aqm-text-dim hover:text-white transition-colors p-2 hover:bg-aqm-card rounded-lg"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </header>

        <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div class="px-6 py-4 border-b border-aqm-border space-y-5 flex-shrink-0">
            <div>
              <label class="block text-aqm-text text-sm font-medium mb-2">選擇設備</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="device in devices"
                  :key="device.id"
                  @click="toggleDevice(device.id)"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2',
                    selectedDevices.includes(device.id)
                      ? 'bg-aqm-accent text-aqm-dark font-medium'
                      : 'bg-aqm-card text-aqm-text-dim hover:bg-aqm-card/80'
                  ]"
                >
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="{
                      'bg-green-500': device.status === 'online',
                      'bg-red-500': device.status === 'offline',
                      'bg-yellow-500': device.status === 'warning',
                    }"
                  />
                  {{ device.name }}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-aqm-text text-sm font-medium mb-2">選擇指標</label>
              <div class="space-y-3">
                <div>
                  <span class="text-aqm-text-dim text-xs mb-1.5 block">化學品監測</span>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="metric in chemicalMetrics"
                      :key="metric.id"
                      @click="selectedMetric = metric.id"
                      :class="[
                        'px-3 py-1.5 rounded-lg text-sm transition-colors',
                        selectedMetric === metric.id
                          ? 'bg-aqm-accent text-aqm-dark font-medium'
                          : 'bg-aqm-card text-aqm-text-dim hover:bg-aqm-card/80'
                      ]"
                    >
                      {{ metric.label }}
                    </button>
                  </div>
                </div>
                <div>
                  <span class="text-aqm-text-dim text-xs mb-1.5 block">環境監測</span>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="metric in environmentMetrics"
                      :key="metric.id"
                      @click="selectedMetric = metric.id"
                      :class="[
                        'px-3 py-1.5 rounded-lg text-sm transition-colors',
                        selectedMetric === metric.id
                          ? 'bg-aqm-accent text-aqm-dark font-medium'
                          : 'bg-aqm-card text-aqm-text-dim hover:bg-aqm-card/80'
                      ]"
                    >
                      {{ metric.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col lg:flex-row gap-5">
              <div class="flex-1">
                <TimeRangePicker
                  v-model="timeRange"
                  :preset-options="presetOptions"
                />
              </div>
              <div class="lg:w-40 flex-shrink-0">
                <label class="block text-aqm-text text-sm font-medium mb-2">平均區間</label>
                <div class="flex items-center gap-2">
                  <input
                    type="text"
                    inputmode="numeric"
                    :value="interval"
                    @input="handleIntervalInput"
                    @blur="handleIntervalBlur"
                    class="w-20 bg-aqm-card border border-aqm-border rounded-lg px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-aqm-accent transition-colors"
                  />
                  <span class="text-aqm-text-dim text-sm">分鐘</span>
                </div>
                <span class="text-aqm-text-dim text-xs mt-1 block">(1-60)</span>
              </div>
            </div>

            <div>
              <label class="block text-aqm-text text-sm font-medium mb-3">計算方式</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    v-model="aggregation"
                    value="avg"
                    class="sr-only"
                  />
                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                    :class="aggregation === 'avg'
                      ? 'border-aqm-accent bg-aqm-accent'
                      : 'border-aqm-text-dim'"
                  >
                    <div
                      v-if="aggregation === 'avg'"
                      class="w-2 h-2 rounded-full bg-aqm-dark"
                    />
                  </div>
                  <span class="text-aqm-text">平均值</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    v-model="aggregation"
                    value="median"
                    class="sr-only"
                  />
                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                    :class="aggregation === 'median'
                      ? 'border-aqm-accent bg-aqm-accent'
                      : 'border-aqm-text-dim'"
                  >
                    <div
                      v-if="aggregation === 'median'"
                      class="w-2 h-2 rounded-full bg-aqm-dark"
                    />
                  </div>
                  <span class="text-aqm-text">中位數</span>
                </label>
              </div>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <button
                @click="handleQuery"
                :disabled="!canQuery || loading"
                class="px-5 py-2 rounded-lg bg-aqm-accent text-aqm-dark font-medium hover:bg-aqm-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <LoaderIcon v-if="loading" class="w-4 h-4 animate-spin" />
                {{ loading ? '查詢中...' : '查詢' }}
              </button>
              <button
                @click="handleClear"
                :disabled="loading"
                class="px-5 py-2 rounded-lg bg-aqm-card text-aqm-text hover:bg-aqm-card/80 transition-colors disabled:opacity-50"
              >
                清除
              </button>
              <span v-if="error" class="text-aqm-danger text-sm ml-2">{{ error }}</span>
            </div>
          </div>

          <div class="flex-1 min-h-0 p-6">
            <div class="h-full bg-aqm-panel rounded-xl border border-aqm-border p-4">
              <HistoryChart :data="historyData" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { h, watch } from 'vue'
import { useHistory } from '@/composables/useHistory'
import TimeRangePicker from './TimeRangePicker.vue'
import HistoryChart from './HistoryChart.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  devices: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['close'])

const {
  chemicalMetrics,
  environmentMetrics,
  presetOptions,
  selectedDevices,
  selectedMetric,
  timeRange,
  interval,
  aggregation,
  historyData,
  loading,
  error,
  canQuery,
  fetchHistory,
  resetQuery,
} = useHistory()

const handleIntervalInput = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  if (value !== '') {
    value = parseInt(value, 10)
    if (value < 1) value = 1
    if (value > 60) value = 60
  }
  interval.value = value === '' ? '' : value
}

const handleIntervalBlur = () => {
  if (interval.value === '' || interval.value < 1) {
    interval.value = 1
  }
}

watch(() => props.visible, (newVal) => {
  if (!newVal) {
    resetQuery()
  }
})

const toggleDevice = (deviceId) => {
  const index = selectedDevices.value.indexOf(deviceId)
  if (index === -1) {
    selectedDevices.value.push(deviceId)
  } else {
    selectedDevices.value.splice(index, 1)
  }
}

const handleQuery = () => {
  fetchHistory(props.devices)
}

const handleClear = () => {
  resetQuery()
}

const handleClose = () => {
  emit('close')
}

const XIcon = {
  render() {
    return h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
    }, [
      h('path', {
        d: 'M18 6L6 18M6 6l12 12',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      }),
    ])
  },
}

const LoaderIcon = {
  render() {
    return h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
    }, [
      h('path', {
        d: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83',
        'stroke-linecap': 'round',
      }),
    ])
  },
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
