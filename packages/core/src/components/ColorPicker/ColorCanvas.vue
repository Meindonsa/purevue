<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  hue: number
  saturation: number
  lightness: number
}>()

const emit = defineEmits<{
  change: [s: number, l: number]
}>()

const canvasRef = ref<HTMLElement | null>(null)
const dragging  = ref(false)

// Position du curseur (s=0..100, l=0..100)
// On mappe HSL → position canvas
// x = saturation, y = inversé lightness
const cursorStyle = computed(() => ({
  left: `${props.saturation}%`,
  top:  `${100 - props.lightness}%`,
}))

const bgStyle = computed(() => ({
  background: `hsl(${props.hue}, 100%, 50%)`,
}))

function getCoords(e: MouseEvent | TouchEvent) {
  const rect = canvasRef.value!.getBoundingClientRect()
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  const y = Math.max(0, Math.min(1, (clientY - rect.top)  / rect.height))
  return { s: Math.round(x * 100), l: Math.round((1 - y) * 100) }
}

function onStart(e: MouseEvent | TouchEvent) {
  dragging.value = true
  const { s, l } = getCoords(e)
  emit('change', s, l)
}

function onMove(e: MouseEvent | TouchEvent) {
  if (!dragging.value) return
  const { s, l } = getCoords(e)
  emit('change', s, l)
}

function onEnd() { dragging.value = false }

onMounted(() => {
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup',   onEnd)
  window.addEventListener('touchmove', onMove)
  window.addEventListener('touchend',  onEnd)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup',   onEnd)
  window.removeEventListener('touchmove', onMove)
  window.removeEventListener('touchend',  onEnd)
})
</script>

<template>
  <div
      ref="canvasRef"
      class="relative w-full h-40 rounded-lg overflow-hidden cursor-crosshair select-none"
      :style="bgStyle"
      @mousedown="onStart"
      @touchstart="onStart"
  >
    <!-- Dégradé blanc → transparent (horizontal) -->
    <div class="absolute inset-0" style="background: linear-gradient(to right, #fff, transparent)" />
    <!-- Dégradé transparent → noir (vertical) -->
    <div class="absolute inset-0" style="background: linear-gradient(to bottom, transparent, #000)" />

    <!-- Curseur -->
    <div
        class="absolute w-4 h-4 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        :style="cursorStyle"
    />
  </div>
</template>