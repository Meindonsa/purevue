<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SelectDropdown from './SelectDropdown.vue'
import type { MultiSelectProps, ResolvedMultiSelectProps, SelectOption } from './Select.types'
import {InputSize, InputState} from "../Input";

const props = withDefaults(defineProps<MultiSelectProps>(), {
  modelValue: () => [],
  size: 'md',
  state: 'default',
  disabled: false,
  searchable: false,
  clearable: false,
  block: false,
  virtualScroll: false,
  virtualItemHeight: 36,
  showSelectAll: true,
}) as ResolvedMultiSelectProps

const emit = defineEmits<{
  'update:modelValue': [value: (string | number)[]]
  change: [value: (string | number)[]]
}>()

const isOpen      = ref(false)
const searchQuery = ref('')
const triggerRef  = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const internalOptions = ref<SelectOption[]>([...props.options])

const selected = computed(() => props.modelValue ?? [])

const allSelected = computed(() =>
    internalOptions.value
        .filter((o) => !o.disabled)
        .every((o) => selected.value.includes(o.value))
)

const displayTags = computed(() => {
  const opts = internalOptions.value.filter((o) => selected.value.includes(o.value))
  if (!props.maxTags) return { visible: opts, extra: 0 }
  return {
    visible: opts.slice(0, props.maxTags),
    extra: Math.max(0, opts.length - props.maxTags),
  }
})

function toggle() { if (!props.disabled) isOpen.value = !isOpen.value }
function close()  { isOpen.value = false; searchQuery.value = '' }

function select(opt: SelectOption) {
  const current = [...selected.value]
  const idx = current.indexOf(opt.value)
  if (idx === -1) current.push(opt.value)
  else current.splice(idx, 1)
  emit('update:modelValue', current)
  emit('change', current)
}

function removeTag(value: string | number, e: MouseEvent) {
  e.stopPropagation()
  const current = selected.value.filter((v) => v !== value)
  emit('update:modelValue', current)
  emit('change', current)
}

function clearAll(e: MouseEvent) {
  e.stopPropagation()
  emit('update:modelValue', [])
  emit('change', [])
}

function toggleAll() {
  if (allSelected.value) {
    emit('update:modelValue', [])
    emit('change', [])
  } else {
    const all = internalOptions.value.filter((o) => !o.disabled).map((o) => o.value)
    emit('update:modelValue', all)
    emit('change', all)
  }
}

function onClickOutside(e: MouseEvent) {
  if (
      !triggerRef.value?.contains(e.target as Node) &&
      !dropdownRef.value?.contains(e.target as Node)
  ) close()
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-1.5 text-base',
  lg: 'px-4 py-2 text-lg',
}

const stateClasses: Record<string, string> = {
  default: 'border-surface-300',
  error:   'border-danger-500',
  success: 'border-success-500',
  warning: 'border-warning-500',
}
</script>

<template>
  <div :class="['flex flex-col gap-1', block ? 'w-full' : 'inline-flex']">

    <label v-if="label" class="text-sm font-medium text-surface-700">{{ label }}</label>

    <div ref="triggerRef" class="relative">
      <!-- Trigger -->
      <div
          :class="[
          'flex flex-wrap items-center gap-1.5 rounded-md border bg-surface-0 cursor-pointer min-h-[2.5rem] transition-all duration-[--duration-fast]',
          sizeClasses[size as InputSize],
          stateClasses[state as InputState],
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          isOpen ? 'ring-1 border-primary-500 ring-primary-500' : '',
        ]"
          @click="toggle"
      >
        <!-- Tags -->
        <template v-if="selected.length > 0">
          <span
              v-for="opt in displayTags.visible"
              :key="opt.value"
              class="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-md"
          >
            {{ opt.label }}
            <button
                class="hover:text-primary-900 transition-colors"
                @click="removeTag(opt.value, $event)"
            >
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </span>
          <!-- Extra count -->
          <span
              v-if="displayTags.extra > 0"
              class="inline-flex items-center px-2 py-0.5 bg-surface-100 text-surface-600 text-xs font-medium rounded-md"
          >
            +{{ displayTags.extra }}
          </span>
        </template>

        <!-- Placeholder -->
        <span v-else class="text-surface-400 text-sm flex-1">
          {{ placeholder ?? 'Sélectionner...' }}
        </span>

        <div class="flex items-center gap-1 ml-auto shrink-0">
          <!-- Clear all -->
          <button
              v-if="clearable && selected.length > 0"
              class="text-surface-400 hover:text-surface-600 transition-colors"
              @click="clearAll"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <!-- Chevron -->
          <svg
              :class="['w-4 h-4 text-surface-400 transition-transform duration-200', isOpen ? 'rotate-180' : '']"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      <!-- Dropdown -->
      <Transition name="pv-select-fade">
        <div v-if="isOpen" ref="dropdownRef" class="absolute z-50 w-full mt-1">
          <!-- Select all -->
          <div v-if="showSelectAll" class="bg-surface-0 border border-b-0 border-surface-200 rounded-t-lg px-3 py-2">
            <button
                class="flex items-center gap-2 text-sm text-surface-600 hover:text-surface-900 transition-colors w-full"
                @click="toggleAll"
            >
              <span :class="['w-4 h-4 rounded border-2 flex items-center justify-center transition-colors shrink-0', allSelected ? 'bg-primary-500 border-primary-500' : 'border-surface-300']">
                <svg v-if="allSelected" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              {{ allSelected ? 'Tout désélectionner' : 'Tout sélectionner' }}
            </button>
          </div>

          <div :class="showSelectAll ? 'rounded-t-none' : ''">
            <SelectDropdown
                :options="internalOptions"
                :selected="selected"
                :searchable="searchable || false"
                :search-query="searchQuery"
                :virtual-scroll="virtualScroll  || true"
                :virtual-item-height="virtualItemHeight || 36"
                :multiple="true"
                @select="select"
                @update:search-query="searchQuery = $event"
            />
          </div>
        </div>
      </Transition>
    </div>

    <p v-if="error" class="text-sm text-danger-500">{{ error }}</p>
    <p v-else-if="helpText" class="text-sm text-surface-500">{{ helpText }}</p>
  </div>
</template>

<style scoped>
.pv-select-fade-enter-active,
.pv-select-fade-leave-active {
  transition: opacity var(--duration-fast) var(--ease-default),
  transform var(--duration-fast) var(--ease-default);
}
.pv-select-fade-enter-from,
.pv-select-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>