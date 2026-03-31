<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SelectOption } from './Select.types'

const props = defineProps<{
  options: SelectOption[]
  selected: (string | number)[]
  searchable: boolean
  searchQuery: string
  virtualScroll: boolean
  virtualItemHeight: number
  multiple?: boolean
}>()

const emit = defineEmits<{
  select: [option: SelectOption]
  'update:searchQuery': [value: string]
}>()

const listRef = ref<HTMLElement | null>(null)

// Groupes
const grouped = computed(() => {
  const map = new Map<string, SelectOption[]>()
  for (const opt of filteredOptions.value) {
    const group = opt.group ?? ''
    if (!map.has(group)) map.set(group, [])
    map.get(group)!.push(opt)
  }
  return map
})

const hasGroups = computed(() =>
    filteredOptions.value.some((o) => o.group)
)

const filteredOptions = computed(() => {
  if (!props.searchQuery) return props.options
  const q = props.searchQuery.toLowerCase()
  return props.options.filter((o) =>
      o.label.toLowerCase().includes(q)
  )
})

// Virtual scroll
const VISIBLE_COUNT = 8
const scrollTop = ref(0)

const virtualItems = computed(() => {
  if (!props.virtualScroll) return filteredOptions.value
  const start = Math.floor(scrollTop.value / props.virtualItemHeight)
  const end   = Math.min(start + VISIBLE_COUNT + 2, filteredOptions.value.length)
  return filteredOptions.value.slice(start, end).map((opt, i) => ({
    ...opt,
    _index: start + i,
  }))
})

const totalHeight = computed(() =>
    filteredOptions.value.length * props.virtualItemHeight
)

const offsetY = computed(() => {
  if (!props.virtualScroll) return 0
  return Math.floor(scrollTop.value / props.virtualItemHeight) * props.virtualItemHeight
})

function onScroll(e: Event) {
  scrollTop.value = (e.target as HTMLElement).scrollTop
}

function isSelected(value: string | number) {
  return props.selected.includes(value)
}
</script>

<template>
  <div class="bg-surface-0 border border-surface-200 rounded-lg shadow-lg overflow-hidden">

    <div v-if="searchable" class="p-2 border-b border-surface-100">
      <input
          :value="searchQuery"
          type="text"
          placeholder="Rechercher..."
          class="w-full px-3 py-1.5 text-sm bg-surface-50 border border-surface-200 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <!-- Liste -->
    <div
        ref="listRef"
        class="overflow-y-auto max-h-56 scrollbar-thin"
        @scroll="onScroll"
    >
      <div
          v-if="filteredOptions.length === 0"
          class="px-3 py-6 text-sm text-surface-400 text-center"
      >
        Aucune option
      </div>

      <div
          v-if="virtualScroll"
          :style="{ height: `${totalHeight}px`, position: 'relative' }"
      >
        <div :style="{ transform: `translateY(${offsetY}px)` }">
          <template v-for="opt in virtualItems" :key="opt.value">
            <button
                :disabled="opt.disabled"
                :class="[
                'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors duration-[--duration-fast] outline-none text-left',
                opt.disabled ? 'text-surface-300 cursor-not-allowed' : 'cursor-pointer hover:bg-surface-50',
                isSelected(opt.value) ? 'bg-primary-50 text-primary-600' : 'text-surface-700',
              ]"
                @click="!opt.disabled && emit('select', opt)"
            >
              <span v-if="opt.icon" class="w-4 h-4 shrink-0" v-html="opt.icon" />
              <span v-if="multiple" :class="['w-4 h-4 rounded shrink-0 border-2 flex items-center justify-center transition-colors', isSelected(opt.value) ? 'bg-primary-500 border-primary-500' : 'border-surface-300']">
                <svg v-if="isSelected(opt.value)" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span class="flex-1 min-w-0">
                <span class="block truncate">{{ opt.label }}</span>
                <span v-if="opt.description" class="block text-xs text-surface-400 truncate">{{ opt.description }}</span>
              </span>
            </button>
          </template>
        </div>
      </div>

      <template v-else>
        <template v-if="hasGroups">
          <template v-for="[group, opts] in grouped" :key="group">
            <div v-if="group" class="px-3 py-1.5 text-xs font-semibold text-surface-400 uppercase tracking-wider bg-surface-50 border-b border-surface-100">
              {{ group }}
            </div>
            <button
                v-for="opt in opts"
                :key="opt.value"
                :disabled="opt.disabled"
                :class="[
                'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors duration-[--duration-fast] outline-none text-left',
                opt.disabled ? 'text-surface-300 cursor-not-allowed' : 'cursor-pointer hover:bg-surface-50',
                isSelected(opt.value) ? 'bg-primary-50 text-primary-600' : 'text-surface-700',
              ]"
                @click="!opt.disabled && emit('select', opt)"
            >
              <span v-if="opt.icon" class="w-4 h-4 shrink-0" v-html="opt.icon" />
              <span v-if="multiple" :class="['w-4 h-4 rounded shrink-0 border-2 flex items-center justify-center transition-colors', isSelected(opt.value) ? 'bg-primary-500 border-primary-500' : 'border-surface-300']">
                <svg v-if="isSelected(opt.value)" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span class="flex-1 min-w-0">
                <span class="block truncate">{{ opt.label }}</span>
                <span v-if="opt.description" class="block text-xs text-surface-400 truncate">{{ opt.description }}</span>
              </span>
            </button>
          </template>
        </template>

        <template v-else>
          <button
              v-for="opt in filteredOptions"
              :key="opt.value"
              :disabled="opt.disabled"
              :class="[
              'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors duration-[--duration-fast] outline-none text-left',
              opt.disabled ? 'text-surface-300 cursor-not-allowed' : 'cursor-pointer hover:bg-surface-50',
              isSelected(opt.value) ? 'bg-primary-50 text-primary-600' : 'text-surface-700',
            ]"
              @click="!opt.disabled && emit('select', opt)"
          >
            <span v-if="opt.icon" class="w-4 h-4 shrink-0" v-html="opt.icon" />
            <span v-if="multiple" :class="['w-4 h-4 rounded shrink-0 border-2 flex items-center justify-center transition-colors', isSelected(opt.value) ? 'bg-primary-500 border-primary-500' : 'border-surface-300']">
              <svg v-if="isSelected(opt.value)" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span class="flex-1 min-w-0">
              <span class="block truncate">{{ opt.label }}</span>
              <span v-if="opt.description" class="block text-xs text-surface-400 truncate">{{ opt.description }}</span>
            </span>
          </button>
        </template>
      </template>
    </div>
  </div>
</template>