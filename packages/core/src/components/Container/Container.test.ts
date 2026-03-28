import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Container } from './index'

describe('Container', () => {
    it('render le slot', () => {
        const wrapper = mount(Container, { slots: { default: 'Contenu' } })
        expect(wrapper.text()).toContain('Contenu')
    })

    it('applique max-w-screen-lg par défaut', () => {
        const wrapper = mount(Container)
        expect(wrapper.classes()).toContain('max-w-screen-lg')
    })

    it('applique max-w-screen-sm', () => {
        const wrapper = mount(Container, { props: { size: 'sm' } })
        expect(wrapper.classes()).toContain('max-w-screen-sm')
    })

    it('applique max-w-full si size=full', () => {
        const wrapper = mount(Container, { props: { size: 'full' } })
        expect(wrapper.classes()).toContain('max-w-full')
    })

    it('applique mx-auto si center=true', () => {
        const wrapper = mount(Container, { props: { center: true } })
        expect(wrapper.classes()).toContain('mx-auto')
    })

    it('n\'applique pas mx-auto si center=false', () => {
        const wrapper = mount(Container, { props: { center: false } })
        expect(wrapper.classes()).not.toContain('mx-auto')
    })

    it('applique le padding lg', () => {
        const wrapper = mount(Container, { props: { padding: 'lg' } })
        expect(wrapper.classes()).toContain('px-8')
    })

    it('n\'applique pas de padding si padding=none', () => {
        const wrapper = mount(Container, { props: { padding: 'none' } })
        expect(wrapper.classes()).not.toContain('px-6')
    })
})