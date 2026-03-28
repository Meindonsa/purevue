import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Spinner } from './index'

describe('Spinner', () => {
    it('renders avec role status', () => {
        const wrapper = mount(Spinner)
        expect(wrapper.attributes('role')).toBe('status')
    })

    it('affiche le label si fourni', () => {
        const wrapper = mount(Spinner, { props: { label: 'Chargement...' } })
        expect(wrapper.text()).toContain('Chargement...')
    })

    it('n\'affiche pas de label si absent', () => {
        const wrapper = mount(Spinner)
        const spans = wrapper.findAll('span')
        const labelSpan = spans.find((s) => s.classes().includes('text-surface-600'))
        expect(labelSpan).toBeUndefined()
    })

    it('applique la taille lg', () => {
        const wrapper = mount(Spinner, { props: { size: 'lg' } })
        expect(wrapper.find('span.rounded-full').classes()).toContain('w-8')
    })

    it('applique le variant danger', () => {
        const wrapper = mount(Spinner, { props: { variant: 'danger' } })
        expect(wrapper.find('span.rounded-full').classes()).toContain('border-t-danger-500')
    })

    it('applique le layout bottom', () => {
        const wrapper = mount(Spinner, { props: { labelPosition: 'bottom' } })
        expect(wrapper.classes()).toContain('flex-col')
    })
})