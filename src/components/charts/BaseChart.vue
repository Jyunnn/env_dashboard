<template>
  <v-chart :option="option" autoresize />
</template>

<script setup>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import { computed } from 'vue'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
  chartType: {
    type: String,
    default: 'line',
    validator: (value) => ['line', 'bar', 'pie'].includes(value),
  },
  title: {
    type: String,
    default: '',
  },
})

const option = computed(() => ({
  title: {
    text: props.title,
  },
  tooltip: {
    trigger: props.chartType === 'pie' ? 'item' : 'axis',
  },
  legend: {
    data: props.chartData.legend || [],
  },
  xAxis:
    props.chartType !== 'pie'
      ? {
          type: 'category',
          data: props.chartData.xAxis || [],
        }
      : undefined,
  yAxis:
    props.chartType !== 'pie'
      ? {
          type: 'value',
        }
      : undefined,
  series: [
    {
      name: props.chartData.seriesName || '',
      type: props.chartType,
      data: props.chartData.values || [],
      smooth: props.chartType === 'line',
    },
  ],
}))
</script>

<style scoped>
.v-chart {
  width: 100%;
  height: 300px;
}
</style>
