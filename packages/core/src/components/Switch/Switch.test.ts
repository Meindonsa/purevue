import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Switch } from './index'

describe('Switch', () => {
    it('render le label', () => {
        const wrapper = mount(Switch, { props: { label: 'Activer' } })
        expect(wrapper.text()).toContain('Activer')
    })

    it('render la description', () => {
        const wrapper = mount(Switch, {
            props: { label: 'Activer', description: 'Active la fonctionnalité' },
        })
        expect(wrapper.text()).toContain('Active la fonctionnalité')
    })

    it('émet update:modelValue au clic', async () => {
        const wrapper = mount(Switch, { props: { modelValue: false } })
        await wrapper.trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    })

    it('toggle de true à false', async () => {
        const wrapper = mount(Switch, { props: { modelValue: true } })
        await wrapper.trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    })

    it('ne déclenche pas si disabled', async () => {
        const wrapper = mount(Switch, { props: { disabled: true } })
        await wrapper.trigger('click')
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('applique bg-primary-500 si ON', () => {
        const wrapper = mount(Switch, { props: { modelValue: true } })
        expect(wrapper.find('div.bg-primary-500').exists()).toBe(true)
    })

    it('applique bg-surface-300 si OFF', () => {
        const wrapper = mount(Switch, { props: { modelValue: false } })
        expect(wrapper.find('div.bg-surface-300').exists()).toBe(true)
    })

    it('affiche le texte ON si showText=true et ON', () => {
        const wrapper = mount(Switch, {
            props: { modelValue: true, showText: true, onText: 'OUI' },
        })
        expect(wrapper.text()).toContain('OUI')
    })

    it('affiche le texte OFF si showText=true et OFF', () => {
        const wrapper = mount(Switch, {
            props: { modelValue: false, showText: true, offText: 'NON' },
        })
        expect(wrapper.text()).toContain('NON')
    })

    it('applique labelPosition left', () => {
        const wrapper = mount(Switch, {
            props: { label: 'Test', labelPosition: 'left' },
        })
        expect(wrapper.find('div').classes()).toContain('flex-row-reverse')
    })

    it('applique la taille sm', () => {
        const wrapper = mount(Switch, { props: { size: 'sm' } })
        expect(wrapper.find('div.w-8').exists()).toBe(true)
    })

    it('applique la taille lg', () => {
        const wrapper = mount(Switch, { props: { size: 'lg' } })
        expect(wrapper.find('div.w-14').exists()).toBe(true)
    })
})