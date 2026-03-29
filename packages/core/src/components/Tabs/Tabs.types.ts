export type TabsVariant = 'line' | 'pill' | 'card'
export type TabsPosition = 'top' | 'bottom' | 'left' | 'right'
export type TabsSize = 'sm' | 'md' | 'lg'
export type TabsAnimation = 'none' | 'fade' | 'slide'

export interface TabItem {
    key: string
    label: string
    disabled?: boolean
    badge?: string | number
}

export interface TabsProps {
    modelValue?: string
    tabs: TabItem[]
    variant?: TabsVariant
    position?: TabsPosition
    size?: TabsSize
    lazy?: boolean
    block?: boolean
    animation?: TabsAnimation
}

export interface ResolvedTabsProps extends Required<Pick<TabsProps, 'variant' | 'position' | 'size' | 'lazy' | 'block' | 'animation'>> {
    modelValue?: string
    tabs: TabItem[]
}