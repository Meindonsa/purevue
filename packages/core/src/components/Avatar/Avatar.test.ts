import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Avatar } from './index'

describe('Avatar', () => {
    it('affiche une image si src est fourni', () => {
        const wrapper = mount(Avatar, { props: { src: 'https://example.com/avatar.jpg', alt: 'User' } })
        expect(wrapper.find('img').exists()).toBe(true)
    })

    it('affiche les initiales si pas de src', () => {
        const wrapper = mount(Avatar, { props: { fallback: 'Boris Mendossa' } })
        expect(wrapper.text()).toBe('BM')
    })

    it('affiche ? si pas de src ni fallback', () => {
        const wrapper = mount(Avatar)
        expect(wrapper.text()).toBe('?')
    })

    it('affiche les initiales si src échoue', async () => {
        const wrapper = mount(Avatar, {
            props: { src: 'https://broken.url/img.jpg', fallback: 'Boris Mendossa' },
        })
        await wrapper.find('img').trigger('error')
        expect(wrapper.text()).toBe('BM')
    })

    it('applique la shape square', () => {
        const wrapper = mount(Avatar, { props: { shape: 'square' } })
        expect(wrapper.find('span > span').classes()).toContain('rounded-md')
    })

    it('affiche le status indicator', () => {
        const wrapper = mount(Avatar, { props: { status: 'online' } })
        expect(wrapper.find('span.bg-success-500').exists()).toBe(true)
    })

    it('applique la taille xl', () => {
        const wrapper = mount(Avatar, { props: { size: 'xl' } })
        expect(wrapper.find('span > span').classes()).toContain('w-16')
    })
})