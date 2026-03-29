import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Panel } from './index'

describe('Panel', () => {
    it('render le slot par défaut', () => {
        const wrapper = mount(Panel, { slots: { default: 'Contenu' } })
        expect(wrapper.text()).toContain('Contenu')
    })

    it('affiche le titre', () => {
        const wrapper = mount(Panel, { props: { title: 'Mon Panel' } })
        expect(wrapper.text()).toContain('Mon Panel')
    })

    it('est fermé par défaut si toggleable', () => {
        const wrapper = mount(Panel, {
            props: { toggleable: true, collapsed: true },
            slots: { default: 'Contenu caché' },
        })
        expect(wrapper.text()).not.toContain('Contenu caché')
    })

    it('s\'ouvre au clic si toggleable', async () => {
        const wrapper = mount(Panel, {
            props: { toggleable: true, collapsed: true, title: 'Panel' },
            slots: { default: 'Contenu visible' },
        })
        await wrapper.find('div.cursor-pointer').trigger('click')
        expect(wrapper.text()).toContain('Contenu visible')
    })

    it('émet toggle au clic', async () => {
        const wrapper = mount(Panel, {
            props: { toggleable: true, title: 'Panel' },
        })
        await wrapper.find('div.cursor-pointer').trigger('click')
        expect(wrapper.emitted('toggle')).toBeDefined()
    })

    it('émet update:collapsed au clic', async () => {
        const wrapper = mount(Panel, {
            props: { toggleable: true, title: 'Panel' },
        })
        await wrapper.find('div.cursor-pointer').trigger('click')
        expect(wrapper.emitted('update:collapsed')).toBeDefined()
    })

    it('affiche le slot footer', () => {
        const wrapper = mount(Panel, {
            slots: { default: 'Contenu', footer: 'Footer' },
        })
        expect(wrapper.text()).toContain('Footer')
    })

    it('applique le variant elevated', () => {
        const wrapper = mount(Panel, { props: { variant: 'elevated' } })
        expect(wrapper.classes()).toContain('shadow-md')
    })

    it('le slot actions ne toggle pas le panel', async () => {
        const wrapper = mount(Panel, {
            props: { toggleable: true, collapsed: true, title: 'Panel' },
            slots: { default: 'Contenu', actions: '<button>Action</button>' },
        })
        await wrapper.find('button').trigger('click')
        expect(wrapper.text()).not.toContain('Contenu')
    })
})