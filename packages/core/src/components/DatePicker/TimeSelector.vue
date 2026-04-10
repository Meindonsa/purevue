<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue?: Date | null
}>()

const emit = defineEmits<{
  change: [hours: number, minutes: number]
}>()

const hours   = ref(props.modelValue?.getHours()   ?? 0)
const minutes = ref(props.modelValue?.getMinutes() ?? 0)

watch(() => props.modelValue, (val) => {
  if (val) { hours.value = val.getHours(); minutes.value = val.getMinutes() }
})

function onHours(e: Event) {
  hours.value = Math.min(23, Math.max(0, Number((e.target as HTMLInputElement).value)))
  emit('change', hours.value, minutes.value)
}

function onMinutes(e: Event) {
  minutes.value = Math.min(59, Math.max(0, Number((e.target as HTMLInputElement).value)))
  emit('change', hours.value, minutes.value)
}

function pad(n: number) { return String(n).padStart(2, '0') }
</script>

<template>
  <div class="flex items-center justify-center gap-2 px-4 py-3 border-t border-surface-100">
    <svg class="w-4 h-4 text-surface-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
    <div class="flex items-center gap-1">
      <input
          type="number"
          :value="pad(hours)"
          min="0" max="23"
          class="w-12 text-center text-sm border border-surface-200 rounded-md py-1 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          @change="onHours"
      />
      <span class="text-surface-400 font-bold">:</span>
      <input
          type="number"
          :value="pad(minutes)"
          min="0" max="59"
          class="w-12 text-center text-sm border border-surface-200 rounded-md py-1 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          @change="onMinutes"
      />
    </div>
  </div>
</template>