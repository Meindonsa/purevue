import type { InputSize } from '../Input'

export type RadioLabelPosition = 'left' | 'right'
export type RadioGroupVariant = 'classic' | 'card' | 'button'
export type RadioGroupOrientation = 'horizontal' | 'vertical'

export interface RadioProps {
    modelValue?: string | number
    value: string | number
    label?: string
    description?: string
    size?: InputSize
    labelPosition?: RadioLabelPosition
    disabled?: boolean
    error?: string
}

export interface ResolvedRadioProps extends Required<Pick<RadioProps,
    'size' | 'labelPosition' | 'disabled'
>> {
    modelValue?: string | number
    value: string | number
    label?: string
    description?: string
    error?: string
}

export interface RadioOption {
    label: string
    value: string | number
    description?: string
    icon?: string
    disabled?: boolean
}

export interface RadioGroupProps {
    modelValue?: string | number
    options: RadioOption[]
    variant?: RadioGroupVariant
    orientation?: RadioGroupOrientation
    size?: InputSize
    labelPosition?: RadioLabelPosition
    disabled?: boolean
    label?: string
    error?: string
    columns?: number
}

export interface ResolvedRadioGroupProps extends Required<Pick<RadioGroupProps,
    'variant' | 'orientation' | 'size' |
    'labelPosition' | 'disabled' | 'columns'
>> {
    modelValue?: string | number
    options: RadioOption[]
    label?: string
    error?: string
}