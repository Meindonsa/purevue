export type PaginationStyle = 'circle' | 'square' | 'underline' | 'overline' | 'flat'
export type PaginationAlign = 'left' | 'center' | 'right'
export type PaginationSize = 'sm' | 'md' | 'lg'

export interface PaginationProps {
    modelValue: number
    total: number
    perPage?: number
    perPageOptions?: number[]
    showPerPage?: boolean
    siblings?: number
    currentStyle?: PaginationStyle
    size?: PaginationSize
    align?: PaginationAlign
    color?: string
    showFirstLast?: boolean
}

export interface ResolvedPaginationProps extends Required<Pick<PaginationProps,
    'perPage' | 'perPageOptions' | 'showPerPage' | 'siblings' |
    'currentStyle' | 'size' | 'align' | 'showFirstLast'
>> {
    modelValue: number
    total: number
    color?: string
}