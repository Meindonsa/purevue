<script setup lang="ts">
import type {AvatarGroupProps} from './Avatar.types'

withDefaults(defineProps<AvatarGroupProps>(), {
  size: 'md',
  shape: 'circle',
})
</script>

<template>
  <div class="flex items-center">
    <div class="flex -space-x-2">
      <slot />
    </div>

    <slot name="overflow" />
  </div>
</template>