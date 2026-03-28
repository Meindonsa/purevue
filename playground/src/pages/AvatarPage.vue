<script setup lang="ts">
import { Avatar, AvatarGroup } from '@purevue/core'
</script>

<template>
  <main class="p-8 bg-surface-50 min-h-screen flex flex-col gap-8">

    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold text-surface-800">Avatar — Sizes</h2>
      <div class="flex items-end gap-3">
        <Avatar size="xs" fallback="Boris Mendossa" />
        <Avatar size="sm" fallback="Boris Mendossa" />
        <Avatar size="md" fallback="Boris Mendossa" />
        <Avatar size="lg" fallback="Boris Mendossa" />
        <Avatar size="xl" fallback="Boris Mendossa" />
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold text-surface-800">Avatar — Image & Fallback</h2>
      <div class="flex items-center gap-3">
        <Avatar src="https://i.pravatar.cc/150?img=1" alt="User" />
        <Avatar src="https://broken.url" fallback="John Doe" />
        <Avatar fallback="Marie Curie" />
        <Avatar shape="square" fallback="Alice Martin" />
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold text-surface-800">Avatar — Status</h2>
      <div class="flex items-center gap-3">
        <Avatar fallback="Online" status="online" />
        <Avatar fallback="Away" status="away" />
        <Avatar fallback="Busy" status="busy" />
        <Avatar fallback="Offline" status="offline" />
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold text-surface-800">AvatarGroup</h2>
      <AvatarGroup>
        <Avatar src="https://i.pravatar.cc/150?img=1" stacked />
        <Avatar src="https://i.pravatar.cc/150?img=2" stacked />
        <Avatar src="https://i.pravatar.cc/150?img=3" stacked />
        <Avatar fallback="Boris Mendossa" stacked />
        <template #overflow>
          <span class="ml-1 text-sm text-surface-500">+3</span>
        </template>
      </AvatarGroup>
    </section>

  </main>
</template>