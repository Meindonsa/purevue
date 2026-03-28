export type DividerOrientation = 'horizontal' | 'vertical'
export type DividerVariant = 'solid' | 'dashed' | 'dotted'
export type DividerAlign = 'start' | 'center' | 'end'

export interface DividerProps {
    orientation?: DividerOrientation
    variant?: DividerVariant
    align?: DividerAlign
    label?: string
}

export interface ResolvedDividerProps extends Required<Pick<DividerProps, 'orientation' | 'variant' | 'align'>> {
    label?: string
}