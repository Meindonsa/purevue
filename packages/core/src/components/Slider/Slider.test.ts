import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Slider } from './index'

describe('Slider', () => {
    it('render le label', () => {
        const wrapper = mount(Slider, { props: { label: 'Volume', modelValue: 50 } })
        expect(wrapper.text()).toContain('Volume')
    })

    it('affiche la valeur par défaut', () => {
        const wrapper = mount(Slider, { props: { modelValue: 30 } })
        expect(wrapper.find('input[type="number"]').exists()).toBe(false)
    })

    it('affiche l\'input si showInput=true', () => {
        const wrapper = mount(Slider, {
            props: { modelValue: 30, showInput: true },
        })
        expect(wrapper.find('input[type="number"]').exists()).toBe(true)
    })

    it('affiche deux inputs si range + showInput', () => {
        const wrapper = mount(Slider, {
            props: { modelValue: [20, 80], range: true, showInput: true },
        })
        expect(wrapper.findAll('input[type="number"]').length).toBe(2)
    })

    it('affiche les marks si marks=true', () => {
        const wrapper = mount(Slider, {
            props: { modelValue: 50, marks: true, step: 25 },
        })
        expect(wrapper.findAll('div.rounded-full.border-2').length).toBeGreaterThan(0)
    })

    it('affiche les labels des marks', () => {
        const wrapper = mount(Slider, {
            props: {
                modelValue: 0,
                marks: [
                    { value: 0,   label: 'Min' },
                    { value: 100, label: 'Max' },
                ],
            },
        })
        expect(wrapper.text()).toContain('Min')
        expect(wrapper.text()).toContain('Max')
    })

    it('applique opacity-50 si disabled', () => {
        const wrapper = mount(Slider, { props: { modelValue: 50, disabled: true } })
        expect(wrapper.find('div.opacity-50').exists()).toBe(true)
    })

    it('émet update:modelValue au changement d\'input', async () => {
        const wrapper = mount(Slider, {
            props: { modelValue: 30, showInput: true },
        })
        const input = wrapper.find('input[type="number"]')
        await input.setValue(60)
        await input.trigger('change')
        expect(wrapper.emitted('update:modelValue')).toBeDefined()
    })

    it('affiche un seul thumb en mode simple', () => {
        const wrapper = mount(Slider, { props: { modelValue: 50 } })
        const thumbs = wrapper.findAll('div.cursor-grab')
        expect(thumbs.length).toBe(1)
    })

    it('affiche deux thumbs en mode range', () => {
        const wrapper = mount(Slider, {
            props: { modelValue: [20, 80], range: true },
        })
        const thumbs = wrapper.findAll('div.cursor-grab')
        expect(thumbs.length).toBe(2)
    })
})