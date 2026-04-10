export function isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
}

export function isBefore(a: Date, b: Date): boolean {
    return a < b
}

export function isAfter(a: Date, b: Date): boolean {
    return a > b
}

export function isBetween(date: Date, start: Date, end: Date): boolean {
    const d = date.getTime()
    return d > start.getTime() && d < end.getTime()
}

export function startOfDay(date: Date): Date {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
}

export function formatDate(date: Date, fmt: string = 'DD/MM/YYYY'): string {
    const d = String(date.getDate()).padStart(2, '0')
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const y = String(date.getFullYear())
    const H = String(date.getHours()).padStart(2, '0')
    const M = String(date.getMinutes()).padStart(2, '0')
    return fmt
        .replace('DD', d)
        .replace('MM', m)
        .replace('YYYY', y)
        .replace('HH', H)
        .replace('mm', M)
}

export function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year: number, month: number, weekStart: 0 | 1): number {
    const day = new Date(year, month, 1).getDay()
    return (day - weekStart + 7) % 7
}

export function generateYears(current: number, range = 10): number[] {
    const years: number[] = []
    for (let y = current - range; y <= current + range; y++) years.push(y)
    return years
}