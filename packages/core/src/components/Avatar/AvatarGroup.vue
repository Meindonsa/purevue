<script setup lang="ts">
import type {AvatarGroupProps} from './Avatar.types'

const props = withDefaults(defineProps<AvatarGroupProps>(), {
  size: 'md',
  shape: 'circle',
})

const sizeClasses: Record<string, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

const shapeClasses: Record<string, string> = {
  circle: 'rounded-full',
  square: 'rounded-md',
}
</script>

<template>
  <div class="flex items-center">
    <div class="flex -space-x-2">
      <slot />
    </div>

    <slot name="overflow" />
  </div>
</template>