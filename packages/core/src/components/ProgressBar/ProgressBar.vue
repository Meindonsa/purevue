<script setup lang="ts">
import { computed } from 'vue'
import {
  ProgressBarLabelPosition,
  ProgressBarProps,
  ProgressBarSize,
  ResolvedProgressBarProps
} from './ProgressBar.types'

const props = withDefaults(defineProps<ProgressBarProps>(), {
  min: 0,
  max: 100,
  size: 'md',
  variant: 'primary',
  animation: 'none',
  label: false,
  labelPosition: 'top',
  indeterminate: false,
}) as ResolvedProgressBarProps

const percentage = computed(() => {
  if (props.indeterminate || props.value === undefined) return 0
  const clamped = Math.min(Math.max(props.value, props.min), props.max)
  return Math.round(((clamped - props.min) / (props.max - props.min)) * 100)
})

const displayedLabel = computed(() => props.labelText ?? `${percentage.value}%`)

const isInside = computed(() =>
    ['inside-left', 'inside-center', 'inside-right'].includes(props.labelPosition)
)

const supportsInside = computed(() =>
    ['md', 'lg'].includes(props.size)
)

const insideAlignClasses: Record<string, string> = {
  'inside-left':   'justify-start pl-2',
  'inside-center': 'justify-center',
  'inside-right':  'justify-end pr-2',
}

const insideTextSizeClasses: Record<string, string> = {
  md: 'text-[10px]',
  lg: 'text-xs',
}

const sizeClasses: Record<string, string> = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-3.5',
  lg: 'h-5',
}

const variantClasses: Record<string, string> = {
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger:  'bg-danger-500',
  info:    'bg-info-500',
}

const fillClasses = computed(() => [
  'h-full rounded-full transition-all duration-500',
  variantClasses[props.variant],
  props.indeterminate ? 'animate-indeterminate w-1/2' : '',
  props.animation === 'pulse' && !props.indeterminate ? 'animate-pulse' : '',
  props.animation === 'stripe' && !props.indeterminate ? 'animate-stripe bg-stripe' : '',
])
</script>

<template>
  <div class="flex flex-col gap-1 w-full">

    <!-- Label externe (top) -->
    <div
        v-if="label && !indeterminate && !isInside"
        class="flex justify-between items-center"
    >
      <span class="text-xs text-surface-500">
        <slot>{{ displayedLabel }}</slot>
      </span>
      <span class="text-xs text-surface-500">{{ value }} / {{ max }}</span>
    </div>

    <!-- Track -->
    <div
        :class="['w-full bg-surface-200 rounded-full overflow-hidden relative', sizeClasses[size as ProgressBarSize]]"
        role="progressbar"
        :aria-valuenow="indeterminate ? undefined : percentage"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-label="indeterminate ? 'Chargement...' : `${percentage}%`"
    >
      <!-- Fill -->
      <div
          :class="fillClasses"
          :style="indeterminate ? {} : { width: `${percentage}%` }"
      />

      <!-- Label intérieur -->
      <div
          v-if="label && isInside && supportsInside && !indeterminate"
          :class="[
          'absolute inset-0 flex items-center text-white font-medium pointer-events-none',
          insideAlignClasses[labelPosition as ProgressBarLabelPosition],
          insideTextSizeClasses[size as ProgressBarSize],
        ]"
      >
        <slot>{{ displayedLabel }}</slot>
      </div>
    </div>
  </div>
</template>