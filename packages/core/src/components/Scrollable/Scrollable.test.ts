import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Scrollable } from './index'

describe('Scrollable', () => {
    it('render le slot', () => {
        const wrapper = mount(Scrollable, { slots: { default: 'Contenu' } })
        expect(wrapper.text()).toContain('Contenu')
    })

    it('applique overflow-y-auto par défaut', () => {
        const wrapper = mount(Scrollable)
        expect(wrapper.classes()).toContain('overflow-y-auto')
    })

    it('applique overflow-x-auto si direction=horizontal', () => {
        const wrapper = mount(Scrollable, { props: { direction: 'horizontal' } })
        expect(wrapper.classes()).toContain('overflow-x-auto')
    })

    it('applique overflow-auto si direction=both', () => {
        const wrapper = mount(Scrollable, { props: { direction: 'both' } })
        expect(wrapper.classes()).toContain('overflow-auto')
    })

    it('applique scrollbar-hidden si hidden=true', () => {
        const wrapper = mount(Scrollable, { props: { hidden: true } })
        expect(wrapper.classes()).toContain('scrollbar-hidden')
    })

    it('applique scrollbar-thin si thin=true', () => {
        const wrapper = mount(Scrollable, { props: { thin: true } })
        expect(wrapper.classes()).toContain('scrollbar-thin')
    })

    it('applique max-h-64 si size=md', () => {
        const wrapper = mount(Scrollable, { props: { size: 'md' } })
        expect(wrapper.classes()).toContain('max-h-64')
    })

    it('applique le style height custom', () => {
        const wrapper = mount(Scrollable, { props: { height: '300px' } })
        expect(wrapper.attributes('style')).toContain('max-height: 300px')
    })

    it('applique le style width custom', () => {
        const wrapper = mount(Scrollable, { props: { direction: 'horizontal', width: '500px' } })
        expect(wrapper.attributes('style')).toContain('max-width: 500px')
    })

    it('affiche le spinner si infinite=true et loading=true', () => {
        const wrapper = mount(Scrollable, {
            props: { infinite: true, loading: true },
        })
        expect(wrapper.findComponent({ name: 'Spinner' }).exists()).toBe(true)
    })

    it('affiche le slot loader custom si fourni', () => {
        const wrapper = mount(Scrollable, {
            props: { infinite: true, loading: true },
            slots: { loader: '<div class="custom-loader">Chargement...</div>' },
        })
        expect(wrapper.find('.custom-loader').exists()).toBe(true)
    })

    it('n\'affiche pas le spinner si loading=false', () => {
        const wrapper = mount(Scrollable, {
            props: { infinite: true, loading: false },
        })
        expect(wrapper.findComponent({ name: 'Spinner' }).exists()).toBe(false)
    })
})