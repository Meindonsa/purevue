import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { AutoComplete } from './index'
import type { AutoCompleteOption } from './AutoComplete.types'
    
const options: AutoCompleteOption[] = [
    { label: 'Vue 3',   value: 'vue',   group: 'Frontend' },
    { label: 'React',   value: 'react', group: 'Frontend' },
    { label: 'Node.js', value: 'node',  group: 'Backend' },
]

async function type(wrapper: ReturnType<typeof mount>, value: string) {
    const input = wrapper.find('input')
    await input.setValue(value)
    await input.trigger('focus')
    await nextTick()
    await new Promise(r => setTimeout(r, 350))
    await nextTick()
}

describe('AutoComplete', () => {
    it('render le label', () => {
        const wrapper = mount(AutoComplete, { props: { options, label: 'Framework' } })
        expect(wrapper.text()).toContain('Framework')
    })

    it('affiche le placeholder', () => {
        const wrapper = mount(AutoComplete, {
            props: { options, placeholder: 'Rechercher...' },
        })
        expect(wrapper.find('input').attributes('placeholder')).toBe('Rechercher...')
    })

    it('n\'affiche pas le dropdown si query < minChars', async () => {
        const wrapper = mount(AutoComplete, { props: { options, minChars: 2, debounce: 0 } })
        await type(wrapper, 'v')
        expect(wrapper.text()).not.toContain('Vue 3')
    })

    it('affiche les options filtrées après minChars', async () => {
        const wrapper = mount(AutoComplete, { props: { options, minChars: 1, debounce: 0 } })
        await type(wrapper, 'vue')
        expect(wrapper.text()).toContain('Vue 3')
        expect(wrapper.text()).not.toContain('React')
    })

    it('émet search avec la query', async () => {
        const wrapper = mount(AutoComplete, { props: { options, minChars: 1, debounce: 0 } })
        await type(wrapper, 'vue')
        expect(wrapper.emitted('search')?.[0]).toEqual(['vue'])
    })

    it('émet update:modelValue à la sélection', async () => {
        const wrapper = mount(AutoComplete, { props: { options, minChars: 1, debounce: 0 } })
        await type(wrapper, 'vue')
        const btn = wrapper.findAll('button').find(b => b.text().includes('Vue 3'))
        await btn?.trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['vue'])
    })

    it('émet select à la sélection', async () => {
        const wrapper = mount(AutoComplete, { props: { options, minChars: 1, debounce: 0 } })
        await type(wrapper, 'vue')
        const btn = wrapper.findAll('button').find(b => b.text().includes('Vue 3'))
        await btn?.trigger('click')
        expect(wrapper.emitted('select')).toBeDefined()
    })

    it('mode multiple — ajoute des tags', async () => {
        const wrapper = mount(AutoComplete, {
            props: { options, multiple: true, modelValue: [], minChars: 1, debounce: 0 },
        })
        await type(wrapper, 'vue')
        const btn = wrapper.findAll('button').find(b => b.text().includes('Vue 3'))
        await btn?.trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['vue']])
    })

    it('mode multiple — retire un tag', async () => {
        const wrapper = mount(AutoComplete, {
            props: {
                options,
                multiple: true,
                modelValue: ['vue'],
                minChars: 1,
                debounce: 0,
            },
        })
        await nextTick()
        const removeBtn = wrapper.find('button')
        await removeBtn.trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
    })

    it('affiche le message vide si aucun résultat', async () => {
        const wrapper = mount(AutoComplete, {
            props: { options, minChars: 1, debounce: 0, emptyText: 'Rien trouvé' },
        })
        await type(wrapper, 'zzz')
        expect(wrapper.text()).toContain('Rien trouvé')
    })

    it('affiche le spinner si loading=true', async () => {
        const wrapper = mount(AutoComplete, {
            props: { options, loading: true, minChars: 1, debounce: 0 },
        })
        await type(wrapper, 'vue')
        expect(wrapper.find('svg.animate-spin').exists()).toBe(true)
    })

    it('navigation clavier ArrowDown', async () => {
        const wrapper = mount(AutoComplete, { props: { options, minChars: 1, debounce: 0 } })
        await type(wrapper, 'v')
        await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
        await nextTick()
        expect(wrapper.find('button.bg-primary-50').exists()).toBe(true)
    })

    it('ferme le dropdown avec Escape', async () => {
        const wrapper = mount(AutoComplete, { props: { options, minChars: 1, debounce: 0 } })
        await type(wrapper, 'vue')
        await wrapper.find('input').trigger('keydown', { key: 'Escape' })
        await nextTick()
        expect(wrapper.text()).not.toContain('Vue 3')
    })

    it('affiche le helpText', () => {
        const wrapper = mount(AutoComplete, {
            props: { options, helpText: 'Tapez pour rechercher' },
        })
        expect(wrapper.text()).toContain('Tapez pour rechercher')
    })

    it('affiche l\'erreur', () => {
        const wrapper = mount(AutoComplete, {
            props: { options, error: 'Champ requis' },
        })
        expect(wrapper.text()).toContain('Champ requis')
    })
})