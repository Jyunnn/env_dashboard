<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 bg-aqm-dark flex flex-col"
      >
        <header class="flex items-center justify-between px-6 py-4 border-b border-aqm-border flex-shrink-0">
          <h2 class="text-white text-xl font-medium">警報歷史紀錄</h2>
          <div class="flex items-center gap-2">
            <button
              @click="handleExport"
              :disabled="exporting || loading"
              class="flex items-center gap-2 px-3 py-1.5 bg-aqm-accent text-aqm-dark rounded-lg font-medium hover:bg-aqm-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LoaderIcon v-if="exporting" class="w-4 h-4 animate-spin" />
              <DownloadIcon v-else class="w-4 h-4" />
              <span class="text-sm">{{ exporting ? '匯出中...' : '匯出' }}</span>
            </button>
            <button
              @click="handleClose"
              class="text-aqm-text-dim hover:text-white transition-colors p-2 hover:bg-aqm-card rounded-lg"
            >
              <XIcon class="w-5 h-5" />
            </button>
          </div>
        </header>

        <div class="flex-1 flex flex-col min-h-0 overflow-hidden p-6 gap-4">
          <AlarmHistoryFilter
            v-model:filters="filters"
            :devices="devices"
            @search="handleSearch"
            @reset="handleReset"
          />

          <div class="flex-1 min-h-0 bg-aqm-panel rounded-xl border border-aqm-border overflow-hidden">
            <div v-if="loading" class="h-full flex items-center justify-center">
              <LoaderIcon class="w-8 h-8 text-aqm-accent animate-spin" />
            </div>
            <AlarmHistoryTable
              v-else
              :items="items"
              :pagination="pagination"
              :sorting="sorting"
              @sort="handleSort"
              @page-change="handlePageChange"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { h, watch } from 'vue'
import { useAlarmHistory } from '@/composables/useAlarmHistory'
import AlarmHistoryFilter from './AlarmHistoryFilter.vue'
import AlarmHistoryTable from './AlarmHistoryTable.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  devices: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close'])

const {
  items,
  pagination,
  filters,
  sorting,
  loading,
  exporting,
  fetchAlarmHistory,
  resetFilters,
  setSorting,
  setPage,
  exportToExcel,
} = useAlarmHistory()

watch(() => props.visible, (newVal) => {
  if (newVal) {
    fetchAlarmHistory(1)
  }
})

const handleClose = () => {
  emit('close')
}

const handleSearch = () => {
  fetchAlarmHistory(1)
}

const handleReset = () => {
  resetFilters()
  fetchAlarmHistory(1)
}

const handleSort = (sortBy) => {
  setSorting(sortBy)
  fetchAlarmHistory(pagination.value.page)
}

const handlePageChange = (page) => {
  setPage(page)
}

const handleExport = async () => {
  await exportToExcel()
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

const DownloadIcon = {
  render() {
    return h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
    }, [
      h('path', {
        d: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      }),
      h('polyline', {
        points: '7 10 12 15 17 10',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      }),
      h('line', {
        x1: '12',
        y1: '15',
        x2: '12',
        y2: '3',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
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
