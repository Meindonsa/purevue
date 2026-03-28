<script setup lang="ts">
import { ref } from 'vue'
import { ProgressBar } from '@purevue/core'

const value = ref(65)
</script>

<template>
  <main class="p-8 bg-surface-50 min-h-screen flex flex-col gap-8 max-w-lg">

    <section class="flex flex-col gap-4">
      <h2 class="text-lg font-semibold text-surface-800">ProgressBar — Variants</h2>
      <ProgressBar :value="80" variant="primary" label />
      <ProgressBar :value="60" variant="success" label />
      <ProgressBar :value="45" variant="warning" label />
      <ProgressBar :value="30" variant="danger" label />
      <ProgressBar :value="70" variant="info" label />
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-lg font-semibold text-surface-800">ProgressBar — Sizes</h2>
      <ProgressBar :value="60" size="xs" />
      <ProgressBar :value="60" size="sm" />
      <ProgressBar :value="60" size="md" />
      <ProgressBar :value="60" size="lg" />
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-lg font-semibold text-surface-800">ProgressBar — Animations</h2>
      <ProgressBar :value="60" animation="pulse" label />
      <ProgressBar :value="60" animation="stripe" size="lg" label />
      <ProgressBar indeterminate size="md" />
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-lg font-semibold text-surface-800">ProgressBar — Dynamique</h2>
      <ProgressBar :value="value" label />
      <input type="range" v-model.number="value" min="0" max="100" class="w-full" />
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-lg font-semibold text-surface-800">ProgressBar — Label intérieur</h2>
      <ProgressBar :value="value" size="sm" label label-position="inside-left" />
      <ProgressBar :value="value" size="md" label label-position="inside-center" />
      <ProgressBar :value="value" size="md" label label-position="inside-right" />
      <ProgressBar :value="value" size="md" label label-position="inside-center" label-text="En cours..." variant="success" />
      <ProgressBar :value="value" size="lg" label label-position="inside-right" variant="danger" />
    </section>

  </main>
</template>