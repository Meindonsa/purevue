<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Spinner } from '../Spinner'
import {ScrollableProps, ResolvedScrollableProps, ScrollableDirection} from './Scrollable.types'

const props = withDefaults(defineProps<ScrollableProps>(), {
  direction: 'vertical',
  thin: false,
  hidden: false,
  infinite: false,
  loading: false,
  threshold: 80,
}) as ResolvedScrollableProps

const emit = defineEmits<{
  loadMore: []
}>()

const scrollRef = ref<HTMLElement | null>(null)
const sentinelRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

function setupObserver() {
  if (!props.infinite || !sentinelRef.value || !scrollRef.value) return

  observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && !props.loading) {
          emit('loadMore')
        }
      },
      {
        root: scrollRef.value,
        threshold: props.threshold / 100,
      }
  )

  observer.observe(sentinelRef.value)
}

onMounted(() => {
  setupObserver()
})

onUnmounted(() => {
  observer?.disconnect()
})

const overflowClasses: Record<string, string> = {
  vertical:   'overflow-x-hidden overflow-y-auto',
  horizontal: 'overflow-y-hidden overflow-x-auto',
  both:       'overflow-auto',
}

const sizeClasses: Record<string, string> = {
  sm:   'max-h-32',
  md:   'max-h-64',
  lg:   'max-h-96',
  xl:   'max-h-[32rem]',
  full: 'max-h-full',
}

const scrollbarClasses = computed(() => {
  if (props.hidden) return 'scrollbar-hidden'
  if (props.thin)   return 'scrollbar-thin'
  return 'scrollbar-default'
})

const style = computed(() => ({
  ...(props.height ? { maxHeight: props.height } : {}),
  ...(props.width  ? { maxWidth:  props.width  } : {}),
}))
</script>

<template>
  <div
      ref="scrollRef"
      :class="[
      'relative',
      overflowClasses[direction as ScrollableDirection],
      !height && size ? sizeClasses[size] : '',
      scrollbarClasses,
    ]"
      :style="style"
  >
    <!-- Contenu principal -->
    <slot />

    <!-- Sentinel + loader pour infinite scroll -->
    <template v-if="infinite">
      <div ref="sentinelRef" class="h-px w-full" />

      <div v-if="loading" class="flex items-center justify-center py-4">
        <slot name="loader">
          <Spinner size="sm" variant="primary" />
        </slot>
      </div>
    </template>
  </div>
</template>