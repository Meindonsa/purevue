import type { InputSize } from '../Input'

export type DatePickerMode = 'date' | 'range' | 'datetime'
export type DatePickerDisplay = 'inline' | 'dropdown' | 'button'
export type DatePickerView = 'days' | 'months' | 'years'
export type WeekStart = 0 | 1

export interface DatePickerProps {
    modelValue?: Date | [Date, Date] | null
    mode?: DatePickerMode
    display?: DatePickerDisplay
    size?: InputSize
    placeholder?: string
    label?: string
    disabled?: boolean
    minDate?: Date
    maxDate?: Date
    weekStart?: WeekStart
    format?: string
    clearable?: boolean
    error?: string
    helpText?: string
}

export interface ResolvedDatePickerProps extends Required<Pick<DatePickerProps,
    'mode' | 'display' | 'size' | 'disabled' | 'weekStart' | 'clearable'
>> {
    modelValue?: Date | [Date, Date] | null
    placeholder?: string
    label?: string
    minDate?: Date
    maxDate?: Date
    format?: string
    error?: string
    helpText?: string
}