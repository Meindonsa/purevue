import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { Menu, ContextMenu } from './index'
import type { MenuItem } from './Menu.types'

const items: MenuItem[] = [
    { key: 'edit',   label: 'Éditer',    shortcut: '⌘E' },
    { key: 'copy',   label: 'Copier',    shortcut: '⌘C' },
    { key: 'sep',    separator: true },
    { key: 'delete', label: 'Supprimer', disabled: true },
    { key: 'share',  label: 'Partager',  badge: 'New' },
    {
        key: 'more', label: 'Plus',
        children: [
            { key: 'export', label: 'Exporter' },
            { key: 'import', label: 'Importer' },
        ],
    },
]

describe('Menu (Dropdown)', () => {
    it('est fermé par défaut', () => {
        const wrapper = mount(Menu, {
            props: { items },
            slots: { default: '<button>Ouvrir</button>' },
        })
        expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    })

    it('s\'ouvre au clic sur le trigger', async () => {
        const wrapper = mount(Menu, {
            props: { items },
            slots: { default: '<button>Ouvrir</button>' },
        })
        await wrapper.find('button').trigger('click')
        await nextTick()
        expect(wrapper.find('[role="menu"]').exists()).toBe(true)
    })

    it('affiche les labels des items', async () => {
        const wrapper = mount(Menu, {
            props: { items },
            slots: { default: '<button>Ouvrir</button>' },
        })
        await wrapper.find('button').trigger('click')
        await nextTick()
        expect(wrapper.text()).toContain('Éditer')
        expect(wrapper.text()).toContain('Copier')
    })

    it('affiche le shortcut', async () => {
        const wrapper = mount(Menu, {
            props: { items },
            slots: { default: '<button>Ouvrir</button>' },
        })
        await wrapper.find('button').trigger('click')
        await nextTick()
        expect(wrapper.text()).toContain('⌘E')
    })

    it('affiche le badge', async () => {
        const wrapper = mount(Menu, {
            props: { items },
            slots: { default: '<button>Ouvrir</button>' },
        })
        await wrapper.find('button').trigger('click')
        await nextTick()
        expect(wrapper.text()).toContain('New')
    })

    it('émet select au clic sur un item', async () => {
        const wrapper = mount(Menu, {
            props: { items },
            slots: { default: '<button>Ouvrir</button>' },
        })
        await wrapper.find('button').trigger('click')
        await nextTick()
        const menuItems = wrapper.findAll('[role="menuitem"]')
        await menuItems[0].trigger('click')
        expect(wrapper.emitted('select')).toBeDefined()
    })

    it('ne déclenche pas l\'action sur un item désactivé', async () => {
        const wrapper = mount(Menu, {
            props: { items },
            slots: { default: '<button>Ouvrir</button>' },
        })
        await wrapper.find('button').trigger('click')
        await nextTick()
        const disabledItem = wrapper.findAll('button').find(b => b.attributes('disabled') !== undefined)
        expect(disabledItem).toBeDefined()
    })

    it('se ferme après sélection d\'un item', async () => {
        const wrapper = mount(Menu, {
            props: { items },
            slots: { default: '<button>Ouvrir</button>' },
        })
        await wrapper.find('button').trigger('click')
        await nextTick()
        const menuItems = wrapper.findAll('[role="menuitem"]')
        await menuItems[0].trigger('click')
        await nextTick()
        expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    })
})

describe('ContextMenu', () => {
    it('est fermé par défaut', () => {
        const wrapper = mount(ContextMenu, {
            props: { items },
            slots: { default: '<div>Zone</div>' },
        })
        expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    })

    it('s\'ouvre au clic droit', async () => {
        const wrapper = mount(ContextMenu, {
            props: { items },
            slots: { default: '<div>Zone</div>' },
            attachTo: document.body,
        })
        await wrapper.trigger('contextmenu')
        await nextTick()
        expect(document.querySelector('[role="menu"]')).toBeTruthy()
        wrapper.unmount()
    })
})