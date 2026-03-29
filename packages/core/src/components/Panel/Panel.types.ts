export type PanelVariant = 'default' | 'outlined' | 'elevated' | 'ghost'
export type PanelPadding = 'none' | 'sm' | 'md' | 'lg'

export interface PanelProps {
    variant?: PanelVariant
    padding?: PanelPadding
    toggleable?: boolean
    collapsed?: boolean
    title?: string
}

export interface ResolvedPanelProps extends Required<Pick<PanelProps, 'variant' | 'padding' | 'toggleable' | 'collapsed'>> {
    title?: string
}