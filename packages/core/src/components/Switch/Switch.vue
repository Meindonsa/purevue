<script setup lang="ts">
import {computed} from 'vue'
import {SwitchProps, ResolvedSwitchProps, SwitchSize} from './Switch.types'

const props = withDefaults(defineProps<SwitchProps>(), {
  size: 'md',
  labelPosition: 'right',
  disabled: false,
  showText: false,
  onText: 'ON',
  offText: 'OFF',
}) as ResolvedSwitchProps

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

const isOn = computed(() => !!props.modelValue)

function toggle() {
  if (props.disabled) return
  emit('update:modelValue', !isOn.value)
  emit('change', !isOn.value)
}

// ----------------------------------------
// Dimensions
// ----------------------------------------
const trackSizes: Record<string, {
  track: string;
  thumb: string;
  translate: string;
  text: string;
  iconSize: string
}> = {
  sm: {
    track: 'w-8 h-4',
    thumb: 'w-3 h-3',
    translate: 'translate-x-4',
    text: 'text-[8px]',
    iconSize: 'w-2 h-2',
  },
  md: {
    track: 'w-11 h-6',
    thumb: 'w-4 h-4',
    translate: 'translate-x-5',
    text: 'text-[9px]',
    iconSize: 'w-2.5 h-2.5',
  },
  lg: {
    track: 'w-14 h-7',
    thumb: 'w-5 h-5',
    translate: 'translate-x-7',
    text: 'text-[10px]',
    iconSize: 'w-3 h-3',
  },
}

const labelSizeClasses: Record<string, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

const descSizeClasses: Record<string, string> = {
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-sm',
}

const s = computed(() => trackSizes[props.size])

const trackClasses = computed(() => [
  'relative inline-flex items-center rounded-full shrink-0 transition-all duration-[--duration-normal] cursor-pointer',
  s.value.track,
  isOn.value ? 'bg-primary-500' : 'bg-surface-300',
  props.disabled ? 'opacity-50 cursor-not-allowed' : '',
])

const thumbClasses = computed(() => [
  'absolute left-0.5 bg-white rounded-full shadow-sm flex items-center justify-center',
  s.value.thumb,
])

const thumbStyle = computed(() => {
  const txMap: Record<string, string> = {
    sm: '1rem',
    md: '1.25rem',
    lg: '1.75rem',
  }
  return {
    transform: isOn.value ? `translateX(${txMap[props.size]})` : 'translateX(0)',
    transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
  }
})
</script>

<template>
  <div
      :class="[
      'inline-flex gap-2 items-center',
      labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row',
      disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    ]"
      @click="toggle"
  >
    <!-- Track -->
    <div :class="trackClasses">

      <!-- Text ON/OFF -->
      <span
          v-if="showText"
          :class="[
          'absolute font-semibold text-white transition-all duration-[--duration-normal] select-none',
          s.text,
          isOn ? 'left-1' : 'right-1',
        ]"
      >
        {{ isOn ? onText : offText }}
      </span>

      <!-- Thumb -->
      <div :class="thumbClasses" :style="thumbStyle">
        <template v-if="isOn ? onIcon : offIcon">
          <span
              v-if="(isOn ? onIcon : offIcon)?.startsWith('<')"
              :class="s.iconSize"
              v-html="isOn ? onIcon : offIcon"
          />
          <i v-else :class="[isOn ? onIcon : offIcon, s.iconSize]"/>
        </template>

        <!-- Slot icon fallback -->
        <slot v-else name="icon" :on="isOn"/>
      </div>
    </div>

    <!-- Label + description -->
    <div
        v-if="label || description || $slots.default"
        class="flex flex-col gap-0.5"
    >
      <span :class="['font-medium text-surface-700 select-none', labelSizeClasses[size as SwitchSize]]">
        <slot>{{ label }}</slot>
      </span>
      <span v-if="description" :class="['text-surface-400 select-none', descSizeClasses[size as SwitchSize]]">
        {{ description }}
      </span>
      <span v-if="error" :class="['text-danger-500', descSizeClasses[size as SwitchSize]]">
        {{ error }}
      </span>
    </div>

  </div>
</template>