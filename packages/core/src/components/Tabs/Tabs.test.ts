import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { Tabs } from './index'
import type { TabItem } from './Tabs.types'

const tabs: TabItem[] = [
    { key: 'tab1', label: 'Onglet 1' },
    { key: 'tab2', label: 'Onglet 2' },
    { key: 'tab3', label: 'Onglet 3', disabled: true },
]

describe('Tabs', () => {
    it('render les labels des tabs', () => {
        const wrapper = mount(Tabs, { props: { tabs } })
        expect(wrapper.text()).toContain('Onglet 1')
        expect(wrapper.text()).toContain('Onglet 2')
        expect(wrapper.text()).toContain('Onglet 3')
    })

    it('active le premier tab par défaut', () => {
        const wrapper = mount(Tabs, { props: { tabs } })
        const buttons = wrapper.findAll('button')
        expect(buttons[0].attributes('aria-selected')).toBe('true')
        expect(buttons[1].attributes('aria-selected')).toBe('false')
    })

    it('change d\'onglet au clic', async () => {
        const wrapper = mount(Tabs, { props: { tabs } })
        await wrapper.findAll('button')[1].trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['tab2'])
    })

    it('émet change au clic', async () => {
        const wrapper = mount(Tabs, { props: { tabs } })
        await wrapper.findAll('button')[1].trigger('click')
        expect(wrapper.emitted('change')?.[0]).toEqual(['tab2'])
    })

    it('ne change pas si tab disabled', async () => {
        const wrapper = mount(Tabs, { props: { tabs } })
        await wrapper.findAll('button')[2].trigger('click')
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('affiche le contenu du tab actif', async () => {
        const wrapper = mount(Tabs, {
            props: { tabs },
            slots: { tab1: 'Contenu 1', tab2: 'Contenu 2' },
        })
        expect(wrapper.text()).toContain('Contenu 1')
    })

    it('mode lazy — ne monte pas les tabs inactifs', () => {
        const wrapper = mount(Tabs, {
            props: { tabs, lazy: true },
            slots: { tab1: 'Contenu 1', tab2: 'Contenu 2' },
        })
        expect(wrapper.text()).not.toContain('Contenu 2')
    })

    it('mode lazy — monte le contenu après activation', async () => {
        const wrapper = mount(Tabs, {
            props: { tabs, lazy: true },
            slots: { tab1: 'Contenu 1', tab2: 'Contenu 2' },
        })
        await wrapper.findAll('button')[1].trigger('click')
        await nextTick()
        expect(wrapper.text()).toContain('Contenu 2')
    })

    it('applique la position left', () => {
        const wrapper = mount(Tabs, { props: { tabs, position: 'left' } })
        expect(wrapper.find('div').classes()).toContain('flex-row')
    })

    it('applique le variant pill', () => {
        const wrapper = mount(Tabs, { props: { tabs, variant: 'pill' } })
        expect(wrapper.find('[role="tablist"]').classes()).toContain('bg-surface-100')
    })

    it('affiche le badge si fourni', () => {
        const tabsWithBadge: TabItem[] = [
            { key: 'tab1', label: 'Messages', badge: 5 },
        ]
        const wrapper = mount(Tabs, { props: { tabs: tabsWithBadge } })
        expect(wrapper.text()).toContain('5')
    })

    it('applique animation fade', async () => {
        const wrapper = mount(Tabs, {
            props: { tabs, animation: 'fade' },
            slots: { tab1: 'Contenu 1', tab2: 'Contenu 2' },
        })
        await wrapper.findAll('button')[1].trigger('click')
        await nextTick()
        expect(wrapper.emitted('change')?.[0]).toEqual(['tab2'])
    })

    it('slide intelligent — direction suivant', async () => {
        const wrapper = mount(Tabs, {
            props: { tabs, animation: 'slide' },
        })
        await wrapper.findAll('button')[1].trigger('click')
        await nextTick()
        expect(wrapper.emitted('change')?.[0]).toEqual(['tab2'])
    })

    it('slide intelligent — direction précédent', async () => {
        const wrapper = mount(Tabs, {
            props: { tabs, animation: 'slide', modelValue: 'tab2' },
        })
        await wrapper.findAll('button')[0].trigger('click')
        await nextTick()
        expect(wrapper.emitted('change')?.[0]).toEqual(['tab1'])
    })
})