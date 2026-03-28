import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Input } from './index'
import {nextTick} from "vue";

describe('Input', () => {
    it('renders with placeholder', () => {
        const wrapper = mount(Input, {
            props: { placeholder: 'Enter text' },
        })
        expect(wrapper.find('input').attributes('placeholder')).toBe('Enter text')
    })

    it('emits update:modelValue on input', async () => {
        const wrapper = mount(Input)
        await wrapper.find('input').setValue('hello')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hello'])
    })

    it('is disabled when disabled prop is true', () => {
        const wrapper = mount(Input, { props: { disabled: true } })
        expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    })

    it('shows error prop message', () => {
        const wrapper = mount(Input, { props: { error: 'Champ requis' } })
        expect(wrapper.text()).toContain('Champ requis')
    })

    it('validates email pattern and shows error', async () => {
        const wrapper = mount(Input, {
            props: { type: 'email', modelValue: 'invalid-email' },
        })

        const input = wrapper.find('input')
        input.element.value = 'invalid-email'
        await input.trigger('input')
        await nextTick()
        await nextTick()

        expect(wrapper.text()).toContain('Adresse email invalide.')
    })

    it('clears email error on valid email', async () => {
        const wrapper = mount(Input, {
            props: { type: 'email', modelValue: 'invalid-email' },
        })

        const input = wrapper.find('input')
        input.element.value = 'invalid-email'
        await input.trigger('input')
        await nextTick()

        input.element.value = 'test@example.com'
        await input.trigger('input')
        await nextTick()

        expect(wrapper.text()).not.toContain('Adresse email invalide.')
    })

    it('renders help text at bottom by default', () => {
        const wrapper = mount(Input, { props: { helpText: 'Aide ici' } })
        expect(wrapper.text()).toContain('Aide ici')
    })
})