<script lang="ts" setup>
import { ref } from 'vue'
import { Password } from '@purevue/core'

const p1 = ref('')
const p2 = ref('')
const p3 = ref('')

function onRules(results: { key: string; label: string; passed: boolean }[]) {
  console.log(results)
}
</script>

<template>
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
</template>

<style scoped></style>