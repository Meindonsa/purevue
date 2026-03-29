<script setup lang="ts">
import { ref, watch } from 'vue'
import {PanelPadding, PanelProps, PanelVariant, ResolvedPanelProps} from './Panel.types'

const props = withDefaults(defineProps<PanelProps>(), {
  variant: 'default',
  padding: 'md',
  toggleable: false,
  collapsed: true,
}) as ResolvedPanelProps

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
  toggle: [value: boolean]
}>()

const isCollapsed = ref(props.collapsed)

watch(() => props.collapsed, (val) => {
  isCollapsed.value = val
})

function toggle() {
  isCollapsed.value = !isCollapsed.value
  emit('update:collapsed', isCollapsed.value)
  emit('toggle', isCollapsed.value)
}

const variantClasses: Record<string, string> = {
  default:  'bg-surface-0 border border-surface-200',
  outlined: 'bg-transparent border border-surface-300',
  elevated: 'bg-surface-0 shadow-md border-0',
  ghost:    'bg-surface-50 border-0',
}

const paddingClasses: Record<string, string> = {
  none: '',
  sm:   'p-3',
  md:   'p-5',
  lg:   'p-8',
}
</script>

<template>
  <div
      :class="[
      'rounded-md overflow-hidden transition-all duration-[--duration-fast]',
      variantClasses[variant as PanelVariant],
    ]"
  >
    <!-- Header slot ou header par défaut -->
    <div
        v-if="$slots.header || title || toggleable"
        :class="[
        'flex items-center justify-between gap-3',
        paddingClasses[padding as PanelPadding],
        !isCollapsed && $slots.default ? 'border-b border-surface-100' : '',
        toggleable ? 'cursor-pointer select-none' : '',
      ]"
        @click="toggleable ? toggle() : undefined"
    >
      <!-- Icône gauche -->
      <span v-if="$slots.icon" class="text-surface-500 flex items-center shrink-0">
        <slot name="icon" />
      </span>

      <!-- Titre ou slot header custom -->
      <div class="flex-1 min-w-0">
        <slot name="header">
          <span class="text-base font-semibold text-surface-800 truncate">{{ title }}</span>
        </slot>
      </div>

      <!-- Actions droite -->
      <div class="flex items-center gap-2 shrink-0" @click.stop>
        <slot name="actions" />
      </div>

      <!-- Chevron toggle -->
      <svg
          v-if="toggleable"
          class="w-4 h-4 text-surface-400 shrink-0 transition-transform duration-300"
          :class="isCollapsed ? '' : 'rotate-180'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>

    <!-- Contenu avec animation slide -->
    <Transition
        name="slide"
        @enter="(el) => { (el as HTMLElement).style.height = el.scrollHeight + 'px' }"
        @after-enter="(el) => { (el as HTMLElement).style.height = 'auto' }"
        @leave="(el) => { (el as HTMLElement).style.height = el.scrollHeight + 'px' }"
        @after-leave="(el) => { (el as HTMLElement).style.height = '0' }"
    >
      <div v-if="!toggleable || !isCollapsed">
        <div :class="paddingClasses[padding as PanelPadding]">
          <slot />
        </div>

        <!-- Footer -->
        <div
            v-if="$slots.footer"
            :class="['border-t border-surface-200', paddingClasses[padding as PanelPadding]]"
        >
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: height var(--duration-normal) var(--ease-default);
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  height: 0 !important;
}
</style>