export type ColorFormat = 'hex' | 'rgb' | 'hsl'

export interface RGBColor { r: number; g: number; b: number; a: number }
export interface HSLColor { h: number; s: number; l: number; a: number }

export interface ColorPickerProps {
    modelValue?: string
    format?: ColorFormat
    display?: 'inline' | 'dropdown'
    disabled?: boolean
    clearable?: boolean
    presets?: string[]
    label?: string
    showAlpha?: boolean
    showEyeDropper?: boolean
}

export interface ResolvedColorPickerProps extends Required<Pick<ColorPickerProps,
    'format' | 'display' | 'disabled' | 'clearable' | 'showAlpha' | 'showEyeDropper'
>> {
    modelValue?: string
    presets?: string[]
    label?: string
}