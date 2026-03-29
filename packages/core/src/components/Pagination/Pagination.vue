<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {PaginationAlign, PaginationProps, PaginationSize, ResolvedPaginationProps} from './Pagination.types'

const props = withDefaults(defineProps<PaginationProps>(), {
  perPage: 10,
  perPageOptions: () => [5, 10, 20, 50],
  showPerPage: false,
  siblings: 1,
  currentStyle: 'flat',
  size: 'md',
  align: 'center',
  showFirstLast: true,
}) as ResolvedPaginationProps

const emit = defineEmits<{
  'update:modelValue': [page: number]
  'update:perPage': [perPage: number]
  change: [page: number]
}>()

const internalPerPage = ref(props.perPage)

watch(() => props.perPage, (val) => { internalPerPage.value = val })

const totalPages = computed(() =>
    Math.max(1, Math.ceil(props.total / internalPerPage.value))
)

// ----------------------------------------
// Pages à afficher
// ----------------------------------------
const pages = computed(() => {
  const current = props.modelValue
  const total = totalPages.value
  const s = props.siblings
  const items: (number | '...')[] = []

  const left  = Math.max(2, current - s)
  const right = Math.min(total - 1, current + s)

  items.push(1)

  if (left > 2) items.push('...')

  for (let i = left; i <= right; i++) items.push(i)

  if (right < total - 1) items.push('...')

  if (total > 1) items.push(total)

  return items
})

function goTo(page: number) {
  if (page < 1 || page > totalPages.value || page === props.modelValue) return
  emit('update:modelValue', page)
  emit('change', page)
}

function onPerPageChange(event: Event) {
  const val = Number((event.target as HTMLSelectElement).value)
  internalPerPage.value = val
  emit('update:perPage', val)
  goTo(1)
}

// ----------------------------------------
// Styles
// ----------------------------------------
const sizeClasses: Record<string, string> = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
}

const alignClasses: Record<string, string> = {
  left:   'justify-start',
  center: 'justify-center',
  right:  'justify-end',
}

function pageClasses(page: number | '...') {
  if (page === '...') return [
    'flex items-center justify-center text-surface-400 cursor-default',
    sizeClasses[props.size],
  ]

  const isActive = page === props.modelValue
  const base = [
    'flex items-center justify-center font-medium transition-all duration-[--duration-fast] cursor-pointer select-none',
    sizeClasses[props.size],
  ]

  if (!isActive) {
    base.push('text-surface-600 hover:text-surface-900 hover:bg-surface-100')
  }

  // Shape
  if (props.currentStyle === 'circle') base.push('rounded-full')
  if (props.currentStyle === 'square') base.push('rounded-md')
  if (['flat', 'underline', 'overline'].includes(props.currentStyle)) base.push('rounded-md')

  // Active state sans couleur custom
  if (isActive && !props.color) {
    if (props.currentStyle === 'circle' || props.currentStyle === 'square') {
      base.push('bg-primary-500 text-white')
    }
    if (props.currentStyle === 'flat') {
      base.push('bg-primary-50 text-primary-600')
    }
    if (props.currentStyle === 'underline') {
      base.push('text-primary-600 border-b-2 border-primary-500')
    }
    if (props.currentStyle === 'overline') {
      base.push('text-primary-600 border-t-2 border-primary-500')
    }
  }

  // Shape
  if (props.currentStyle === 'circle') base.push('rounded-full')
  if (props.currentStyle === 'square') base.push('rounded-md')
  if (props.currentStyle === 'flat')   base.push('rounded-md')
  if (props.currentStyle === 'underline' || props.currentStyle === 'overline') base.push('rounded-none')
  return base
}

// Style inline pour couleur custom
function pageStyle(page: number | '...') {
  if (page === '...' || page !== props.modelValue || !props.color) return {}

  if (props.currentStyle === 'circle' || props.currentStyle === 'square') {
    return { backgroundColor: props.color, color: '#fff' }
  }
  if (props.currentStyle === 'flat') {
    return { backgroundColor: `${props.color}20`, color: props.color }
  }
  if (props.currentStyle === 'underline') {
    return { borderBottomColor: props.color, color: props.color }
  }
  if (props.currentStyle === 'overline') {
    return { borderTopColor: props.color, color: props.color }
  }
  return {}
}

const navBtnClasses = computed(() => [
  'flex items-center justify-center rounded-md transition-all duration-[--duration-fast]',
  sizeClasses[props.size],
  'text-surface-500 hover:text-surface-800 hover:bg-surface-100 disabled:opacity-30 disabled:cursor-not-allowed',
])

const chevronSize: Record<string, string> = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}
</script>

<template>
  <div :class="['flex flex-wrap items-center gap-3', alignClasses[align as PaginationAlign]]">

    <!-- Rows per page -->
    <div v-if="showPerPage" class="flex items-center gap-2 mr-2">
      <span class="text-sm text-surface-500 whitespace-nowrap">Lignes par page</span>
      <select
          :value="internalPerPage"
          class="text-sm border border-surface-200 rounded-md px-2 py-1 bg-surface-0 text-surface-700 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 cursor-pointer"
          @change="onPerPageChange"
      >
        <option v-for="opt in perPageOptions" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>

    <div class="flex items-center gap-1">
      <!-- Première page -->
      <button
          v-if="showFirstLast"
          :class="navBtnClasses"
          :disabled="modelValue === 1"
          @click="goTo(1)"
      >
        <svg :class="chevronSize[size as PaginationSize]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>
        </svg>
      </button>

      <!-- Précédent -->
      <button
          :class="navBtnClasses"
          :disabled="modelValue === 1"
          @click="goTo(modelValue - 1)"
      >
        <svg :class="chevronSize[size as PaginationSize]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      <!-- Pages -->
      <button
          v-for="(page, i) in pages"
          :key="`${page}-${i}`"
          :class="pageClasses(page)"
          :style="pageStyle(page)"
          :disabled="page === '...'"
          @click="typeof page === 'number' && goTo(page)"
      >
        {{ page }}
      </button>

      <!-- Suivant -->
      <button
          :class="navBtnClasses"
          :disabled="modelValue === totalPages"
          @click="goTo(modelValue + 1)"
      >
        <svg :class="chevronSize[size as PaginationSize]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      <!-- Dernière page -->
      <button
          v-if="showFirstLast"
          :class="navBtnClasses"
          :disabled="modelValue === totalPages"
          @click="goTo(totalPages)"
      >
        <svg :class="chevronSize[size as PaginationSize]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
        </svg>
      </button>
    </div>

    <!-- Info total -->
    <span class="text-sm text-surface-400 ml-2">
      {{ (modelValue - 1) * internalPerPage + 1 }}–{{ Math.min(modelValue * internalPerPage, total) }}
      sur {{ total }}
    </span>

  </div>
</template>