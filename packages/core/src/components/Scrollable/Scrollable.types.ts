export type ScrollableDirection = 'vertical' | 'horizontal' | 'both'
export type ScrollableSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ScrollableProps {
    direction?: ScrollableDirection
    height?: string
    width?: string
    size?: ScrollableSize
    thin?: boolean
    hidden?: boolean
    infinite?: boolean
    loading?: boolean
    threshold?: number
}

export interface ResolvedScrollableProps extends Required<Pick<ScrollableProps, 'direction' | 'thin' | 'hidden' | 'infinite' | 'loading' | 'threshold'>> {
    height?: string
    width?: string
    size?: ScrollableSize
}