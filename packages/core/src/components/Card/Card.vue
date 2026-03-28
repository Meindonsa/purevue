<script setup lang="ts">
import {CardPadding, CardProps, CardVariant} from './Card.types'

withDefaults(defineProps<CardProps>(), {
  variant: 'default',
  padding: 'md',
  clickable: false,
  loading: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClasses: Record<string, string> = {
  default:  'bg-surface-0 border border-surface-200',
  outlined: 'bg-transparent border border-surface-300',
  elevated: 'bg-surface-0 shadow-md border-0',
  ghost:    'bg-surface-50 border-0',
}

const paddingClasses: Record<string, string> = {
  none: '',
  sm:   'p-3',
  md:   'p-5',
  lg:   'p-8',
}
</script>

<template>
  <div
      :class="[
      'rounded-xl transition-all duration-[--duration-fast] overflow-hidden',
      variantClasses[variant as CardVariant],
      paddingClasses[padding as CardPadding],
      clickable ? 'cursor-pointer hover:shadow-lg hover:border-surface-300 active:scale-[0.99]' : '',
      loading ? 'pointer-events-none' : '',
    ]"
      v-bind="$attrs"
      @click="clickable ? emit('click', $event) : undefined"
  >
    <slot />
  </div>
</template>