<script lang="ts" setup>
import { ref } from 'vue'
import { Textarea } from '@purevue/core'
const text = ref('')
</script>

<template>
  <section class="flex flex-col gap-4 max-w-sm">
    <h2 class="text-lg font-semibold text-surface-800">Textarea</h2>

    <Textarea v-model="text" label="Par défaut" placeholder="Saisissez..." />

    <Textarea v-model="text" label="Avec compteur" placeholder="Max 200 caractères"
              :maxlength="200" show-count />

    <Textarea v-model="text" label="Auto-resize" placeholder="Grandit automatiquement..."
              resize="auto" :max-rows="6" />

    <Textarea v-model="text" label="States" state="success"
              help-text="Contenu valide." />

    <Textarea label="Erreur" error="Ce champ est requis." />

    <Textarea v-model="text" label="Désactivé" disabled placeholder="Disabled" />
  </section>
</template>

<style scoped></style>