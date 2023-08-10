import { getCurrentInstance, ref, unref, watch } from 'vue'
import dayjs from 'dayjs'
import _ from 'lodash'
export const useRangePicker = (props) => {
  const { range } = props
  const { emit } = getCurrentInstance()

  const minDate = ref()
  const maxDate = ref()

  const leftDate = ref()
  const rightDate = ref()

  const rangeState = ref({
    endDate: null,
    selecting: false
  })

  const isValidRange = (range) => {
    if (!_.isArray(range)) return false

    const [left, right] = range

    return (
      dayjs.isDayjs(left) && dayjs.isDayjs(right) && left.isSameOrBefore(right)
    )
  }

  const handleRangeConfirm = () => {
    const _minDate = unref(minDate)
    const _maxDate = unref(maxDate)

    if (isValidRange([_minDate, _maxDate])) {
      emit('pick', [_minDate, _maxDate])
    }
  }

  const handleRangePick = (val) => {
    const minDate_ = val.minDate
    const maxDate_ = val.maxDate
    if (maxDate.value === maxDate_ && minDate.value === minDate_) {
      return
    }
    maxDate.value = maxDate_
    minDate.value = minDate_

    handleRangeConfirm()
  }

  const restoreDefault = () => {
    const [start, end] = props.defaultValue.map((item) => dayjs(item))
    minDate.value = start
    maxDate.value = end
    leftDate.value = start
    rightDate.value = start.add(1, 'year')
  }

  const disabledDate = (cell) => {
    const [rangeStart, rangeEnd] = range.map((item) => dayjs(item))

    return !(
      dayjs(cell).isSameOrAfter(rangeStart) &&
      dayjs(cell).isSameOrBefore(rangeEnd)
    )
  }
  const onSelect = (selecting) => {
    rangeState.value.selecting = selecting
    if (!selecting) {
      rangeState.value.endDate = null
    }
  }
  const handleChangeRange = (val) => {
    rangeState.value = val
  }

  const handleShortcutClick = (val) => {
    emit('shortcut-change', val, props.unit)
  }

  watch(
    () => props.defaultValue,
    (value) => {
      if (value) {
        console.log(value)
        restoreDefault()
      }
    },
    {
      immediate: true
    }
  )

  return {
    minDate,
    maxDate,
    leftDate,
    rightDate,
    rangeState,
    disabledDate,
    onSelect,
    handleRangePick,
    handleChangeRange,
    handleShortcutClick
  }
}
