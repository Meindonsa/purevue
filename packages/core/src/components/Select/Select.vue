<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SelectDropdown from './SelectDropdown.vue'
import type { SelectProps, SelectOption } from './Select.types'
import type {InputSize, InputState} from "../Input";

const props = withDefaults(defineProps<SelectProps>(), {
  size: 'md',
  state: 'default',
  disabled: false,
  searchable: false,
  clearable: false,
  block: false,
  virtualScroll: false,
  virtualItemHeight: 36,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
  change: [option: SelectOption | null]
}>()

const isOpen    = ref(false)
const searchQuery = ref('')
const triggerRef  = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const internalOptions = ref<SelectOption[]>([...props.options])

const selectedOption = computed(() =>
    internalOptions.value.find((o) => o.value === props.modelValue) ?? null
)

function toggle()  { if (!props.disabled) isOpen.value = !isOpen.value }
function close()   { isOpen.value = false; searchQuery.value = '' }

function select(opt: SelectOption) {
  emit('update:modelValue', opt.value)
  emit('change', opt)
  close()
}

function clear(e: MouseEvent) {
  e.stopPropagation()
  emit('update:modelValue', null)
  emit('change', null)
}

function onCreate(label: string) {
  const newOpt: SelectOption = { label, value: label }
  internalOptions.value.push(newOpt)
  select(newOpt)
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
</script>

<template>
  <div :class="['flex flex-col gap-1', block ? 'w-full' : 'inline-flex']">

    <label v-if="label" class="text-sm font-medium text-surface-700">{{ label }}</label>

    <div ref="triggerRef" class="relative">
      <!-- Trigger -->
      <div
          :class="[
          'flex items-center gap-2 rounded-md border bg-surface-0 cursor-pointer select-none transition-all duration-[--duration-fast]',
          sizeClasses[size as InputSize],
          stateClasses[state as InputState],
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          isOpen ? 'ring-1 border-primary-500 ring-primary-500' : '',
        ]"
          @click="toggle"
      >
        <!-- Icône option -->
        <span v-if="selectedOption?.icon" class="w-4 h-4 shrink-0" v-html="selectedOption.icon" />

        <!-- Valeur / Placeholder -->
        <span :class="['flex-1 truncate', selectedOption ? 'text-surface-800' : 'text-surface-400']">
          {{ selectedOption?.label ?? placeholder ?? 'Sélectionner...' }}
        </span>

        <!-- Clear -->
        <button
            v-if="clearable && selectedOption"
            class="shrink-0 text-surface-400 hover:text-surface-600 transition-colors"
            @click="clear"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <!-- Chevron -->
        <svg
            :class="['w-4 h-4 text-surface-400 shrink-0 transition-transform duration-200', isOpen ? 'rotate-180' : '']"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

      <!-- Dropdown -->
      <Transition name="pv-select-fade">
        <div v-if="isOpen" ref="dropdownRef" class="absolute z-50 w-full mt-1">
          <SelectDropdown
              :options="internalOptions"
              :selected="modelValue != null ? [modelValue] : []"
              :searchable="searchable || false"
              :search-query="searchQuery"
              :virtual-scroll="virtualScroll || true"
              :virtual-item-height="virtualItemHeight || 36"
              @select="select"
              @create="onCreate"
              @update:search-query="searchQuery = $event"
          />
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