import type { InjectionKey, Ref } from 'vue'

export type StepperOrientation = 'horizontal' | 'vertical'
export type StepperSize = 'sm' | 'md' | 'lg'

export interface StepperProps {
    modelValue?: string
    orientation?: StepperOrientation
    size?: StepperSize
    linear?: boolean
}

export interface StepperContext {
    activeValue: Ref<string>
    orientation: Ref<StepperOrientation>
    size: Ref<StepperSize>
    linear: Ref<boolean>
    steps: Ref<string[]>
    direction: Ref<number>
    completed: Ref<Record<string, boolean>>
    registerStep: (value: string) => void
    activateCallback: (value: string) => void
    markCompleted: (value: string, done: boolean) => void
}

export const STEPPER_KEY: InjectionKey<StepperContext> = Symbol('Stepper')