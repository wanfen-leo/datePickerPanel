<template>
  <table
    role="grid"
    class="el-month-table"
    @click="handleMonthTableClick"
    @mousemove="handleMouseMove"
  >
    <tbody>
      <tr v-for="(row, key) in rows" :key="key">
        <td
          v-for="(cell, key_) in row"
          :key="key_"
          :class="getCellStyle(cell)"
          :aria-selected="`${isSelectedCell(cell)}`"
          @keydown.space.prevent.stop="handleMonthTableClick"
          @keydown.enter.prevent.stop="handleMonthTableClick"
        >
          <div>
            <span class="cell">
              {{ cell.month }}
            </span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import { computed, defineComponent, ref } from 'vue'
import dayjs from 'dayjs'
import { castArray, hasClass, rangeArr } from './utils'
export default defineComponent({
  name: 'BasicMonthTable',
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
    const lastRow = ref()
    const lastColumn = ref()
    const datesInMonth = (year, month) => {
      const firstDay = dayjs().startOf('month').month(month).year(year)
      const numOfDays = firstDay.daysInMonth()
      return rangeArr(numOfDays).map((n) => firstDay.add(n, 'day').toDate())
    }
    const tableRows = ref([[], [], []])
    const rows = computed(() => {
      const rows = tableRows.value

      const now = dayjs().startOf('month')

      for (let i = 0; i < 3; i++) {
        const row = rows[i]
        for (let j = 0; j < 4; j++) {
          const cell = (row[j] ||= {
            row: i,
            column: j,
            type: 'normal',
            inRange: false,
            start: false,
            end: false,
            text: -1,
            disabled: false
          })

          cell.type = 'normal'

          const index = i * 4 + j
          const calTime = props.date.startOf('year').month(index)

          const calEndDate =
            props.rangeState.endDate ||
            props.maxDate ||
            (props.rangeState.selecting && props.minDate) ||
            null

          cell.inRange =
            !!(
              props.minDate &&
              calTime.isSameOrAfter(props.minDate, 'month') &&
              calEndDate &&
              calTime.isSameOrBefore(calEndDate, 'month')
            ) ||
            !!(
              props.minDate &&
              calTime.isSameOrBefore(props.minDate, 'month') &&
              calEndDate &&
              calTime.isSameOrAfter(calEndDate, 'month')
            )

          if (props.minDate?.isSameOrAfter(calEndDate)) {
            cell.start = !!(calEndDate && calTime.isSame(calEndDate, 'month'))
            cell.end = props.minDate && calTime.isSame(props.minDate, 'month')
          } else {
            cell.start = !!(
              props.minDate && calTime.isSame(props.minDate, 'month')
            )
            cell.end = !!(calEndDate && calTime.isSame(calEndDate, 'month'))
          }

          const isToday = now.isSame(calTime)
          if (isToday) {
            cell.type = 'today'
          }

          cell.text = index
          cell.month = `${index + 1}月`
          cell.disabled = props.disabledDate?.(calTime.toDate()) || false
        }
      }
      return rows
    })
    console.log(rows)
    const getCellStyle = (cell) => {
      const style = {}
      const year = props.date.year()
      const today = new Date()
      const month = cell.text

      style.disabled = props.disabledDate
        ? datesInMonth(year, month).every(props.disabledDate)
        : false
      style.current =
        castArray().findIndex(
          (date) =>
            dayjs.isDayjs(date) &&
            date.year() === year &&
            date.month() === month
        ) >= 0
      style.today = today.getFullYear() === year && today.getMonth() === month

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

    const isSelectedCell = (cell) => {
      const year = props.date.year()
      const month = cell.text

      return (
        castArray(props.date).findIndex(
          (date) => date.year() === year && date.month() === month
        ) >= 0
      )
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

      const row = target.parentNode.rowIndex
      const column = target.cellIndex
      // can not select disabled date
      if (rows.value[row][column].disabled) return

      // only update rangeState when mouse moves to a new cell
      // this avoids frequent Date object creation and improves performance
      if (row !== lastRow.value || column !== lastColumn.value) {
        lastRow.value = row
        lastColumn.value = column
        emit('changerange', {
          selecting: true,
          endDate: props.date.startOf('year').month(row * 4 + column)
        })
      }
    }
    const handleMonthTableClick = (event) => {
      const target = event.target.closest('td')

      if (target?.tagName !== 'TD') return
      if (hasClass(target, 'disabled')) return
      const column = target.cellIndex

      const row = target.parentNode.rowIndex

      const month = row * 4 + column
      const newDate = props.date.startOf('year').month(month)

      if (!props.rangeState.selecting) {
        emit('pick', { minDate: newDate, maxDate: null })
        emit('select', true)
      } else {
        if (props.minDate && newDate >= props.minDate) {
          console.log('1111')
          emit('pick', { minDate: props.minDate, maxDate: newDate })
        } else {
          console.log('222')
          emit('pick', { minDate: newDate, maxDate: props.minDate })
        }
        console.log('3333')
        emit('select', false)
      }
    }
    return {
      datesInMonth,
      rows,
      isSelectedCell,
      getCellStyle,
      handleMouseMove,
      handleMonthTableClick
    }
  }
})
</script>
<style lang="scss"></style>
