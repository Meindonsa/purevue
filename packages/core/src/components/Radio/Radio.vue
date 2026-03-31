<script setup lang="ts">
import { computed } from 'vue'
import type { RadioProps, ResolvedRadioProps } from './Radio.types'
import type {InputSize} from "../Input";

const props = withDefaults(defineProps<RadioProps>(), {
  size: 'md',
  labelPosition: 'right',
  disabled: false,
}) as ResolvedRadioProps

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
}>()

const isChecked = computed(() => props.modelValue === props.value)

function select() {
  if (props.disabled || isChecked.value) return
  emit('update:modelValue', props.value)
  emit('change', props.value)
}

const dotSizeClasses: Record<string, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

const innerDotSizeClasses: Record<string, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
}

const labelSizeClasses: Record<string, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

const descSizeClasses: Record<string, string> = {
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-sm',
}

const dotClasses = computed(() => [
  'rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-[--duration-fast]',
  dotSizeClasses[props.size],
  isChecked.value
      ? 'border-primary-500 bg-surface-0'
      : 'border-surface-300 bg-surface-0 hover:border-primary-400',
  props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
])
</script>

<template>
  <div
      :class="[
      'inline-flex gap-2 items-start',
      labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    ]"
      @click="select"
  >
    <!-- Input natif caché -->
    <input
        type="radio"
        :value="value"
        :checked="isChecked"
        :disabled="disabled"
        class="sr-only"
        v-bind="$attrs"
    />

    <!-- Dot custom -->
    <div :class="dotClasses" style="margin-top: 1px">
      <div
          v-if="isChecked"
          :class="['rounded-full bg-primary-500 transition-transform duration-[--duration-fast]', innerDotSizeClasses[size as InputSize]]"
      />
    </div>

    <!-- Label + description -->
    <div v-if="label || description || $slots.default" class="flex flex-col gap-0.5">
      <span :class="['font-medium text-surface-700', labelSizeClasses[size as InputSize]]">
        <slot>{{ label }}</slot>
      </span>
      <span v-if="description" :class="['text-surface-400', descSizeClasses[size as InputSize]]">
        {{ description }}
      </span>
      <span v-if="error" :class="['text-danger-500', descSizeClasses[size as InputSize]]">
        {{ error }}
      </span>
    </div>
  </div>
</template>