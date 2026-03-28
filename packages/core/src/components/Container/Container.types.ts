export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
export type ContainerPadding = 'none' | 'sm' | 'md' | 'lg'

export interface ContainerProps {
    size?: ContainerSize
    padding?: ContainerPadding
    center?: boolean
}

export interface ResolvedContainerProps extends Required<ContainerProps> {}