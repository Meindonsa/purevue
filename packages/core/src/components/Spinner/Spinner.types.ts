export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type SpinnerVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'white'
export type SpinnerLabelPosition = 'top' | 'bottom' | 'left' | 'right'

export interface SpinnerProps {
    size?: SpinnerSize
    variant?: SpinnerVariant
    label?: string
    labelPosition?: SpinnerLabelPosition
}

export interface ResolvedSpinnerProps extends Required<Pick<SpinnerProps, 'size' | 'variant' | 'labelPosition'>> {
    label?: string
}