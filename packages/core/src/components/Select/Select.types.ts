import type { InputSize, InputState } from '../Input'

export interface SelectOption {
    label: string
    value: string | number
    icon?: string
    description?: string
    disabled?: boolean
    group?: string
}

export interface SelectGroup {
    label: string
    options: SelectOption[]
}

export interface SelectProps {
    modelValue?: string | number | null
    options: SelectOption[]
    placeholder?: string
    label?: string
    size?: InputSize
    state?: InputState
    disabled?: boolean
    searchable?: boolean
    clearable?: boolean
    helpText?: string
    error?: string
    block?: boolean
    virtualScroll?: boolean
    virtualItemHeight?: number
}

export interface ResolvedSelectProps extends Required<Pick<SelectProps,
    'size' | 'state' | 'disabled' | 'searchable' |
    'clearable' | 'block' | 'virtualScroll' | 'virtualItemHeight'
>> {
    modelValue?: string | number | null
    options: SelectOption[]
    placeholder?: string
    label?: string
    helpText?: string
    error?: string
}

export interface MultiSelectProps extends Omit<SelectProps, 'modelValue'> {
    modelValue?: (string | number)[]
    maxTags?: number
    showSelectAll?: boolean
}

export interface ResolvedMultiSelectProps extends Required<Pick<MultiSelectProps,
    'size' | 'state' | 'disabled' | 'searchable' |
    'clearable' | 'block' | 'virtualScroll' | 'virtualItemHeight' | 'showSelectAll'
>> {
    modelValue?: (string | number)[]
    options: SelectOption[]
    placeholder?: string
    label?: string
    helpText?: string
    error?: string
    maxTags?: number
}