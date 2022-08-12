export const tension = 210
export const timeWidth = 120

export function getTimeLeft(
  mouseXRatio: number,
  barWidth: number,
  barLeft: number
) {
  if (mouseXRatio && barWidth && barLeft) {
    const rawLeft = mouseXRatio * barWidth + barLeft
    const range = [barLeft, barWidth + barLeft - timeWidth]
    if (rawLeft < range[0]) {
      return range[0]
    } else if (rawLeft > range[1]) {
      return range[1]
    } else {
      return rawLeft
    }
  }
  return 0
}

export function getX(
  left: number,
  width: number,
  clientX: MouseEvent['clientX']
) {
  const nextX = (clientX - left) / width
  const x = Math.min(1, Math.max(0, nextX))
  return x
}

export function getNextProgress(x: number, total: number) {
  return Math.floor(x * total)
}
