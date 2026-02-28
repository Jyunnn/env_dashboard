<template>
  <div class="space-y-3">
    <label class="block text-aqm-text text-sm font-medium">時間範圍</label>
    
    <div class="flex flex-wrap gap-2">
      <button
        v-for="option in presetOptions"
        :key="option.value"
        @click="selectPreset(option.value)"
        :class="[
          'px-3 py-1.5 rounded-lg text-sm transition-colors',
          modelValue.preset === option.value
            ? 'bg-aqm-accent text-aqm-dark font-medium'
            : 'bg-aqm-card text-aqm-text-dim hover:bg-aqm-card/80'
        ]"
      >
        {{ option.label }}
      </button>
      <button
        @click="selectPreset('custom')"
        :class="[
          'px-3 py-1.5 rounded-lg text-sm transition-colors',
          modelValue.preset === 'custom'
            ? 'bg-aqm-accent text-aqm-dark font-medium'
            : 'bg-aqm-card text-aqm-text-dim hover:bg-aqm-card/80'
        ]"
      >
        自訂
      </button>
    </div>

    <Transition name="fade">
      <div v-if="modelValue.preset === 'custom'" class="flex flex-col sm:flex-row gap-3">
        <div class="flex-1">
          <label class="block text-aqm-text-dim text-xs mb-1">開始時間</label>
          <input
            type="datetime-local"
            :value="modelValue.customStart ? formatDateTimeLocal(modelValue.customStart) : ''"
            @input="updateCustomStart($event.target.value)"
            class="w-full bg-aqm-card border border-aqm-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-aqm-accent transition-colors"
          />
        </div>
        <div class="flex-1">
          <label class="block text-aqm-text-dim text-xs mb-1">結束時間</label>
          <input
            type="datetime-local"
            :value="modelValue.customEnd ? formatDateTimeLocal(modelValue.customEnd) : ''"
            @input="updateCustomEnd($event.target.value)"
            class="w-full bg-aqm-card border border-aqm-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-aqm-accent transition-colors"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  presetOptions: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const selectPreset = (preset) => {
  emit('update:modelValue', {
    ...props.modelValue,
    preset,
  })
}

const formatDateTimeLocal = (isoString) => {
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const updateCustomStart = (value) => {
  if (value) {
    emit('update:modelValue', {
      ...props.modelValue,
      customStart: new Date(value).toISOString(),
    })
  }
}

const updateCustomEnd = (value) => {
  if (value) {
    emit('update:modelValue', {
      ...props.modelValue,
      customEnd: new Date(value).toISOString(),
    })
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
