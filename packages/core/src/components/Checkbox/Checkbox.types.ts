import type { InputSize } from '../Input'

export type CheckboxShape = 'square' | 'circle'
export type CheckboxLabelPosition = 'left' | 'right'

export interface CheckboxProps {
    modelValue?: boolean | null
    value?: string | number
    label?: string
    description?: string
    size?: InputSize
    shape?: CheckboxShape
    labelPosition?: CheckboxLabelPosition
    disabled?: boolean
    indeterminate?: boolean
    error?: string
}

export interface ResolvedCheckboxProps extends Required<Pick<CheckboxProps,
    'size' | 'shape' | 'labelPosition' | 'disabled' | 'indeterminate'
>> {
    modelValue?: boolean | null
    value?: string | number
    label?: string
    description?: string
    error?: string
}

export interface CheckboxGroupProps {
    modelValue?: (string | number)[]
    options: CheckboxGroupOption[]
    size?: InputSize
    shape?: CheckboxShape
    labelPosition?: CheckboxLabelPosition
    disabled?: boolean
    label?: string
    error?: string
    columns?: number
}

export interface CheckboxGroupOption {
    label: string
    value: string | number
    description?: string
    disabled?: boolean
}

export interface ResolvedCheckboxGroupProps extends Required<Pick<CheckboxGroupProps,
    'size' | 'shape' | 'labelPosition' | 'disabled' | 'columns'
>> {
    modelValue?: (string | number)[]
    options: CheckboxGroupOption[]
    label?: string
    error?: string
}