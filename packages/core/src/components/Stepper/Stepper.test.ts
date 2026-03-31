import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { Stepper, StepList, Step, StepPanels, StepPanel } from './index'

function mountStepper(modelValue = '1') {
    return mount({
        components: { Stepper, StepList, Step, StepPanels, StepPanel },
        template: `
      <Stepper model-value="${modelValue}">
        <StepList>
          <Step value="1">Étape 1</Step>
          <Step value="2">Étape 2</Step>
          <Step value="3">Étape 3</Step>
        </StepList>
        <StepPanels>
          <StepPanel value="1" v-slot="{ activateCallback }">
            <div>Contenu 1</div>
            <button @click="activateCallback('2')">Suivant</button>
          </StepPanel>
          <StepPanel value="2" v-slot="{ activateCallback }">
            <div>Contenu 2</div>
            <button @click="activateCallback('3')">Suivant</button>
          </StepPanel>
          <StepPanel value="3">
            <div>Contenu 3</div>
          </StepPanel>
        </StepPanels>
      </Stepper>
    `,
    })
}

describe('Stepper', () => {
    it('affiche le contenu du panel actif', async () => {
        const wrapper = mountStepper('1')
        await nextTick()
        expect(wrapper.text()).toContain('Contenu 1')
        expect(wrapper.text()).not.toContain('Contenu 2')
    })

    it('affiche les labels des steps', async () => {
        const wrapper = mountStepper('1')
        await nextTick()
        expect(wrapper.text()).toContain('Étape 1')
        expect(wrapper.text()).toContain('Étape 2')
        expect(wrapper.text()).toContain('Étape 3')
    })

    it('navigue via activateCallback', async () => {
        const wrapper = mountStepper('1')
        await nextTick()
        await wrapper.find('button').trigger('click')
        await nextTick()
        expect(wrapper.text()).toContain('Contenu 2')
    })

    it('affiche le check sur les étapes complétées', async () => {
        const wrapper = mountStepper('3')
        await nextTick()
        expect(wrapper.findAll('polyline').length).toBe(2)
    })

    it('affiche les numéros des étapes non complétées', async () => {
        const wrapper = mountStepper('1')
        await nextTick()
        expect(wrapper.text()).toContain('2')
        expect(wrapper.text()).toContain('3')
    })
})