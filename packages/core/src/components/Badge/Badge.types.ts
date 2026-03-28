export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
export type BadgeSize = 'sm' | 'md' | 'lg'
export type BadgeShape = 'rounded' | 'pill'

export interface BadgeProps {
    variant?: BadgeVariant
    size?: BadgeSize
    shape?: BadgeShape
    dot?: boolean
    closable?: boolean
}