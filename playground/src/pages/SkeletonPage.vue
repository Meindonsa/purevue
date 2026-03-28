<script setup lang="ts">
import { Skeleton } from '@purevue/core'
</script>

<template>
  <main class="p-8 bg-surface-50 min-h-screen flex flex-col gap-8">

    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold text-surface-800">Skeleton — Shapes</h2>
      <div class="flex items-center gap-4">
        <Skeleton shape="circle" width="3rem" height="3rem" />
        <Skeleton shape="pill" width="8rem" height="1.5rem" />
        <Skeleton shape="rectangle" width="10rem" height="2rem" />
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold text-surface-800">Skeleton — Lignes multiples</h2>
      <div class="max-w-sm">
        <Skeleton :lines="4" />
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold text-surface-800">Skeleton — Card simulée</h2>
      <div class="max-w-sm bg-surface-0 border border-surface-200 rounded-xl p-4 flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <Skeleton shape="circle" width="2.5rem" height="2.5rem" />
          <div class="flex flex-col gap-1.5 flex-1">
            <Skeleton width="60%" height="0.75rem" />
            <Skeleton width="40%" height="0.75rem" />
          </div>
        </div>
        <Skeleton :lines="3" />
        <Skeleton width="30%" height="2rem" shape="pill" />
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold text-surface-800">Skeleton — Animation none</h2>
      <div class="max-w-sm">
        <Skeleton :lines="2" animation="none" />
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold text-surface-800">Skeleton — Animation wave</h2>
      <div class="max-w-sm">
        <Skeleton animation="wave" :lines="3" />
        <Skeleton animation="wave" shape="circle" width="3rem" height="3rem" />
      </div>
    </section>

  </main>
</template>