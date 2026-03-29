<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { TabsProps, ResolvedTabsProps } from './Tabs.types'

const props = withDefaults(defineProps<TabsProps>(), {
  variant: 'line',
  position: 'top',
  size: 'md',
  lazy: false,
  block: false,
  animation: 'none',
}) as ResolvedTabsProps

const emit = defineEmits<{
  'update:modelValue': [key: string]
  change: [key: string]
}>()

const activeKey = ref(props.modelValue ?? props.tabs[0]?.key ?? '')
const mounted = ref<Set<string>>(new Set([activeKey.value]))

// Direction du slide : 1 = suivant, -1 = précédent
const direction = ref(1)

watch(() => props.modelValue, (val) => {
  if (val) activeKey.value = val
})

function getIndex(key: string) {
  return props.tabs.findIndex((t) => t.key === key)
}

function activate(key: string) {
  if (activeKey.value === key) return
  direction.value = getIndex(key) > getIndex(activeKey.value) ? 1 : -1
  activeKey.value = key
  mounted.value.add(key)
  emit('update:modelValue', key)
  emit('change', key)
}

// ----------------------------------------
// Animation
// ----------------------------------------

// Nom de la transition selon animation + position + direction
const transitionName = computed(() => {
  if (props.animation === 'none') return ''
  if (props.animation === 'fade') return 'pv-fade'

  const isVertical = ['left', 'right'].includes(props.position)
  if (isVertical) {
    return direction.value === 1 ? 'pv-slide-down' : 'pv-slide-up'
  } else {
    return direction.value === 1 ? 'pv-slide-right' : 'pv-slide-left'
  }
})

// ----------------------------------------
// Layout
// ----------------------------------------
const isVertical = computed(() => ['left', 'right'].includes(props.position))

const containerClasses = computed(() => [
  'flex',
  isVertical.value ? 'flex-row' : 'flex-col',
  props.position === 'bottom' ? 'flex-col-reverse' : '',
  props.position === 'right'  ? 'flex-row-reverse' : '',
])

// ----------------------------------------
// Tab list
// ----------------------------------------
const tabListClasses = computed(() => {
  const base = ['flex shrink-0']

  if (isVertical.value) {
    base.push('flex-col')
    if (props.variant === 'line') {
      base.push(props.position === 'right'
          ? 'border-l border-surface-200'
          : 'border-r border-surface-200'
      )
    }
  } else {
    if (props.variant === 'line') {
      base.push(props.position === 'bottom'
          ? 'border-t border-surface-200'
          : 'border-b border-surface-200'
      )
    }
  }

  if (props.variant === 'card') base.push('gap-1')
  if (props.variant === 'pill') base.push('gap-1 p-1 bg-surface-100 rounded-lg')
  if (props.block && !isVertical.value) base.push('w-full')

  return base
})

// ----------------------------------------
// Tab item
// ----------------------------------------
const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
}

function tabClasses(key: string, disabled: boolean = false) {
  const isActive = activeKey.value === key
  const base = [
    'inline-flex items-center justify-center gap-2 font-medium transition-all duration-[--duration-fast] whitespace-nowrap outline-none',
    sizeClasses[props.size],
    disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
    props.block && !isVertical.value ? 'flex-1' : '',
  ]

  if (props.variant === 'line') {
    const borderSide = {
      top:    'border-b-2',
      bottom: 'border-t-2',
      left:   'border-r-2',
      right:  'border-l-2',
    }[props.position]

    base.push(
        isActive
            ? `${borderSide} border-primary-500 text-primary-500`
            : `${borderSide} border-transparent text-surface-500 hover:text-surface-800 hover:border-surface-300`
    )
  }

  if (props.variant === 'pill') {
    base.push('rounded-md')
    base.push(
        isActive
            ? 'bg-surface-0 text-surface-800 shadow-sm'
            : 'text-surface-500 hover:text-surface-700'
    )
  }

  if (props.variant === 'card') {
    base.push('rounded-t-lg border border-b-0')
    base.push(
        isActive
            ? 'bg-surface-0 border-surface-200 text-surface-800'
            : 'bg-surface-50 border-transparent text-surface-500 hover:text-surface-700 hover:bg-surface-100'
    )
  }

  return base
}

// ----------------------------------------
// Tab content
// ----------------------------------------
const contentClasses = computed(() => {
  const base = ['flex-1 min-w-0 overflow-hidden relative']
  if (!isVertical.value) base.push('pt-4')
  if (isVertical.value)  base.push(props.position === 'right' ? 'pr-4' : 'pl-4')
  return base
})

function shouldRender(key: string): boolean {
  if (!props.lazy) return true
  return mounted.value.has(key)
}
</script>

<template>
  <div :class="containerClasses">

    <!-- Tab list -->
    <div :class="tabListClasses" role="tablist">
      <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="tabClasses(tab.key, tab.disabled)"
          :disabled="tab.disabled"
          role="tab"
          :aria-selected="activeKey === tab.key"
          :aria-controls="`panel-${tab.key}`"
          @click="!tab.disabled && activate(tab.key)"
      >
        <slot :name="`icon-${tab.key}`" />
        {{ tab.label }}
        <span
            v-if="tab.badge !== undefined"
            class="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-700"
        >
          {{ tab.badge }}
        </span>
      </button>
    </div>

    <!-- Tab panels -->
    <div :class="contentClasses">
      <Transition :name="transitionName" mode="out-in">
        <div :key="activeKey" style="width: 100%">
          <template v-for="tab in tabs" :key="tab.key">
            <div v-if="activeKey === tab.key">
              <template v-if="shouldRender(tab.key)">
                <slot :name="tab.key" />
              </template>
            </div>
          </template>
        </div>
      </Transition>
    </div>

  </div>
</template>

<style scoped>
/* Fade */
.pv-fade-enter-active,
.pv-fade-leave-active {
  transition: opacity var(--duration-normal) var(--ease-default);
}
.pv-fade-enter-from,
.pv-fade-leave-to { opacity: 0; }

/* Slide right (suivant, top/bottom) */
.pv-slide-right-enter-active,
.pv-slide-right-leave-active {
  transition: transform var(--duration-normal) var(--ease-default),
  opacity var(--duration-normal) var(--ease-default);
  overflow: hidden;
}
.pv-slide-right-enter-from {
  transform: translateX(40px);
  opacity: 0;
}
.pv-slide-right-leave-to {
  transform: translateX(-40px);
  opacity: 0;
}

/* Slide left (précédent, top/bottom) */
.pv-slide-left-enter-active,
.pv-slide-left-leave-active {
  transition: transform var(--duration-normal) var(--ease-default),
  opacity var(--duration-normal) var(--ease-default);
  overflow: hidden;
}
.pv-slide-left-enter-from {
  transform: translateX(-40px);
  opacity: 0;
}
.pv-slide-left-leave-to {
  transform: translateX(40px);
  opacity: 0;
}

/* Slide down (suivant, left/right) */
.pv-slide-down-enter-active,
.pv-slide-down-leave-active {
  transition: transform var(--duration-normal) var(--ease-default),
  opacity var(--duration-normal) var(--ease-default);
  overflow: hidden;
}
.pv-slide-down-enter-from {
  transform: translateY(40px);
  opacity: 0;
}
.pv-slide-down-leave-to {
  transform: translateY(-40px);
  opacity: 0;
}

/* Slide up (précédent, left/right) */
.pv-slide-up-enter-active,
.pv-slide-up-leave-active {
  transition: transform var(--duration-normal) var(--ease-default),
  opacity var(--duration-normal) var(--ease-default);
  overflow: hidden;
}
.pv-slide-up-enter-from {
  transform: translateY(-40px);
  opacity: 0;
}
.pv-slide-up-leave-to {
  transform: translateY(40px);
  opacity: 0;
}
</style>