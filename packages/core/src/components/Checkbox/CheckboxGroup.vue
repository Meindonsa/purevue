<script setup lang="ts">
import { computed } from 'vue'
import Checkbox from './Checkbox.vue'
import type { CheckboxGroupProps, ResolvedCheckboxGroupProps } from './Checkbox.types'

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  modelValue: () => [],
  size: 'md',
  shape: 'square',
  labelPosition: 'right',
  disabled: false,
  columns: 1,
}) as ResolvedCheckboxGroupProps

const emit = defineEmits<{
  'update:modelValue': [value: (string | number)[]]
  change: [value: (string | number)[]]
}>()

const allSelected = computed(() =>
    props.options.every((o) => props.modelValue?.includes(o.value))
)

const someSelected = computed(() =>
    props.options.some((o) => props.modelValue?.includes(o.value)) && !allSelected.value
)

function toggle(value: string | number) {
  const current = [...(props.modelValue ?? [])]
  const idx = current.indexOf(value)
  if (idx === -1) current.push(value)
  else current.splice(idx, 1)
  emit('update:modelValue', current)
  emit('change', current)
}

function toggleAll(val: boolean) {
  const next = val
      ? props.options.filter((o) => !o.disabled).map((o) => o.value)
      : []
  emit('update:modelValue', next)
  emit('change', next)
}

const gridClass = computed(() =>
    props.columns > 1
        ? `grid grid-cols-${props.columns} gap-3`
        : 'flex flex-col gap-3'
)
</script>

<template>
  <div class="flex flex-col gap-3">

    <!-- Label groupe + select all -->
    <div v-if="label" class="flex items-center justify-between">
      <span class="text-sm font-semibold text-surface-700">{{ label }}</span>
      <Checkbox
          :model-value="allSelected ? true : someSelected ? null : false"
          :indeterminate="someSelected"
          :size="size"
          :shape="shape"
          label="Tout sélectionner"
          label-position="left"
          :disabled="disabled"
          @update:model-value="toggleAll"
      />
    </div>

    <!-- Options -->
    <div :class="gridClass">
      <Checkbox
          v-for="opt in options"
          :key="opt.value"
          :model-value="modelValue?.includes(opt.value) ?? false"
          :label="opt.label"
          :description="opt.description"
          :size="size"
          :shape="shape"
          :label-position="labelPosition"
          :disabled="disabled || opt.disabled"
          @update:model-value="toggle(opt.value)"
      />
    </div>

    <!-- Error -->
    <p v-if="error" class="text-sm text-danger-500">{{ error }}</p>
  </div>
</template>