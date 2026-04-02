export type SwitchSize = 'sm' | 'md' | 'lg'
export type SwitchLabelPosition = 'left' | 'right'

export interface SwitchProps {
    modelValue?: boolean
    label?: string
    description?: string
    size?: SwitchSize
    labelPosition?: SwitchLabelPosition
    disabled?: boolean
    showText?: boolean
    onText?: string
    offText?: string
    onIcon?: string
    offIcon?: string
    error?: string
}

export interface ResolvedSwitchProps extends Required<Pick<SwitchProps,
    'size' | 'labelPosition' | 'disabled' | 'showText' | 'onText' | 'offText'
>> {
    modelValue?: boolean
    label?: string
    description?: string
    onIcon?: string
    offIcon?: string
    error?: string
}