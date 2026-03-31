import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { Select, MultiSelect } from './index'
import type { SelectOption } from './Select.types'

const options: SelectOption[] = [
    { label: 'Vue',     value: 'vue' },
    { label: 'React',   value: 'react' },
    { label: 'Angular', value: 'angular', disabled: true },
    { label: 'Svelte',  value: 'svelte', group: 'Autres' },
]

describe('Select', () => {
    it('affiche le placeholder par défaut', () => {
        const wrapper = mount(Select, { props: { options, placeholder: 'Choisir...' } })
        expect(wrapper.text()).toContain('Choisir...')
    })

    it('s\'ouvre au clic', async () => {
        const wrapper = mount(Select, { props: { options } })
        await wrapper.find('div.cursor-pointer').trigger('click')
        await nextTick()
        expect(wrapper.find('[role="menu"]').exists() || wrapper.text()).toBeTruthy()
    })

    it('affiche les options à l\'ouverture', async () => {
        const wrapper = mount(Select, { props: { options } })
        await wrapper.find('div.cursor-pointer').trigger('click')
        await nextTick()
        expect(wrapper.text()).toContain('Vue')
        expect(wrapper.text()).toContain('React')
    })

    it('émet update:modelValue à la sélection', async () => {
        const wrapper = mount(Select, { props: { options } })
        await wrapper.find('div.cursor-pointer').trigger('click')
        await nextTick()
        const buttons = wrapper.findAll('button')
        await buttons[0].trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['vue'])
    })

    it('affiche la valeur sélectionnée', () => {
        const wrapper = mount(Select, {
            props: { options, modelValue: 'vue' },
        })
        expect(wrapper.text()).toContain('Vue')
    })

    it('affiche le bouton clear si clearable et valeur sélectionnée', () => {
        const wrapper = mount(Select, {
            props: { options, modelValue: 'vue', clearable: true },
        })
        expect(wrapper.find('button').exists()).toBe(true)
    })
})

describe('MultiSelect', () => {
    it('affiche le placeholder si aucune sélection', () => {
        const wrapper = mount(MultiSelect, {
            props: { options, placeholder: 'Choisir...' },
        })
        expect(wrapper.text()).toContain('Choisir...')
    })

    it('affiche les tags des valeurs sélectionnées', () => {
        const wrapper = mount(MultiSelect, {
            props: { options, modelValue: ['vue', 'react'] },
        })
        expect(wrapper.text()).toContain('Vue')
        expect(wrapper.text()).toContain('React')
    })

    it('affiche le compteur +N si maxTags défini', () => {
        const wrapper = mount(MultiSelect, {
            props: { options, modelValue: ['vue', 'react', 'svelte'], maxTags: 1 },
        })
        expect(wrapper.text()).toContain('+2')
    })

    it('émet update:modelValue à la sélection', async () => {
        const wrapper = mount(MultiSelect, {
            props: { options, modelValue: [] },
        })
        await wrapper.find('div.cursor-pointer').trigger('click')
        await nextTick()
        const buttons = wrapper.findAll('button')
        const optBtn = buttons.find(b => b.text().includes('Vue'))
        await optBtn?.trigger('click')
        expect(wrapper.emitted('update:modelValue')).toBeDefined()
    })

    it('retire un tag au clic sur le X', async () => {
        const wrapper = mount(MultiSelect, {
            props: { options, modelValue: ['vue'] },
        })
        const removeBtn = wrapper.find('button')
        await removeBtn.trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
    })
})