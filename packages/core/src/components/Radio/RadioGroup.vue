<script setup lang="ts">
import { computed } from 'vue'
import Radio from './Radio.vue'
import type { RadioGroupProps, ResolvedRadioGroupProps, RadioOption } from './Radio.types'
import type {InputSize} from "../Input";

const props = withDefaults(defineProps<RadioGroupProps>(), {
  variant: 'classic',
  orientation: 'vertical',
  size: 'md',
  labelPosition: 'right',
  disabled: false,
  columns: 1,
}) as ResolvedRadioGroupProps

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
}>()

function select(value: string | number) {
  emit('update:modelValue', value)
  emit('change', value)
}

const isChecked = (opt: RadioOption) => props.modelValue === opt.value

// ----------------------------------------
// Layout
// ----------------------------------------
const containerClasses = computed(() => {
  if (props.variant === 'button') {
    return 'flex flex-row gap-0 border border-surface-200 rounded-lg overflow-hidden w-fit'
  }
  if (props.orientation === 'horizontal') {
    return props.columns > 1
        ? `grid grid-cols-${props.columns} gap-3`
        : 'flex flex-row flex-wrap gap-4'
  }
  return props.columns > 1
      ? `grid grid-cols-${props.columns} gap-3`
      : 'flex flex-col gap-3'
})

// ----------------------------------------
// Styles variants
// ----------------------------------------
const cardClasses = (opt: RadioOption) => [
  'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-[--duration-fast] select-none',
  isChecked(opt)
      ? 'border-primary-500 bg-primary-50'
      : 'border-surface-200 bg-surface-0 hover:border-surface-300',
  (props.disabled || opt.disabled) ? 'opacity-50 cursor-not-allowed' : '',
]

const buttonClasses = (opt: RadioOption) => [
  'flex items-center justify-center px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-[--duration-fast] select-none border-r last:border-r-0 border-surface-200',
  isChecked(opt)
      ? 'bg-primary-500 text-white'
      : 'bg-surface-0 text-surface-600 hover:bg-surface-50',
  (props.disabled || opt.disabled) ? 'opacity-50 cursor-not-allowed' : '',
]

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
</script>

<template>
  <div class="flex flex-col gap-3">

    <!-- Label groupe -->
    <span v-if="label" class="text-sm font-semibold text-surface-700">{{ label }}</span>

    <!-- Classic -->
    <div v-if="variant === 'classic'" :class="containerClasses">
      <Radio
          v-for="opt in options"
          :key="opt.value"
          :model-value="modelValue"
          :value="opt.value"
          :label="opt.label"
          :description="opt.description"
          :size="size"
          :label-position="labelPosition"
          :disabled="disabled || opt.disabled"
          @update:model-value="select"
      />
    </div>

    <!-- Card -->
    <div v-else-if="variant === 'card'" :class="containerClasses">
      <div
          v-for="opt in options"
          :key="opt.value"
          :class="cardClasses(opt)"
          @click="!disabled && !opt.disabled && select(opt.value)"
      >
        <!-- Radio dot -->
        <div
            :class="[
            'rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-[--duration-fast]',
            size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4',
            isChecked(opt) ? 'border-primary-500' : 'border-surface-300',
          ]"
        >
          <div
              v-if="isChecked(opt)"
              :class="[
              'rounded-full bg-primary-500',
              size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-2 h-2',
            ]"
          />
        </div>

        <!-- Contenu -->
        <div class="flex flex-col gap-0.5 flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span v-if="opt.icon" class="w-4 h-4" v-html="opt.icon" />
            <span :class="['font-medium text-surface-800', labelSizeClasses[size as InputSize]]">
              {{ opt.label }}
            </span>
          </div>
          <span v-if="opt.description" :class="['text-surface-400', descSizeClasses[size as InputSize]]">
            {{ opt.description }}
          </span>
        </div>
      </div>
    </div>

    <!-- Button group -->
    <div v-else-if="variant === 'button'" :class="containerClasses">
      <div
          v-for="opt in options"
          :key="opt.value"
          :class="buttonClasses(opt)"
          @click="!disabled && !opt.disabled && select(opt.value)"
      >
        <span v-if="opt.icon" class="w-4 h-4 mr-1.5" v-html="opt.icon" />
        {{ opt.label }}
      </div>
    </div>

    <!-- Error -->
    <p v-if="error" class="text-sm text-danger-500">{{ error }}</p>
  </div>
</template>