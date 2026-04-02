export type SliderOrientation = 'horizontal' | 'vertical'
export type SliderSize = 'sm' | 'md' | 'lg'

export interface SliderMark {
    value: number
    label?: string
}

export interface SliderProps {
    modelValue?: number | [number, number]
    min?: number
    max?: number
    step?: number
    orientation?: SliderOrientation
    size?: SliderSize
    disabled?: boolean
    range?: boolean
    showInput?: boolean
    marks?: SliderMark[] | boolean
    label?: string
}

export interface ResolvedSliderProps extends Required<Pick<SliderProps,
    'min' | 'max' | 'step' | 'orientation' | 'size' | 'disabled' | 'range' | 'showInput'
>> {
    modelValue?: number | [number, number]
    marks?: SliderMark[] | boolean
    label?: string
}