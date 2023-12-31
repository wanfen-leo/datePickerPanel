<template>
  <table
    role="grid"
    class="el-year-table el-month-table socar-year-table"
    @click="handleYearTableClick"
    @mousemove="handleMouseMove"
  >
    <tbody>
      <tr v-for="(row, key) in rows" :key="key">
        <td
          v-for="(cell, key_) in row"
          :key="key_"
          :class="getCellStyle(cell)"
          @click="handleMonthTableClick"
        >
          <div>
            <span class="cell">
              {{ cell.text }}
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

import { hasClass } from './utils'
export default defineComponent({
  name: 'BasicYearTable',
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
  setup(props, { emit }) {
    const lastRow = ref()
    const lastColumn = ref()
    const tableRows = ref([[], [], []])
    const removeLastTwoElements = (arr) => {
      if (arr.length === 0) {
        return arr
      }

      const lastArray = arr[arr.length - 1]
      if (lastArray.length >= 2) {
        lastArray.splice(-2, 2)
      } else {
        lastArray.length = 0
      }

      return arr
    }
    const getCellStyle = (cell) => {
      const style = {}
      const year = props.minDate.year()
      const today = new Date()
      const cellYear = cell.text

      style.disabled = props.disabledDate
        ? props.disabledDate(dayjs().startOf('year').year(cellYear))
        : false
      style.current = dayjs().year() === cellYear

      style.today = today.getFullYear() === year

      if (cell.inRange) {
        style['in-range'] = true

        if (cell.start) {
          style['start-date'] = true
          style.current = false
        }

        if (cell.end) {
          style['end-date'] = true
          style.current = false
        }
      }

      return style
    }
    const startYear = computed(() => {
      return Math.floor(props.date.year() / 10) * 10
    })
    const rows = computed(() => {
      const rows = tableRows.value
      const now = dayjs().startOf('year')

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

          const calTime = props.date.startOf('year').add(index, 'year')

          const calEndDate =
            props.rangeState.endDate ||
            props.maxDate ||
            (props.rangeState.selecting && props.minDate) ||
            null

          cell.inRange =
            !!(
              props.minDate &&
              calTime.isSameOrAfter(props.minDate, 'year') &&
              calEndDate &&
              calTime.isSameOrBefore(calEndDate, 'year')
            ) ||
            !!(
              props.minDate &&
              calTime.isSameOrBefore(props.minDate, 'year') &&
              calEndDate &&
              calTime.isSameOrAfter(calEndDate, 'year')
            )

          if (props.minDate?.isSameOrAfter(calEndDate)) {
            cell.start = !!(calEndDate && calTime.isSame(calEndDate, 'year'))
            cell.end = props.minDate && calTime.isSame(props.minDate, 'year')
          } else {
            cell.start = !!(
              props.minDate && calTime.isSame(props.minDate, 'year')
            )
            cell.end = !!(calEndDate && calTime.isSame(calEndDate, 'year'))
          }

          const isToday = now.isSame(calTime)
          if (isToday) {
            cell.type = 'today'
          }

          cell.text = startYear.value + i * 4 + j
          cell.year = i * 4 + j
          cell.disabled = props.disabledDate?.(calTime.toDate()) || false
        }
      }
      return removeLastTwoElements(rows)
    })
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
      console.log()
      if (rows.value[row][column].disabled) return

      if (row !== lastRow.value || column !== lastColumn.value) {
        lastRow.value = row
        lastColumn.value = column

        emit('changerange', {
          selecting: true,
          endDate: props.date.startOf('year').add(row * 4 + column, 'year')
        })
      }
    }

    const handleMonthTableClick = (event) => {
      const target = event.target.closest('td')

      if (target?.tagName !== 'TD') return
      if (hasClass(target, 'disabled')) return
      const column = target.cellIndex

      const row = target.parentNode.rowIndex

      const year = row * 4 + column
      const newDate = props.date.startOf('year').add(year, 'year')

      if (!props.rangeState.selecting) {
        emit('pick', { minDate: newDate, maxDate: null })
        emit('select', true)
      } else {
        if (props.minDate && newDate >= props.minDate) {
          emit('pick', { minDate: props.minDate, maxDate: newDate })
        } else {
          emit('pick', { minDate: newDate, maxDate: props.minDate })
        }
        emit('select', false)
      }
    }

    return {
      rows,
      getCellStyle,
      handleMouseMove,
      handleMonthTableClick
    }
  }
})
</script>
<style lang="scss"></style>
