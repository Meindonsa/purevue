export type CardVariant = 'default' | 'outlined' | 'elevated' | 'ghost'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps {
    variant?: CardVariant
    padding?: CardPadding
    clickable?: boolean
    loading?: boolean
}

export interface ResolvedCardProps extends Required<CardProps> {}