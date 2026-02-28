<template>
  <div class="h-full w-full">
    <v-chart v-if="hasData" :option="chartOption" autoresize class="h-full w-full" />
    <div v-else class="h-full flex items-center justify-center text-aqm-text-dim">
      <p>請選擇條件後點擊查詢</p>
    </div>
  </div>
</template>

<script setup>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import { computed, h } from 'vue'

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
})

const hasData = computed(() => {
  return props.data && props.data.devices && props.data.devices.length > 0
})

const formatTime = (isoString) => {
  const date = new Date(isoString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${month}/${day} ${hours}:${minutes}`
}

const chartOption = computed(() => {
  if (!hasData.value) return {}

  const { metric, devices } = props.data

  const allTimestamps = new Set()
  devices.forEach(device => {
    device.data.forEach(point => {
      allTimestamps.add(point.timestamp)
    })
  })
  
  const sortedTimestamps = Array.from(allTimestamps).sort()

  const series = devices.map(device => ({
    name: device.name,
    type: 'line',
    data: sortedTimestamps.map(timestamp => {
      const point = device.data.find(p => p.timestamp === timestamp)
      return point ? point.value : null
    }),
    smooth: true,
    symbol: 'circle',
    symbolSize: 4,
    showSymbol: false,
    emphasis: {
      focus: 'series'
    },
    lineStyle: {
      width: 2,
    },
  }))

  return {
    backgroundColor: 'transparent',
    title: {
      text: `${metric.label} 歷史數據`,
      left: 'center',
      top: 10,
      textStyle: {
        color: '#CFCFCF',
        fontSize: 16,
        fontWeight: 'normal',
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(31, 31, 31, 0.95)',
      borderColor: 'rgba(255, 255, 255, 0.15)',
      borderWidth: 1,
      textStyle: {
        color: '#CFCFCF',
      },
      formatter: (params) => {
        if (!params || params.length === 0) return ''
        
        const time = params[0].axisValue
        let html = `<div style="margin-bottom: 4px; font-weight: 500;">${time}</div>`
        
        params.forEach(param => {
          if (param.value !== null && param.value !== undefined) {
            html += `<div style="display: flex; justify-content: space-between; gap: 20px;">
              <span>${param.marker} ${param.seriesName}</span>
              <span style="font-weight: 500;">${param.value} ${metric.unit}</span>
            </div>`
          }
        })
        
        return html
      },
    },
    legend: {
      data: devices.map(d => d.name),
      top: 40,
      textStyle: {
        color: '#A9ADB2',
      },
      itemWidth: 20,
      itemHeight: 10,
      itemGap: 20,
    },
    grid: {
      left: 60,
      right: 40,
      top: 90,
      bottom: 60,
    },
    xAxis: {
      type: 'category',
      data: sortedTimestamps.map(formatTime),
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.15)',
        },
      },
      axisLabel: {
        color: '#A9ADB2',
        fontSize: 11,
        rotate: sortedTimestamps.length > 20 ? 45 : 0,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      name: metric.unit,
      nameTextStyle: {
        color: '#A9ADB2',
        fontSize: 12,
        padding: [0, 0, 0, -20],
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        color: '#A9ADB2',
        fontSize: 11,
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.08)',
        },
      },
    },
    series,
    color: ['#00E5D0', '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'],
  }
})
</script>
