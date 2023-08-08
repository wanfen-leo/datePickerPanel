export const castArray = (arr) => {
  if (!arr && arr !== 0) return []
  return Array.isArray(arr) ? arr : [arr]
}

export const rangeArr = (n) => Array.from(Array.from({ length: n }).keys())

export const hasClass = (el, cls) => {
  if (!el || !cls) return false
  if (cls.includes(' ')) throw new Error('className should not contain space.')
  return el.classList.contains(cls)
}
