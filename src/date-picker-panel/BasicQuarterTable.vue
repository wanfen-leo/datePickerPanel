<template>
  <table role="grid" class="el-month-table">
    <tbody>
      <tr>
        <td
          v-for="(item, key) in rows"
          :class="getCellStyle(item)"
          :key="key"
          @click="handleMonthTableClick"
          @mousemove="handleMouseMove"
        >
          <div>
            <span class="cell"> 第{{ item.text }}季度 </span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import { computed, defineComponent, ref } from 'vue'
import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
// isSameAfter isSameBefort
dayjs.extend(quarterOfYear)
export default defineComponent({
  name: 'BasicQuarterTable',
  props: {
    minDate: {
      type: Object,
      default() {
        return null
      }
    },
    maxDate: {
      type: Object,
      default() {
        return null
      }
    },
    date: {
      type: Object,
      default() {
        return null
      }
    },
    disabledDate: {
      type: Function,
      default() {
        return null
      }
    },
    rangeState: {
      type: Object,
      default() {
        return null
      }
    }
  },
  emits: ['pick', 'select', 'changerange'],
  setup(props, { emit }) {
    console.log(props)
    const lastColumn = ref()
    const rows = computed(() => {
      const rows = []

      const now = props.date
        ? dayjs(props.date).startOf('quarter')
        : dayjs().startOf('quarter')

      for (let i = 1; i < 5; i++) {
        const cell = {
          row: i,
          type: 'normal',
          inRange: false,
          start: false,
          end: false,
          text: -1,
          disabled: false
        }
        cell.type = 'normal'
        const calTime = props.date.startOf('year').quarter(i)
        const calEndDate =
          props.rangeState.endDate ||
          props.maxDate ||
          (props.rangeState.selecting && props.minDate) ||
          null

        cell.inRange =
          !!(
            props.minDate &&
            calTime.isSameOrAfter(props.minDate, 'quarter') &&
            calEndDate &&
            calTime.isSameOrBefore(calEndDate, 'quarter')
          ) ||
          !!(
            props.minDate &&
            calTime.isSameOrBefore(props.minDate, 'quarter') &&
            calEndDate &&
            calTime.isSameOrAfter(calEndDate, 'quarter')
          )

        if (props.minDate.isSameOrAfter(calEndDate)) {
          cell.start = !!(calEndDate && calTime.isSame(calEndDate, 'quarter'))
          cell.end = props.minDate && calTime.isSame(props.minDate, 'quarter')
        } else {
          cell.start = !!(
            props.minDate && calTime.isSame(props.minDate, 'quarter')
          )
          cell.end = !!(calEndDate && calTime.isSame(calEndDate, 'quarter'))
        }
        const isToday = now.isSame(calTime)
        if (isToday) {
          cell.type = 'today'
        }

        cell.text = calTime.quarter()
        cell.disabled = props.disabledDate?.(calTime.toDate()) || false
        rows.push(cell)
      }

      return rows
    })
    const getCellStyle = (cell) => {
      const style = {}
      const year = props.date.year()
      const today = dayjs(new Date())
      const quarter = cell.text
      style.disabled = props.disabledDate
        ? props.disabledDate(
            dayjs().startOf('quarter').quarter(quarter).year(year)
          )
        : false

      style.today =
        today.year() === year && today.quarter() === quarter && cell.inRange

      if (cell.inRange) {
        style['in-range'] = true

        if (cell.start) {
          style['start-date'] = true
        }

        if (cell.end) {
          style['end-date'] = true
        }
      }
      return style
    }
    const hasClass = (el, cls) => {
      if (!el || !cls) return false
      if (cls.includes(' '))
        throw new Error('className should not contain space.')
      return el.classList.contains(cls)
    }

    const handleMonthTableClick = (event) => {
      const target = event.target.closest('td')

      if (target?.tagName !== 'TD') return
      if (hasClass(target, 'disabled')) return

      const quarter = target.cellIndex + 1
      const newDate = props.date.startOf('year').quarter(quarter)

      if (!props.rangeState.selecting) {
        emit('pick', { minDate: newDate, maxDate: null })
        emit('select', true)
      } else {
        if (props.minDate && newDate >= props.minDate) {
          console.log('11111111')
          emit('pick', { minDate: props.minDate, maxDate: newDate })
        } else {
          console.log('2222')
          emit('pick', { minDate: newDate, maxDate: props.minDate })
        }
        emit('select', false)
      }
    }

    const handleMouseMove = (event) => {
      if (!props.rangeState.selecting) return
      let target = event.target

      if (target.tagName === 'A') {
        target = target.parentNode?.parentNode
      }
      if (target.tagName === 'DIV') {
        target = target.parentNode
      }
      if (target.tagName !== 'TD') return
      const column = target.cellIndex
      if (rows.value[column].disabled) return
      if (column !== lastColumn.value) {
        lastColumn.value = column
        emit('changerange', {
          selecting: true,
          endDate: props.date.startOf('year').quarter(target.cellIndex + 1)
        })
      }
    }

    return {
      rows,
      getCellStyle,
      handleMonthTableClick,
      handleMouseMove
    }
  }
})
</script>
