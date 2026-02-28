<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        @click.self="handleClose"
      >
        <div class="bg-aqm-panel rounded-xl w-full max-w-md mx-4 shadow-2xl border border-aqm-border">
          <div class="flex items-center justify-between p-4 border-b border-aqm-border">
            <h2 class="text-white text-lg font-medium">即時資料設定</h2>
            <button
              @click="handleClose"
              :disabled="saving"
              class="text-aqm-text-dim hover:text-white transition-colors p-1 disabled:opacity-50"
            >
              <XIcon class="w-5 h-5" />
            </button>
          </div>

          <div class="p-4 space-y-5">
            <div>
              <label class="block text-aqm-text text-sm font-medium mb-3">計算方式</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    v-model="localSettings.aggregation"
                    value="avg"
                    :disabled="saving"
                    class="sr-only"
                  />
                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                    :class="localSettings.aggregation === 'avg'
                      ? 'border-aqm-accent bg-aqm-accent'
                      : 'border-aqm-text-dim'"
                  >
                    <div
                      v-if="localSettings.aggregation === 'avg'"
                      class="w-2 h-2 rounded-full bg-aqm-dark"
                    />
                  </div>
                  <span class="text-aqm-text">平均值</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    v-model="localSettings.aggregation"
                    value="median"
                    :disabled="saving"
                    class="sr-only"
                  />
                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                    :class="localSettings.aggregation === 'median'
                      ? 'border-aqm-accent bg-aqm-accent'
                      : 'border-aqm-text-dim'"
                  >
                    <div
                      v-if="localSettings.aggregation === 'median'"
                      class="w-2 h-2 rounded-full bg-aqm-dark"
                    />
                  </div>
                  <span class="text-aqm-text">中位數</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-aqm-text text-sm font-medium mb-2">平均區間</label>
              <div class="flex items-center gap-3">
                <input
                  type="text"
                  inputmode="numeric"
                  :value="localSettings.interval"
                  @input="handleIntervalInput"
                  @blur="handleIntervalBlur"
                  :disabled="saving"
                  class="w-20 bg-aqm-card border border-aqm-border rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-aqm-accent transition-colors disabled:opacity-50"
                />
                <span class="text-aqm-text">分鐘</span>
                <span class="text-aqm-text-dim text-xs">(1-60)</span>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 p-4 border-t border-aqm-border">
            <button
              @click="handleClose"
              :disabled="saving"
              class="px-4 py-2 rounded-lg text-aqm-text hover:bg-aqm-card transition-colors disabled:opacity-50"
            >
              取消
            </button>
            <button
              @click="handleSave"
              :disabled="saving"
              class="px-4 py-2 rounded-lg bg-aqm-accent text-aqm-dark font-medium hover:bg-aqm-accent/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <LoaderIcon v-if="saving" class="w-4 h-4 animate-spin" />
              {{ saving ? '儲存中...' : '確定' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, h } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  settings: {
    type: Object,
    default: () => ({
      interval: 5,
      aggregation: 'avg',
    }),
  },
  saving: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'save'])

const localSettings = ref({
  interval: 5,
  aggregation: 'avg',
})

watch(() => props.visible, (newVal) => {
  if (newVal) {
    localSettings.value = {
      interval: props.settings.interval ?? 5,
      aggregation: props.settings.aggregation ?? 'avg',
    }
  }
})

const handleIntervalInput = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  if (value !== '') {
    value = parseInt(value, 10)
    if (value < 1) value = 1
    if (value > 60) value = 60
  }
  localSettings.value.interval = value === '' ? '' : value
}

const handleIntervalBlur = () => {
  if (localSettings.value.interval === '' || localSettings.value.interval < 1) {
    localSettings.value.interval = 1
  }
}

const handleClose = () => {
  if (!props.saving) {
    emit('close')
  }
}

const handleSave = () => {
  emit('save', { ...localSettings.value })
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

.modal-enter-active .bg-aqm-panel,
.modal-leave-active .bg-aqm-panel {
  transition: transform 0.2s ease;
}

.modal-enter-from .bg-aqm-panel,
.modal-leave-to .bg-aqm-panel {
  transform: scale(0.95);
}
</style>
