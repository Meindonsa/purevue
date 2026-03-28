import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { Textarea } from './index'

describe('Textarea', () => {
    it('renders avec placeholder', () => {
        const wrapper = mount(Textarea, { props: { placeholder: 'Saisissez...' } })
        expect(wrapper.find('textarea').attributes('placeholder')).toBe('Saisissez...')
    })

    it('émet update:modelValue on input', async () => {
        const wrapper = mount(Textarea)
        await wrapper.find('textarea').setValue('hello')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hello'])
    })

    it('est désactivé quand disabled est true', () => {
        const wrapper = mount(Textarea, { props: { disabled: true } })
        expect(wrapper.find('textarea').attributes('disabled')).toBeDefined()
    })

    it('affiche le compteur de caractères', async () => {
        const wrapper = mount(Textarea, {
            props: { showCount: true, maxlength: 100, modelValue: 'hello' },
        })
        await nextTick()
        expect(wrapper.text()).toContain('5 / 100')
    })

    it('affiche compteur en rouge si dépassement', async () => {
        const wrapper = mount(Textarea, {
            props: { showCount: true, maxlength: 3, modelValue: 'hello' },
        })
        await nextTick()
        const counter = wrapper.find('p.text-danger-500')
        expect(counter.exists()).toBe(true)
    })

    it('affiche le message error', () => {
        const wrapper = mount(Textarea, { props: { error: 'Champ requis' } })
        expect(wrapper.text()).toContain('Champ requis')
    })

    it('affiche le helpText en bas par défaut', () => {
        const wrapper = mount(Textarea, { props: { helpText: 'Aide ici' } })
        expect(wrapper.text()).toContain('Aide ici')
    })

    it('affiche le helpText en haut si helpTextPosition=top', () => {
        const wrapper = mount(Textarea, {
            props: { helpText: 'Aide en haut', helpTextPosition: 'top' },
        })
        expect(wrapper.text()).toContain('Aide en haut')
    })

    it('applique la classe resize correcte', () => {
        const wrapper = mount(Textarea, { props: { resize: 'none' } })
        expect(wrapper.find('textarea').classes()).toContain('resize-none')
    })
})