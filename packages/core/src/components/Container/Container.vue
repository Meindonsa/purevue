<script setup lang="ts">
import {ContainerPadding, ContainerProps, ContainerSize} from './Container.types'

withDefaults(defineProps<ContainerProps>(), {
  size: 'lg',
  padding: 'md',
  center: true,
})

const sizeClasses: Record<string, string> = {
  sm:   'max-w-screen-sm',
  md:   'max-w-screen-md',
  lg:   'max-w-screen-lg',
  xl:   'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
}

const paddingClasses: Record<string, string> = {
  none: '',
  sm:   'px-4',
  md:   'px-6',
  lg:   'px-8',
}
</script>

<template>
  <div
      :class="[
      'w-full',
      sizeClasses[size as ContainerSize],
      paddingClasses[padding as ContainerPadding],
      center ? 'mx-auto' : '',
    ]"
  >
    <slot />
  </div>
</template>