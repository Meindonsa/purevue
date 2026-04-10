<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CalendarGrid from './CalendarGrid.vue'
import TimeSelector from './TimeSelector.vue'
import { formatDate } from './date.utils'
import {DatePickerMode, DatePickerProps, ResolvedDatePickerProps, WeekStart} from './DatePicker.types'
import {InputSize} from "../Input";

const props = withDefaults(defineProps<DatePickerProps>(), {
  mode: 'date',
  display: 'dropdown',
  size: 'md',
  disabled: false,
  weekStart: 1,
  clearable: false,
}) as ResolvedDatePickerProps

const emit = defineEmits<{
  'update:modelValue': [value: Date | [Date, Date] | null]
  change: [value: Date | [Date, Date] | null]
}>()

const isOpen    = ref(false)
const triggerRef  = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const hoverDate   = ref<Date | null>(null)
const selectingRange = ref(false)

// Range en cours de sélection
const rangeStart = ref<Date | null>(null)

// ----------------------------------------
// Format affiché
// ----------------------------------------
const displayFormat = computed(() => {
  if (props.format) return props.format
  return props.mode === 'datetime' ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY'
})

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  if (props.modelValue instanceof Date) return formatDate(props.modelValue, displayFormat.value)
  if (Array.isArray(props.modelValue)) {
    const [a, b] = props.modelValue
    return `${formatDate(a, displayFormat.value)} — ${formatDate(b, displayFormat.value)}`
  }
  return ''
})

// ----------------------------------------
// Sélection
// ----------------------------------------
function onSelectDate(date: Date) {
  if (props.mode === 'date' || props.mode === 'datetime') {
    const result = new Date(date)
    if (props.modelValue instanceof Date) {
      result.setHours(props.modelValue.getHours(), props.modelValue.getMinutes())
    }
    emit('update:modelValue', result)
    emit('change', result)
    if (props.mode === 'date') isOpen.value = false
  }

  if (props.mode === 'range') {
    if (!selectingRange.value) {
      // Premier clic — début de la plage
      selectingRange.value = true
      rangeStart.value = date
      emit('update:modelValue', null)
    } else {
      // Deuxième clic — fin de la plage
      selectingRange.value = false
      const start = rangeStart.value!
      const end   = date
      const sorted: [Date, Date] = start <= end ? [start, end] : [end, start]
      rangeStart.value = null
      emit('update:modelValue', sorted)
      emit('change', sorted)
      isOpen.value = false
    }
  }
}

function onTimeChange(hours: number, minutes: number) {
  if (props.modelValue instanceof Date) {
    const d = new Date(props.modelValue)
    d.setHours(hours, minutes)
    emit('update:modelValue', d)
    emit('change', d)
  }
}

function clear(e: MouseEvent) {
  e.stopPropagation()
  emit('update:modelValue', null)
  emit('change', null)
}

// ----------------------------------------
// Calender value pour le range en cours
// ----------------------------------------
const calendarValue = computed(() => {
  if (props.mode === 'range' && selectingRange.value && rangeStart.value) {
    const end = hoverDate.value ?? rangeStart.value
    const sorted: [Date, Date] = rangeStart.value <= end
        ? [rangeStart.value, end]
        : [end, rangeStart.value]
    return sorted
  }
  // Range déjà sélectionnée : on la passe telle quelle
  return props.modelValue ?? null
})

// ----------------------------------------
// Ouverture / fermeture
// ----------------------------------------
function toggle() { if (!props.disabled) isOpen.value = !isOpen.value }
function close()  { isOpen.value = false; rangeStart.value = null }

function onClickOutside(e: MouseEvent) {
  if (
      !triggerRef.value?.contains(e.target as Node) &&
      !dropdownRef.value?.contains(e.target as Node)
  ) close()
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))

// ----------------------------------------
// Styles
// ----------------------------------------
const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
}
</script>

<template>
  <div class="flex flex-col gap-1" :class="display === 'inline' ? 'inline-flex' : 'w-full'">

    <!-- Label -->
    <label v-if="label" class="text-sm font-medium text-surface-700">{{ label }}</label>

    <!-- Inline -->
    <div v-if="display === 'inline'" class="border border-surface-200 rounded-xl overflow-hidden bg-surface-0 shadow-sm p-2">
      <CalendarGrid
          :model-value="calendarValue"
          :mode="mode as DatePickerMode"
          :min-date="minDate"
          :max-date="maxDate"
          :week-start="weekStart as WeekStart"
          :hover-date="hoverDate"
          @select="onSelectDate"
          @hover="hoverDate = $event"
      />
      <TimeSelector
          v-if="mode === 'datetime'"
          :model-value="modelValue instanceof Date ? modelValue : null"
          @change="onTimeChange"
      />
    </div>

    <!-- Dropdown / Button -->
    <template v-else>
      <div ref="triggerRef" class="relative">

        <!-- Trigger Dropdown -->
        <div
            v-if="display === 'dropdown'"
            :class="[
            'flex items-center gap-2 rounded-md border bg-surface-0 cursor-pointer transition-all duration-[--duration-fast]',
            sizeClasses[size as InputSize],
            disabled ? 'opacity-50 cursor-not-allowed' : '',
            isOpen
              ? 'border-primary-500 ring-1 ring-primary-500'
              : 'border-surface-300',
          ]"
            @click="toggle"
        >
          <svg class="w-4 h-4 text-surface-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span :class="['flex-1 truncate', displayValue ? 'text-surface-800' : 'text-surface-400']">
            {{ displayValue || placeholder || 'Sélectionner une date...' }}
          </span>
          <button
              v-if="clearable && modelValue"
              class="text-surface-400 hover:text-surface-600 transition-colors shrink-0"
              @click="clear"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Trigger Button -->
        <button
            v-else-if="display === 'button'"
            :class="[
            'inline-flex items-center gap-2 rounded-md border bg-surface-0 cursor-pointer transition-all duration-[--duration-fast] font-medium',
            sizeClasses[size as InputSize],
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-50',
            isOpen ? 'border-primary-500 ring-1 ring-primary-500 text-primary-600' : 'border-surface-300 text-surface-700',
          ]"
            :disabled="disabled"
            @click="toggle"
        >
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {{ displayValue || placeholder || 'Choisir une date' }}
        </button>

        <!-- Dropdown panel -->
        <Transition name="pv-dp-fade">
          <div
              v-if="isOpen"
              ref="dropdownRef"
              class="absolute z-50 mt-1 left-0"
          >
            <div class="bg-surface-0 border border-surface-200 rounded-xl shadow-lg overflow-hidden p-2">
              <CalendarGrid
                  :model-value="calendarValue"
                  :mode="mode as DatePickerMode"
                  :min-date="minDate"
                  :max-date="maxDate"
                  :week-start="weekStart as WeekStart"
                  :hover-date="hoverDate"
                  @select="onSelectDate"
                  @hover="hoverDate = $event"
              />
              <TimeSelector
                  v-if="mode === 'datetime'"
                  :model-value="modelValue instanceof Date ? modelValue : null"
                  @change="onTimeChange"
              />
            </div>
          </div>
        </Transition>

      </div>
    </template>

    <!-- Error / HelpText -->
    <p v-if="error" class="text-sm text-danger-500">{{ error }}</p>
    <p v-else-if="helpText" class="text-sm text-surface-500">{{ helpText }}</p>
  </div>
</template>

<style scoped>
.pv-dp-fade-enter-active,
.pv-dp-fade-leave-active {
  transition: opacity var(--duration-fast) var(--ease-default),
  transform var(--duration-fast) var(--ease-default);
}
.pv-dp-fade-enter-from,
.pv-dp-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>