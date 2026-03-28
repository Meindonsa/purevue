<script setup lang="ts">
import type {ButtonProps} from './Button.types'

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  iconPosition: 'left',
  block: false,
})

const baseClasses = [
  'inline-flex items-center justify-center gap-2',
  'font-medium rounded-md',
  'transition-all duration-[--duration-fast]',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'cursor-pointer',
]

const variantClasses: Record<string, string> = {
  primary:
      'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus-visible:ring-primary-500',
  secondary:
      'bg-surface-100 text-surface-800 hover:bg-surface-200 active:bg-surface-300 focus-visible:ring-surface-400',
  outline:
      'border border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-500',
  ghost:
      'text-primary-500 hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-500',
  danger:
      'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700 focus-visible:ring-danger-500',
  success:
      'bg-success-500 text-white hover:bg-success-700 active:bg-success-700 focus-visible:ring-success-500',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

const classes = [
  ...baseClasses,
  variantClasses[props.variant],
  sizeClasses[props.size],
  props.block ? 'w-full' : '',
]
</script>

<template>
  <button
      :class="classes"
      :disabled="disabled || loading"
      v-bind="$attrs"
  >
    <!-- Spinner loading -->
    <svg
        v-if="loading"
        class="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
      <circle
          class="opacity-25"
          cx="12" cy="12" r="10"
          stroke="currentColor"
          stroke-width="4"
      />
      <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
      />
    </svg>

    <span v-if="icon && iconPosition === 'left' && !loading" v-html="icon"/>

    <slot/>

    <span v-if="icon && iconPosition === 'right' && !loading" v-html="icon"/>
  </button>
</template>