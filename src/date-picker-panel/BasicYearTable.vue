<template>
  <table
    role="grid"
    class="el-year-table el-month-table"
    @click="handleYearTableClick"
  >
    <tbody>
      <tr v-for="(row, key) in rows" :key="key">
        <td
          v-for="(cell, key_) in row"
          :key="key_"
          :class="getCellStyle(cell)"
          @keydown.space.prevent.stop="handleMonthTableClick"
          @keydown.enter.prevent.stop="handleMonthTableClick"
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
// import { castArray, hasClass, rangeArr } from './utils'
import dayjs from 'dayjs'
// import _ from 'lodash'

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
  setup(props) {
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
        }

        if (cell.end) {
          style['end-date'] = true
        }
      }

      return style
    }
    const startYear = computed(() => {
      return Math.floor(props.minDate.year() / 10) * 10
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
          const calTime = props.minDate.startOf('year').add(index, 'year')

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

          if (props.minDate?.isSameOrAfter(calEndDate, 'year')) {
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
        }
      }
      return removeLastTwoElements(rows)
    })

    return {
      rows,
      getCellStyle
    }
  }
})
</script>
