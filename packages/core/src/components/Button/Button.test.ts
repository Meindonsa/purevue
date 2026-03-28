import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Button } from './index'

describe('Button', () => {
    it('renders slot content', () => {
        const wrapper = mount(Button, {
            slots: { default: 'Click me' },
        })
        expect(wrapper.text()).toBe('Click me')
    })

    it('is disabled when disabled prop is true', () => {
        const wrapper = mount(Button, {
            props: { disabled: true },
        })
        expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('is disabled when loading prop is true', () => {
        const wrapper = mount(Button, {
            props: { loading: true },
        })
        expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('applies variant class correctly', () => {
        const wrapper = mount(Button, {
            props: { variant: 'danger' },
        })
        expect(wrapper.classes()).toContain('bg-danger-500')
    })

    it('applies block class when block is true', () => {
        const wrapper = mount(Button, {
            props: { block: true },
        })
        expect(wrapper.classes()).toContain('w-full')
    })
})