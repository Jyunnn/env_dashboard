<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[280px] max-w-[400px]"
          :class="[
            toast.type === 'success' 
              ? 'bg-green-600/95 text-white' 
              : 'bg-aqm-danger/95 text-white'
          ]"
        >
          <component 
            :is="toast.type === 'success' ? CheckIcon : XCircleIcon" 
            class="w-5 h-5 flex-shrink-0"
          />
          <span class="flex-1 text-sm">{{ toast.message }}</span>
          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 hover:opacity-70 transition-opacity"
          >
            <XIcon class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { h } from 'vue'
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

const CheckIcon = {
  render() {
    return h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2'
    }, [
      h('path', {
        d: 'M20 6L9 17l-5-5',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    ])
  }
}

const XCircleIcon = {
  render() {
    return h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2'
    }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('path', {
        d: 'M15 9l-6 6M9 9l6 6',
        'stroke-linecap': 'round'
      })
    ])
  }
}

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
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease;
}

.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
