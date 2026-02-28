<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        @click.self="handleClose"
      >
        <div class="bg-aqm-panel rounded-xl shadow-2xl border border-aqm-border flex flex-col" style="width: 500px; height: 600px;">
          <div class="flex items-center justify-between px-5 py-4 border-b border-aqm-border flex-shrink-0">
            <h2 class="text-white text-lg font-medium">警報通知</h2>
            <button
              @click="handleClose"
              class="text-aqm-text-dim hover:text-white transition-colors p-1"
            >
              <XIcon class="w-5 h-5" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-4">
            <div v-if="notifications.length === 0" class="h-full flex flex-col items-center justify-center text-aqm-text-dim">
              <BellOffIcon class="w-12 h-12 mb-3 opacity-50" />
              <span>目前沒有警報通知</span>
            </div>
            <div v-else class="space-y-3">
              <AlarmNotificationItem
                v-for="notification in notifications"
                :key="notification.id"
                :notification="notification"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { h, watch } from 'vue'
import AlarmNotificationItem from './AlarmNotificationItem.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  notifications: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'read'])

watch(() => props.visible, (newVal) => {
  if (newVal) {
    emit('read')
  }
})

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

const BellOffIcon = {
  render() {
    return h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.5',
    }, [
      h('path', {
        d: 'M13.73 21a2 2 0 01-3.46 0M18.63 13A17.89 17.89 0 0118 8M6.26 6.26A5.86 5.86 0 006 8c0 7-3 9-3 9h14M18 8a6 6 0 00-9.33-5',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      }),
      h('line', {
        x1: '1',
        y1: '1',
        x2: '23',
        y2: '23',
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

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}
</style>
