<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DatePickerMode, DatePickerView, WeekStart } from './DatePicker.types'
import {
  isSameDay, isBetween, startOfDay,
  getDaysInMonth, getFirstDayOfMonth, generateYears,
} from './date.utils'

const props = defineProps<{
  modelValue?: Date | [Date, Date] | null
  mode: DatePickerMode
  minDate?: Date
  maxDate?: Date
  weekStart: WeekStart
  hoverDate?: Date | null
}>()

const emit = defineEmits<{
  select: [date: Date]
  hover: [date: Date | null]
}>()

const today = startOfDay(new Date())
const view  = ref<DatePickerView>('days')

const cursor = ref({
  month: (props.modelValue instanceof Date
          ? props.modelValue
          : Array.isArray(props.modelValue)
              ? props.modelValue[0]
              : new Date()
  ).getMonth(),
  year: (props.modelValue instanceof Date
          ? props.modelValue
          : Array.isArray(props.modelValue)
              ? props.modelValue[0]
              : new Date()
  ).getFullYear(),
})

// ----------------------------------------
// Navigation
// ----------------------------------------
const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAYS_FR   = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']

const weekDays = computed(() => {
  const days = [...DAYS_FR]
  if (props.weekStart === 1) {
    days.push(days.shift()!)
  }
  return days
})

function prevMonth() {
  if (cursor.value.month === 0) { cursor.value.month = 11; cursor.value.year-- }
  else cursor.value.month--
}

function nextMonth() {
  if (cursor.value.month === 11) { cursor.value.month = 0; cursor.value.year++ }
  else cursor.value.month++
}

// ----------------------------------------
// Jours du calendrier
// ----------------------------------------
interface CalendarDay {
  date: Date
  current: boolean
  disabled: boolean
}

const calendarDays = computed<CalendarDay[]>(() => {
  const { month, year } = cursor.value
  const daysInMonth   = getDaysInMonth(year, month)
  const firstDayIndex = getFirstDayOfMonth(year, month, props.weekStart)
  const daysInPrev    = getDaysInMonth(year, month === 0 ? 11 : month - 1)
  const days: CalendarDay[] = []

  // Jours du mois précédent
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, daysInPrev - i)
    days.push({ date: d, current: false, disabled: isDisabled(d) })
  }

  // Jours du mois courant
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    days.push({ date, current: true, disabled: isDisabled(date) })
  }

  // Jours du mois suivant
  const remaining = 42 - days.length
  for (let d = 1; d <= remaining; d++) {
    const date = new Date(year, month + 1, d)
    days.push({ date, current: false, disabled: isDisabled(date) })
  }

  return days
})

function isDisabled(date: Date): boolean {
  if (props.minDate && startOfDay(date) < startOfDay(props.minDate)) return true
  if (props.maxDate && startOfDay(date) > startOfDay(props.maxDate)) return true
  return false
}

// ----------------------------------------
// États des jours
// ----------------------------------------
function isSelected(date: Date): boolean {
  if (!props.modelValue) return false
  if (props.modelValue instanceof Date) return isSameDay(date, props.modelValue)
  if (Array.isArray(props.modelValue)) {
    return isSameDay(date, props.modelValue[0]) || isSameDay(date, props.modelValue[1])
  }
  return false
}

function isRangeStart(date: Date): boolean {
  if (!Array.isArray(props.modelValue)) return false
  return isSameDay(date, props.modelValue[0])
}

function isRangeEnd(date: Date): boolean {
  if (!Array.isArray(props.modelValue)) return false
  return isSameDay(date, props.modelValue[1])
}

function isInRange(date: Date): boolean {
  // Range sélectionnée
  if (Array.isArray(props.modelValue) && props.modelValue.length === 2) {
    return isBetween(startOfDay(date), startOfDay(props.modelValue[0]), startOfDay(props.modelValue[1]))
  }
  // Range en cours de sélection (hover)
  if (Array.isArray(props.modelValue) && props.modelValue.length === 1 && props.hoverDate) {
    const start = props.modelValue[0]
    const end   = props.hoverDate
    if (start < end) return isBetween(startOfDay(date), startOfDay(start), startOfDay(end))
    return isBetween(startOfDay(date), startOfDay(end), startOfDay(start))
  }
  return false
}

function isToday(date: Date): boolean {
  return isSameDay(date, today)
}

function dayClasses(day: CalendarDay) {
  const sel  = isSelected(day.date)
  const inR  = isInRange(day.date)
  const rS   = isRangeStart(day.date)
  const rE   = isRangeEnd(day.date)
  const tod  = isToday(day.date)

  return [
    'relative flex items-center justify-center text-sm font-medium transition-all duration-[--duration-fast] select-none',
    'w-8 h-8 rounded-full mx-auto',
    day.disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer',
    !day.current ? 'text-surface-300' : '',
    sel ? 'bg-primary-500 text-white' : '',
    !sel && !inR && !day.disabled && day.current ? 'hover:bg-primary-50 hover:text-primary-600' : '',
    inR && !rS && !rE ? 'bg-primary-100 text-primary-700 rounded-none' : '',
    rS && !rE ? 'bg-primary-500 text-white rounded-l-full rounded-r-none' : '',
    rE && !rS ? 'bg-primary-500 text-white rounded-r-full rounded-l-none' : '',
    tod && !sel ? 'ring-1 ring-primary-400' : '',
  ]
}

// ----------------------------------------
// Sélection mois/année
// ----------------------------------------
const years = computed(() => generateYears(cursor.value.year))

function selectMonth(month: number) {
  cursor.value.month = month
  view.value = 'days'
}

function selectYear(year: number) {
  cursor.value.year = year
  view.value = 'months'
}
</script>

<template>
  <div class="w-72 select-none">

    <!-- Header navigation -->
    <div class="flex items-center justify-between px-2 py-3">
      <button
          v-if="view === 'days'"
          class="p-1.5 rounded-md hover:bg-surface-100 text-surface-500 transition-colors"
          @click="prevMonth"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <div v-else class="w-7" />

      <!-- Titre cliquable -->
      <div class="flex items-center gap-1">
        <button
            :class="['px-2 py-1 rounded-md text-sm font-semibold text-surface-800 hover:bg-surface-100 transition-colors', view === 'months' ? 'bg-surface-100' : '']"
            @click="view = view === 'months' ? 'days' : 'months'"
        >
          {{ MONTHS_FR[cursor.month] }}
        </button>
        <button
            :class="['px-2 py-1 rounded-md text-sm font-semibold text-surface-800 hover:bg-surface-100 transition-colors', view === 'years' ? 'bg-surface-100' : '']"
            @click="view = view === 'years' ? 'days' : 'years'"
        >
          {{ cursor.year }}
        </button>
      </div>

      <button
          v-if="view === 'days'"
          class="p-1.5 rounded-md hover:bg-surface-100 text-surface-500 transition-colors"
          @click="nextMonth"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
      <div v-else class="w-7" />
    </div>

    <!-- Vue : Jours -->
    <div v-if="view === 'days'">
      <!-- Entêtes jours -->
      <div class="grid grid-cols-7 mb-1">
        <div
            v-for="day in weekDays"
            :key="day"
            class="text-center text-xs font-medium text-surface-400 py-1"
        >
          {{ day }}
        </div>
      </div>

      <!-- Grille jours -->
      <div class="grid grid-cols-7 gap-y-0.5">
        <div
            v-for="(day, i) in calendarDays"
            :key="i"
            :class="dayClasses(day)"
            @click="!day.disabled && emit('select', day.date)"
            @mouseenter="!day.disabled && emit('hover', day.date)"
            @mouseleave="emit('hover', null)"
        >
          {{ day.date.getDate() }}
        </div>
      </div>
    </div>

    <!-- Vue : Mois -->
    <div v-else-if="view === 'months'" class="grid grid-cols-3 gap-2 p-2">
      <button
          v-for="(month, i) in MONTHS_FR"
          :key="i"
          :class="[
          'py-2 px-1 text-sm rounded-lg transition-colors',
          i === cursor.month
            ? 'bg-primary-500 text-white font-medium'
            : 'text-surface-700 hover:bg-surface-100',
        ]"
          @click="selectMonth(i)"
      >
        {{ month.slice(0, 3) }}
      </button>
    </div>

    <!-- Vue : Années -->
    <div v-else-if="view === 'years'" class="grid grid-cols-4 gap-1.5 p-2 max-h-48 overflow-y-auto scrollbar-thin">
      <button
          v-for="year in years"
          :key="year"
          :class="[
          'py-2 text-sm rounded-lg transition-colors',
          year === cursor.year
            ? 'bg-primary-500 text-white font-medium'
            : 'text-surface-700 hover:bg-surface-100',
        ]"
          @click="selectYear(year)"
      >
        {{ year }}
      </button>
    </div>

  </div>
</template>