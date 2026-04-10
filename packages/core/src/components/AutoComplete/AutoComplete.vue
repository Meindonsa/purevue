<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import type { AutoCompleteProps, ResolvedAutoCompleteProps, AutoCompleteOption } from './AutoComplete.types'
import type {InputSize, InputState} from "../Input";

const props = withDefaults(defineProps<AutoCompleteProps>(), {
  options: () => [],
  size: 'md',
  state: 'default',
  disabled: false,
  multiple: false,
  minChars: 1,
  debounce: 300,
  block: false,
  loading: false,
  emptyText: 'Aucun résultat',
}) as ResolvedAutoCompleteProps

const emit = defineEmits<{
  'update:modelValue': [value: string | number | (string | number)[]]
  search: [query: string]
  select: [option: AutoCompleteOption]
  clear: []
}>()

// ----------------------------------------
// State
// ----------------------------------------
const query       = ref('')
const isOpen      = ref(false)
const activeIndex = ref(-1)
const inputRef    = ref<HTMLInputElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const wrapperRef  = ref<HTMLElement | null>(null)

// Tags pour mode multiple
const selectedTags = ref<AutoCompleteOption[]>(
    props.multiple && Array.isArray(props.modelValue)
        ? (props.modelValue as (string | number)[]).map(v =>
            props.options?.find(o => o.value === v) ?? { label: String(v), value: v }
        )
        : []
)

// ----------------------------------------
// Debounce search
// ----------------------------------------
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(query, (val) => {
  activeIndex.value = -1
  if (val.length < props.minChars) {
    isOpen.value = false
    return
  }
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('search', val)
    isOpen.value = true
  }, props.debounce)
})

// ----------------------------------------
// Filtrage local
// ----------------------------------------
const filteredOptions = computed(() => {
  if (!query.value || query.value.length < props.minChars) return []
  const q = query.value.toLowerCase()
  return (props.options ?? []).filter(opt => {
    if (props.multiple && selectedTags.value.some(t => t.value === opt.value)) return false
    return opt.label.toLowerCase().includes(q)
  })
})

// Groupes
const hasGroups = computed(() => filteredOptions.value.some(o => o.group))

const grouped = computed(() => {
  const map = new Map<string, AutoCompleteOption[]>()
  for (const opt of filteredOptions.value) {
    const g = opt.group ?? ''
    if (!map.has(g)) map.set(g, [])
    map.get(g)!.push(opt)
  }
  return map
})

// ----------------------------------------
// Highlight
// ----------------------------------------
function highlight(text: string): string {
  if (!query.value) return text
  const escaped = query.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex   = new RegExp(`(${escaped})`, 'gi')
  return text.replace(regex, '<mark class="bg-primary-100 text-primary-700 rounded px-0.5">$1</mark>')
}

// ----------------------------------------
// Sélection
// ----------------------------------------
function select(opt: AutoCompleteOption) {
  if (props.multiple) {
    if (props.maxTags && selectedTags.value.length >= props.maxTags) return
    selectedTags.value.push(opt)
    emit('update:modelValue', selectedTags.value.map(t => t.value))
    emit('select', opt)
    query.value = ''
    isOpen.value = false
    nextTick(() => inputRef.value?.focus())
  } else {
    query.value = opt.label
    emit('update:modelValue', opt.value)
    emit('select', opt)
    isOpen.value = false
  }
}

function removeTag(index: number) {
  selectedTags.value.splice(index, 1)
  emit('update:modelValue', selectedTags.value.map(t => t.value))
}

function clearAll() {
  query.value = ''
  selectedTags.value = []
  emit('update:modelValue', props.multiple ? [] : '')
  emit('clear')
  isOpen.value = false
}

// ----------------------------------------
// Navigation clavier
// ----------------------------------------
function onKeydown(e: KeyboardEvent) {
  if (!isOpen.value) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, filteredOptions.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (e.key === 'Enter' && activeIndex.value >= 0) {
    e.preventDefault()
    select(filteredOptions.value[activeIndex.value])
  } else if (e.key === 'Escape') {
    isOpen.value = false
  } else if (e.key === 'Backspace' && !query.value && props.multiple && selectedTags.value.length) {
    removeTag(selectedTags.value.length - 1)
  }
}

// ----------------------------------------
// Click outside
// ----------------------------------------
function onClickOutside(e: MouseEvent) {
  if (!wrapperRef.value?.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))

// ----------------------------------------
// Styles
// ----------------------------------------
const sizeClasses: Record<string, string> = {
  sm: 'text-sm min-h-[2rem]',
  md: 'text-base min-h-[2.5rem]',
  lg: 'text-lg min-h-[3rem]',
}

const inputPaddingClasses: Record<string, string> = {
  sm: 'px-2 py-1',
  md: 'px-3 py-1.5',
  lg: 'px-4 py-2',
}

const stateClasses: Record<string, string> = {
  default: 'border-surface-300 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500',
  error:   'border-danger-500 focus-within:border-danger-500 focus-within:ring-1 focus-within:ring-danger-500',
  success: 'border-success-500',
  warning: 'border-warning-500',
}
</script>

<template>
  <div
      ref="wrapperRef"
      :class="['flex flex-col gap-1', block ? 'w-full' : 'inline-flex']"
  >
    <!-- Label -->
    <label v-if="label" class="text-sm font-medium text-surface-700">{{ label }}</label>

    <!-- Input wrapper -->
    <div class="relative">
      <div
          :class="[
          'flex flex-wrap items-center gap-1.5 rounded-md border bg-surface-0 transition-all duration-[--duration-fast] cursor-text',
          inputPaddingClasses[size as InputSize],
          sizeClasses[size as InputSize],
          stateClasses[state as InputState],
          disabled ? 'opacity-50 cursor-not-allowed' : '',
        ]"
          @click="inputRef?.focus()"
      >
        <!-- Tags mode multiple -->
        <span
            v-for="(tag, i) in selectedTags"
            :key="tag.value"
            class="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-md shrink-0"
        >
          {{ tag.label }}
          <button
              type="button"
              class="hover:text-primary-900 transition-colors"
              @click.stop="removeTag(i)"
          >
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </span>

        <!-- Input -->
        <input
            ref="inputRef"
            v-model="query"
            type="text"
            :placeholder="selectedTags.length === 0 ? placeholder : ''"
            :disabled="disabled"
            class="flex-1 min-w-[4rem] bg-transparent outline-none text-surface-800 placeholder:text-surface-400"
            @keydown="onKeydown"
            @focus="query.length >= minChars && (isOpen = true)"
        />

        <!-- Loader -->
        <span v-if="loading" class="shrink-0">
          <svg class="w-4 h-4 animate-spin text-surface-400" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
        </span>

        <!-- Clear -->
        <button
            v-else-if="query || selectedTags.length"
            type="button"
            class="shrink-0 text-surface-400 hover:text-surface-600 transition-colors"
            @click.stop="clearAll"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Dropdown -->
      <Transition name="pv-ac-fade">
        <div
            v-if="isOpen"
            ref="dropdownRef"
            class="absolute z-50 w-full mt-1 bg-surface-0 border border-surface-200 rounded-lg shadow-lg overflow-hidden"
        >
          <!-- Loading -->
          <div v-if="loading" class="flex items-center justify-center py-6 gap-2 text-sm text-surface-400">
            <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Recherche en cours...
          </div>

          <!-- Empty -->
          <div
              v-else-if="filteredOptions.length === 0"
              class="px-3 py-6 text-sm text-surface-400 text-center"
          >
            {{ emptyText }}
          </div>

          <!-- Options avec groupes -->
          <template v-else-if="hasGroups">
            <template v-for="[group, opts] in grouped" :key="group">
              <div
                  v-if="group"
                  class="px-3 py-1.5 text-xs font-semibold text-surface-400 uppercase tracking-wider bg-surface-50 border-b border-surface-100"
              >
                {{ group }}
              </div>
              <button
                  v-for="opt in opts"
                  :key="opt.value"
                  :class="[
                  'w-full flex items-start gap-2 px-3 py-2 text-sm text-left transition-colors duration-[--duration-fast] outline-none',
                  filteredOptions.indexOf(opt) === activeIndex
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-surface-700 hover:bg-surface-50',
                ]"
                  @click="select(opt)"
                  @mouseenter="activeIndex = filteredOptions.indexOf(opt)"
              >
                <!-- Slot custom -->
                <slot name="option" :option="opt" :query="query">
                  <span v-html="highlight(opt.label)" />
                </slot>
              </button>
            </template>
          </template>

          <!-- Options sans groupes -->
          <template v-else>
            <button
                v-for="(opt, i) in filteredOptions"
                :key="opt.value"
                :class="[
                'w-full flex items-start gap-2 px-3 py-2 text-sm text-left transition-colors duration-[--duration-fast] outline-none',
                i === activeIndex
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-surface-700 hover:bg-surface-50',
              ]"
                @click="select(opt)"
                @mouseenter="activeIndex = i"
            >
              <!-- Slot custom -->
              <slot name="option" :option="opt" :query="query">
                <span v-html="highlight(opt.label)" />
              </slot>
            </button>
          </template>
        </div>
      </Transition>
    </div>

    <!-- Error / Help -->
    <p v-if="error" class="text-sm text-danger-500">{{ error }}</p>
    <p v-else-if="helpText" class="text-sm text-surface-500">{{ helpText }}</p>
  </div>
</template>

<style scoped>
.pv-ac-fade-enter-active,
.pv-ac-fade-leave-active {
  transition: opacity var(--duration-fast) var(--ease-default),
  transform var(--duration-fast) var(--ease-default);
}
.pv-ac-fade-enter-from,
.pv-ac-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>