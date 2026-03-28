<script setup lang="ts">
import { computed } from 'vue'
import type { SkeletonProps, ResolvedSkeletonProps } from './Skeleton.types'

const props = withDefaults(defineProps<SkeletonProps>(), {
  shape: 'rectangle',
  animation: 'pulse',
  lines: 1,
  gap: '0.5rem',
}) as ResolvedSkeletonProps

const shapeClasses: Record<string, string> = {
  rectangle: 'rounded-md',
  circle:    'rounded-full',
  pill:      'rounded-full',
}

const baseClasses = computed(() => [
  'block',
  shapeClasses[props.shape],
  props.animation === 'pulse' ? 'animate-pulse bg-surface-200' : '',
  props.animation === 'none'  ? 'bg-surface-200' : '',
])

const waveStyle = computed(() =>
    props.animation === 'wave'
        ? {
          background: 'linear-gradient(90deg, var(--color-surface-200) 25%, var(--color-surface-100) 50%, var(--color-surface-200) 75%)',
          backgroundSize: '200% 100%',
          animation: 'skeleton-wave 1.5s ease-in-out infinite',
        }
        : {}
)

const defaultWidth = computed(() => {
  if (props.width) return props.width
  if (props.shape === 'circle') return '2.5rem'
  return '100%'
})

const defaultHeight = computed(() => {
  if (props.height) return props.height
  if (props.shape === 'circle') return '2.5rem'
  if (props.shape === 'pill')   return '1.5rem'
  return '1rem'
})

const lineWidths = ['100%', '92%', '85%', '78%', '60%']

function getLineWidth(index: number): string {
  if (!props.lines || props.lines === 1) return defaultWidth.value
  if (index === props.lines - 1) return lineWidths[2]
  return lineWidths[index % 2]
}
</script>

<template>
  <div
      v-if="lines && lines > 1"
      class="flex flex-col"
      :style="{ gap }"
  >
    <span
        v-for="i in lines"
        :key="i"
        :class="baseClasses"
        :style="{
        width: getLineWidth(i - 1),
        height: defaultHeight,
        ...waveStyle,
      }"
    />
  </div>

  <span
      v-else
      :class="baseClasses"
      :style="{
      width: defaultWidth,
      height: defaultHeight,
      ...waveStyle,
    }"
  />
</template>