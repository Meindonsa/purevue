<script setup lang="ts">
import { ref } from 'vue'
import MenuList from './MenuList.vue'
import type { MenuItem } from './Menu.types'

defineProps<{
  items: MenuItem[]
  width?: string
}>()

const emit = defineEmits<{
  select: [item: MenuItem]
  close: []
}>()

const openSubmenu = ref<string | null>(null)

function handleClick(item: MenuItem) {
  if (item.disabled || item.separator || item.children?.length) return
  item.action?.()
  emit('select', item)
  emit('close')
}

function toggleSubmenu(key: string) {
  openSubmenu.value = openSubmenu.value === key ? null : key
}
</script>

<template>
  <ul
      :style="{ width: width ?? '14rem' }"
      class="py-1 bg-surface-0 border border-surface-200 rounded-lg shadow-lg"
      role="menu"
  >
    <template v-for="item in items" :key="item.key">

      <!-- Séparateur -->
      <li v-if="item.separator" class="my-1 border-t border-surface-100" role="separator" />

      <!-- Item avec sous-menu -->
      <li v-else-if="item.children?.length" class="relative" role="none">
        <button
            :disabled="item.disabled"
            :class="[
            'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors duration-[--duration-fast] outline-none',
            item.disabled
              ? 'text-surface-300 cursor-not-allowed'
              : 'text-surface-700 hover:bg-surface-50 cursor-pointer',
          ]"
            @click="toggleSubmenu(item.key)"
        >
          <!-- Icône -->
          <span v-if="item.icon" class="w-4 h-4 flex items-center justify-center text-surface-400 shrink-0" v-html="item.icon" />
          <span v-else class="w-4 shrink-0" />

          <!-- Label -->
          <span class="flex-1 text-left">{{ item.label }}</span>

          <!-- Badge -->
          <span
              v-if="item.badge !== undefined"
              class="px-1.5 py-0.5 text-xs font-semibold rounded-full bg-primary-100 text-primary-700"
          >
            {{ item.badge }}
          </span>

          <!-- Chevron -->
          <svg class="w-3.5 h-3.5 text-surface-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <!-- Sous-menu -->
        <Transition name="pv-menu-fade">
          <div
              v-if="openSubmenu === item.key"
              class="absolute left-full top-0 ml-1 z-[9999]"
              style="min-width: 14rem"
          >
            <MenuList
                :items="item.children"
                :width="width"
                @select="emit('select', $event)"
                @close="emit('close')"
            />
          </div>
        </Transition>
      </li>

      <!-- Item normal -->
      <li v-else role="none">
        <button
            :disabled="item.disabled"
            :class="[
            'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors duration-[--duration-fast] outline-none',
            item.disabled
              ? 'text-surface-300 cursor-not-allowed'
              : 'text-surface-700 hover:bg-surface-50 cursor-pointer',
          ]"
            role="menuitem"
            @click="handleClick(item)"
        >
          <!-- Icône -->
          <span v-if="item.icon" class="w-4 h-4 flex items-center justify-center text-surface-400 shrink-0" v-html="item.icon" />
          <span v-else class="w-4 shrink-0" />

          <!-- Label -->
          <span class="flex-1 text-left">{{ item.label }}</span>

          <!-- Badge -->
          <span
              v-if="item.badge !== undefined"
              class="px-1.5 py-0.5 text-xs font-semibold rounded-full bg-primary-100 text-primary-700"
          >
            {{ item.badge }}
          </span>

          <!-- Shortcut -->
          <span v-if="item.shortcut" class="text-xs text-surface-400 shrink-0 font-mono">
            {{ item.shortcut }}
          </span>
        </button>
      </li>

    </template>
  </ul>
</template>

<style scoped>
.pv-menu-fade-enter-active,
.pv-menu-fade-leave-active {
  transition: opacity var(--duration-fast) var(--ease-default),
  transform var(--duration-fast) var(--ease-default);
}
.pv-menu-fade-enter-from,
.pv-menu-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>