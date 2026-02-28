<template>
  <div 
    class="bg-aqm-card rounded-xl transition-all duration-300 hover:bg-opacity-80 h-full"
    :class="[
      size === '2x2' ? 'col-span-2 row-span-2 p-4 md:p-6' : 'p-3 md:p-4 min-h-[100px]'
    ]"
  >
    <template v-if="size === '1x1'">
      <div class="h-full flex flex-col items-center justify-center">
        <div class="mb-1 md:mb-2">
          <component :is="iconComponent" class="w-6 h-6 md:w-8 md:h-8 text-aqm-text-dim" />
        </div>
        
        <span class="text-aqm-text text-xs md:text-sm">{{ label }}</span>
        
        <div class="mt-1 md:mt-2 text-center">
          <span class="text-white text-lg md:text-xl lg:text-2xl font-bold">{{ displayValue }}</span>
          <span v-if="unit" class="text-aqm-text-dim text-[10px] md:text-xs ml-1">{{ unit }}</span>
        </div>
      </div>
    </template>
    
    <template v-else-if="size === '2x2'">
      <div class="h-full flex flex-col items-center justify-center">
        <component :is="iconComponent" class="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-aqm-text-dim" />
        <span class="text-aqm-text text-sm md:text-base mt-2 md:mt-3">{{ label }}</span>
        <span class="text-white text-2xl md:text-3xl lg:text-4xl font-bold mt-1">{{ displayValue }}</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  unit: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: '1x1',
    validator: (value) => ['1x1', '2x2'].includes(value)
  }
})

const displayValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toFixed(1)
  }
  return props.value
})

const ThermometerIcon = {
  render() {
    return h('svg', { 
      viewBox: '0 0 24 24', 
      fill: 'none', 
      stroke: 'currentColor', 
      'stroke-width': '1.5' 
    }, [
      h('path', { 
        d: 'M12 9V3m0 0l3 3m-3-3L9 6m3 3a6 6 0 100 12 6 6 0 000-12z',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    ])
  }
}

const DropletIcon = {
  render() {
    return h('svg', { 
      viewBox: '0 0 24 24', 
      fill: 'none', 
      stroke: 'currentColor', 
      'stroke-width': '1.5' 
    }, [
      h('path', { 
        d: 'M12 2.69l5.66 5.66a8 8 0 11-11.31 0z',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    ])
  }
}

const WindIcon = {
  render() {
    return h('svg', { 
      viewBox: '0 0 24 24', 
      fill: 'none', 
      stroke: 'currentColor', 
      'stroke-width': '1.5' 
    }, [
      h('path', { 
        d: 'M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    ])
  }
}

const CompassIcon = {
  render() {
    return h('svg', { 
      viewBox: '0 0 100 100', 
      fill: 'none', 
      stroke: 'currentColor', 
      'stroke-width': '1.5' 
    }, [
      h('circle', { cx: '50', cy: '50', r: '45', 'stroke-width': '2' }),
      h('circle', { cx: '50', cy: '50', r: '35', 'stroke-width': '1', opacity: '0.5' }),
      h('circle', { cx: '50', cy: '50', r: '8', fill: '#CFCFCF', stroke: 'none' }),
      h('line', { x1: '50', y1: '5', x2: '50', y2: '15', 'stroke-width': '2' }),
      h('line', { x1: '50', y1: '85', x2: '50', y2: '95', 'stroke-width': '1', opacity: '0.5' }),
      h('line', { x1: '5', y1: '50', x2: '15', y2: '50', 'stroke-width': '1', opacity: '0.5' }),
      h('line', { x1: '85', y1: '50', x2: '95', y2: '50', 'stroke-width': '1', opacity: '0.5' }),
      h('polygon', { 
        points: '50,18 44,50 50,56 56,50',
        fill: '#00E5D0',
        stroke: '#00E5D0',
        'stroke-width': '1'
      }),
      h('polygon', { 
        points: '50,82 44,50 50,44 56,50',
        fill: '#A9ADB2',
        stroke: '#A9ADB2',
        'stroke-width': '1',
        opacity: '0.6'
      }),
      h('text', { x: '50', y: '12', fill: '#CFCFCF', 'text-anchor': 'middle', 'font-size': '10', 'font-weight': 'bold' }, 'N'),
      h('text', { x: '50', y: '94', fill: '#A9ADB2', 'text-anchor': 'middle', 'font-size': '8' }, 'S'),
      h('text', { x: '8', y: '53', fill: '#A9ADB2', 'text-anchor': 'middle', 'font-size': '8' }, 'W'),
      h('text', { x: '92', y: '53', fill: '#A9ADB2', 'text-anchor': 'middle', 'font-size': '8' }, 'E'),
    ])
  }
}

const VolumeIcon = {
  render() {
    return h('svg', { 
      viewBox: '0 0 24 24', 
      fill: 'none', 
      stroke: 'currentColor', 
      'stroke-width': '1.5' 
    }, [
      h('path', { 
        d: 'M11 5L6 9H2v6h4l5 4V5z',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      h('path', { 
        d: 'M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    ])
  }
}

const ParticleIcon = {
  render() {
    return h('svg', { 
      viewBox: '0 0 24 24', 
      fill: 'none', 
      stroke: 'currentColor', 
      'stroke-width': '1.5' 
    }, [
      h('circle', { cx: '12', cy: '12', r: '3' }),
      h('circle', { cx: '12', cy: '5', r: '1' }),
      h('circle', { cx: '12', cy: '19', r: '1' }),
      h('circle', { cx: '5', cy: '12', r: '1' }),
      h('circle', { cx: '19', cy: '12', r: '1' }),
      h('circle', { cx: '7', cy: '7', r: '1' }),
      h('circle', { cx: '17', cy: '17', r: '1' }),
      h('circle', { cx: '17', cy: '7', r: '1' }),
      h('circle', { cx: '7', cy: '17', r: '1' })
    ])
  }
}

const OdorIcon = {
  render() {
    return h('svg', { 
      viewBox: '0 0 24 24', 
      fill: 'none', 
      stroke: 'currentColor', 
      'stroke-width': '1.5' 
    }, [
      h('path', { 
        d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z'
      }),
      h('path', { 
        d: 'M8 14s1.5 2 4 2 4-2 4-2',
        'stroke-linecap': 'round'
      }),
      h('circle', { cx: '9', cy: '9', r: '1', fill: 'currentColor' }),
      h('circle', { cx: '15', cy: '9', r: '1', fill: 'currentColor' })
    ])
  }
}

const iconMap = {
  thermometer: ThermometerIcon,
  droplet: DropletIcon,
  wind: WindIcon,
  compass: CompassIcon,
  volume: VolumeIcon,
  particle: ParticleIcon,
  odor: OdorIcon,
}

const iconComponent = computed(() => {
  return iconMap[props.type] || ParticleIcon
})
</script>
