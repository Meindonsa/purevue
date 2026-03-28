<script setup lang="ts">
import { ref } from 'vue'
import { Button, Input, Password, Textarea } from '@purevue/core'

const email = ref('')
const text = ref('')

const p1 = ref('')
const p2 = ref('')
const p3 = ref('')

function onRules(results: { key: string; label: string; passed: boolean }[]) {
  console.log(results)
}
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

    <section class="flex flex-col gap-4 max-w-sm">
      <h2 class="text-lg font-semibold text-surface-800">Mode 1 — options object</h2>
      <Password
          v-model="p1"
          label="Mot de passe"
          placeholder="Saisissez votre mot de passe"
          :min="8" :max="16"
          :options="{ number: true, lower: true, upper: true, special: true }"
      />
    </section>

    <section class="flex flex-col gap-4 max-w-sm">
      <h2 class="text-lg font-semibold text-surface-800">Mode 2 — props booléennes</h2>
      <Password
          v-model="p2"
          label="Mot de passe"
          placeholder="Saisissez votre mot de passe"
          :min="8"
          number lower upper special
      />
    </section>

    <section class="flex flex-col gap-4 max-w-sm">
      <h2 class="text-lg font-semibold text-surface-800">Mode 3 — pattern custom</h2>
      <Password
          v-model="p3"
          label="Code PIN"
          placeholder="Chiffres uniquement"
          :min="4" :max="6"
          pattern="^\d+$"
      />
    </section>

    <section class="flex flex-col gap-4 max-w-sm">
      <h2 class="text-lg font-semibold text-surface-800">Mode 3 — pattern custom</h2>
      <Password v-model="p1" :min="8" number upper show-helper />
      <Password
          upper
          number
          special
          v-model="p2"
          :min="8"
          :show-helper="true"
          @rules="onRules($event)"
      />

    </section>

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

  </main>
</template>