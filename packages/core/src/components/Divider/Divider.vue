<script setup lang="ts">
import {DividerAlign, DividerProps, DividerVariant} from './Divider.types'

withDefaults(defineProps<DividerProps>(), {
  orientation: 'horizontal',
  variant: 'solid',
  align: 'center',
})

const variantClasses: Record<string, string> = {
  solid:  'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
}

const alignClasses: Record<string, string> = {
  start:  'justify-start',
  center: 'justify-center',
  end:    'justify-end',
}

const labelAlignClasses: Record<string, string> = {
  start:  'mr-auto',
  center: '',
  end:    'ml-auto',
}
</script>

<template>
  <!-- Vertical -->
  <div
      v-if="orientation === 'vertical'"
      :class="['inline-block self-stretch border-l border-surface-200', variantClasses[variant as DividerVariant]]"
  />

  <!-- Horizontal sans label -->
  <div
      v-else-if="!label && !$slots.default"
      :class="['w-full border-t border-surface-200', variantClasses[variant as DividerVariant]]"
  />

  <!-- Horizontal avec label ou slot -->
  <div
      v-else
      :class="['flex items-center gap-3 w-full', alignClasses[align as DividerAlign]]"
  >
    <!-- Ligne gauche -->
    <div
        v-if="align !== 'start'"
        :class="[
        'flex-1 border-t border-surface-200',
        variantClasses[variant as DividerVariant],
        align === 'end' ? 'flex-none w-full' : '',
      ]"
    />

    <!-- Label / slot -->
    <span :class="['text-xs text-surface-400 whitespace-nowrap shrink-0', labelAlignClasses[align as DividerAlign]]">
      <slot>{{ label }}</slot>
    </span>

    <!-- Ligne droite -->
    <div
        v-if="align !== 'end'"
        :class="[
        'flex-1 border-t border-surface-200',
        variantClasses[variant as DividerVariant],
      ]"
    />
  </div>
</template>