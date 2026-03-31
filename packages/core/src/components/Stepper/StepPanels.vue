<script setup lang="ts">
import { inject, computed } from 'vue'
import { STEPPER_KEY } from './Stepper.types'

const ctx = inject(STEPPER_KEY)!

const transitionName = computed(() => {
  if (ctx.orientation.value === 'vertical') {
    return ctx.direction.value === 1 ? 'pv-step-down' : 'pv-step-up'
  }
  return ctx.direction.value === 1 ? 'pv-step-right' : 'pv-step-left'
})
</script>

<template>
  <div class="flex-1 overflow-hidden relative">
    <Transition :name="transitionName" mode="out-in">
      <div :key="ctx.activeValue.value" class="w-full">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.pv-step-right-enter-active,
.pv-step-right-leave-active,
.pv-step-left-enter-active,
.pv-step-left-leave-active,
.pv-step-down-enter-active,
.pv-step-down-leave-active,
.pv-step-up-enter-active,
.pv-step-up-leave-active {
  transition: transform var(--duration-normal) var(--ease-default),
  opacity var(--duration-normal) var(--ease-default);
}

.pv-step-right-enter-from { transform: translateX(40px);  opacity: 0; }
.pv-step-right-leave-to   { transform: translateX(-40px); opacity: 0; }

.pv-step-left-enter-from  { transform: translateX(-40px); opacity: 0; }
.pv-step-left-leave-to    { transform: translateX(40px);  opacity: 0; }

.pv-step-down-enter-from  { transform: translateY(40px);  opacity: 0; }
.pv-step-down-leave-to    { transform: translateY(-40px); opacity: 0; }

.pv-step-up-enter-from    { transform: translateY(-40px); opacity: 0; }
.pv-step-up-leave-to      { transform: translateY(40px);  opacity: 0; }
</style>