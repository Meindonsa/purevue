<script setup lang="ts">
import { Divider, Badge } from '@purevue/core'
</script>

<template>
  <main class="p-8 flex flex-col gap-8 max-w-lg">

    <section class="flex flex-col gap-4">
      <h2 class="text-lg font-semibold text-surface-800">Divider — Horizontal</h2>
      <Divider />
      <Divider variant="dashed" />
      <Divider variant="dotted" />
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-lg font-semibold text-surface-800">Divider — Avec label</h2>
      <Divider label="ou" />
      <Divider label="Section A" align="start" />
      <Divider label="Fin" align="end" />
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-lg font-semibold text-surface-800">Divider — Slot custom</h2>
      <Divider>
        <Badge variant="secondary" size="sm">Aujourd'hui</Badge>
      </Divider>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold text-surface-800">Divider — Vertical</h2>
      <div class="flex items-center gap-4 h-8">
        <span class="text-surface-600 text-sm">Accueil</span>
        <Divider orientation="vertical" />
        <span class="text-surface-600 text-sm">Projets</span>
        <Divider orientation="vertical" />
        <span class="text-surface-600 text-sm">Contact</span>
      </div>
    </section>

  </main>
</template>