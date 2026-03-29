<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import MenuList from './MenuList.vue'
import type { MenuProps, ResolvedMenuProps, MenuItem } from './Menu.types'

const props = withDefaults(defineProps<MenuProps>(), {
  position: 'bottom',
  align: 'start',
}) as ResolvedMenuProps

const emit = defineEmits<{
  select: [item: MenuItem]
}>()

const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)

function toggle() { isOpen.value = !isOpen.value }
function close()  { isOpen.value = false }

function onClickOutside(event: MouseEvent) {
  if (
      !triggerRef.value?.contains(event.target as Node) &&
      !menuRef.value?.contains(event.target as Node)
  ) {
    close()
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))

const positionClasses = computed(() => {
  const alignMap: Record<string, string> = {
    start:  'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end:    'right-0',
  }
  const align = alignMap[props.align]

  const pos: Record<string, string> = {
    bottom: `top-full mt-1 ${align}`,
    top:    `bottom-full mb-1 ${align}`,
    left:   'right-full mr-1 top-0',
    right:  'left-full ml-1 top-0',
  }
  return pos[props.position]
})
</script>

<template>
  <div class="relative inline-flex">

    <!-- Trigger -->
    <div ref="triggerRef" @click="toggle">
      <slot :open="isOpen" :toggle="toggle" />
    </div>

    <!-- Dropdown -->
    <Transition name="pv-menu-fade">
      <div
          v-if="isOpen"
          ref="menuRef"
          :class="['absolute z-50', positionClasses]"
      >
        <MenuList
            :items="items"
            :width="width"
            @select="emit('select', $event)"
            @close="close"
        />
      </div>
    </Transition>
  </div>
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