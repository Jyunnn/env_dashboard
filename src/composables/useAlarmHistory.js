import { ref, computed } from 'vue'
import { getAlarmHistory, exportAlarmHistory } from '@/api'

const items = ref([])
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
})

const filters = ref({
  keyword: '',
  deviceId: null,
  severity: null,
  startDate: null,
  endDate: null,
})

const sorting = ref({
  sortBy: 'timestamp',
  sortOrder: 'desc',
})

const loading = ref(false)
const exporting = ref(false)
const error = ref(null)

const metricLabels = {
  voc: 'VOC 2.0',
  nox: 'NOX 2.0',
  co: 'CO 2.0',
  so2: 'SO2',
  o3: 'O3',
  pm25: 'PM2.5',
  odor: '臭味',
  temp: '溫度',
  humidity: '濕度',
  wind: '風速',
  direction: '風向',
  noise: '噪音',
  pm10: 'PM10',
}

function generateMockData() {
  const mockItems = []
  const devices = [
    { id: 1, name: '設備 A' },
    { id: 2, name: '設備 B' },
    { id: 3, name: '設備 C' },
    { id: 4, name: '設備 D' },
  ]
  
  const metrics = ['voc', 'temp', 'humidity', 'pm25', 'co', 'nox']
  const severities = ['high', 'low']
  const messages = {
    high: (metric, value, threshold) => `超過上限閾值 (${value} > ${threshold})`,
    low: (metric, value, threshold) => `低於下限閾值 (${value} < ${threshold})`,
  }

  const now = new Date()
  
  for (let i = 0; i < 45; i++) {
    const device = devices[Math.floor(Math.random() * devices.length)]
    const metric = metrics[Math.floor(Math.random() * metrics.length)]
    const severity = severities[Math.floor(Math.random() * severities.length)]
    const value = Math.round((Math.random() * 100 + 50) * 10) / 10
    const threshold = severity === 'high' ? 80 : 20
    
    const timestamp = new Date(now.getTime() - i * 3600000 - Math.random() * 3600000)
    
    mockItems.push({
      id: i + 1,
      timestamp: timestamp.toISOString(),
      deviceId: device.id,
      deviceName: device.name,
      metricId: metric,
      metricName: metricLabels[metric] || metric,
      message: messages[severity](metric, value, threshold),
      severity,
    })
  }

  mockItems.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  
  return mockItems
}

function filterAndSortMockData(mockData, filtersValue, sortingValue, page, pageSize) {
  let filtered = [...mockData]

  if (filtersValue.keyword) {
    const keyword = filtersValue.keyword.toLowerCase()
    filtered = filtered.filter(item => 
      item.message.toLowerCase().includes(keyword) ||
      item.deviceName.toLowerCase().includes(keyword) ||
      item.metricName.toLowerCase().includes(keyword)
    )
  }

  if (filtersValue.deviceId) {
    filtered = filtered.filter(item => item.deviceId === filtersValue.deviceId)
  }

  if (filtersValue.severity) {
    filtered = filtered.filter(item => item.severity === filtersValue.severity)
  }

  if (filtersValue.startDate) {
    const startDate = new Date(filtersValue.startDate)
    startDate.setHours(0, 0, 0, 0)
    filtered = filtered.filter(item => new Date(item.timestamp) >= startDate)
  }

  if (filtersValue.endDate) {
    const endDate = new Date(filtersValue.endDate)
    endDate.setHours(23, 59, 59, 999)
    filtered = filtered.filter(item => new Date(item.timestamp) <= endDate)
  }

  filtered.sort((a, b) => {
    let aVal, bVal
    
    switch (sortingValue.sortBy) {
      case 'timestamp':
        aVal = new Date(a.timestamp).getTime()
        bVal = new Date(b.timestamp).getTime()
        break
      case 'deviceName':
        aVal = a.deviceName
        bVal = b.deviceName
        break
      case 'metricName':
        aVal = a.metricName
        bVal = b.metricName
        break
      case 'severity':
        aVal = a.severity
        bVal = b.severity
        break
      default:
        aVal = a[sortingValue.sortBy]
        bVal = b[sortingValue.sortBy]
    }

    if (typeof aVal === 'string') {
      const comparison = aVal.localeCompare(bVal)
      return sortingValue.sortOrder === 'asc' ? comparison : -comparison
    }

    return sortingValue.sortOrder === 'asc' ? aVal - bVal : bVal - aVal
  })

  const total = filtered.length
  const totalPages = Math.ceil(total / pageSize)
  const startIndex = (page - 1) * pageSize
  const paginatedItems = filtered.slice(startIndex, startIndex + pageSize)

  return {
    items: paginatedItems,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  }
}

function generateCSV(items) {
  const headers = ['時間', '設備', '項目', '訊息', '嚴重度']
  const rows = items.map(item => [
    formatTimestamp(item.timestamp),
    item.deviceName,
    item.metricName,
    item.message,
    item.severity === 'high' ? '超過上限' : '低於下限',
  ])

  const csvRows = [headers, ...rows]
  const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
  
  return '\uFEFF' + csvContent
}

function formatTimestamp(isoString) {
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
}

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export function useAlarmHistory() {
  const fetchAlarmHistory = async (page = 1) => {
    loading.value = true
    error.value = null

    try {
      const useMock = import.meta.env.VITE_USE_MOCK_DATA !== 'false'

      if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const mockData = generateMockData()
        const result = filterAndSortMockData(
          mockData,
          filters.value,
          sorting.value,
          page,
          pagination.value.pageSize
        )
        items.value = result.items
        pagination.value = result.pagination
      } else {
        const response = await getAlarmHistory({
          page,
          pageSize: pagination.value.pageSize,
          keyword: filters.value.keyword || undefined,
          deviceId: filters.value.deviceId || undefined,
          severity: filters.value.severity || undefined,
          startDate: filters.value.startDate || undefined,
          endDate: filters.value.endDate || undefined,
          sortBy: sorting.value.sortBy,
          sortOrder: sorting.value.sortOrder,
        })

        if (response.success && response.data) {
          items.value = response.data.items
          pagination.value = response.data.pagination
        }
      }
    } catch (err) {
      error.value = err.message || '取得警報歷史失敗'
      items.value = []
    } finally {
      loading.value = false
    }
  }

  const resetFilters = () => {
    filters.value = {
      keyword: '',
      deviceId: null,
      severity: null,
      startDate: null,
      endDate: null,
    }
    sorting.value = {
      sortBy: 'timestamp',
      sortOrder: 'desc',
    }
    pagination.value.page = 1
  }

  const setSorting = (sortBy) => {
    if (sorting.value.sortBy === sortBy) {
      sorting.value.sortOrder = sorting.value.sortOrder === 'asc' ? 'desc' : 'asc'
    } else {
      sorting.value.sortBy = sortBy
      sorting.value.sortOrder = 'desc'
    }
  }

  const setPage = (page) => {
    pagination.value.page = page
    fetchAlarmHistory(page)
  }

  const exportToExcel = async () => {
    exporting.value = true

    try {
      const useMock = import.meta.env.VITE_USE_MOCK_DATA !== 'false'

      if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const mockData = generateMockData()
        const filtered = filterAndSortMockData(
          mockData,
          filters.value,
          sorting.value,
          1,
          1000
        )
        
        const csvContent = generateCSV(filtered.items)
        downloadFile(csvContent, 'alarm-history.csv', 'text/csv;charset=utf-8;')
      } else {
        const blob = await exportAlarmHistory({
          keyword: filters.value.keyword || undefined,
          deviceId: filters.value.deviceId || undefined,
          severity: filters.value.severity || undefined,
          startDate: filters.value.startDate || undefined,
          endDate: filters.value.endDate || undefined,
          sortBy: sorting.value.sortBy,
          sortOrder: sorting.value.sortOrder,
        })

        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `alarm-history-${formatDate(new Date())}.xlsx`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }

      return { success: true }
    } catch (err) {
      error.value = err.message || '匯出失敗'
      return { success: false, message: error.value }
    } finally {
      exporting.value = false
    }
  }

  return {
    items,
    pagination,
    filters,
    sorting,
    loading,
    exporting,
    error,
    fetchAlarmHistory,
    resetFilters,
    setSorting,
    setPage,
    exportToExcel,
  }
}
