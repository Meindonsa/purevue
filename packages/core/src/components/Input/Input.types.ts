export type InputSize = 'sm' | 'md' | 'lg'
export type InputState = 'default' | 'error' | 'success' | 'warning'
export type InputType = 'text' | 'email' | 'number' | 'tel' | 'url' | 'search'
export type HelpTextPosition = 'top' | 'bottom'

export interface InputProps {
    modelValue?: string | number
    type?: InputType
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    size?: InputSize
    state?: InputState
    label?: string
    helpText?: string
    helpTextPosition?: HelpTextPosition
    error?: string
    block?: boolean
}