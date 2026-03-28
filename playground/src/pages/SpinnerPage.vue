<script setup lang="ts">
import { Spinner } from '@purevue/core'
</script>

<template>
  <main class="p-8 bg-surface-50 min-h-screen flex flex-col gap-8">

    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold text-surface-800">Spinner — Variants</h2>
      <div class="flex flex-wrap items-center gap-4">
        <Spinner variant="primary" />
        <Spinner variant="secondary" />
        <Spinner variant="success" />
        <Spinner variant="warning" />
        <Spinner variant="danger" />
        <Spinner variant="info" />
        <span class="bg-surface-800 p-2 rounded-md">
          <Spinner variant="white" />
        </span>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold text-surface-800">Spinner — Sizes</h2>
      <div class="flex flex-wrap items-center gap-4">
        <Spinner size="xs" />
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
        <Spinner size="xl" />
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold text-surface-800">Spinner — Label positions</h2>
      <div class="flex flex-wrap items-center gap-6">
        <Spinner label="Chargement" label-position="right" />
        <Spinner label="Chargement" label-position="left" />
        <Spinner label="Chargement" label-position="bottom" />
        <Spinner label="Chargement" label-position="top" />
      </div>
    </section>

  </main>
</template>