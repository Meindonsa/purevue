<script lang="ts" setup>
import { ref } from 'vue'
import { Badge } from '@purevue/core'

const tags = ref(['Vue 3', 'TypeScript', 'Tailwind']);

function removeTag(index: number) {
  tags.value.splice(index, 1)
}

</script>

<template>
  <section class="flex flex-col gap-3">
    <h2 class="text-lg font-semibold text-surface-800">Badge — Variants</h2>
    <div class="flex flex-wrap gap-2">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  </section>

  <section class="flex flex-col gap-3">
    <h2 class="text-lg font-semibold text-surface-800">Badge — Shapes & Sizes</h2>
    <div class="flex flex-wrap items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
      <Badge shape="pill" variant="success">Pill</Badge>
      <Badge shape="pill" variant="danger" size="sm">Pill sm</Badge>
    </div>
  </section>

  <section class="flex flex-col gap-3">
    <h2 class="text-lg font-semibold text-surface-800">Badge — Dot</h2>
    <div class="flex flex-wrap gap-2">
      <Badge dot variant="success">Actif</Badge>
      <Badge dot variant="danger">Erreur</Badge>
      <Badge dot variant="warning">En attente</Badge>
    </div>
  </section>

  <section class="flex flex-col gap-3">
    <h2 class="text-lg font-semibold text-surface-800">Badge — Closable</h2>
    <div class="flex flex-wrap gap-2">
      <Badge
          v-for="(tag, i) in tags"
          :key="tag"
          variant="primary"
          shape="pill"
          closable
          @close="removeTag(i)"
      >
        {{ tag }}
      </Badge>
    </div>
  </section>
</template>

<style scoped></style>