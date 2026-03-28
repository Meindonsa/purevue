import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Skeleton } from './index'

describe('Skeleton', () => {
    it('renders un élément par défaut', () => {
        const wrapper = mount(Skeleton)
        expect(wrapper.find('span').exists()).toBe(true)
    })

    it('applique la shape circle', () => {
        const wrapper = mount(Skeleton, { props: { shape: 'circle' } })
        expect(wrapper.find('span').classes()).toContain('rounded-full')
    })

    it('applique la shape pill', () => {
        const wrapper = mount(Skeleton, { props: { shape: 'pill' } })
        expect(wrapper.find('span').classes()).toContain('rounded-full')
    })

    it('applique la width et height custom', () => {
        const wrapper = mount(Skeleton, {
            props: { width: '200px', height: '50px' },
        })
        const style = wrapper.find('span').attributes('style')
        expect(style).toContain('width: 200px')
        expect(style).toContain('height: 50px')
    })

    it('render plusieurs lignes si lines > 1', () => {
        const wrapper = mount(Skeleton, { props: { lines: 3 } })
        expect(wrapper.findAll('span').length).toBe(3)
    })

    it('applique animate-pulse par défaut', () => {
        const wrapper = mount(Skeleton)
        expect(wrapper.find('span').classes()).toContain('animate-pulse')
    })

    it('n\'applique pas d\'animation si animation=none', () => {
        const wrapper = mount(Skeleton, { props: { animation: 'none' } })
        expect(wrapper.find('span').classes()).not.toContain('animate-pulse')
    })
})