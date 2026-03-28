<script setup lang="ts">
import {ref, computed, watch, nextTick} from 'vue'
import type { PasswordProps, PasswordRule } from './Password.types'
import type {InputSize} from "../Input";

const props = withDefaults(defineProps<PasswordProps>(), {
  size: 'md',
  disabled: false,
  block: false,
  min: 8,
  showHelper: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'valid': [value: boolean]
  'rules': [results: { key: string; label: string; passed: boolean }[]]
}>()

const show = ref(false)
const isFocused = ref(false)

// ----------------------------------------
// Résolution des règles actives
// ----------------------------------------
const activeRules = computed<PasswordRule[]>(() => {
  const rules: PasswordRule[] = []

  if (props.min) {
    rules.push({
      key: 'min',
      label: `Au moins ${props.min} caractères`,
      test: (v) => v.length >= props.min!,
    })
  }

  if (props.max) {
    rules.push({
      key: 'max',
      label: `Maximum ${props.max} caractères`,
      test: (v) => v.length <= props.max!,
    })
  }

  // Mode 3 — pattern custom (prioritaire)
  if (props.pattern) {
    rules.push({
      key: 'pattern',
      label: 'Format requis',
      test: (v) => new RegExp(props.pattern!).test(v),
    })
    return rules
  }

  // Mode 1 — objet options / Mode 2 — props booléennes
  const wantsNumber  = props.options?.number  ?? props.number  ?? false
  const wantsLower   = props.options?.lower   ?? props.lower   ?? false
  const wantsUpper   = props.options?.upper   ?? props.upper   ?? false
  const wantsSpecial = props.options?.special ?? props.special ?? false

  if (wantsNumber)  rules.push({ key: 'number',  label: 'Au moins un chiffre',            test: (v) => /\d/.test(v) })
  if (wantsLower)   rules.push({ key: 'lower',   label: 'Au moins une minuscule',          test: (v) => /[a-z]/.test(v) })
  if (wantsUpper)   rules.push({ key: 'upper',   label: 'Au moins une majuscule',          test: (v) => /[A-Z]/.test(v) })
  if (wantsSpecial) rules.push({ key: 'special', label: 'Au moins un caractère spécial',  test: (v) => /[^a-zA-Z0-9]/.test(v) })

  return rules
})

// ----------------------------------------
// Résultats de validation
// ----------------------------------------
const internalValue = ref(props.modelValue ?? '')

watch(() => props.modelValue, (v) => {
  internalValue.value = v ?? ''
})

const value = computed(() => internalValue.value)

const ruleResults = computed(() =>
    activeRules.value.map((rule) => ({
      ...rule,
      passed: value.value.length > 0 && rule.test(value.value),
    }))
)

const allPassed = computed(() => ruleResults.value.every((r) => r.passed))

const strength = computed(() => {
  if (!value.value) return 0
  const passed = ruleResults.value.filter((r) => r.passed).length
  const total  = ruleResults.value.length
  return total === 0 ? 100 : Math.round((passed / total) * 100)
})

const strengthLabel = computed(() => {
  if (!value.value)      return ''
  if (strength.value <= 25) return 'Très faible'
  if (strength.value <= 50) return 'Faible'
  if (strength.value <= 75) return 'Moyen'
  return 'Fort'
})

const strengthColor = computed(() => {
  if (strength.value <= 25) return 'bg-danger-500'
  if (strength.value <= 50) return 'bg-warning-500'
  if (strength.value <= 75) return 'bg-primary-400'
  return 'bg-success-500'
})

// ----------------------------------------
// Input
// ----------------------------------------
const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
}

const iconSizeClasses: Record<string, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}


function onInput(event: Event) {
  const v = (event.target as HTMLInputElement).value
  internalValue.value = v
  emit('update:modelValue', v)
  nextTick(() => {
    emit('valid', allPassed.value)
    emit('rules', ruleResults.value.map(({ key, label, passed }) => ({ key, label, passed })))
  })
}

const showRules = computed(() => isFocused.value && activeRules.value.length > 0)
</script>

<template>
  <div :class="['flex flex-col gap-1', block ? 'w-full' : 'inline-flex']">

    <!-- Label -->
    <label v-if="label" class="text-sm font-medium text-surface-700">
      {{ label }}
    </label>

    <!-- Help text -->
    <p v-if="helpText" class="text-sm text-surface-500">{{ helpText }}</p>

    <!-- Input wrapper -->
    <div class="relative flex items-center">
      <input
          :type="show ? 'text' : 'password'"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :class="[
          'w-full rounded-md border bg-surface-0 outline-none pr-10',
          'transition-all duration-[--duration-fast]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeClasses[size as InputSize],
          allPassed || !value
            ? 'border-surface-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
            : 'border-danger-500 focus:border-danger-500 focus:ring-1 focus:ring-danger-500',
        ]"
          @input="onInput"
          @focus="isFocused = true"
          @blur="isFocused = false"
      />

      <!-- Toggle visibilité -->
      <button
          type="button"
          tabindex="-1"
          class="absolute right-3 text-surface-400 hover:text-surface-600 transition-colors"
          @click="show = !show"
      >
        <!-- Oeil ouvert -->
        <svg v-if="!show" :class="iconSizeClasses[size as InputSize]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        <!-- Oeil barré -->
        <svg v-else :class="iconSizeClasses[size as InputSize]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
      </button>
    </div>

    <!-- Barre de force -->
    <div v-if="value" class="flex items-center gap-2 mt-0.5">
      <div class="flex-1 h-1 bg-surface-100 rounded-full overflow-hidden">
        <div
            :class="['h-full rounded-full transition-all duration-300', strengthColor]"
            :style="{ width: `${strength}%` }"
        />
      </div>
      <span class="text-xs text-surface-500 min-w-[4rem] text-right">{{ strengthLabel }}</span>
    </div>

    <ul v-if="showHelper && showRules" class="flex flex-col gap-0.5 mt-1">
      <li
          v-for="rule in ruleResults"
          :key="rule.key"
          :class="['flex items-center gap-1.5 text-xs transition-colors', rule.passed ? 'text-success-500' : 'text-surface-400']"
      >
        <svg v-if="rule.passed" class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span v-else class="w-3 h-3 flex items-center justify-center shrink-0">
          <span class="w-1 h-1 rounded-full bg-surface-300 block"/>
        </span>
        {{ rule.label }}
      </li>
    </ul>

  </div>
</template>