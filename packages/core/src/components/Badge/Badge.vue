<script setup lang="ts">
import type { BadgeProps } from './Badge.types'

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: 'primary',
  size: 'md',
  shape: 'rounded',
  dot: false,
  closable: false,
})

const emit = defineEmits<{
  close: []
}>()

const variantClasses: Record<string, string> = {
  primary:   'bg-primary-100 text-primary-700 border-primary-200',
  secondary: 'bg-surface-100 text-surface-700 border-surface-200',
  success:   'bg-success-100 text-success-500 border-success-200',
  warning:   'bg-warning-100 text-warning-500 border-warning-200',
  danger:    'bg-danger-100 text-danger-500 border-danger-200',
  info:      'bg-info-100 text-info-500 border-info-200',
}

const dotVariantClasses: Record<string, string> = {
  primary:   'bg-primary-500',
  secondary: 'bg-surface-400',
  success:   'bg-success-500',
  warning:   'bg-warning-500',
  danger:    'bg-danger-500',
  info:      'bg-info-500',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-1.5 py-0.5 text-xs gap-1',
  md: 'px-2 py-0.5 text-sm gap-1.5',
  lg: 'px-2.5 py-1 text-sm gap-1.5',
}

const dotSizeClasses: Record<string, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2 h-2',
}

const iconSizeClasses: Record<string, string> = {
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
  lg: 'w-3.5 h-3.5',
}

const shapeClasses: Record<string, string> = {
  rounded: 'rounded-md',
  pill:    'rounded-full',
}
</script>

<template>
  <span
      :class="[
      'inline-flex items-center border font-medium',
      variantClasses[variant],
      sizeClasses[size],
      shapeClasses[shape],
    ]"
  >
    <!-- Dot -->
    <span
        v-if="dot"
        :class="['rounded-full shrink-0', dotVariantClasses[variant], dotSizeClasses[size]]"
    />

    <!-- Prefix slot (icône gauche) -->
    <span v-if="$slots.prefix" class="flex items-center">
      <slot name="prefix" />
    </span>

    <!-- Contenu -->
    <slot />

    <!-- Bouton close -->
    <button
        v-if="closable"
        type="button"
        class="flex items-center opacity-60 hover:opacity-100 transition-opacity ml-0.5 cursor-pointer"
        @click.stop="emit('close')"
    >
      <svg :class="iconSizeClasses[size]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </span>
</template>