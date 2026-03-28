<script setup lang="ts">
import {SpinnerProps, SpinnerSize, SpinnerVariant, SpinnerLabelPosition} from './Spinner.types'

withDefaults(defineProps<SpinnerProps>(), {
  size: 'md',
  variant: 'primary',
  labelPosition: 'right',
})

const sizeClasses: Record<string, string> = {
  xs: 'w-3 h-3 border',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-2',
  xl: 'w-10 h-10 border-[3px]',
}

const variantClasses: Record<string, string> = {
  primary:   'border-primary-200 border-t-primary-500',
  secondary: 'border-surface-200 border-t-surface-500',
  success:   'border-success-100 border-t-success-500',
  warning:   'border-warning-100 border-t-warning-500',
  danger:    'border-danger-100 border-t-danger-500',
  info:      'border-info-100 border-t-info-500',
  white:     'border-white/30 border-t-white',
}

const labelSizeClasses: Record<string, string> = {
  xs: 'text-xs',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
}

const layoutClasses: Record<string, string> = {
  top:    'flex-col-reverse items-center',
  bottom: 'flex-col items-center',
  left:   'flex-row-reverse items-center',
  right:  'flex-row items-center',
}

const gapClasses: Record<string, string> = {
  top:    'gap-1',
  bottom: 'gap-1',
  left:   'gap-2',
  right:  'gap-2',
}
</script>

<template>
  <span
      :class="[
      'inline-flex',
      layoutClasses[labelPosition as SpinnerLabelPosition],
      gapClasses[labelPosition as SpinnerLabelPosition],
    ]"
      role="status"
      :aria-label="label ?? 'Chargement...'"
  >
    <!-- Spinner -->
    <span
        :class="[
        'rounded-full animate-spin shrink-0',
        sizeClasses[size as SpinnerSize],
        variantClasses[variant as SpinnerVariant],
      ]"
    />

    <!-- Label -->
    <span
        v-if="label"
        :class="['text-surface-600', labelSizeClasses[size as SpinnerSize]]"
    >
      {{ label }}
    </span>
  </span>
</template>