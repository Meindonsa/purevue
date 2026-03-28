<script setup lang="ts">

</script>

<template>
  <div class="flex items-start justify-between gap-4 mb-4">
    <div class="flex flex-col gap-1 flex-1">
      <slot />
    </div>
    <slot name="actions" />
  </div>
</template>

<style scoped>

</style>