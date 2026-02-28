<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-auto">
      <table class="w-full">
        <thead class="sticky top-0 bg-aqm-panel z-10">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              @click="column.sortable && handleSort(column.key)"
              :class="[
                'text-left px-4 py-3 text-aqm-text text-sm font-medium border-b border-aqm-border',
                column.sortable ? 'cursor-pointer hover:text-aqm-accent transition-colors' : ''
              ]"
            >
              <div class="flex items-center gap-1">
                {{ column.label }}
                <span v-if="column.sortable && sorting.sortBy === column.key" class="text-aqm-accent">
                  {{ sorting.sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item.id"
            class="border-b border-aqm-border/50 hover:bg-aqm-card/30 transition-colors"
          >
            <td class="px-4 py-3 text-aqm-text text-sm whitespace-nowrap">
              {{ formatTimestamp(item.timestamp) }}
            </td>
            <td class="px-4 py-3 text-aqm-text text-sm">
              {{ item.deviceName }}
            </td>
            <td class="px-4 py-3 text-aqm-text text-sm">
              {{ item.metricName }}
            </td>
            <td class="px-4 py-3 text-aqm-text text-sm">
              {{ item.message }}
            </td>
            <td class="px-4 py-3 text-sm">
              <div class="flex items-center gap-2">
                <span
                  class="w-2 h-2 rounded-full"
                  :class="item.severity === 'high' ? 'bg-aqm-danger' : 'bg-yellow-500'"
                />
                <span
                  :class="item.severity === 'high' ? 'text-aqm-danger' : 'text-yellow-500'"
                >
                  {{ item.severity === 'high' ? '超過上限' : '低於下限' }}
                </span>
              </div>
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="5" class="px-4 py-12 text-center text-aqm-text-dim">
              <div class="flex flex-col items-center gap-2">
                <EmptyIcon class="w-12 h-12 opacity-50" />
                <span>尚無警報紀錄</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="pagination.total > 0" class="flex items-center justify-between px-4 py-3 border-t border-aqm-border">
      <div class="text-aqm-text-dim text-sm">
        顯示 {{ startItem }}-{{ endItem }} 筆，共 {{ pagination.total }} 筆
      </div>
      <div class="flex items-center gap-1">
        <button
          @click="handlePageChange(pagination.page - 1)"
          :disabled="pagination.page === 1"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-aqm-text-dim hover:bg-aqm-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ‹
        </button>
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="handlePageChange(page)"
          :class="[
            'w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors',
            page === pagination.page
              ? 'bg-aqm-accent text-aqm-dark font-medium'
              : 'text-aqm-text-dim hover:bg-aqm-card'
          ]"
        >
          {{ page }}
        </button>
        <button
          @click="handlePageChange(pagination.page + 1)"
          :disabled="pagination.page === pagination.totalPages"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-aqm-text-dim hover:bg-aqm-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  pagination: {
    type: Object,
    default: () => ({
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
    }),
  },
  sorting: {
    type: Object,
    default: () => ({
      sortBy: 'timestamp',
      sortOrder: 'desc',
    }),
  },
})

const emit = defineEmits(['sort', 'page-change'])

const columns = [
  { key: 'timestamp', label: '時間', sortable: true },
  { key: 'deviceName', label: '設備', sortable: true },
  { key: 'metricName', label: '項目', sortable: true },
  { key: 'message', label: '訊息', sortable: false },
  { key: 'severity', label: '嚴重度', sortable: true },
]

const startItem = computed(() => {
  return (props.pagination.page - 1) * props.pagination.pageSize + 1
})

const endItem = computed(() => {
  return Math.min(props.pagination.page * props.pagination.pageSize, props.pagination.total)
})

const visiblePages = computed(() => {
  const pages = []
  const { page, totalPages } = props.pagination
  const delta = 2

  let start = Math.max(1, page - delta)
  let end = Math.min(totalPages, page + delta)

  if (page <= delta + 1) {
    end = Math.min(totalPages, delta * 2 + 1)
  }

  if (page >= totalPages - delta) {
    start = Math.max(1, totalPages - delta * 2)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const formatTimestamp = (isoString) => {
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
}

const handleSort = (key) => {
  emit('sort', key)
}

const handlePageChange = (page) => {
  if (page >= 1 && page <= props.pagination.totalPages) {
    emit('page-change', page)
  }
}

const EmptyIcon = {
  render() {
    return h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.5',
    }, [
      h('path', {
        d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      }),
    ])
  },
}
</script>
