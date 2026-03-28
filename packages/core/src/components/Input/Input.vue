<script setup lang="ts">
import { ref, computed } from 'vue'
import type { InputProps } from './Input.types'

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  size: 'md',
  state: 'default',
  disabled: false,
  readonly: false,
  block: false,
  helpTextPosition: 'bottom',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const internalError = ref<string | null>(null)

const computedState = computed(() => {
  if (props.error || internalError.value) return 'error'
  return props.state
})

const displayedError = computed(() => props.error || internalError.value)

function validate(value: string) {
  internalError.value = null
  if (props.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      internalError.value = 'Adresse email invalide.'
    }
  }
}

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
  validate(value)
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
}

const stateClasses: Record<string, string> = {
  default: 'border-surface-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
  error:   'border-danger-500 focus:border-danger-500 focus:ring-1 focus:ring-danger-500',
  success: 'border-success-500 focus:border-success-500 focus:ring-1 focus:ring-success-500',
  warning: 'border-warning-500 focus:border-warning-500 focus:ring-1 focus:ring-warning-500',
}

const hintColorClasses: Record<string, string> = {
  default: 'text-surface-500',
  error:   'text-danger-500',
  success: 'text-success-500',
  warning: 'text-warning-500',
}
</script>

<template>
  <div :class="['flex flex-col gap-1', block ? 'w-full' : 'inline-flex']">

    <label v-if="label" class="text-sm font-medium text-surface-700">
      {{ label }}
    </label>

    <p v-if="helpText && helpTextPosition === 'top'" class="text-sm text-surface-500">
      {{ helpText }}
    </p>

    <div class="relative flex items-center">
      <span v-if="$slots.prefix" class="absolute left-3 text-surface-400 flex items-center z-10">
        <slot name="prefix" />
      </span>

      <input
          :type="type"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :class="[
          'w-full rounded-md border bg-surface-0 outline-none',
          'transition-all duration-[--duration-fast]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'read-only:bg-surface-50 read-only:cursor-default',
          sizeClasses[size],
          stateClasses[computedState],
          $slots.prefix ? 'pl-9' : '',
          $slots.suffix ? 'pr-9' : '',
        ]"
          v-bind="$attrs"
          @input="onInput"
          @focus="emit('focus', $event)"
          @blur="emit('blur', $event)"
      />

      <span v-if="$slots.suffix" class="absolute right-3 text-surface-400 flex items-center">
        <slot name="suffix" />
      </span>
    </div>

    <p v-if="displayedError" class="text-sm text-danger-500">
      {{ displayedError }}
    </p>

    <p v-if="helpText && helpTextPosition === 'bottom'" :class="['text-sm', hintColorClasses[computedState]]">
      {{ helpText }}
    </p>

  </div>
</template>