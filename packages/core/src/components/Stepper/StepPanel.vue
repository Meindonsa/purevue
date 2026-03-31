<script setup lang="ts">
import { inject, computed } from 'vue'
import { STEPPER_KEY } from './Stepper.types'

const props = defineProps<{ value: string }>()
const ctx = inject(STEPPER_KEY)!

const isActive = computed(() => ctx.activeValue.value === props.value)
</script>

<template>
  <div v-if="isActive">
    <slot :activate-callback="ctx.activateCallback" :active="isActive" />
  </div>
</template>