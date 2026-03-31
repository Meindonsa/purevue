<script setup lang="ts">
import { inject, computed, onMounted } from 'vue'
import { STEPPER_KEY } from './Stepper.types'

const props = withDefaults(defineProps<{
  value: string
  completed?: boolean
}>(), {
  completed: true
})

const ctx = inject(STEPPER_KEY)!

onMounted(() => ctx.registerStep(props.value))

const index    = computed(() => ctx.steps.value.indexOf(props.value))
const isActive = computed(() => ctx.activeValue.value === props.value)

const isDone = computed(() => {
  if (!props.completed) return false
  return index.value < ctx.steps.value.indexOf(ctx.activeValue.value)
})

const isClickable = computed(() => {
  if (!props.completed) return false
  if (ctx.linear.value) return isDone.value || isActive.value
  return true
})

const circleSizeClasses: Record<string, string> = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
}

const labelSizeClasses: Record<string, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

const circleClasses = computed(() => [
  'rounded-full flex items-center justify-center font-semibold shrink-0 transition-all duration-[--duration-normal] border-2',
  circleSizeClasses[ctx.size.value],
  isDone.value ? 'bg-primary-500 border-primary-500 text-white' : '',
  isActive.value && !isDone.value ? 'bg-surface-0 border-primary-500 text-primary-500' : '',
  !isActive.value && !isDone.value ? 'bg-surface-0 border-surface-300 text-surface-400' : '',
  isClickable.value ? 'cursor-pointer hover:opacity-80' : 'cursor-default opacity-50',
])

const labelClasses = computed(() => [
  'font-medium transition-colors duration-[--duration-normal] whitespace-nowrap',
  labelSizeClasses[ctx.size.value],
  isActive.value               ? 'text-primary-600' : '',
  isDone.value                 ? 'text-surface-700' : '',
  !isActive.value && !isDone.value ? 'text-surface-400' : '',
])

const connectorClasses = computed(() => {
  const done = isDone.value
  if (ctx.orientation.value === 'horizontal') {
    return ['flex-1 h-0.5 transition-all duration-[--duration-slow] mx-2', done ? 'bg-primary-500' : 'bg-surface-200']
  }
  return ['w-0.5 min-h-[2rem] flex-1 transition-all duration-[--duration-slow] my-1 ml-4', done ? 'bg-primary-500' : 'bg-surface-200']
})

const isLast = computed(() => index.value === ctx.steps.value.length - 1)

function handleClick() {
  if (!isClickable.value) return
  ctx.activateCallback(props.value)
}
</script>

<template>
  <!-- Horizontal -->
  <template v-if="ctx.orientation.value === 'horizontal'">
    <div class="flex flex-col items-center gap-2 shrink-0">
      <div :class="circleClasses" @click="handleClick">
        <svg v-if="isDone" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span v-else>{{ index + 1 }}</span>
      </div>
      <span :class="labelClasses"><slot /></span>
    </div>
    <div v-if="!isLast" :class="connectorClasses" style="margin-bottom: 1.5rem" />
  </template>

  <!-- Vertical -->
  <template v-else>
    <div class="flex gap-3">
      <div class="flex flex-col items-center">
        <div :class="circleClasses" @click="handleClick">
          <svg v-if="isDone" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div v-if="!isLast" :class="connectorClasses" />
      </div>
      <div class="flex items-center" :style="{ minHeight: circleSizeClasses[ctx.size.value].split(' ')[1] }">
        <span :class="labelClasses"><slot /></span>
      </div>
    </div>
  </template>
</template>