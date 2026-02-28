<template>
  <header class="h-[50px] md:h-[60px] lg:h-navbar bg-aqm-dark border-b border-aqm-border px-3 md:px-6 flex items-center justify-between flex-shrink-0">
    <div class="flex items-center gap-2 md:gap-3">
      <div class="flex items-center gap-1 md:gap-2">
        <div class="w-0.5 md:w-1 h-6 md:h-8 bg-aqm-accent rounded-full" />
        <h1 class="text-xl md:text-2xl font-bold text-aqm-accent">AQM</h1>
      </div>
      <span class="text-aqm-text-dim text-xs md:text-sm ml-1 md:ml-2 hidden sm:inline">Dashboard</span>
    </div>
    
    <div class="flex items-center gap-1 md:gap-2 lg:gap-3">
      <button 
        v-for="btn in navButtons" 
        :key="btn.id"
        class="flex items-center gap-1 md:gap-2 px-2 md:px-3 lg:px-4 py-1.5 md:py-2 bg-aqm-panel rounded-lg transition-all duration-200 hover:bg-aqm-card relative"
        :title="btn.label"
        @click="$emit(btn.event)"
      >
        <component :is="btn.icon" class="w-4 h-4 md:w-5 md:h-5 text-aqm-text-dim" />
        <span class="text-aqm-text text-xs md:text-sm hidden sm:inline">{{ btn.label }}</span>
        
        <span 
          v-if="btn.badge"
          class="absolute -top-0.5 md:-top-1 -right-0.5 md:-right-1 w-4 h-4 md:w-5 md:h-5 bg-aqm-danger rounded-full text-white text-[10px] md:text-xs flex items-center justify-center"
        >
          {{ btn.badge }}
        </span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { h } from 'vue'

defineProps({
  notificationCount: {
    type: Number,
    default: 0
  }
})

defineEmits(['settings', 'trend', 'history', 'refresh', 'notification'])

const SettingsIcon = {
  render() {
    return h('svg', { 
      viewBox: '0 0 24 24', 
      fill: 'none', 
      stroke: 'currentColor', 
      'stroke-width': '1.5' 
    }, [
      h('path', { 
        d: 'M12 15a3 3 0 100-6 3 3 0 000 6z'
      }),
      h('path', { 
        d: 'M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z'
      })
    ])
  }
}

const TrendIcon = {
  render() {
    return h('svg', { 
      viewBox: '0 0 24 24', 
      fill: 'none', 
      stroke: 'currentColor', 
      'stroke-width': '1.5' 
    }, [
      h('path', { 
        d: 'M23 6l-9.5 9.5-5-5L1 18',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      h('path', { 
        d: 'M17 6h6v6',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    ])
  }
}

const HistoryIcon = {
  render() {
    return h('svg', { 
      viewBox: '0 0 24 24', 
      fill: 'none', 
      stroke: 'currentColor', 
      'stroke-width': '1.5' 
    }, [
      h('path', { 
        d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    ])
  }
}

const RefreshIcon = {
  render() {
    return h('svg', { 
      viewBox: '0 0 24 24', 
      fill: 'none', 
      stroke: 'currentColor', 
      'stroke-width': '1.5' 
    }, [
      h('path', { 
        d: 'M1 4v6h6M23 20v-6h-6',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      h('path', { 
        d: 'M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    ])
  }
}

const BellIcon = {
  render() {
    return h('svg', { 
      viewBox: '0 0 24 24', 
      fill: 'none', 
      stroke: 'currentColor', 
      'stroke-width': '1.5' 
    }, [
      h('path', { 
        d: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    ])
  }
}

const navButtons = [
  { id: 'settings', label: '設定', icon: SettingsIcon, event: 'settings' },
  { id: 'trend', label: '趨勢', icon: TrendIcon, event: 'trend' },
  { id: 'history', label: '紀錄', icon: HistoryIcon, event: 'history' },
  { id: 'refresh', label: '刷新', icon: RefreshIcon, event: 'refresh' },
  { id: 'notification', label: '通知', icon: BellIcon, event: 'notification', badge: 6 },
]
</script>

<style scoped>
.h-navbar {
  height: 70px;
}
</style>
