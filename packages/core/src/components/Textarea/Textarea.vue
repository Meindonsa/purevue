<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import {ResizeMode, TextareaProps} from './Textarea.types'
import type {InputSize} from "../Input";

const props = withDefaults(defineProps<TextareaProps>(), {
  size: 'md',
  state: 'default',
  disabled: false,
  readonly: false,
  block: false,
  rows: 3,
  showCount: false,
  resize: 'vertical',
  helpTextPosition: 'bottom',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const internalError = ref<string | null>(null)

const computedState = computed(() => {
  if (props.error || internalError.value) return 'error'
  return props.state
})

const displayedError = computed(() => props.error || internalError.value)

const charCount = computed(() => String(props.modelValue ?? '').length)

const isOverLimit = computed(() =>
    props.maxlength !== undefined && charCount.value > props.maxlength
)

// Auto-resize
function autoResize() {
  if (props.resize !== 'auto' || !textareaRef.value) return
  const el = textareaRef.value
  el.style.height = 'auto'
  let newHeight = el.scrollHeight

  if (props.maxRows) {
    const lineHeight = parseInt(getComputedStyle(el).lineHeight)
    const maxHeight = lineHeight * props.maxRows
    newHeight = Math.min(newHeight, maxHeight)
  }

  el.style.height = `${newHeight}px`
}

watch(() => props.modelValue, () => {
  nextTick(autoResize)
})

function onInput(event: Event) {
  const value = (event.target as HTMLTextAreaElement).value
  emit('update:modelValue', value)
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

const resizeClass: Record<string, string> = {
  none:       'resize-none',
  vertical:   'resize-y',
  horizontal: 'resize-x',
  both:       'resize',
  auto:       'resize-none',
}
</script>

<template>
  <div :class="['flex flex-col gap-1', block ? 'w-full' : 'inline-flex']">

    <!-- Label -->
    <label v-if="label" class="text-sm font-medium text-surface-700">
      {{ label }}
    </label>

    <!-- Help text top -->
    <p v-if="helpText && helpTextPosition === 'top'" class="text-sm text-surface-500">
      {{ helpText }}
    </p>

    <!-- Textarea -->
    <textarea
        ref="textareaRef"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
        :maxlength="resize === 'auto' ? undefined : maxlength"
        :class="[
        'w-full rounded-md border bg-surface-0 outline-none',
        'transition-all duration-[--duration-fast]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'read-only:bg-surface-50 read-only:cursor-default',
        sizeClasses[size as InputSize],
        stateClasses[isOverLimit ? 'error' : computedState],
        resizeClass[resize as ResizeMode],
      ]"
        v-bind="$attrs"
        @input="onInput"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
    />

    <!-- Footer : error + compteur -->
    <div class="flex items-start justify-between gap-2">
      <div class="flex-1">
        <p v-if="displayedError" class="text-sm text-danger-500">
          {{ displayedError }}
        </p>
        <p v-else-if="helpText && helpTextPosition === 'bottom'" :class="['text-sm', hintColorClasses[computedState]]">
          {{ helpText }}
        </p>
      </div>

      <!-- Compteur de caractères -->
      <p
          v-if="showCount"
          :class="['text-xs shrink-0', isOverLimit ? 'text-danger-500' : 'text-surface-400']"
      >
        {{ charCount }}{{ maxlength ? ` / ${maxlength}` : '' }}
      </p>
    </div>

  </div>
</template>