import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { Password } from './index'

async function typeInto(wrapper: ReturnType<typeof mount>, value: string) {
    const input = wrapper.find('input')
    await input.trigger('focus')
    input.element.value = value
    await input.trigger('input')
    await nextTick()
}

describe('Password', () => {
    it('renders input de type password par défaut', () => {
        const wrapper = mount(Password)
        expect(wrapper.find('input').attributes('type')).toBe('password')
    })

    it('toggle la visibilité au clic', async () => {
        const wrapper = mount(Password)
        await wrapper.find('button').trigger('click')
        expect(wrapper.find('input').attributes('type')).toBe('text')
        await wrapper.find('button').trigger('click')
        expect(wrapper.find('input').attributes('type')).toBe('password')
    })

    it('valide la longueur minimale', async () => {
        const wrapper = mount(Password, { props: { min: 8, showHelper: true } })
        await typeInto(wrapper, 'abc')
        const rule = wrapper.findAll('li').find((r) => r.text().includes('caractères'))
        expect(rule).toBeDefined()
        expect(rule!.classes()).not.toContain('text-success-500')
    })

    it('valide le pattern chiffre', async () => {
        const wrapper = mount(Password, { props: { number: true, showHelper: true } })
        await typeInto(wrapper, 'password1')
        const rule = wrapper.findAll('li').find((r) => r.text().includes('chiffre'))
        expect(rule).toBeDefined()
        expect(rule!.classes()).toContain('text-success-500')
    })

    it('valide via options object', async () => {
        const wrapper = mount(Password, {
            props: { options: { upper: true }, showHelper: true },
        })
        await typeInto(wrapper, 'Password')
        const rule = wrapper.findAll('li').find((r) => r.text().includes('majuscule'))
        expect(rule).toBeDefined()
        expect(rule!.classes()).toContain('text-success-500')
    })

    it('valide via pattern custom', async () => {
        const wrapper = mount(Password, {
            props: { pattern: '^[a-z]+$', showHelper: true },
        })
        await typeInto(wrapper, 'abc')
        const rule = wrapper.findAll('li').find((r) => r.text().includes('Format'))
        expect(rule).toBeDefined()
        expect(rule!.classes()).toContain('text-success-500')
    })

    it('émet valid=true quand toutes les règles passent', async () => {
        const wrapper = mount(Password, { props: { min: 3 } })
        await typeInto(wrapper, 'abcd')
        expect(wrapper.emitted('valid')?.[0]).toEqual([true])
    })

    it('cache le helper quand showHelper est false', async () => {
        const wrapper = mount(Password, {
            props: { min: 8, showHelper: false },
        })
        await typeInto(wrapper, 'abc')
        expect(wrapper.find('ul').exists()).toBe(false)
    })

    it('émet rules avec les résultats de validation', async () => {
        const wrapper = mount(Password, { props: { number: true } })
        await typeInto(wrapper, 'abc')
        const emitted = wrapper.emitted('rules')
        expect(emitted).toBeDefined()
        const results = emitted![0][0] as { key: string; passed: boolean }[]
        const numberRule = results.find((r) => r.key === 'number')
        expect(numberRule?.passed).toBe(false)
    })
})