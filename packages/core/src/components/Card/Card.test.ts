import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent, CardFooter } from './index'

describe('Card', () => {
    it('render le slot', () => {
        const wrapper = mount(Card, { slots: { default: 'Contenu' } })
        expect(wrapper.text()).toContain('Contenu')
    })

    it('applique le variant elevated', () => {
        const wrapper = mount(Card, { props: { variant: 'elevated' } })
        expect(wrapper.classes()).toContain('shadow-md')
    })

    it('applique le variant outlined', () => {
        const wrapper = mount(Card, { props: { variant: 'outlined' } })
        expect(wrapper.classes()).toContain('border-surface-300')
    })

    it('applique le padding lg', () => {
        const wrapper = mount(Card, { props: { padding: 'lg' } })
        expect(wrapper.classes()).toContain('p-8')
    })

    it('applique cursor-pointer si clickable', () => {
        const wrapper = mount(Card, { props: { clickable: true } })
        expect(wrapper.classes()).toContain('cursor-pointer')
    })

    it('émet click si clickable', async () => {
        const wrapper = mount(Card, { props: { clickable: true } })
        await wrapper.trigger('click')
        expect(wrapper.emitted('click')).toBeDefined()
    })

    it('n\'émet pas click si non clickable', async () => {
        const wrapper = mount(Card)
        await wrapper.trigger('click')
        expect(wrapper.emitted('click')).toBeUndefined()
    })
})

describe('CardHeader', () => {
    it('render le slot', () => {
        const wrapper = mount(CardHeader, { slots: { default: 'Header' } })
        expect(wrapper.text()).toContain('Header')
    })
})

describe('CardTitle', () => {
    it('render le slot dans un h3', () => {
        const wrapper = mount(CardTitle, { slots: { default: 'Titre' } })
        expect(wrapper.find('h3').text()).toBe('Titre')
    })
})

describe('CardSubtitle', () => {
    it('render le slot dans un p', () => {
        const wrapper = mount(CardSubtitle, { slots: { default: 'Sous-titre' } })
        expect(wrapper.find('p').text()).toBe('Sous-titre')
    })
})

describe('CardContent', () => {
    it('render le slot', () => {
        const wrapper = mount(CardContent, { slots: { default: 'Contenu' } })
        expect(wrapper.text()).toContain('Contenu')
    })
})

describe('CardFooter', () => {
    it('render le slot', () => {
        const wrapper = mount(CardFooter, { slots: { default: 'Footer' } })
        expect(wrapper.text()).toContain('Footer')
    })
})