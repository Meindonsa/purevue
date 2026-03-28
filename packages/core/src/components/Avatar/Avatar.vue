<script setup lang="ts">
import { ref, computed } from 'vue'
import {AvatarProps, AvatarShape, AvatarSize} from './Avatar.types'

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'md',
  shape: 'circle',
  stacked: false,
})

const imgError = ref(false)

const initials = computed(() => {
  if (!props.fallback) return '?'
  return props.fallback
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('')
})

const showImage = computed(() => !!props.src && !imgError.value)

const sizeClasses: Record<string, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

const statusSizeClasses: Record<string, string> = {
  xs: 'w-1.5 h-1.5 border',
  sm: 'w-2 h-2 border',
  md: 'w-2.5 h-2.5 border-2',
  lg: 'w-3 h-3 border-2',
  xl: 'w-3.5 h-3.5 border-2',
}

const statusColorClasses: Record<string, string> = {
  online:  'bg-success-500',
  offline: 'bg-surface-400',
  away:    'bg-warning-500',
  busy:    'bg-danger-500',
}

const shapeClasses: Record<string, string> = {
  circle: 'rounded-full',
  square: 'rounded-md',
}

// Couleur de fond déterministe basée sur le fallback
const bgColors = [
  'bg-primary-100 text-primary-700',
  'bg-success-100 text-success-700',
  'bg-warning-100 text-warning-700',
  'bg-danger-100 text-danger-700',
  'bg-info-100 text-info-700',
]

const fallbackColor = computed(() => {
  if (!props.fallback) return 'bg-surface-100 text-surface-500'
  const index = props.fallback
      .split('')
      .reduce((acc, c) => acc + c.charCodeAt(0), 0) % bgColors.length
  return bgColors[index]
})
</script>

<template>
  <span class="relative inline-flex shrink-0">
    <span
        :class="[
        'inline-flex items-center justify-center overflow-hidden font-medium select-none',
        sizeClasses[size as AvatarSize],
        shapeClasses[shape as AvatarShape],
        !showImage ? fallbackColor : '',
        stacked ? 'ring-2 ring-surface-0' : '',
      ]"
    >
      <!-- Image -->
      <img
          v-if="showImage"
          :src="src"
          :alt="alt"
          class="w-full h-full object-cover"
          @error="imgError = true"
      />

      <!-- Slot custom -->
      <slot v-else-if="$slots.default" />

      <!-- Initiales -->
      <span v-else>{{ initials }}</span>
    </span>

    <!-- Status indicator -->
    <span
        v-if="status"
        :class="[
        'absolute bottom-0 right-0 rounded-full border-surface-0',
        statusSizeClasses[size as AvatarSize],
        statusColorClasses[status],
      ]"
    />
  </span>
</template>