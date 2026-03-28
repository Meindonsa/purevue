export type SkeletonShape = 'rectangle' | 'circle' | 'pill'
export type SkeletonAnimation = 'pulse' | 'wave' | 'none'

export interface SkeletonProps {
    shape?: SkeletonShape
    animation?: SkeletonAnimation
    width?: string
    height?: string
    rounded?: boolean
    lines?: number
    gap?: string
}

export interface ResolvedSkeletonProps extends Required<Pick<SkeletonProps, 'shape' | 'animation'>> {
    width?: string
    height?: string
    rounded?: boolean
    lines?: number
    gap?: string
}