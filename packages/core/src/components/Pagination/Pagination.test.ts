import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Pagination } from './index'

const baseProps = { modelValue: 1, total: 100, perPage: 10 }

describe('Pagination', () => {
    it('calcule le nombre total de pages', () => {
        const wrapper = mount(Pagination, { props: baseProps })
        expect(wrapper.text()).toContain('10')
    })

    it('affiche l\'info total', () => {
        const wrapper = mount(Pagination, { props: baseProps })
        expect(wrapper.text()).toContain('sur 100')
    })

    it('émet update:modelValue au clic suivant', async () => {
        const wrapper = mount(Pagination, { props: baseProps })
        const buttons = wrapper.findAll('button')
        // ordre : première(0), précédent(1), page1(2), ..., suivant(n-2), dernière(n-1)
        await buttons[buttons.length - 2].trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
    })

    it('désactive le bouton précédent sur la première page', () => {
        const wrapper = mount(Pagination, { props: baseProps })
        const buttons = wrapper.findAll('button')
        expect(buttons[0].attributes('disabled')).toBeDefined()
    })

    it('désactive le bouton suivant sur la dernière page', () => {
        const wrapper = mount(Pagination, {
            props: { ...baseProps, modelValue: 10 },
        })
        const buttons = wrapper.findAll('button')
        expect(buttons[buttons.length - 2].attributes('disabled')).toBeDefined()
    })

    it('affiche les points de suspension', () => {
        const wrapper = mount(Pagination, {
            props: { ...baseProps, modelValue: 5, total: 200 },
        })
        expect(wrapper.text()).toContain('...')
    })

    it('affiche le sélecteur de lignes par page', () => {
        const wrapper = mount(Pagination, {
            props: { ...baseProps, showPerPage: true },
        })
        expect(wrapper.find('select').exists()).toBe(true)
    })

    it('émet update:perPage au changement', async () => {
        const wrapper = mount(Pagination, {
            props: { ...baseProps, showPerPage: true },
        })
        await wrapper.find('select').setValue('20')
        expect(wrapper.emitted('update:perPage')?.[0]).toEqual([20])
    })

    it('applique le style circle sur la page active', () => {
        const wrapper = mount(Pagination, {
            props: { ...baseProps, currentStyle: 'circle' },
        })
        const activeBtn = wrapper.findAll('button').find(b => b.classes().includes('rounded-full') && b.classes().includes('bg-primary-500'))
        expect(activeBtn).toBeDefined()
    })

    it('applique align right', () => {
        const wrapper = mount(Pagination, {
            props: { ...baseProps, align: 'right' },
        })
        expect(wrapper.find('div').classes()).toContain('justify-end')
    })
})