<script setup lang="ts">
import {ref, computed, watch, onMounted, onUnmounted} from 'vue'
import ColorCanvas from './ColorCanvas.vue'
import type {ColorPickerProps, ResolvedColorPickerProps, ColorFormat, RGBColor} from './ColorPicker.types'
import {parseColor, formatColor, rgbToHsl, hslToRgb, rgbToHex} from './color.utils'

const props = withDefaults(defineProps<ColorPickerProps>(), {
  format: 'hex',
  display: 'dropdown',
  disabled: false,
  clearable: false,
  showAlpha: true,
  showEyeDropper: true,
}) as ResolvedColorPickerProps

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

// ----------------------------------------
// État interne
// ----------------------------------------
const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const activeFormat = ref<ColorFormat>(props.format)

const rgb = ref<RGBColor>(parseColor(props.modelValue ?? '#3b82f6'))
const hsl = computed(() => rgbToHsl(rgb.value))

// Sync depuis prop externe
watch(() => props.modelValue, (val) => {
  if (val) rgb.value = parseColor(val)
})

function emitColor() {
  const color = formatColor(rgb.value, activeFormat.value)
  emit('update:modelValue', color)
  emit('change', color)
}

// ----------------------------------------
// Canvas SL
// ----------------------------------------
function onCanvasChange(s: number, l: number) {
  const newHsl = {...hsl.value, s, l}
  rgb.value = {...hslToRgb(newHsl), a: rgb.value.a}
  emitColor()
}

// ----------------------------------------
// Hue slider
// ----------------------------------------
const hueTrackRef = ref<HTMLElement | null>(null)
const hueDragging = ref(false)

function getHueFromEvent(e: MouseEvent | TouchEvent): number {
  const rect = hueTrackRef.value!.getBoundingClientRect()
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  return Math.round(ratio * 360)
}

function onHueStart(e: MouseEvent | TouchEvent) {
  hueDragging.value = true
  onHueMove(e)
}

function onHueMove(e: MouseEvent | TouchEvent) {
  if (!hueDragging.value) return
  const h = getHueFromEvent(e)
  rgb.value = {...hslToRgb({...hsl.value, h}), a: rgb.value.a}
  emitColor()
}

function onHueEnd() {
  hueDragging.value = false
}

// ----------------------------------------
// Alpha slider
// ----------------------------------------
const alphaTrackRef = ref<HTMLElement | null>(null)
const alphaDragging = ref(false)

function getAlphaFromEvent(e: MouseEvent | TouchEvent): number {
  const rect = alphaTrackRef.value!.getBoundingClientRect()
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  return parseFloat(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)).toFixed(2))
}

function onAlphaStart(e: MouseEvent | TouchEvent) {
  alphaDragging.value = true
  onAlphaMove(e)
}

function onAlphaMove(e: MouseEvent | TouchEvent) {
  if (!alphaDragging.value) return
  rgb.value = {...rgb.value, a: getAlphaFromEvent(e)}
  emitColor()
}

function onAlphaEnd() {
  alphaDragging.value = false
}

// ----------------------------------------
// Global drag listeners
// ----------------------------------------
onMounted(() => {
  window.addEventListener('mousemove', onHueMove)
  window.addEventListener('mouseup', onHueEnd)
  window.addEventListener('mousemove', onAlphaMove)
  window.addEventListener('mouseup', onAlphaEnd)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onHueMove)
  window.removeEventListener('mouseup', onHueEnd)
  window.removeEventListener('mousemove', onAlphaMove)
  window.removeEventListener('mouseup', onAlphaEnd)
})

// ----------------------------------------
// Styles
// ----------------------------------------
const hueThumbStyle = computed(() => ({
  left: `${(hsl.value.h / 360) * 100}%`,
}))

const alphaThumbStyle = computed(() => ({
  left: `${rgb.value.a * 100}%`,
}))

const alphaGradient = computed(() => {
  const {r, g, b} = rgb.value
  return `linear-gradient(to right, rgba(${r},${g},${b},0), rgb(${r},${g},${b}))`
})

const previewStyle = computed(() => ({
  background: formatColor(rgb.value, 'hex'),
  opacity: rgb.value.a,
}))

// ----------------------------------------
// Inputs texte
// ----------------------------------------
const hexInput = computed(() => rgbToHex({...rgb.value, a: 1}))
const alphaInput = computed(() => Math.round(rgb.value.a * 100))

function onHexInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  if (/^#[0-9a-fA-F]{6}$/.test(val)) {
    const parsed = parseColor(val)
    rgb.value = {...parsed, a: rgb.value.a}
    emitColor()
  }
}

function onRgbInput(channel: 'r' | 'g' | 'b', e: Event) {
  const val = Math.min(255, Math.max(0, parseInt((e.target as HTMLInputElement).value) || 0))
  rgb.value = {...rgb.value, [channel]: val}
  emitColor()
}

function onHslInput(channel: 'h' | 's' | 'l', e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value) || 0
  const current = hsl.value
  const newHsl = {...current, [channel]: val}
  rgb.value = {...hslToRgb(newHsl), a: rgb.value.a}
  emitColor()
}

function onAlphaInput(e: Event) {
  const val = Math.min(100, Math.max(0, parseInt((e.target as HTMLInputElement).value) || 0))
  rgb.value = {...rgb.value, a: val / 100}
  emitColor()
}

// ----------------------------------------
// Eye dropper
// ----------------------------------------
const hasEyeDropper = typeof window !== 'undefined' && 'EyeDropper' in window

async function pickColor() {
  if (!hasEyeDropper) return
  try {
    const eyeDropper = new (window as any).EyeDropper()
    const result = await eyeDropper.open()
    rgb.value = {...parseColor(result.sRGBHex), a: rgb.value.a}
    emitColor()
  } catch {
  }
}

// ----------------------------------------
// Presets
// ----------------------------------------
const DEFAULT_PRESETS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6',
  '#000000', '#ffffff', '#6b7280', '#1e293b',
]

const displayPresets = computed(() => props.presets ?? DEFAULT_PRESETS)

function applyPreset(color: string) {
  rgb.value = {...parseColor(color), a: rgb.value.a}
  emitColor()
}

// ----------------------------------------
// Dropdown
// ----------------------------------------
function toggle() {
  if (!props.disabled) isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

function onClickOutside(e: MouseEvent) {
  if (
      !triggerRef.value?.contains(e.target as Node) &&
      !dropdownRef.value?.contains(e.target as Node)
  ) close()
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))

const currentColor = computed(() => formatColor(rgb.value, activeFormat.value))
</script>

<template>
  <div class="flex flex-col gap-1">

    <label v-if="label" class="text-sm font-medium text-surface-700">{{ label }}</label>

    <!-- Inline -->
    <div v-if="display === 'inline'">
      <div class="w-64 border border-surface-200 rounded-xl bg-surface-0 shadow-sm p-3 flex flex-col gap-3">
        <slot name="picker-content"/>
      </div>
    </div>

    <!-- Trigger dropdown -->
    <template v-else>
      <div ref="triggerRef" class="relative inline-flex">
        <button
            :disabled="disabled"
            :class="[
            'flex items-center gap-2 px-3 py-2 rounded-md border transition-all duration-[--duration-fast]',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-surface-400',
            isOpen ? 'border-primary-500 ring-1 ring-primary-500' : 'border-surface-300',
          ]"
            @click="toggle"
        >
          <!-- Preview swatch -->
          <span class="w-5 h-5 rounded-md border border-surface-200 shrink-0 relative overflow-hidden">
            <!-- Damier pour transparence -->
            <span class="absolute inset-0"
                  style="background: repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 8px 8px"/>
            <span class="absolute inset-0 rounded-md" :style="{ background: currentColor }"/>
          </span>
          <span class="text-sm text-surface-700 font-mono">{{ currentColor }}</span>
          <svg class="w-3.5 h-3.5 text-surface-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        <!-- Dropdown panel -->
        <Transition name="pv-cp-fade">
          <div
              v-if="isOpen"
              ref="dropdownRef"
              class="absolute z-50 top-full mt-1 left-0"
          >
            <div class="w-64 border border-surface-200 rounded-xl bg-surface-0 shadow-lg p-3 flex flex-col gap-3">

              <!-- Canvas SL -->
              <ColorCanvas
                  :hue="hsl.h"
                  :saturation="hsl.s"
                  :lightness="hsl.l"
                  @change="onCanvasChange"
              />

              <!-- Sliders + preview -->
              <div class="flex items-center gap-2">
                <!-- Preview -->
                <div class="w-8 h-8 rounded-lg border border-surface-200 shrink-0 relative overflow-hidden">
                  <div class="absolute inset-0"
                       style="background: repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 8px 8px"/>
                  <div class="absolute inset-0 rounded-lg" :style="previewStyle"/>
                </div>

                <div class="flex flex-col gap-1.5 flex-1">
                  <!-- Hue slider -->
                  <div
                      ref="hueTrackRef"
                      class="relative h-3 rounded-full cursor-pointer"
                      style="background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)"
                      @mousedown="onHueStart"
                      @touchstart="onHueStart"
                  >
                    <div
                        class="absolute top-1/2 w-3 h-3 rounded-full border-2 border-white shadow -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        :style="[hueThumbStyle, { background: `hsl(${hsl.h}, 100%, 50%)` }]"
                    />
                  </div>

                  <!-- Alpha slider -->
                  <div
                      v-if="showAlpha"
                      ref="alphaTrackRef"
                      class="relative h-3 rounded-full cursor-pointer overflow-hidden"
                      @mousedown="onAlphaStart"
                      @touchstart="onAlphaStart"
                  >
                    <div class="absolute inset-0 rounded-full"
                         style="background: repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 8px 8px"/>
                    <div class="absolute inset-0 rounded-full" :style="{ background: alphaGradient }"/>
                    <div
                        class="absolute top-1/2 w-3 h-3 rounded-full border-2 border-white shadow -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        :style="[alphaThumbStyle, { background: formatColor(rgb, 'hex') }]"
                    />
                  </div>
                </div>
              </div>

              <!-- Format switch + inputs -->
              <div class="flex flex-col gap-2">
                <!-- Tabs format -->
                <div class="flex border border-surface-200 rounded-lg overflow-hidden text-xs">
                  <button
                      v-for="fmt in (['hex', 'rgb', 'hsl'] as ColorFormat[])"
                      :key="fmt"
                      :class="[
                      'flex-1 py-1 font-medium transition-colors uppercase',
                      activeFormat === fmt
                        ? 'bg-primary-500 text-white'
                        : 'text-surface-500 hover:bg-surface-50',
                    ]"
                      @click="activeFormat = fmt"
                  >
                    {{ fmt }}
                  </button>
                </div>

                <!-- Inputs HEX -->
                <div v-if="activeFormat === 'hex'" class="flex gap-1.5">
                  <div class="flex flex-col gap-0.5 flex-1">
                    <input
                        :value="hexInput"
                        type="text"
                        class="w-full px-2 py-1 text-xs border border-surface-200 rounded-md text-center outline-none focus:border-primary-500 font-mono"
                        @change="onHexInput"
                    />
                    <span class="text-[10px] text-surface-400 text-center">HEX</span>
                  </div>
                  <div v-if="showAlpha" class="flex flex-col gap-0.5 w-12">
                    <input
                        :value="alphaInput"
                        type="number"
                        min="0" max="100"
                        class="w-full px-1 py-1 text-xs border border-surface-200 rounded-md text-center outline-none focus:border-primary-500"
                        @change="onAlphaInput"
                    />
                    <span class="text-[10px] text-surface-400 text-center">A%</span>
                  </div>
                </div>

                <!-- Inputs RGB -->
                <div v-else-if="activeFormat === 'rgb'" class="flex gap-1.5">
                  <div v-for="ch in ['r', 'g', 'b'] as const" :key="ch" class="flex flex-col gap-0.5 flex-1">
                    <input
                        :value="rgb[ch]"
                        type="number" min="0" max="255"
                        class="w-full px-1 py-1 text-xs border border-surface-200 rounded-md text-center outline-none focus:border-primary-500"
                        @change="onRgbInput(ch, $event)"
                    />
                    <span class="text-[10px] text-surface-400 text-center uppercase">{{ ch }}</span>
                  </div>
                  <div v-if="showAlpha" class="flex flex-col gap-0.5 w-12">
                    <input
                        :value="alphaInput"
                        type="number" min="0" max="100"
                        class="w-full px-1 py-1 text-xs border border-surface-200 rounded-md text-center outline-none focus:border-primary-500"
                        @change="onAlphaInput"
                    />
                    <span class="text-[10px] text-surface-400 text-center">A%</span>
                  </div>
                </div>

                <!-- Inputs HSL -->
                <div v-else-if="activeFormat === 'hsl'" class="flex gap-1.5">
                  <div
                      v-for="item in [
                          { ch: 'h', label: 'H°', max: 360 },
                          { ch: 's', label: 'S%', max: 100 },
                          { ch: 'l', label: 'L%', max: 100 },
                      ]"
                      :key="item.ch"
                      class="flex flex-col gap-0.5 flex-1"
                  >
                    <input
                        :value="hsl[item.ch as 'h' | 's' | 'l']"
                        type="number"
                        :max="item.max"
                        min="0"
                        class="w-full px-1 py-1 text-xs border border-surface-200 rounded-md text-center outline-none focus:border-primary-500"
                        @change="onHslInput(item.ch as 'h' | 's' | 'l', $event)"
                    />
                    <span class="text-[10px] text-surface-400 text-center">{{ item.label }}</span>
                  </div>
                  <div v-if="showAlpha" class="flex flex-col gap-0.5 w-12">
                    <input
                        :value="alphaInput"
                        type="number" min="0" max="100"
                        class="w-full px-1 py-1 text-xs border border-surface-200 rounded-md text-center outline-none focus:border-primary-500"
                        @change="onAlphaInput"
                    />
                    <span class="text-[10px] text-surface-400 text-center">A%</span>
                  </div>
                </div>
              </div>

              <!-- Presets -->
              <div class="grid grid-cols-6 gap-1.5">
                <button
                    v-for="preset in displayPresets"
                    :key="preset"
                    class="w-8 h-8 rounded-lg border-2 transition-all duration-[--duration-fast] hover:scale-110"
                    :class="currentColor === preset ? 'border-primary-500' : 'border-transparent'"
                    :style="{ background: preset }"
                    @click="applyPreset(preset)"
                />
              </div>

              <!-- Actions bas -->
              <div class="flex items-center justify-between pt-1 border-t border-surface-100">
                <!-- Eye dropper -->
                <button
                    v-if="showEyeDropper && hasEyeDropper"
                    class="flex items-center gap-1.5 text-xs text-surface-500 hover:text-surface-800 transition-colors"
                    @click="pickColor"
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 13.5V20a2 2 0 0 0 2 2h.5"/>
                    <path d="M22 6 11.5 16.5l-5-5L17 1l5 5z"/>
                    <path d="m16.5 11.5 5 5"/>
                    <path d="M4 20v.5a2 2 0 0 0 2 2H7"/>
                  </svg>
                  Pipette
                </button>
                <div v-else/>

                <!-- Clear -->
                <button
                    v-if="clearable"
                    class="text-xs text-surface-400 hover:text-danger-500 transition-colors"
                    @click="emit('update:modelValue', ''); emit('change', '')"
                >
                  Effacer
                </button>
              </div>

            </div>
          </div>
        </Transition>
      </div>
    </template>
  </div>
</template>

<style scoped>
.pv-cp-fade-enter-active,
.pv-cp-fade-leave-active {
  transition: opacity var(--duration-fast) var(--ease-default),
  transform var(--duration-fast) var(--ease-default);
}

.pv-cp-fade-enter-from,
.pv-cp-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>