import type { InputSize, InputState } from '../Input'

export interface AutoCompleteOption {
    label: string
    value: string | number
    group?: string
    [key: string]: unknown
}

export interface AutoCompleteProps {
    modelValue?: string | number | (string | number)[]
    options?: AutoCompleteOption[]
    placeholder?: string
    label?: string
    size?: InputSize
    state?: InputState
    disabled?: boolean
    multiple?: boolean
    minChars?: number
    maxTags?: number
    debounce?: number
    block?: boolean
    loading?: boolean
    emptyText?: string
    error?: string
    helpText?: string
}

export interface ResolvedAutoCompleteProps extends Required<Pick<AutoCompleteProps,
    'size' | 'state' | 'disabled' | 'multiple' |
    'minChars' | 'debounce' | 'block' | 'loading' | 'emptyText'
>> {
    modelValue?: string | number | (string | number)[]
    options?: AutoCompleteOption[]
    placeholder?: string
    label?: string
    maxTags?: number
    error?: string
    helpText?: string
}