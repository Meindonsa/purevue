export type MenuPosition = 'top' | 'bottom' | 'left' | 'right'
export type MenuAlign = 'start' | 'center' | 'end'

export interface MenuItem {
    key: string
    label?: string
    icon?: string
    shortcut?: string
    badge?: string | number
    disabled?: boolean
    separator?: boolean
    children?: MenuItem[]
    action?: () => void
}

export interface MenuProps {
    items: MenuItem[]
    position?: MenuPosition
    align?: MenuAlign
    width?: string
}

export interface ResolvedMenuProps extends Required<Pick<MenuProps, 'position' | 'align'>> {
    items: MenuItem[]
    width?: string
}