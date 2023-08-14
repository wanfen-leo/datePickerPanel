import { computed } from 'vue'
export const useDatePanel = ({ leftDate, rightDate }) => {
  const leftPrevYear = () => {
    leftDate.value = leftDate.value.subtract(1, 'year')
    rightDate.value = rightDate.value.subtract(1, 'year')
  }

  const rightNextYear = () => {
    leftDate.value = leftDate.value.add(1, 'year')
    rightDate.value = rightDate.value.add(1, 'year')
  }

  const leftNextYear = () => {
    leftDate.value = leftDate.value.add(1, 'year')
  }

  const rightPrevYear = () => {
    rightDate.value = rightDate.value.subtract(1, 'year')
  }

  const leftLabel = computed(() => {
    return `${leftDate.value.year()}`
  })

  const rightLabel = computed(() => {
    return `${rightDate.value.year()}`
  })

  return {
    leftPrevYear,
    rightNextYear,
    leftNextYear,
    rightPrevYear,
    leftLabel,
    rightLabel
  }
}
