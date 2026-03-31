<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { CheckboxProps, ResolvedCheckboxProps } from './Checkbox.types'
import type {InputSize} from "../Input";

const props = withDefaults(defineProps<CheckboxProps>(), {
  size: 'md',
  shape: 'square',
  labelPosition: 'right',
  disabled: false,
  indeterminate: false,
}) as ResolvedCheckboxProps

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

// Sync indeterminate sur l'élément natif
watch(() => props.indeterminate, (val) => {
  if (inputRef.value) inputRef.value.indeterminate = val
}, { immediate: true })

const isChecked = computed(() => !!props.modelValue)

function toggle() {
  if (props.disabled) return
  const next = !isChecked.value
  emit('update:modelValue', next)
  emit('change', next)
}

// ----------------------------------------
// Tailles
// ----------------------------------------
const boxSizeClasses: Record<string, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

const iconSizeClasses: Record<string, string> = {
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
  lg: 'w-3.5 h-3.5',
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

// ----------------------------------------
// Classes boîte
// ----------------------------------------
const boxClasses = computed(() => [
  'shrink-0 border-2 flex items-center justify-center transition-all duration-[--duration-fast]',
  boxSizeClasses[props.size],
  props.shape === 'circle' ? 'rounded-full' : 'rounded-sm',
  props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
  isChecked.value || props.indeterminate
      ? 'bg-primary-500 border-primary-500'
      : 'bg-surface-0 border-surface-300 hover:border-primary-400',
])
</script>

<template>
  <div
      :class="[
      'inline-flex gap-2',
      labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    ]"
      @click="toggle"
  >
    <!-- Input natif caché -->
    <input
        ref="inputRef"
        type="checkbox"
        :checked="isChecked"
        :disabled="disabled"
        class="sr-only"
        v-bind="$attrs"
    />

    <!-- Box custom -->
    <div :class="boxClasses">
      <!-- Slot custom -->
      <slot name="icon" :checked="isChecked" :indeterminate="indeterminate">
        <!-- Indeterminate -->
        <svg
            v-if="indeterminate && !isChecked"
            :class="iconSizeClasses[size as InputSize]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="3"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <!-- Check -->
        <svg
            v-else-if="isChecked"
            :class="iconSizeClasses[size as InputSize]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="3"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </slot>
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