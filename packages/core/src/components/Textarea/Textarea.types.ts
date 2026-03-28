import type { InputSize, InputState } from '../Input/Input.types'

export type ResizeMode = 'none' | 'vertical' | 'horizontal' | 'both' | 'auto'

export interface TextareaProps {
    modelValue?: string
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    size?: InputSize
    state?: InputState
    label?: string
    helpText?: string
    helpTextPosition?: 'top' | 'bottom'
    error?: string
    block?: boolean
    rows?: number
    maxRows?: number
    maxlength?: number
    showCount?: boolean
    resize?: ResizeMode
}