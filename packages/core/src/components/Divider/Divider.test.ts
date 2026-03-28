import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Divider } from './index'

describe('Divider', () => {
    it('renders horizontal par défaut', () => {
        const wrapper = mount(Divider)
        expect(wrapper.find('div').classes()).toContain('border-t')
    })

    it('renders vertical', () => {
        const wrapper = mount(Divider, { props: { orientation: 'vertical' } })
        expect(wrapper.find('div').classes()).toContain('border-l')
    })

    it('applique le variant dashed', () => {
        const wrapper = mount(Divider, { props: { variant: 'dashed' } })
        expect(wrapper.find('div').classes()).toContain('border-dashed')
    })

    it('applique le variant dotted', () => {
        const wrapper = mount(Divider, { props: { variant: 'dotted' } })
        expect(wrapper.find('div').classes()).toContain('border-dotted')
    })

    it('affiche le label', () => {
        const wrapper = mount(Divider, { props: { label: 'ou' } })
        expect(wrapper.text()).toContain('ou')
    })

    it('affiche le slot', () => {
        const wrapper = mount(Divider, { slots: { default: 'ET' } })
        expect(wrapper.text()).toContain('ET')
    })

    it('applique align start', () => {
        const wrapper = mount(Divider, { props: { label: 'ou', align: 'start' } })
        expect(wrapper.find('div').classes()).toContain('justify-start')
    })

    it('applique align end', () => {
        const wrapper = mount(Divider, { props: { label: 'ou', align: 'end' } })
        expect(wrapper.find('div').classes()).toContain('justify-end')
    })
})