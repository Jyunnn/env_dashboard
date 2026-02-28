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
            <h2 class="text-white text-lg font-medium">
              設定警報閾值 - {{ title }}
            </h2>
            <button
              @click="handleClose"
              :disabled="loading"
              class="text-aqm-text-dim hover:text-white transition-colors p-1 disabled:opacity-50"
            >
              <XIcon class="w-5 h-5" />
            </button>
          </div>

          <div class="p-4 space-y-4">
            <label class="flex items-center gap-3 cursor-pointer">
              <div
                class="relative w-11 h-6 rounded-full transition-colors"
                :class="localConfig.enabled ? 'bg-aqm-accent' : 'bg-aqm-card'"
              >
                <input
                  type="checkbox"
                  v-model="localConfig.enabled"
                  :disabled="loading"
                  class="sr-only"
                />
                <div
                  class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow"
                  :class="localConfig.enabled ? 'translate-x-5' : ''"
                />
              </div>
              <span class="text-aqm-text">啟用警報</span>
            </label>

            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <div class="flex-1">
                  <label class="block text-aqm-text-dim text-xs mb-1">
                    {{ isDirection ? '最小角度' : '下限' }}
                  </label>
                  <input
                    type="number"
                    v-model.number="localConfig.min"
                    :placeholder="isDirection ? '0' : '輸入下限值'"
                    :min="isDirection ? 0 : undefined"
                    :max="isDirection ? 360 : undefined"
                    :disabled="!localConfig.enabled || loading"
                    class="w-full bg-aqm-card border border-aqm-border rounded-lg px-3 py-2 text-white placeholder-aqm-text-dim/50 focus:outline-none focus:border-aqm-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div class="flex-1">
                  <label class="block text-aqm-text-dim text-xs mb-1">
                    {{ isDirection ? '最大角度' : '上限' }}
                  </label>
                  <input
                    type="number"
                    v-model.number="localConfig.max"
                    :placeholder="isDirection ? '360' : '輸入上限值'"
                    :min="isDirection ? 0 : undefined"
                    :max="isDirection ? 360 : undefined"
                    :disabled="!localConfig.enabled || loading"
                    class="w-full bg-aqm-card border border-aqm-border rounded-lg px-3 py-2 text-white placeholder-aqm-text-dim/50 focus:outline-none focus:border-aqm-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              <div class="text-right">
                <span class="text-aqm-text-dim text-xs">單位: {{ isDirection ? '°' : unit }}</span>
              </div>
            </div>

            <div
              v-if="isDirection"
              class="bg-aqm-card rounded-lg p-3"
            >
              <p class="text-aqm-text-dim text-xs">
                角度說明：N=0°, E=90°, S=180°, W=270°
              </p>
            </div>
          </div>

          <div class="flex justify-end gap-3 p-4 border-t border-aqm-border">
            <button
              @click="handleClose"
              :disabled="loading"
              class="px-4 py-2 rounded-lg text-aqm-text hover:bg-aqm-card transition-colors disabled:opacity-50"
            >
              取消
            </button>
            <button
              @click="handleSave"
              :disabled="loading"
              class="px-4 py-2 rounded-lg bg-aqm-accent text-aqm-dark font-medium hover:bg-aqm-accent/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <LoaderIcon v-if="loading" class="w-4 h-4 animate-spin" />
              {{ loading ? '儲存中...' : '儲存' }}
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
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  deviceId: {
    type: [Number, String],
    required: true
  },
  metricId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    default: ''
  },
  isDirection: {
    type: Boolean,
    default: false
  },
  config: {
    type: Object,
    default: () => ({ min: null, max: null, enabled: false })
  }
})

const emit = defineEmits(['close', 'save'])

const localConfig = ref({
  min: null,
  max: null,
  enabled: false
})

watch(() => props.visible, (newVal) => {
  if (newVal) {
    localConfig.value = {
      min: props.config.min ?? null,
      max: props.config.max ?? null,
      enabled: props.config.enabled ?? false
    }
  }
})

const XIcon = {
  render() {
    return h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2'
    }, [
      h('path', {
        d: 'M18 6L6 18M6 6l12 12',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    ])
  }
}

const LoaderIcon = {
  render() {
    return h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2'
    }, [
      h('path', {
        d: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83',
        'stroke-linecap': 'round'
      })
    ])
  }
}

const handleClose = () => {
  if (!props.loading) {
    emit('close')
  }
}

const handleSave = () => {
  emit('save', {
    deviceId: props.deviceId,
    metricId: props.metricId,
    config: { ...localConfig.value }
  })
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
