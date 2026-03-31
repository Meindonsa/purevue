import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Radio, RadioGroup } from './index'
import type { RadioOption } from './Radio.types'

const options: RadioOption[] = [
    { label: 'Vue',     value: 'vue' },
    { label: 'React',   value: 'react' },
    { label: 'Angular', value: 'angular', disabled: true },
]

describe('Radio', () => {
    it('render le label', () => {
        const wrapper = mount(Radio, { props: { value: 'vue', label: 'Vue' } })
        expect(wrapper.text()).toContain('Vue')
    })

    it('est coché si modelValue === value', () => {
        const wrapper = mount(Radio, { props: { value: 'vue', modelValue: 'vue' } })
        expect(wrapper.find('div.bg-primary-500').exists()).toBe(true)
    })

    it('n\'est pas coché si modelValue !== value', () => {
        const wrapper = mount(Radio, { props: { value: 'vue', modelValue: 'react' } })
        expect(wrapper.find('div.bg-primary-500').exists()).toBe(false)
    })

    it('émet update:modelValue au clic', async () => {
        const wrapper = mount(Radio, { props: { value: 'vue', modelValue: 'react' } })
        await wrapper.trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['vue'])
    })

    it('ne déclenche pas si disabled', async () => {
        const wrapper = mount(Radio, { props: { value: 'vue', disabled: true } })
        await wrapper.trigger('click')
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('applique labelPosition left', () => {
        const wrapper = mount(Radio, {
            props: { value: 'vue', label: 'Vue', labelPosition: 'left' },
        })
        expect(wrapper.find('div').classes()).toContain('flex-row-reverse')
    })
})

describe('RadioGroup', () => {
    it('render toutes les options', () => {
        const wrapper = mount(RadioGroup, { props: { options, modelValue: 'vue' } })
        expect(wrapper.text()).toContain('Vue')
        expect(wrapper.text()).toContain('React')
        expect(wrapper.text()).toContain('Angular')
    })

    it('émet update:modelValue à la sélection', async () => {
        const wrapper = mount(RadioGroup, { props: { options, modelValue: 'vue' } })
        const radios = wrapper.findAllComponents({ name: 'Radio' })
        await radios[1].trigger('click')
        expect(wrapper.emitted('update:modelValue')).toBeDefined()
    })

    it('affiche le label du groupe', () => {
        const wrapper = mount(RadioGroup, {
            props: { options, label: 'Framework', modelValue: 'vue' },
        })
        expect(wrapper.text()).toContain('Framework')
    })

    it('affiche l\'erreur', () => {
        const wrapper = mount(RadioGroup, {
            props: { options, modelValue: 'vue', error: 'Requis' },
        })
        expect(wrapper.text()).toContain('Requis')
    })

    it('render le variant card', () => {
        const wrapper = mount(RadioGroup, {
            props: { options, modelValue: 'vue', variant: 'card' },
        })
        expect(wrapper.find('div.rounded-xl').exists()).toBe(true)
    })

    it('render le variant button', () => {
        const wrapper = mount(RadioGroup, {
            props: { options, modelValue: 'vue', variant: 'button' },
        })
        expect(wrapper.find('div.border').exists()).toBe(true)
    })
})