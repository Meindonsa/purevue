import type { InputSize } from '../Input'

export interface PasswordOptions {
    number?: boolean
    lower?: boolean
    upper?: boolean
    special?: boolean
}

export interface PasswordProps {
    modelValue?: string
    label?: string
    placeholder?: string
    size?: InputSize
    disabled?: boolean
    block?: boolean
    min?: number
    max?: number
    options?: PasswordOptions
    number?: boolean
    lower?: boolean
    upper?: boolean
    special?: boolean
    pattern?: string
    helpText?: string
    showHelper?: boolean
}

export interface PasswordRule {
    key: string
    label: string
    test: (value: string) => boolean
}