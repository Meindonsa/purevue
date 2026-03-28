<script setup lang="ts">
import { ref } from 'vue'
import { Button, Input } from '@purevue/core'

const email = ref('')
const text = ref('')
</script>

<template>
  <main class="p-8 bg-surface-50 min-h-screen flex flex-col gap-8">

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

  </main>
</template>