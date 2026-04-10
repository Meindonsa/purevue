import type { RGBColor, HSLColor } from './ColorPicker.types'

export function hexToRgb(hex: string): RGBColor {
    const clean = hex.replace('#', '')
    const full  = clean.length === 3
        ? clean.split('').map(c => c + c).join('')
        : clean.slice(0, 6)
    const alpha = clean.length === 8 ? parseInt(clean.slice(6, 8), 16) / 255 : 1

    const r = parseInt(full.slice(0, 2), 16)
    const g = parseInt(full.slice(2, 4), 16)
    const b = parseInt(full.slice(4, 6), 16)
    return { r, g, b, a: parseFloat(alpha.toFixed(2)) }
}

export function rgbToHex({ r, g, b, a }: RGBColor): string {
    const hex = [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('')
    const alpha = a < 1 ? Math.round(a * 255).toString(16).padStart(2, '0') : ''
    return `#${hex}${alpha}`
}

export function rgbToHsl({ r, g, b, a }: RGBColor): HSLColor {
    const rn = r / 255, gn = g / 255, bn = b / 255
    const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
    let h = 0, s = 0
    const l = (max + min) / 2

    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
        else if (max === gn) h = ((bn - rn) / d + 2) / 6
        else h = ((rn - gn) / d + 4) / 6
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100), a }
}

export function hslToRgb({ h, s, l, a }: HSLColor): RGBColor {
    const sn = s / 100, ln = l / 100
    const c  = (1 - Math.abs(2 * ln - 1)) * sn
    const x  = c * (1 - Math.abs((h / 60) % 2 - 1))
    const m  = ln - c / 2
    let r = 0, g = 0, b = 0

    if (h < 60)       { r = c; g = x }
    else if (h < 120) { r = x; g = c }
    else if (h < 180) { g = c; b = x }
    else if (h < 240) { g = x; b = c }
    else if (h < 300) { r = x; b = c }
    else              { r = c; b = x }

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
        a,
    }
}

export function formatColor(rgb: RGBColor, format: 'hex' | 'rgb' | 'hsl'): string {
    if (format === 'hex') return rgbToHex(rgb)
    if (format === 'rgb') {
        return rgb.a < 1
            ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`
            : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    }
    const hsl = rgbToHsl(rgb)
    return hsl.a < 1
        ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${hsl.a})`
        : `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
}

export function parseColor(value: string): RGBColor {
    if (!value) return { r: 0, g: 0, b: 0, a: 1 }

    // HEX
    if (value.startsWith('#')) return hexToRgb(value)

    // RGB / RGBA
    const rgbMatch = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
    if (rgbMatch) {
        return {
            r: parseInt(rgbMatch[1]),
            g: parseInt(rgbMatch[2]),
            b: parseInt(rgbMatch[3]),
            a: rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1,
        }
    }

    // HSL / HSLA
    const hslMatch = value.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([\d.]+))?\)/)
    if (hslMatch) {
        return hslToRgb({
            h: parseInt(hslMatch[1]),
            s: parseInt(hslMatch[2]),
            l: parseInt(hslMatch[3]),
            a: hslMatch[4] !== undefined ? parseFloat(hslMatch[4]) : 1,
        })
    }

    return { r: 0, g: 0, b: 0, a: 1 }
}

export function isValidColor(value: string): boolean {
    try {
        const el = document.createElement('div')
        el.style.color = value
        return el.style.color !== ''
    } catch { return false }
}