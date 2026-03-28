export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type AvatarShape = 'circle' | 'square'
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy'

export interface AvatarProps {
    src?: string
    alt?: string
    fallback?: string
    size?: AvatarSize
    shape?: AvatarShape
    status?: AvatarStatus
    stacked?: boolean
}

export interface AvatarGroupProps {
    max?: number
    size?: AvatarSize
    shape?: AvatarShape
}