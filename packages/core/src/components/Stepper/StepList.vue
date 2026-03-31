<script setup lang="ts">
import { inject } from 'vue'
import { STEPPER_KEY } from './Stepper.types'

const ctx = inject(STEPPER_KEY)!
</script>

<template>
  <div
      :class="[
      'flex shrink-0',
      ctx.orientation.value === 'vertical'
        ? 'flex-col gap-0'
        : 'flex-row items-center w-full',
    ]"
  >
    <slot />
  </div>
</template>