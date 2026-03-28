<script lang="ts" setup>
import { ref } from 'vue'
import { Input } from '@purevue/core'

const email = ref('')
const text = ref('')
</script>

<template>
  <section class="flex flex-col gap-4 max-w-sm">
    <h2 class="text-lg font-semibold text-surface-800">Input — type & validation</h2>
    <Input v-model="email" type="email" label="Email" placeholder="vous@exemple.com"
           help-text="Nous ne partagerons jamais votre email." />
    <Input v-model="text" type="text" label="Nom" placeholder="Votre nom"
           help-text="Aide en haut" help-text-position="top" />
  </section>

  <section class="flex flex-col gap-4 max-w-sm">
    <h2 class="text-lg font-semibold text-surface-800">Input — States</h2>
    <Input label="Success" state="success" model-value="Valide" />
    <Input label="Warning" state="warning" model-value="Attention" />
    <Input label="Erreur" error="Ce champ est requis." />
  </section>
</template>

<style scoped></style>