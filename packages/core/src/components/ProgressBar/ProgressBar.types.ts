export type ProgressBarSize = 'xs' | 'sm' | 'md' | 'lg'
export type ProgressBarVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type ProgressBarAnimation = 'none' | 'pulse' | 'stripe'
export type ProgressBarLabelPosition = 'top' | 'inside-left' | 'inside-center' | 'inside-right'

export interface ProgressBarProps {
    value?: number
    min?: number
    max?: number
    size?: ProgressBarSize
    variant?: ProgressBarVariant
    animation?: ProgressBarAnimation
    label?: boolean
    labelPosition?: ProgressBarLabelPosition
    labelText?: string
    indeterminate?: boolean
}

export interface ResolvedProgressBarProps extends Required<Pick<ProgressBarProps, 'size' | 'variant' | 'animation' | 'min' | 'max' | 'indeterminate' | 'label' | 'labelPosition'>> {
    value?: number
    labelText?: string
}