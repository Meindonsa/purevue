<script setup lang="ts">
import { ref, computed, provide, watch } from 'vue'
import { STEPPER_KEY } from './Stepper.types'
import type { StepperProps, StepperOrientation, StepperSize } from './Stepper.types'

const props = withDefaults(defineProps<StepperProps>(), {
  orientation: 'horizontal',
  size: 'md',
  linear: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const steps = ref<string[]>([])
const activeValue = ref(props.modelValue ?? '')
const direction = ref(1)
const completed = ref<Record<string, boolean>>({})

watch(() => props.modelValue, (val) => {
  if (val) activeValue.value = val
})

function registerStep(value: string) {
  if (!steps.value.includes(value)) {
    steps.value.push(value)
    if (!activeValue.value) activeValue.value = value
  }
}

function activateCallback(value: string) {
  const currentIndex = steps.value.indexOf(activeValue.value)
  const nextIndex    = steps.value.indexOf(value)
  if (nextIndex === -1) return
  if (props.linear && nextIndex > currentIndex + 1) return
  direction.value = nextIndex > currentIndex ? 1 : -1
  activeValue.value = value
  emit('update:modelValue', value)
  emit('change', value)
}

function markCompleted(value: string, done: boolean) {
  completed.value[value] = done
}

provide(STEPPER_KEY, {
  activeValue,
  orientation: computed(() => props.orientation as StepperOrientation),
  size: computed(() => props.size as StepperSize),
  linear: computed(() => props.linear),
  steps,
  direction,
  completed,
  registerStep,
  activateCallback,
  markCompleted,
})
</script>

<template>
  <div
      :class="[
      'flex w-full',
      orientation === 'vertical' ? 'flex-row gap-6' : 'flex-col gap-4',
    ]"
  >
    <slot />
  </div>
</template>