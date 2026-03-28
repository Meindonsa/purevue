<script lang="ts" setup>
import { Button } from '@purevue/core'
</script>

<template>
  <section>
    <h2 class="text-lg font-semibold text-surface-800 mb-4">Button</h2>
    <div class="flex flex-wrap gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button loading>Loading</Button>
      <Button disabled>Disabled</Button>
    </div>
  </section>
</template>

<style scoped></style>