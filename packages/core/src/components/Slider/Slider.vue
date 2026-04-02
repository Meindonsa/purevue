<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {SliderProps, ResolvedSliderProps, SliderMark, SliderSize} from './Slider.types'

const props = withDefaults(defineProps<SliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
  orientation: 'horizontal',
  size: 'md',
  disabled: false,
  range: false,
  showInput: false,
}) as ResolvedSliderProps

const emit = defineEmits<{
  'update:modelValue': [value: number | [number, number]]
  change: [value: number | [number, number]]
}>()

// ----------------------------------------
// Valeurs internes
// ----------------------------------------
const valueA = ref<number>(
    Array.isArray(props.modelValue) ? props.modelValue[0] : (props.modelValue ?? props.min)
)
const valueB = ref<number>(
    Array.isArray(props.modelValue) ? props.modelValue[1] : props.max
)

const isVertical = computed(() => props.orientation === 'vertical')
const trackRef   = ref<HTMLElement | null>(null)
const dragging   = ref<'a' | 'b' | null>(null)

// ----------------------------------------
// Pourcentages
// ----------------------------------------
function toPercent(val: number) {
  return ((val - props.min) / (props.max - props.min)) * 100
}

const percentA = computed(() => toPercent(valueA.value))
const percentB = computed(() => toPercent(valueB.value))

const fillStyle = computed(() => {
  if (isVertical.value) {
    return props.range
        ? {
          bottom: `${percentA.value}%`,
          height: `${percentB.value - percentA.value}%`,
          top: 'auto',
          left: '0',
          right: '0',
          width: '100%',
        }
        : {
          bottom: '0',
          height: `${percentA.value}%`,
          top: 'auto',
          left: '0',
          right: '0',
          width: '100%',
        }
  }
  return props.range
      ? {
        left:   `${percentA.value}%`,
        width:  `${percentB.value - percentA.value}%`,
        top:    '0',
        bottom: '0',
        height: '100%',
      }
      : {
        left:   '0',
        width:  `${percentA.value}%`,
        top:    '0',
        bottom: '0',
        height: '100%',
      }
})

const thumbAStyle = computed(() =>
    isVertical.value
        ? { bottom: `${percentA.value}%`, left: '50%', top: 'auto', transform: 'translate(-50%, 50%)' }
        : { left: `${percentA.value}%`, top: '50%', transform: 'translate(-50%, -50%)' }
)

const thumbBStyle = computed(() =>
    isVertical.value
        ? { bottom: `${percentB.value}%`, left: '50%', top: 'auto', transform: 'translate(-50%, 50%)' }
        : { left: `${percentB.value}%`, top: '50%', transform: 'translate(-50%, -50%)' }
)

// ----------------------------------------
// Snap au step
// ----------------------------------------
function snap(val: number): number {
  const snapped = Math.round((val - props.min) / props.step) * props.step + props.min
  return Math.min(props.max, Math.max(props.min, snapped))
}

// ----------------------------------------
// Drag
// ----------------------------------------
function getValueFromEvent(e: MouseEvent | TouchEvent): number {
  const rect = trackRef.value!.getBoundingClientRect()
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

  if (isVertical.value) {
    const ratio = 1 - Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
    return snap(props.min + ratio * (props.max - props.min))
  }
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  return snap(props.min + ratio * (props.max - props.min))
}

function startDrag(thumb: 'a' | 'b', e: MouseEvent | TouchEvent) {
  if (props.disabled) return
  e.preventDefault()
  dragging.value = thumb
}

function onMove(e: MouseEvent | TouchEvent) {
  if (!dragging.value || !trackRef.value) return
  const val = getValueFromEvent(e)
  if (dragging.value === 'a') {
    valueA.value = props.range ? Math.min(val, valueB.value) : val
  } else {
    valueB.value = Math.max(val, valueA.value)
  }
  emitValue()
}

function onUp() { dragging.value = null }

function emitValue() {
  const val = props.range
      ? [valueA.value, valueB.value] as [number, number]
      : valueA.value
  emit('update:modelValue', val)
  emit('change', val)
}

function onTrackClick(e: MouseEvent) {
  if (props.disabled || dragging.value) return
  const val = getValueFromEvent(e)
  if (!props.range) {
    valueA.value = val
  } else {
    const distA = Math.abs(val - valueA.value)
    const distB = Math.abs(val - valueB.value)
    if (distA <= distB) valueA.value = Math.min(val, valueB.value)
    else valueB.value = Math.max(val, valueA.value)
  }
  emitValue()
}

onMounted(() => {
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup',   onUp)
  window.addEventListener('touchmove', onMove)
  window.addEventListener('touchend',  onUp)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup',   onUp)
  window.removeEventListener('touchmove', onMove)
  window.removeEventListener('touchend',  onUp)
})

// ----------------------------------------
// Marks
// ----------------------------------------
const computedMarks = computed<SliderMark[]>(() => {
  if (!props.marks) return []
  if (props.marks === true) {
    const marks: SliderMark[] = []
    for (let v = props.min; v <= props.max; v += props.step) {
      marks.push({ value: v })
    }
    return marks
  }
  return props.marks
})

function isMarkActive(mark: SliderMark) {
  if (props.range) return mark.value >= valueA.value && mark.value <= valueB.value
  return mark.value <= valueA.value
}

// ----------------------------------------
// Tailles
// ----------------------------------------
const thumbSizeClasses: Record<string, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

// ----------------------------------------
// Input sync
// ----------------------------------------
function onInputA(e: Event) {
  const val = snap(Number((e.target as HTMLInputElement).value))
  valueA.value = props.range ? Math.min(val, valueB.value) : val
  emitValue()
}

function onInputB(e: Event) {
  const val = snap(Number((e.target as HTMLInputElement).value))
  valueB.value = Math.max(val, valueA.value)
  emitValue()
}
</script>

<template>
  <div class="flex flex-col gap-2 w-full">

    <!-- Label -->
    <label v-if="label" class="text-sm font-medium text-surface-700">{{ label }}</label>

    <div :class="['flex gap-4 items-center', isVertical ? 'flex-row' : 'flex-col']">

      <!-- Track container -->
      <div
          :class="[
          'relative flex items-center justify-center',
          isVertical ? 'h-48' : 'w-full',
        ]"
      >
        <!-- Track -->
        <div
            ref="trackRef"
            :class="[
            'relative bg-surface-200 rounded-full cursor-pointer',
            isVertical ? 'w-1.5 h-full' : 'h-1.5 w-full',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
          ]"
            @click="onTrackClick"
        >
          <!-- Fill -->
          <div
              class="absolute bg-primary-500 rounded-full"
              :style="fillStyle"
          />

          <!-- Thumb A -->
          <div
              :class="[
              'absolute bg-white border-2 border-primary-500 rounded-full shadow cursor-grab active:cursor-grabbing transition-shadow duration-[--duration-fast] hover:shadow-md hover:shadow-primary-200 z-10',
              thumbSizeClasses[size as SliderSize],
              disabled ? 'cursor-not-allowed' : '',
            ]"
              :style="thumbAStyle"
              @mousedown="startDrag('a', $event)"
              @touchstart="startDrag('a', $event)"
          />

          <!-- Thumb B (range) -->
          <div
              v-if="range"
              :class="[
              'absolute bg-white border-2 border-primary-500 rounded-full shadow cursor-grab active:cursor-grabbing transition-shadow duration-[--duration-fast] hover:shadow-md hover:shadow-primary-200 z-10',
              thumbSizeClasses[size as SliderSize],
              disabled ? 'cursor-not-allowed' : '',
            ]"
              :style="thumbBStyle"
              @mousedown="startDrag('b', $event)"
              @touchstart="startDrag('b', $event)"
          />

          <!-- Marks -->
          <template v-if="computedMarks.length">
            <div
                v-for="mark in computedMarks"
                :key="mark.value"
                :class="[
                'absolute w-1.5 h-1.5 rounded-full border-2 transition-colors duration-[--duration-fast]',
                isMarkActive(mark)
                  ? 'bg-primary-500 border-primary-500'
                  : 'bg-surface-0 border-surface-300',
              ]"
                :style="isVertical
                ? { bottom: `${toPercent(mark.value)}%`, left: '50%', transform: 'translate(-50%, 50%)' }
                : { left: `${toPercent(mark.value)}%`, top: '50%', transform: 'translate(-50%, -50%)' }
              "
            />

            <!-- Mark labels -->
            <div
                v-for="mark in computedMarks.filter(m => m.label)"
                :key="`label-${mark.value}`"
                class="absolute text-xs text-surface-400 whitespace-nowrap"
                :style="isVertical
                ? { bottom: `${toPercent(mark.value)}%`, left: '1.5rem', transform: 'translateY(50%)' }
                : { left: `${toPercent(mark.value)}%`, top: '1rem', transform: 'translateX(-50%)' }
              "
            >
              {{ mark.label }}
            </div>
          </template>
        </div>
      </div>

      <!-- Inputs synchronisés -->
      <div v-if="showInput" class="flex items-center gap-2 shrink-0">
        <input
            type="number"
            :value="valueA"
            :min="min"
            :max="range ? valueB : max"
            :step="step"
            :disabled="disabled"
            class="w-16 px-2 py-1 text-sm border border-surface-200 rounded-md text-center outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
            @change="onInputA"
        />
        <template v-if="range">
          <span class="text-surface-400 text-sm">—</span>
          <input
              type="number"
              :value="valueB"
              :min="valueA"
              :max="max"
              :step="step"
              :disabled="disabled"
              class="w-16 px-2 py-1 text-sm border border-surface-200 rounded-md text-center outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
              @change="onInputB"
          />
        </template>
      </div>

    </div>
  </div>
</template>