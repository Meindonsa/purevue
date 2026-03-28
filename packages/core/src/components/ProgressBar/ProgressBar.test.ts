import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ProgressBar } from './index'

describe('ProgressBar', () => {
    it('calcule le pourcentage correctement', () => {
        const wrapper = mount(ProgressBar, { props: { value: 50, label: true } })
        expect(wrapper.text()).toContain('50%')
    })

    it('clamp la valeur au min', () => {
        const wrapper = mount(ProgressBar, { props: { value: -10, label: true } })
        expect(wrapper.text()).toContain('0%')
    })

    it('clamp la valeur au max', () => {
        const wrapper = mount(ProgressBar, { props: { value: 150, label: true } })
        expect(wrapper.text()).toContain('100%')
    })

    it('applique le variant success', () => {
        const wrapper = mount(ProgressBar, { props: { value: 50, variant: 'success' } })
        expect(wrapper.find('div.bg-success-500').exists()).toBe(true)
    })

    it('applique la taille xs', () => {
        const wrapper = mount(ProgressBar, { props: { value: 50, size: 'xs' } })
        expect(wrapper.find('[role="progressbar"]').classes()).toContain('h-1')
    })

    it('render en mode indeterminate', () => {
        const wrapper = mount(ProgressBar, { props: { indeterminate: true } })
        expect(wrapper.find('div.animate-indeterminate').exists()).toBe(true)
    })

    it('affiche le label intérieur en mode inside-center', () => {
        const wrapper = mount(ProgressBar, {
            props: { value: 60, label: true, labelPosition: 'inside-center', size: 'md' },
        })
        expect(wrapper.find('div.absolute').exists()).toBe(true)
        expect(wrapper.find('div.absolute').text()).toContain('60%')
    })

    it('n\'affiche pas le label intérieur sur size xs', () => {
        const wrapper = mount(ProgressBar, {
            props: { value: 60, label: true, labelPosition: 'inside-center', size: 'xs' },
        })
        expect(wrapper.find('div.absolute').exists()).toBe(false)
    })

    it('affiche un labelText custom', () => {
        const wrapper = mount(ProgressBar, {
            props: { value: 60, label: true, labelText: 'En cours...', size: 'lg', labelPosition: 'inside-left' },
        })
        expect(wrapper.text()).toContain('En cours...')
    })

    it('a les bons attributs aria', () => {
        const wrapper = mount(ProgressBar, { props: { value: 75 } })
        const bar = wrapper.find('[role="progressbar"]')
        expect(bar.attributes('aria-valuenow')).toBe('75')
        expect(bar.attributes('aria-valuemin')).toBe('0')
        expect(bar.attributes('aria-valuemax')).toBe('100')
    })
})