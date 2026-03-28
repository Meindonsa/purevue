import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Badge } from './index'

describe('Badge', () => {
    it('renders le slot content', () => {
        const wrapper = mount(Badge, { slots: { default: 'Nouveau' } })
        expect(wrapper.text()).toContain('Nouveau')
    })

    it('applique le variant primary par défaut', () => {
        const wrapper = mount(Badge)
        expect(wrapper.classes()).toContain('bg-primary-100')
    })

    it('applique le variant danger', () => {
        const wrapper = mount(Badge, { props: { variant: 'danger' } })
        expect(wrapper.classes()).toContain('bg-danger-100')
    })

    it('applique la shape pill', () => {
        const wrapper = mount(Badge, { props: { shape: 'pill' } })
        expect(wrapper.classes()).toContain('rounded-full')
    })

    it('affiche le dot quand dot=true', () => {
        const wrapper = mount(Badge, { props: { dot: true } })
        expect(wrapper.find('span.rounded-full').exists()).toBe(true)
    })

    it('affiche le bouton close quand closable=true', () => {
        const wrapper = mount(Badge, { props: { closable: true } })
        expect(wrapper.find('button').exists()).toBe(true)
    })

    it('émet close au clic sur le bouton', async () => {
        const wrapper = mount(Badge, { props: { closable: true } })
        await wrapper.find('button').trigger('click')
        expect(wrapper.emitted('close')).toBeDefined()
    })

    it('applique la taille sm', () => {
        const wrapper = mount(Badge, { props: { size: 'sm' } })
        expect(wrapper.classes()).toContain('text-xs')
    })
})