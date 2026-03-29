<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import MenuList from './MenuList.vue'
import type { MenuItem } from './Menu.types'

defineProps<{
  items: MenuItem[]
  width?: string
}>()

const emit = defineEmits<{
  select: [item: MenuItem]
}>()

const isOpen = ref(false)
const position = ref({ x: 0, y: 0 })
const menuRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

function open(event: MouseEvent) {
  event.preventDefault()
  isOpen.value = false

  const x = event.clientX
  const y = event.clientY

  // Ajuste si le menu dépasse la fenêtre
  requestAnimationFrame(() => {
    const menuEl = menuRef.value
    if (!menuEl) return

    const menuW = menuEl.offsetWidth  || 224
    const menuH = menuEl.offsetHeight || 300

    position.value = {
      x: x + menuW > window.innerWidth  ? x - menuW : x,
      y: y + menuH > window.innerHeight ? y - menuH : y,
    }
  })

  position.value = { x, y }
  isOpen.value = true
}

function close() { isOpen.value = false }

function onClickOutside(event: MouseEvent) {
  if (!menuRef.value?.contains(event.target as Node)) close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', onClickOutside)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="containerRef" @contextmenu="open">
    <slot />

    <Teleport to="body">
      <Transition name="pv-ctx-fade">
        <div
            v-if="isOpen"
            ref="menuRef"
            class="fixed z-[9999]"
            :style="{ top: `${position.y}px`, left: `${position.x}px` }"
        >
          <MenuList
              :items="items"
              :width="width"
              @select="emit('select', $event)"
              @close="close"
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.pv-ctx-fade-enter-active,
.pv-ctx-fade-leave-active {
  transition: opacity var(--duration-fast) var(--ease-default),
  transform var(--duration-fast) var(--ease-default);
}
.pv-ctx-fade-enter-from,
.pv-ctx-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>