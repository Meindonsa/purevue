import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Checkbox, CheckboxGroup } from './index'
import type { CheckboxGroupOption } from './Checkbox.types'

const options: CheckboxGroupOption[] = [
    { label: 'Vue',     value: 'vue' },
    { label: 'React',   value: 'react' },
    { label: 'Angular', value: 'angular', disabled: true },
]

describe('Checkbox', () => {
    it('render le label', () => {
        const wrapper = mount(Checkbox, { props: { label: 'Accepter' } })
        expect(wrapper.text()).toContain('Accepter')
    })

    it('render la description', () => {
        const wrapper = mount(Checkbox, {
            props: { label: 'CGU', description: 'Conditions générales' },
        })
        expect(wrapper.text()).toContain('Conditions générales')
    })

    it('émet update:modelValue au clic', async () => {
        const wrapper = mount(Checkbox, { props: { modelValue: false } })
        await wrapper.trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    })

    it('ne déclenche pas si disabled', async () => {
        const wrapper = mount(Checkbox, { props: { disabled: true } })
        await wrapper.trigger('click')
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('affiche le check si modelValue=true', () => {
        const wrapper = mount(Checkbox, { props: { modelValue: true } })
        expect(wrapper.find('polyline').exists()).toBe(true)
    })

    it('affiche le tiret si indeterminate', () => {
        const wrapper = mount(Checkbox, { props: { indeterminate: true, modelValue: false } })
        expect(wrapper.find('line').exists()).toBe(true)
    })

    it('applique shape circle', () => {
        const wrapper = mount(Checkbox, { props: { shape: 'circle' } })
        expect(wrapper.find('div.rounded-full').exists()).toBe(true)
    })

    it('applique labelPosition left', () => {
        const wrapper = mount(Checkbox, {
            props: { label: 'Test', labelPosition: 'left' },
        })
        expect(wrapper.find('div').classes()).toContain('flex-row-reverse')
    })
})

describe('CheckboxGroup', () => {
    it('render toutes les options', () => {
        const wrapper = mount(CheckboxGroup, { props: { options, modelValue: [] } })
        expect(wrapper.text()).toContain('Vue')
        expect(wrapper.text()).toContain('React')
        expect(wrapper.text()).toContain('Angular')
    })

    it('émet update:modelValue à la sélection', async () => {
        const wrapper = mount(CheckboxGroup, { props: { options, modelValue: [] } })
        const checkboxes = wrapper.findAllComponents({ name: 'Checkbox' })
        await checkboxes[0].trigger('click')
        expect(wrapper.emitted('update:modelValue')).toBeDefined()
    })

    it('affiche le bouton tout sélectionner si label fourni', () => {
        const wrapper = mount(CheckboxGroup, {
            props: { options, modelValue: [], label: 'Frameworks' },
        })
        expect(wrapper.text()).toContain('Tout sélectionner')
    })

    it('affiche l\'erreur', () => {
        const wrapper = mount(CheckboxGroup, {
            props: { options, modelValue: [], error: 'Champ requis' },
        })
        expect(wrapper.text()).toContain('Champ requis')
    })

    it('état indeterminate si sélection partielle', () => {
        const wrapper = mount(CheckboxGroup, {
            props: { options, modelValue: ['vue'], label: 'Frameworks' },
        })
        const selectAll = wrapper.findComponent({ name: 'Checkbox' })
        expect(selectAll.props('indeterminate')).toBe(true)
    })
})